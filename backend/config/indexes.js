import mongoose from "mongoose";
import appointmentModel from "../models/appointmentModel.js";
import idempotencyModel from "../models/idempotencyModel.js";

/**
 * Indexes that are part of the data-integrity guarantees (not just performance).
 *
 * `uniq_active_slot` is the last line of defence against double booking: even if
 * two processes (in-memory locks are per process) reserve the same slot, MongoDB
 * rejects the second active appointment for that doctor/date/time.
 *
 * Index creation is best-effort: pre-existing duplicate data must not stop the
 * API from booting, so a failure is logged with the reason instead.
 */
export const ensureIndexes = async () => {
  try {
    await appointmentModel.collection.createIndex(
      { docId: 1, slotDate: 1, slotTime: 1 },
      {
        name: "uniq_active_slot",
        unique: true,
        partialFilterExpression: { cancelled: false },
      }
    );
  } catch (error) {
    console.warn(
      `[indexes] could not create uniq_active_slot (${error.code ?? "?"}: ${error.message}). ` +
        "Resolve duplicate active appointments for the same doctor/date/time, then restart."
    );
  }

  try {
    await idempotencyModel.collection.createIndex(
      { expiresAt: 1 },
      { name: "idempotency_ttl", expireAfterSeconds: 0 }
    );
  } catch (error) {
    console.warn(
      `[indexes] could not create idempotency_ttl (${error.code ?? "?"}: ${error.message}).`
    );
  }
};

export const isDatabaseReady = () => mongoose.connection.readyState === 1;
