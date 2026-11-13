import bcrypt from "bcrypt";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import contactModel from "../models/contactModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import {
  autoCompleteAppointments,
  cancelAppointmentWithLock,
  findActiveAppointment,
  findSlotOwner,
  isValidSlot,
  releaseSlotAtomic,
  reserveSlotAtomic,
} from "../helpers/appointmentHelper.js";
import { ApiError } from "../helpers/apiError.js";
import { getLockTimeoutMs, lockKey, withLocks } from "../helpers/lockManager.js";
import { readThrough } from "../helpers/cache.js";
import {
  KEY,
  TAG,
  TTL,
  invalidateAppointmentReads,
  invalidateMessageReads,
  invalidateUserReads,
} from "../helpers/cacheKeys.js";
import {
  abortIdempotentRequest,
  beginIdempotentRequest,
  completeIdempotentRequest,
  getIdempotencyKey,
} from "../helpers/idempotency.js";

// Helper function for strict sanitization
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return validator.escape(validator.trim(input));
};

const noStore = (res) => res.set("Cache-Control", "private, no-store");

const respondWithError = (res, error, fallbackMessage = "Server error.") => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.code ? { code: error.code } : {}),
    });
  }

  if (error?.code === "LOCK_TIMEOUT") {
    // Contention, not a client error: tell the caller it is safe to retry.
    res.set("Retry-After", "1");
    return res.status(503).json({
      success: false,
      code: "LOCK_TIMEOUT",
      message: "The slot is being processed by another request. Please retry.",
    });
  }

  console.error("Request error:", error);
  return res.status(500).json({ success: false, message: fallbackMessage });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name: sanitizeInput(name), email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ success: true, message: "User logged in successfully", token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await readThrough(
      KEY.userProfile(userId),
      () => userModel.findById(userId).select("-password").lean(),
      { ttlMs: TTL.userProfile, tags: [TAG.user(userId)] }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    noStore(res);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, address, gender, dob, phone } = req.body;
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = sanitizeInput(name);

    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Please enter a valid email" });
      }
      const emailExists = await userModel.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }
      user.email = email;
    }

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(base64);
      user.image = uploadResult.secure_url;
    }

    let parsedAddress;
    if (address) {
      parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
      user.address = {
        line1: sanitizeInput(parsedAddress.line1 || user.address.line1),
        line2: sanitizeInput(parsedAddress.line2 || user.address.line2),
      };
    }

    if (gender) user.gender = sanitizeInput(gender);
    if (dob) user.dob = dob;
    if (phone) user.phone = sanitizeInput(phone);

    await user.save();

    // Write-then-invalidate: readers never see the pre-update profile again.
    invalidateUserReads(user._id);

    noStore(res);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        address: user.address,
        gender: user.gender,
        dob: user.dob,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

/**
 * Book an appointment.
 *
 * Concurrency contract:
 *  1. Idempotency-Key (header or body) makes retries replay the original result.
 *     The ledger insert is the arbiter between two concurrent duplicates.
 *  2. Inside the critical section every lock the operation needs is taken up
 *     front via withLocks(), in the process-wide canonical order, each with a
 *     timeout: {doctor, slot, user}. Partial acquisition rolls back.
 *  3. The slot itself is taken with one atomic compare-and-set on MongoDB, so
 *     even a second process (where in-memory locks do not reach) cannot double
 *     book; a unique partial index backs that up.
 *  4. If writing the appointment fails, the slot reservation is compensated.
 *  5. Cache tags are invalidated only after the write is committed.
 */
export const bookAppointment = async (req, res) => {
  const userId = req.user?.userId;

  let idempotencyKey;
  try {
    idempotencyKey = getIdempotencyKey(req);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  const { docId, slotDate, slotTime } = req.body ?? {};

  if (!userId) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
  if (!docId || !slotDate || !slotTime) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  if (!mongoose.isValidObjectId(docId)) {
    return res.status(400).json({ success: false, message: "Invalid doctor id" });
  }
  if (!isValidSlot(slotDate, slotTime)) {
    return res.status(400).json({ success: false, message: "Invalid slot date or time" });
  }

  let idempotency;
  try {
    idempotency = await beginIdempotentRequest({
      scope: "book-appointment",
      owner: userId,
      key: idempotencyKey,
      payload: { userId, docId, slotDate, slotTime },
    });
  } catch (error) {
    console.error("Idempotency setup error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }

  if (idempotency.mode === "conflict") {
    return res.status(409).json({
      success: false,
      code: "IDEMPOTENCY_KEY_REUSED",
      message: "This Idempotency-Key was already used for a different booking request.",
    });
  }

  if (idempotency.mode === "in_progress") {
    res.set("Retry-After", String(Math.max(1, Math.ceil(idempotency.retryAfterMs / 1000))));
    return res.status(409).json({
      success: false,
      code: "BOOKING_IN_PROGRESS",
      retryAfterMs: idempotency.retryAfterMs,
      message: "An identical booking request is already being processed.",
    });
  }

  if (idempotency.mode === "replay") {
    res.set("Idempotent-Replayed", "true");
    noStore(res);
    return res.status(idempotency.statusCode || 200).json(idempotency.response);
  }

  const record = idempotency.record ?? null;

  try {
    const outcome = await withLocks(
      [
        lockKey.doctor(docId),
        lockKey.slot(docId, slotDate, slotTime),
        lockKey.user(userId),
      ],
      async () => {
        // Fresh read inside the lock; the cache is deliberately bypassed here.
        const doctor = await doctorModel.findById(docId).lean();
        if (!doctor) throw new ApiError(404, "Doctor not found");
        if (!doctor.available) throw new ApiError(400, "Doctor is not available");

        // A retry whose first attempt already succeeded: replay, do not duplicate.
        const existing = await findActiveAppointment({ userId, docId, slotDate, slotTime });
        if (existing) {
          return { appointment: existing, replayed: true };
        }

        const reserved = await reserveSlotAtomic(docId, slotDate, slotTime);
        if (!reserved) {
          const owner = await findSlotOwner({ docId, slotDate, slotTime });
          throw new ApiError(
            409,
            owner ? "Slot already booked" : "Doctor is not available for this slot",
            { code: "SLOT_UNAVAILABLE" }
          );
        }

        const userData = await userModel.findById(userId).select("-password").lean();
        if (!userData) {
          await releaseSlotAtomic(docId, slotDate, slotTime);
          throw new ApiError(404, "User not found");
        }

        try {
          const appointment = await appointmentModel.create({
            userId,
            docId,
            slotDate,
            slotTime,
            userData,
            docData: {
              _id: doctor._id,
              name: doctor.name,
              speciality: doctor.speciality,
              fees: doctor.fees,
              image: doctor.image,
              address: doctor.address,
            },
            amount: doctor.fees,
            date: Date.now(),
          });

          // Invalidate only after the commit, so no reader caches a half state.
          invalidateAppointmentReads({ userId, docId });

          return { appointment: appointment.toObject(), replayed: false };
        } catch (error) {
          // Compensation: never leave a slot blocked by an appointment that
          // does not exist.
          await releaseSlotAtomic(docId, slotDate, slotTime);
          invalidateAppointmentReads({ userId, docId });

          if (error?.code === 11000) {
            throw new ApiError(409, "Slot already booked", { code: "SLOT_UNAVAILABLE" });
          }
          throw error;
        }
      },
      { timeoutMs: getLockTimeoutMs() }
    );

    const body = {
      success: true,
      message: outcome.replayed
        ? "Appointment already booked"
        : "Appointment booked successfully",
      appointment: outcome.appointment,
      replayed: outcome.replayed,
    };

    await completeIdempotentRequest(record, { statusCode: 200, response: body });

    if (outcome.replayed) res.set("Idempotent-Replayed", "true");
    noStore(res);
    return res.status(200).json(body);
  } catch (error) {
    // A failed attempt must not poison the key: the client may retry.
    await abortIdempotentRequest(record);
    return respondWithError(res, error);
  }
};

export const listAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const appointments = await readThrough(
      KEY.userAppointments(userId),
      async () => {
        const list = await appointmentModel
          .find({ userId })
          .sort({ date: -1 })
          .lean();

        // Auto-complete appointments whose time has passed, then cache the
        // settled list (autoCompleteAppointments invalidates on its own writes).
        return (await autoCompleteAppointments(list)).appointments;
      },
      {
        ttlMs: TTL.appointments,
        tags: [TAG.userAppointments(userId), TAG.appointments],
      }
    );

    noStore(res);
    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Fetch appointments error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { appointmentId } = req.body ?? {};

    if (!appointmentId || !mongoose.isValidObjectId(appointmentId)) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId).lean();
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Cancelling twice is a no-op, not an error: the slot is released once only.
    const result = await cancelAppointmentWithLock({
      appointmentId,
      timeoutMs: getLockTimeoutMs(),
    });

    if (!result.appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    noStore(res);
    return res.status(200).json({
      success: true,
      message: result.changed
        ? "Appointment cancelled successfully"
        : "Appointment was already cancelled",
      alreadyCancelled: result.alreadyCancelled,
    });
  } catch (error) {
    return respondWithError(res, error, error.message);
  }
};

export const payment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { appointmentId } = req.body ?? {};

    if (!appointmentId || !mongoose.isValidObjectId(appointmentId)) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId).lean();
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // In a real scenario, Verify Stripe/Razorpay signature here.

    // Atomic + idempotent: only an unpaid appointment is flipped, and a repeated
    // confirmation is answered with the same success.
    const updated = await appointmentModel.findOneAndUpdate(
      { _id: appointmentId, payment: false },
      { $set: { payment: true } },
      { new: true }
    );

    if (updated) {
      invalidateAppointmentReads({ userId: updated.userId, docId: updated.docId });
    }

    noStore(res);
    return res.status(200).json({
      success: true,
      message: updated ? "Payment successful" : "Payment was already recorded",
      alreadyPaid: !updated,
      updatedAppointment: updated ? updated.toObject() : { ...appointmentData, payment: true },
    });
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const contactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Sanitize input
    const cleanName = sanitizeInput(name);
    const cleanMessage = sanitizeInput(message);

    const data = await contactModel.create({
      name: cleanName,
      email,
      message: cleanMessage,
    });

    invalidateMessageReads();

    return res.status(201).json({ success: true, message: "Message received successfully", data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
