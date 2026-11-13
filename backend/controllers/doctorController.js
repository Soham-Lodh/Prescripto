import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import {
  autoCompleteAppointments,
  cancelAppointmentWithLock,
  toggleAppointmentCompletion,
} from "../helpers/appointmentHelper.js";
import { getLockTimeoutMs, lockKey, withLocks } from "../helpers/lockManager.js";
import { readThrough } from "../helpers/cache.js";
import {
  KEY,
  TAG,
  TTL,
  invalidateAppointmentReads,
  invalidateDoctorReads,
} from "../helpers/cacheKeys.js";

const noStore = (res) => res.set("Cache-Control", "private, no-store");

/** Admin-side availability toggle (mounted under /api/admin). */
export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId || !mongoose.isValidObjectId(docId)) {
      return res.json({ success: false, message: "Invalid doctor id" });
    }

    const message = await withLocks([lockKey.doctor(docId)], async () => {
      const docData = await doctorModel.findById(docId).lean();
      if (!docData) return { success: false, message: "Doctor not found" };

      await doctorModel.findByIdAndUpdate(docId, {
        available: !docData.available,
      });

      invalidateDoctorReads(docId);
      return { success: true, message: "Availability Changed Successfully" };
    });

    res.json(message);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const doctorsList = async (req, res) => {
  try {
    const doctors = await readThrough(
      KEY.doctorsList,
      () => doctorModel.find({}).select(["-password", "-email"]).lean(),
      { ttlMs: TTL.doctorsList, tags: [TAG.doctors] }
    );

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Doctor Dashboard Functions
export const getDoctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;

    const doctor = await readThrough(
      KEY.doctorProfile(docId),
      () => doctorModel.findById(docId).select("-password").lean(),
      { ttlMs: TTL.doctorProfile, tags: [TAG.doctor(docId), TAG.doctors] }
    );

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    noStore(res);
    res.json({ success: true, doctor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    let updateData = {
      speciality: speciality || doctor.speciality,
      degree: degree || doctor.degree,
      experience: experience || doctor.experience,
      about: about || doctor.about,
      fees: fees || doctor.fees,
      address: address ? JSON.parse(address) : doctor.address,
    };

    // Handle image update if provided
    if (imageFile) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
        stream.end(imageFile.buffer);
      });
      updateData.image = result.secure_url;
    }

    const updatedDoctor = await doctorModel
      .findByIdAndUpdate(docId, updateData, { new: true })
      .select("-password")
      .lean();

    // The roster and this doctor's cached profile both embed these fields.
    invalidateDoctorReads(docId);

    noStore(res);
    res.json({ success: true, message: "Profile updated successfully", doctor: updatedDoctor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const doctorChangeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const message = await withLocks([lockKey.doctor(docId)], async () => {
      const docData = await doctorModel.findById(docId).lean();
      if (!docData) return { success: false, message: "Doctor not found" };

      await doctorModel.findByIdAndUpdate(docId, {
        available: !docData.available,
      });

      invalidateDoctorReads(docId);
      return { success: true, message: "Availability changed successfully" };
    });

    noStore(res);
    res.json(message);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await readThrough(
      KEY.doctorAppointments(docId),
      async () => {
        const list = await appointmentModel.find({ docId }).lean();
        return (await autoCompleteAppointments(list)).appointments;
      },
      {
        ttlMs: TTL.appointments,
        tags: [TAG.doctorAppointments(docId), TAG.appointments],
      }
    );

    noStore(res);
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const doctorCancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId || !mongoose.isValidObjectId(appointmentId)) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId).lean();
    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Locked + idempotent: the slot is released exactly once, even if the doctor
    // double-clicks or an admin cancels at the same moment.
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
    console.error("Cancel appointment error:", error);

    if (error?.code === "LOCK_TIMEOUT") {
      res.set("Retry-After", "1");
      return res.status(503).json({
        success: false,
        code: "LOCK_TIMEOUT",
        message: "This appointment is being updated by another request. Please retry.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const doctorCompleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId || !mongoose.isValidObjectId(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    // The helper invalidates every appointment-derived cache entry.
    const updated = await toggleAppointmentCompletion(appointmentId);

    invalidateAppointmentReads({ userId: updated.userId, docId: updated.docId });
    noStore(res);

    return res.status(200).json({
      success: true,
      message: `Appointment marked as ${updated.isCompleted ? "completed" : "incomplete"}`,
      isCompleted: updated.isCompleted,
    });
  } catch (error) {
    console.error("Complete appointment error:", error);

    if (error.message === "Appointment not found") {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (error.message.includes("cancelled")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const dashData = await readThrough(
      KEY.doctorDashboard(docId),
      async () => {
        const appointments = await appointmentModel.find({ docId }).lean();
        const settled = (await autoCompleteAppointments(appointments)).appointments;

        return {
          appointments: settled.length,
          patients: new Set(settled.map((apt) => apt.userId)).size,
          cancelled: settled.filter((apt) => apt.cancelled).length,
          completed: settled.filter((apt) => apt.isCompleted).length,
          latestAppointments: [...settled].reverse().slice(0, 5),
        };
      },
      {
        ttlMs: TTL.dashboard,
        tags: [TAG.doctorDashboard(docId), TAG.appointments],
      }
    );

    noStore(res);
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
