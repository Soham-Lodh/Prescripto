import appointmentModel from "../models/appointmentModel.js";

/**
 * Parse slotDate (DD-MM-YYYY) and slotTime (HH:MM) into a Date object
 * @param {string} slotDate - Date in DD-MM-YYYY format
 * @param {string} slotTime - Time in HH:MM format (24-hour)
 * @returns {Date} - Parsed date object
 */
const parseAppointmentDateTime = (slotDate, slotTime) => {
  const [day, month, year] = slotDate.split("-").map(Number);
  const [hours, minutes] = slotTime.split(":").map(Number);
  
  return new Date(year, month - 1, day, hours, minutes, 0);
};

/**
 * Check and automatically complete appointments if their time has passed
 * Updates appointments in the database if they should be completed
 * @param {Array} appointments - Array of appointment objects
 * @returns {Promise<Array>} - Updated appointments array
 */
export const checkAndCompleteAppointments = async (appointments) => {
  try {
    const now = new Date();
    const appointmentsToUpdate = [];

    for (const appointment of appointments) {
      // Skip if already completed or cancelled
      if (appointment.isCompleted || appointment.cancelled) {
        continue;
      }

      // Parse appointment datetime
      const appointmentDateTime = parseAppointmentDateTime(
        appointment.slotDate,
        appointment.slotTime
      );

      // Check if appointment time has passed
      if (appointmentDateTime < now) {
        appointmentsToUpdate.push(appointment._id);
        appointment.isCompleted = true;
      }
    }

    // Batch update appointments that should be completed
    if (appointmentsToUpdate.length > 0) {
      await appointmentModel.updateMany(
        { _id: { $in: appointmentsToUpdate } },
        { isCompleted: true }
      );
    }

    return appointments;
  } catch (error) {
    console.error("Error checking and completing appointments:", error);
    return appointments; // Return original array on error
  }
};

/**
 * Toggle appointment completion status
 * @param {string} appointmentId - ID of the appointment
 * @returns {Promise<Object>} - Updated appointment with new completion status
 */
export const toggleAppointmentCompletion = async (appointmentId) => {
  try {
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.cancelled) {
      throw new Error("Cannot toggle completion status of a cancelled appointment");
    }

    const newStatus = !appointment.isCompleted;
    const updated = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { isCompleted: newStatus },
      { new: true }
    );

    return updated;
  } catch (error) {
    console.error("Error toggling appointment completion:", error);
    throw error;
  }
};
