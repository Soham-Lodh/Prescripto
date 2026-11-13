import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Two-phase lock manager.
 *
 * Phase 1 (grow): every lock a transaction needs is acquired one by one, in a
 * single canonical order (lexicographic on the key string) that is identical for
 * every caller in the process. Because all transactions request their keys in
 * the same order, a cycle (deadlock) cannot form.
 *
 * Phase 2 (shrink): locks are released one by one in reverse acquisition order,
 * so a transaction that partially fails rolls back exactly the locks it holds.
 *
 * Every acquisition is bounded by a deadline. A waiter that cannot be served in
 * time is rejected and removed from the queue, and any locks already taken by
 * that transaction are released immediately -> no permanent hold, no deadlock.
 */

const DEFAULT_LOCK_TIMEOUT_MS = (() => {
  const configured = Number(process.env.LOCK_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0 ? configured : 5000;
})();

export class LockTimeoutError extends Error {
  constructor(keys, timeoutMs) {
    super(
      `Timed out after ${timeoutMs}ms waiting for lock(s): ${keys.join(", ")}`
    );
    this.name = "LockTimeoutError";
    this.code = "LOCK_TIMEOUT";
    this.keys = keys;
    this.timeoutMs = timeoutMs;
  }
}

export class LockOrderError extends Error {
  constructor(keys) {
    super(
      `Lock order violation: this transaction already holds ${keys.join(
        ", "
      )}. Declare every lock a critical section needs in a single withLocks() call instead of nesting.`
    );
    this.name = "LockOrderError";
    this.code = "LOCK_ORDER";
    this.keys = keys;
  }
}

/** Registry: key -> { holder, queue: waiter[] } */
const registry = new Map();
/** Keys held by the currently running transaction, used to fail fast on nesting. */
const heldKeys = new AsyncLocalStorage();

const metrics = {
  acquisitions: 0,
  releases: 0,
  contentions: 0,
  timeouts: 0,
  orderViolations: 0,
};

export const lockKey = {
  user: (userId) => `lock:user:${userId}`,
  doctor: (docId) => `lock:doctor:${docId}`,
  slot: (docId, slotDate, slotTime) =>
    `lock:slot:${docId}:${slotDate}:${slotTime}`,
  appointment: (appointmentId) => `lock:appointment:${appointmentId}`,
};

/** Stable, deduplicated acquisition order shared by every caller. */
export const canonicalKeyOrder = (keys) => [...new Set(keys.map(String))].sort();

const stateFor = (key) => {
  let state = registry.get(key);
  if (!state) {
    state = { holder: null, queue: [] };
    registry.set(key, state);
  }
  return state;
};

const dropIfIdle = (key, state) => {
  if (!state.holder && state.queue.length === 0) {
    registry.delete(key);
  }
};

/** Hand the lock to the next waiter in FIFO order (fairness). */
const pump = (key, state) => {
  if (state.holder) return;

  while (state.queue.length > 0) {
    const next = state.queue.shift();
    if (next.settled) continue;

    state.holder = next;
    next.grant();
    return;
  }

  dropIfIdle(key, state);
};

/**
 * Wait for a single lock. Resolves with a waiter token that must be handed back
 * to `releaseLock` in phase 2.
 */
const acquireLock = (key, timeoutMs) =>
  new Promise((resolve, reject) => {
    const state = stateFor(key);

    const waiter = {
      key,
      settled: false,
      timer: null,
      grant: null,
    };

    waiter.grant = () => {
      if (waiter.settled) return;
      waiter.settled = true;
      if (waiter.timer) clearTimeout(waiter.timer);
      waiter.timer = null;
      metrics.acquisitions += 1;
      resolve(waiter);
    };

    waiter.timer = setTimeout(() => {
      if (waiter.settled) return;
      waiter.settled = true;
      waiter.timer = null;

      const index = state.queue.indexOf(waiter);
      if (index !== -1) state.queue.splice(index, 1);

      metrics.timeouts += 1;
      dropIfIdle(key, state);
      reject(new LockTimeoutError([key], timeoutMs));
    }, timeoutMs);

    // Never keep the event loop alive just to wait for a lock.
    if (typeof waiter.timer.unref === "function") waiter.timer.unref();

    if (state.holder || state.queue.length > 0) metrics.contentions += 1;
    state.queue.push(waiter);
    pump(key, state);
  });

/** Phase 2 primitive: release one lock, then pass it to the next waiter. */
const releaseLock = (key, waiter) => {
  const state = registry.get(key);
  if (!state || state.holder !== waiter) return false;

  state.holder = null;
  metrics.releases += 1;
  pump(key, state);
  return true;
};

/** Release acquired locks one by one, newest first (strict reverse order). */
const releaseAll = (acquired) => {
  for (let i = acquired.length - 1; i >= 0; i -= 1) {
    const { key, waiter } = acquired[i];
    try {
      releaseLock(key, waiter);
    } catch (error) {
      console.error(`[locks] failed to release ${key}:`, error.message);
    }
  }
  acquired.length = 0;
};

/**
 * Run `task` while holding every key in `keys`.
 *
 * Stage 1: acquire keys one by one, in canonical order, under one shared
 *          deadline. A timeout or error releases everything taken so far.
 * Stage 2: run the critical section.
 * Stage 3: release keys one by one in reverse order, even if the task throws.
 */
export const withLocks = async (keys, task, options = {}) => {
  const requested = canonicalKeyOrder(keys);
  if (requested.length === 0) return task();

  const inherited = heldKeys.getStore();
  if (inherited) {
    const reentrant = requested.filter((key) => inherited.has(key));
    if (reentrant.length > 0) {
      metrics.orderViolations += 1;
      throw new LockOrderError(reentrant);
    }
  }

  const timeoutMs =
    Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : DEFAULT_LOCK_TIMEOUT_MS;
  const deadline = Date.now() + timeoutMs;
  const acquired = [];

  // ---- phase 1: grow, one lock at a time, always in the same order ----
  try {
    for (const key of requested) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        throw new LockTimeoutError(
          requested.filter((key2) => !acquired.some((entry) => entry.key === key2)),
          timeoutMs
        );
      }

      const waiter = await acquireLock(key, remaining);
      acquired.push({ key, waiter });
    }
  } catch (error) {
    // Rollback: hand back whatever this transaction already took.
    releaseAll(acquired);
    throw error;
  }

  // ---- phase 2/3: critical section, then shrink in reverse order ----
  const nextHeld = new Set([...(inherited ?? []), ...requested]);
  try {
    return await heldKeys.run(nextHeld, task);
  } finally {
    releaseAll(acquired);
  }
};

export const getLockStats = () => ({
  ...metrics,
  activeLocks: [...registry.entries()].filter(([, state]) => Boolean(state.holder)).length,
  queuedLocks: [...registry.entries()].reduce((total, [, state]) => total + state.queue.length, 0),
  trackedKeys: registry.size,
});

export const getLockTimeoutMs = () => DEFAULT_LOCK_TIMEOUT_MS;
