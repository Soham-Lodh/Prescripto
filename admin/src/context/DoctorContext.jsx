import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { cachedRequest, invalidateCache } from "../utils/requestCache";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [doctorData, setDoctorData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState({});
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const clearDoctorSession = (message = "Session expired. Please log in again.") => {
    localStorage.removeItem("dToken");
    setDToken("");
    invalidateCache("doctor:");
    toast.error(message);
  };

  const getDoctorProfile = async ({ force = false } = {}) => {
    try {
      const data = await cachedRequest(
        `doctor:profile:${dToken}`,
        async () => {
          const response = await axios.post(
            `${backendUrl}/api/doctor/profile`,
            {},
            { headers: { dtoken: dToken } }
          );
          return response.data;
        },
        { ttlMs: 30000, force }
      );

      if (data.success) {
        setDoctorData(data.doctor);
      } else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearDoctorSession(data.message);
          return;
        }
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
        invalidateCache(`doctor:profile:${dToken}`);
        return true;
      } else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearDoctorSession(data.message);
          return false;
        }
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
        invalidateCache(`doctor:profile:${dToken}`);
        return true;
      } else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearDoctorSession(data.message);
          return false;
        }
        toast.error(data.message);
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Error changing availability");
      return false;
    }
  };

  const getDoctorAppointments = async ({ force = false } = {}) => {
    try {
      const data = await cachedRequest(
        `doctor:appointments:${dToken}`,
        async () => {
          const response = await axios.post(
            `${backendUrl}/api/doctor/appointments`,
            {},
            { headers: { dtoken: dToken } }
          );
          return response.data;
        },
        { ttlMs: 15000, force }
      );

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearDoctorSession(data.message);
          return;
        }
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
        invalidateCache(`doctor:appointments:${dToken}`);
        getDoctorAppointments({ force: true });
        return true;
      } else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearDoctorSession(data.message);
          return false;
        }
        toast.error(data.message);
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling appointment");
      return false;
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
        invalidateCache(`doctor:appointments:${dToken}`);
        getDoctorAppointments({ force: true });
        return true;
      } else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearDoctorSession(data.message);
          return false;
        }
        toast.error(data.message);
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating appointment");
      return false;
    }
  };

  const getDashboardData = async ({ force = false } = {}) => {
    try {
      const data = await cachedRequest(
        `doctor:dashboard:${dToken}`,
        async () => {
          const response = await axios.post(
            `${backendUrl}/api/doctor/dashboard`,
            {},
            { headers: { dtoken: dToken } }
          );
          return response.data;
        },
        { ttlMs: 10000, force }
      );

      if (data.success) {
        setDashData(data.dashData);
      } else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearDoctorSession(data.message);
          return;
        }
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
