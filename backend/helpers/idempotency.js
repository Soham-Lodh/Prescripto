import crypto from "node:crypto";
import idempotencyModel from "../models/idempotencyModel.js";

/**
 * Idempotent request handling.
 *
 * Contract:
 *  - the client sends an `Idempotency-Key` header (or `idempotencyKey` body field);
 *  - the first request creates a `pending` record and executes;
 *  - a retry with the same key and the same payload gets the stored response
 *    replayed, so a duplicate never books a second appointment;
 *  - the same key with a different payload is rejected (409), never silently
 *    executed as a different action;
 *  - a concurrent duplicate while the first request is still running is answered
 *    with 409 + Retry-After, and a retry after the configured window may take
 *    over an abandoned `pending` record;
 *  - a failed execution deletes its `pending` record so the client can retry.
 */

const positiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const IDEMPOTENCY_TTL_MS = positiveNumber(
  process.env.IDEMPOTENCY_TTL_MS,
  24 * 60 * 60 * 1000
);
export const IDEMPOTENCY_PENDING_STALE_MS = positiveNumber(
  process.env.IDEMPOTENCY_PENDING_STALE_MS,
  60 * 1000
);
const MAX_KEY_LENGTH = 200;

/** Deterministic JSON: object keys are sorted at every depth. */
const stableStringify = (value) => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;

  const keys = Object.keys(value).sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
};

export const fingerprint = (payload) =>
  crypto.createHash("sha256").update(stableStringify(payload)).digest("hex");

/** Read the idempotency key from the request, or null when the client sent none. */
export const getIdempotencyKey = (req) => {
  const raw = req.get?.("Idempotency-Key") ?? req.body?.idempotencyKey ?? "";
  const key = String(raw).trim();
  if (!key) return null;
  if (key.length > MAX_KEY_LENGTH) {
    throw new Error(`Idempotency-Key must be at most ${MAX_KEY_LENGTH} characters`);
  }
  return key;
};

const createRecord = (fields) =>
  idempotencyModel.create({
    ...fields,
    state: "pending",
    expiresAt: new Date(Date.now() + IDEMPOTENCY_TTL_MS),
  });

const inProgressResult = (record) => {
  const age = Date.now() - new Date(record.updatedAt ?? record.createdAt).getTime();
  return {
    mode: "in_progress",
    record,
    retryAfterMs: Math.max(
      250,
      Math.min(IDEMPOTENCY_PENDING_STALE_MS, IDEMPOTENCY_PENDING_STALE_MS - age)
    ),
  };
};

/**
 * @returns {Promise<
 *   | { mode: "disabled" }
 *   | { mode: "execute", record: object }
 *   | { mode: "replay", statusCode: number, response: object }
 *   | { mode: "in_progress", retryAfterMs: number }
 *   | { mode: "conflict" }
 * >}
 */
export const beginIdempotentRequest = async ({ scope, owner, key, payload }) => {
  if (!key) return { mode: "disabled" };

  const identity = {
    scope: String(scope),
    owner: String(owner),
    key: String(key),
    requestHash: fingerprint(payload),
  };

  try {
    const record = await createRecord(identity);
    return { mode: "execute", record };
  } catch (error) {
    if (error?.code !== 11000) throw error;
  }

  const existing = await idempotencyModel.findOne({
    scope: identity.scope,
    owner: identity.owner,
    key: identity.key,
  });

  // The TTL monitor removed the record between the insert and this read.
  if (!existing) {
    const record = await createRecord(identity);
    return { mode: "execute", record };
  }

  if (existing.requestHash !== identity.requestHash) {
    return { mode: "conflict" };
  }

  if (existing.state === "completed") {
    return {
      mode: "replay",
      statusCode: existing.statusCode || 200,
      response: existing.response,
    };
  }

  const pendingAge = Date.now() - new Date(existing.updatedAt ?? existing.createdAt).getTime();
  if (pendingAge < IDEMPOTENCY_PENDING_STALE_MS) {
    return inProgressResult(existing);
  }

  // Abandoned attempt (process crash, timeout): take it over atomically so only
  // one caller continues.
  const takeover = await idempotencyModel.findOneAndUpdate(
    {
      _id: existing._id,
      state: "pending",
      updatedAt: { $lt: new Date(Date.now() - IDEMPOTENCY_PENDING_STALE_MS) },
    },
    {
      $set: {
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + IDEMPOTENCY_TTL_MS),
      },
    },
    { new: true }
  );

  if (takeover) return { mode: "execute", record: takeover };

  return inProgressResult(existing);
};

/** Persist the response so retries replay the exact same result. */
export const completeIdempotentRequest = async (record, { statusCode, response }) => {
  if (!record?._id) return;

  try {
    await idempotencyModel.updateOne(
      { _id: record._id },
      {
        $set: {
          state: "completed",
          statusCode,
          response,
          expiresAt: new Date(Date.now() + IDEMPOTENCY_TTL_MS),
        },
      }
    );
  } catch (error) {
    console.error("[idempotency] failed to store response:", error.message);
  }
};

/** Release the key after a failed attempt so the client is free to retry. */
export const abortIdempotentRequest = async (record) => {
  if (!record?._id) return;

  try {
    await idempotencyModel.deleteOne({ _id: record._id, state: "pending" });
  } catch (error) {
    console.error("[idempotency] failed to release record:", error.message);
  }
};
