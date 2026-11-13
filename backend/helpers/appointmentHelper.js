import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import { withLocks, lockKey } from "./lockManager.js";
import { invalidateAppointmentReads } from "./cacheKeys.js";

/** Slot formats used across the app: DD-MM-YYYY and HH:MM (24h). */
export const SLOT_DATE_PATTERN = /^\d{2}-\d{2}-\d{4}$/;
export const SLOT_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Validate user-supplied slot values.
 *
 * Besides rejecting nonsense, this keeps `slotDate` safe to use inside a Mongo
 * field path (`slots_booked.<slotDate>`): no dots, no `$`, no operator injection.
 */
export const isValidSlot = (slotDate, slotTime) =>
  typeof slotDate === "string" &&
  typeof slotTime === "string" &&
  SLOT_DATE_PATTERN.test(slotDate) &&
  SLOT_TIME_PATTERN.test(slotTime);

/**
 * Parse slotDate (DD-MM-YYYY) and slotTime (HH:MM) into a Date object.
 * @returns {Date|null} null when the stored values are not parseable
 */
const parseAppointmentDateTime = (slotDate, slotTime) => {
  if (!isValidSlot(slotDate, slotTime)) return null;

  const [day, month, year] = slotDate.split("-").map(Number);
  const [hours, minutes] = slotTime.split(":").map(Number);
  const parsed = new Date(year, month - 1, day, hours, minutes, 0);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Mark every passed appointment as completed.
 * @returns {Promise<{appointments: Array, updatedCount: number}>}
 */
export const autoCompleteAppointments = async (appointments = []) => {
  const now = new Date();
  const idsToComplete = [];

  for (const appointment of appointments) {
    if (appointment.isCompleted || appointment.cancelled) continue;

    const appointmentDateTime = parseAppointmentDateTime(
      appointment.slotDate,
      appointment.slotTime
    );
    if (!appointmentDateTime) continue;

    if (appointmentDateTime < now) {
      idsToComplete.push(appointment._id);
      appointment.isCompleted = true;
    }
  }

  if (idsToComplete.length > 0) {
    await appointmentModel.updateMany(
      { _id: { $in: idsToComplete } },
      { isCompleted: true }
    );

    // The write above changed appointment state: drop every derived view so no
    // reader keeps serving the pre-completion snapshot.
    invalidateAppointmentReads();
  }

  return { appointments, updatedCount: idsToComplete.length };
};

/**
 * Backwards-compatible wrapper used by the read endpoints.
 */
export const checkAndCompleteAppointments = async (appointments) =>
  (await autoCompleteAppointments(appointments)).appointments;

/**
 * Toggle appointment completion status.
 * @returns {Promise<Object>} updated appointment
 */
export const toggleAppointmentCompletion = async (appointmentId) => {
  const appointment = await appointmentModel.findById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.cancelled) {
    throw new Error("Cannot toggle completion status of a cancelled appointment");
  }

  const updated = await appointmentModel.findByIdAndUpdate(
    appointmentId,
    { isCompleted: !appointment.isCompleted },
    { new: true }
  );

  invalidateAppointmentReads({
    userId: updated.userId,
    docId: updated.docId,
  });

  return updated;
};

/**
 * Atomically take a slot.
 *
 * The filter and the update are one MongoDB operation, so two callers can never
 * both observe the slot as free: the loser's filter no longer matches.
 *
 * @returns {Promise<Object|null>} the updated doctor, or null when the slot is
 * taken / the doctor is unavailable
 */
export const reserveSlotAtomic = async (docId, slotDate, slotTime) => {
  if (!isValidSlot(slotDate, slotTime)) return null;

  return doctorModel
    .findOneAndUpdate(
      {
        _id: docId,
        available: true,
        [`slots_booked.${slotDate}`]: { $ne: slotTime },
      },
      { $push: { [`slots_booked.${slotDate}`]: slotTime } },
      { new: true }
    )
    .lean();
};

/** Give a slot back. Safe to call repeatedly: `$pull` on an absent value is a no-op. */
export const releaseSlotAtomic = async (docId, slotDate, slotTime) => {
  if (!isValidSlot(slotDate, slotTime)) return;

  await doctorModel.updateOne(
    { _id: docId },
    { $pull: { [`slots_booked.${slotDate}`]: slotTime } }
  );
};

/** An active (not cancelled) appointment for exactly this user/doctor/slot. */
export const findActiveAppointment = ({ userId, docId, slotDate, slotTime }) =>
  appointmentModel
    .findOne({ userId, docId, slotDate, slotTime, cancelled: false })
    .lean();

/** Any active appointment for exactly this doctor/slot, regardless of user. */
export const findSlotOwner = ({ docId, slotDate, slotTime }) =>
  appointmentModel
    .findOne({ docId, slotDate, slotTime, cancelled: false })
    .lean();

/**
 * Cancel an appointment exactly once, under locks.
 *
 * The caller reads the appointment first only to know which keys to lock; the
 * authoritative state is re-read by the conditional update inside the critical
 * section. Whoever flips `cancelled` from false to true wins and is the only one
 * that releases the slot, so a concurrent cancel/booking pair cannot corrupt
 * `slots_booked` or free a slot twice.
 *
 * @param {{appointmentId: string, timeoutMs?: number}} options
 * @returns {Promise<{changed: boolean, alreadyCancelled: boolean, appointment: object|null}>}
 */
export const cancelAppointmentWithLock = async ({ appointmentId, timeoutMs }) => {
  // Read once, unlocked, only to learn which locks this appointment needs.
  const preview = await appointmentModel.findById(appointmentId).lean();
  if (!preview) return { changed: false, alreadyCancelled: false, appointment: null };

  return withLocks(
    [
      lockKey.doctor(String(preview.docId)),
      lockKey.slot(String(preview.docId), preview.slotDate, preview.slotTime),
      lockKey.appointment(String(appointmentId)),
    ],
    async () => {
      // Authoritative re-read happens inside the lock.
      const current = await appointmentModel.findById(appointmentId).lean();
      if (!current) return { changed: false, alreadyCancelled: false, appointment: null };

      const cancelled = await appointmentModel.findOneAndUpdate(
        { _id: appointmentId, cancelled: false },
        { $set: { cancelled: true, payment: false } },
        { new: true }
      );

      if (!cancelled) {
        // Another request already cancelled it: idempotent success, no double release.
        return {
          changed: false,
          alreadyCancelled: true,
          appointment: current,
        };
      }

      await releaseSlotAtomic(cancelled.docId, cancelled.slotDate, cancelled.slotTime);
      invalidateAppointmentReads({
        userId: cancelled.userId,
        docId: cancelled.docId,
      });

      return {
        changed: true,
        alreadyCancelled: false,
        appointment: cancelled.toObject(),
      };
    },
    { timeoutMs }
  );
};

export default {
  autoCompleteAppointments,
  checkAndCompleteAppointments,
  toggleAppointmentCompletion,
  reserveSlotAtomic,
  releaseSlotAtomic,
  findActiveAppointment,
  findSlotOwner,
  cancelAppointmentWithLock,
  isValidSlot,
};
