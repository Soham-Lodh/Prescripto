import { invalidateTags } from "./cache.js";

/**
 * Single source of truth for cache keys, TTLs and tags.
 *
 * Every write path imports the invalidation helpers below, so a mutation can
 * never forget one of the reads that depends on it.
 */

const positiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const TTL = {
  doctorsList: positiveNumber(process.env.CACHE_TTL_DOCTORS_MS, 30_000),
  doctorProfile: positiveNumber(process.env.CACHE_TTL_DOCTOR_PROFILE_MS, 20_000),
  userProfile: positiveNumber(process.env.CACHE_TTL_USER_PROFILE_MS, 30_000),
  appointments: positiveNumber(process.env.CACHE_TTL_APPOINTMENTS_MS, 10_000),
  dashboard: positiveNumber(process.env.CACHE_TTL_DASHBOARD_MS, 15_000),
  messages: positiveNumber(process.env.CACHE_TTL_MESSAGES_MS, 30_000),
};

export const TAG = {
  /** The doctor roster / every doctor document projection. */
  doctors: "doctors",
  /** One doctor (profile, slots, availability). */
  doctor: (docId) => `doctor:${docId}`,
  user: (userId) => `user:${userId}`,
  /** Every appointment view; bumped by any appointment mutation. */
  appointments: "appointments",
  userAppointments: (userId) => `appointments:user:${userId}`,
  doctorAppointments: (docId) => `appointments:doctor:${docId}`,
  adminDashboard: "dashboard:admin",
  doctorDashboard: (docId) => `dashboard:doctor:${docId}`,
  messages: "messages",
};

export const KEY = {
  doctorsList: "doctors:list",
  adminDoctorsList: "doctors:admin-list",
  doctorProfile: (docId) => `doctor:profile:${docId}`,
  userProfile: (userId) => `user:profile:${userId}`,
  userAppointments: (userId) => `appointments:user:${userId}`,
  doctorAppointments: (docId) => `appointments:doctor:${docId}`,
  adminAppointments: "appointments:admin",
  doctorDashboard: (docId) => `dashboard:doctor:${docId}`,
  adminDashboard: "dashboard:admin",
  messages: "messages:admin",
};

/** Doctor roster / doctor document changed (add, update, delete, availability). */
export const invalidateDoctorReads = (docId) =>
  invalidateTags(TAG.doctors, docId ? TAG.doctor(docId) : undefined);

/** A user document changed. */
export const invalidateUserReads = (userId) =>
  invalidateTags(TAG.user(userId));

/**
 * An appointment was created / cancelled / completed / auto-completed.
 * Appointment snapshots include doctor data, and doctors embed `slots_booked`,
 * so both sides plus every aggregate view are invalidated together.
 */
export const invalidateAppointmentReads = ({ userId, docId } = {}) =>
  invalidateTags(
    TAG.appointments,
    TAG.adminDashboard,
    userId ? TAG.userAppointments(userId) : undefined,
    docId ? TAG.doctorAppointments(docId) : undefined,
    docId ? TAG.doctorDashboard(docId) : undefined,
    // `slots_booked` is part of both the roster and the doctor profile.
    TAG.doctors,
    docId ? TAG.doctor(docId) : undefined
  );

/** Contact messages changed. */
export const invalidateMessageReads = () => invalidateTags(TAG.messages);
