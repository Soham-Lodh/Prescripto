/**
 * Server-side read cache (DB -> API response).
 *
 * Why: the same rows are read over and over (doctor roster, profiles, dashboards,
 * appointment lists). Caching them removes repeated round trips to MongoDB.
 *
 * Staleness rules (no stale reads are served):
 *  - every entry has a TTL; an expired entry is treated as a miss, never served;
 *  - every entry carries tags, and each tag has a version. A write that touches a
 *    resource bumps that tag version, which instantly invalidates every entry
 *    carrying it - even if the sweeper has not removed the entry yet;
 *  - a loader that started *before* an invalidation is not allowed to store its
 *    result, so a slow read cannot resurrect data that a concurrent write just
 *    changed (the classic cache-aside race);
 *  - concurrent misses for the same key share one loader (single flight), so a
 *    burst of requests cannot stampede the database;
 *  - the cache is bounded and self-pruning.
 */

const positiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const DEFAULT_TTL_MS = positiveNumber(process.env.CACHE_TTL_MS, 30_000);
const MAX_ENTRIES = positiveNumber(process.env.CACHE_MAX_ENTRIES, 1000);
const SWEEP_INTERVAL_MS = positiveNumber(process.env.CACHE_SWEEP_INTERVAL_MS, 60_000);
const ENABLED = String(process.env.CACHE_ENABLED ?? "true").toLowerCase() !== "false";

/** key -> { value, storedAt, expiresAt, tags, tagVersions } */
const store = new Map();
/** tag -> version counter */
const tagVersions = new Map();
/** key -> in-flight loader promise */
const inflight = new Map();

const stats = {
  hits: 0,
  misses: 0,
  sets: 0,
  evictions: 0,
  invalidations: 0,
  stampedeJoins: 0,
  skippedStaleWrites: 0,
};

const tagVersion = (tag) => tagVersions.get(tag) ?? 0;

const isStillValid = (entry) => {
  if (entry.expiresAt <= Date.now()) return false;
  for (let i = 0; i < entry.tags.length; i += 1) {
    if (tagVersion(entry.tags[i]) !== entry.tagVersions[i]) return false;
  }
  return true;
};

const evictIfNeeded = () => {
  while (store.size > MAX_ENTRIES) {
    const oldestKey = store.keys().next().value;
    if (oldestKey === undefined) return;
    store.delete(oldestKey);
    stats.evictions += 1;
  }
};

const pruneExpired = () => {
  let removed = 0;
  for (const [key, entry] of store) {
    if (!isStillValid(entry)) {
      store.delete(key);
      removed += 1;
    }
  }
  return removed;
};

export const cacheGet = (key) => {
  if (!ENABLED) return undefined;

  const entry = store.get(key);
  if (!entry) {
    stats.misses += 1;
    return undefined;
  }

  if (!isStillValid(entry)) {
    store.delete(key);
    stats.misses += 1;
    return undefined;
  }

  stats.hits += 1;
  // Re-insert to keep Map insertion order as a cheap LRU.
  store.delete(key);
  store.set(key, entry);
  return entry.value;
};

export const cacheSet = (key, value, { ttlMs = DEFAULT_TTL_MS, tags = [] } = {}) => {
  if (!ENABLED || value === undefined) return value;

  const normalizedTags = [...new Set(tags.map(String))];
  store.delete(key);
  store.set(key, {
    value,
    storedAt: Date.now(),
    expiresAt: Date.now() + positiveNumber(ttlMs, DEFAULT_TTL_MS),
    tags: normalizedTags,
    tagVersions: normalizedTags.map(tagVersion),
  });
  stats.sets += 1;
  evictIfNeeded();
  return value;
};

export const cacheDel = (key) => store.delete(key);

/**
 * Invalidate every entry carrying any of the given tags, and bump the tag
 * versions so entries that are mid-flight cannot be written back as fresh.
 */
export const invalidateTags = (...tags) => {
  const flat = tags.flat().filter(Boolean).map(String);
  if (flat.length === 0) return 0;

  for (const tag of flat) {
    tagVersions.set(tag, tagVersion(tag) + 1);
  }

  let removed = 0;
  for (const [key, entry] of store) {
    if (entry.tags.some((tag) => flat.includes(tag))) {
      store.delete(key);
      removed += 1;
    }
  }

  stats.invalidations += 1;
  return removed;
};

export const invalidatePrefix = (prefix) => {
  if (!prefix) return 0;
  let removed = 0;
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
      removed += 1;
    }
  }
  if (removed > 0) stats.invalidations += 1;
  return removed;
};

/**
 * Cache-aside read with single flight and invalidation-safe writes.
 *
 * @param {string} key
 * @param {() => Promise<any>} loader - must return the raw data (not an envelope)
 * @param {{ttlMs?: number, tags?: string[], refresh?: boolean}} options
 */
export const readThrough = async (key, loader, options = {}) => {
  const { ttlMs = DEFAULT_TTL_MS, tags = [], refresh = false } = options;

  if (!ENABLED) return loader();

  if (!refresh) {
    const cached = cacheGet(key);
    if (cached !== undefined) return cached;
  }

  const pending = inflight.get(key);
  if (pending) {
    stats.stampedeJoins += 1;
    return pending;
  }

  // Snapshot tag versions *before* reading so a write that lands mid-load
  // prevents this (now outdated) result from being cached.
  const versionsBeforeLoad = [...new Set(tags.map(String))].map(tagVersion);

  const promise = (async () => {
    try {
      const value = await loader();

      const invalidatedDuringLoad = tags.some(
        (tag, index) => tagVersion(tag) !== versionsBeforeLoad[index]
      );

      if (invalidatedDuringLoad) {
        stats.skippedStaleWrites += 1;
        return value;
      }

      return cacheSet(key, value, { ttlMs, tags });
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
};

export const cacheStats = () => ({
  enabled: ENABLED,
  entries: store.size,
  maxEntries: MAX_ENTRIES,
  defaultTtlMs: DEFAULT_TTL_MS,
  inFlight: inflight.size,
  tags: tagVersions.size,
  hits: stats.hits,
  misses: stats.misses,
  hitRate:
    stats.hits + stats.misses === 0
      ? 0
      : Number((stats.hits / (stats.hits + stats.misses)).toFixed(4)),
  ...stats,
});

export const cacheClear = () => {
  store.clear();
  inflight.clear();
  tagVersions.clear();
};

const sweeper = setInterval(() => {
  const removed = pruneExpired();
  if (removed > 0) stats.evictions += removed;
}, SWEEP_INTERVAL_MS);

if (typeof sweeper.unref === "function") sweeper.unref();
