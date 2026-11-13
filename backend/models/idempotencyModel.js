import mongoose from "mongoose";

/**
 * Idempotency ledger for state-changing API calls (booking).
 *
 * `state: pending` marks a request that is currently being executed, so a second
 * concurrent call with the same key can be answered with 409 instead of being
 * executed twice. `state: completed` stores the original response body, which is
 * replayed verbatim for retries.
 *
 * Records expire through a TTL index, so the collection stays small.
 */
const idempotencySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    requestHash: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      required: true,
    },
    statusCode: {
      type: Number,
      default: 200,
    },
    response: {
      type: Object,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true, minimize: false }
);

// One record per (scope, owner, key): the database itself is the arbiter when
// two identical requests race.
idempotencySchema.index({ scope: 1, owner: 1, key: 1 }, { unique: true });

const idempotencyModel =
  mongoose.models.idempotency || mongoose.model("idempotency", idempotencySchema);

export default idempotencyModel;
