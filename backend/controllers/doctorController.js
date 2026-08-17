import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import { checkAndCompleteAppointments, toggleAppointmentCompletion } from "../helpers/appointmentHelper.js";

export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability Changed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const doctorsList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
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
    const doctor = await doctorModel.findById(docId).select("-password");

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

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

    const updatedDoctor = await doctorModel.findByIdAndUpdate(docId, updateData, {
      new: true,
    }).select("-password");

    res.json({ success: true, message: "Profile updated successfully", doctor: updatedDoctor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const doctorChangeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({ success: true, message: "Availability changed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { docId } = req.body;
    let appointments = await appointmentModel.find({ docId });

    // Auto-complete appointments whose time has passed
    appointments = await checkAndCompleteAppointments(appointments);

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const doctorCancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
      payment: false,
    });

    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);
    let slots_booked = docData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (time) => time !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const doctorCompleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const updated = await toggleAppointmentCompletion(appointmentId);

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
    let appointments = await appointmentModel.find({ docId });

    // Auto-complete appointments whose time has passed
    appointments = await checkAndCompleteAppointments(appointments);

    const dashData = {
      appointments: appointments.length,
      patients: new Set(appointments.map((apt) => apt.userId)).size,
      cancelled: appointments.filter((apt) => apt.cancelled).length,
      completed: appointments.filter((apt) => apt.isCompleted).length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
