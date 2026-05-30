import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [doctorData, setDoctorData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState({});
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getDoctorProfile = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/profile`,
        {},
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        setDoctorData(data.doctor);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching profile");
    }
  };

  const updateDoctorProfile = async (formData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        formData,
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setDoctorData(data.doctor);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
      return false;
    }
  };

  const changeAvailability = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/change-availability`,
        {},
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setDoctorData((prev) => ({
          ...prev,
          available: !prev.available,
        }));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error changing availability");
    }
  };

  const getDoctorAppointments = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/appointments`,
        {},
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching appointments");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling appointment");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating appointment");
    }
  };

  const getDashboardData = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/dashboard`,
        {},
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching dashboard data");
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    doctorData,
    setDoctorData,
    getDoctorProfile,
    updateDoctorProfile,
    changeAvailability,
    appointments,
    setAppointments,
    getDoctorAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    setDashData,
    getDashboardData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
