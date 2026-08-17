import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { cachedRequest, invalidateCache } from "../utils/requestCache";

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);

  const clearAdminSession = (message = "Session expired. Please log in again.") => {
    localStorage.removeItem("aToken");
    setAToken("");
    invalidateCache("admin:");
    toast.error(message);
  };

  const getAllDoctors = async ({ force = false } = {}) => {
    try {
      const data = await cachedRequest(
        "admin:doctors",
        async () => {
          const response = await axios.post(
            `${backendUrl}/api/admin/all-doctors`,
            {},
            { headers: { aToken } }
          );
          return response.data;
        },
        { ttlMs: 30000, force }
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearAdminSession(data.message);
          return;
        }
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        invalidateCache("admin:doctors");
        setDoctors((prev) =>
          prev.map((doc) =>
            doc._id === docId ? { ...doc, available: !doc.available } : doc
          )
        );
        return true;
      } else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearAdminSession(data.message);
          return false;
        }
        toast.error(data.message);
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      return false;
    }
  };

  const updateDoctor = async (formData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/update-doctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            atoken: aToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        invalidateCache("admin:doctors");
        invalidateCache("admin:appointments");
        await Promise.all([getAllDoctors({ force: true }), getAllAppointments({ force: true })]);
        return true;
      }

      if (String(data.message || "").toLowerCase().includes("authorized")) {
        clearAdminSession(data.message);
        return false;
      }
      toast.error(data.message);
      return false;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  const deleteDoctor = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/delete-doctor`,
        { docId },
        {
          headers: { atoken: aToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        invalidateCache("admin:doctors");
        invalidateCache("admin:appointments");
        await Promise.all([getAllDoctors({ force: true }), getAllAppointments({ force: true })]);
        return true;
      }

      if (String(data.message || "").toLowerCase().includes("authorized")) {
        clearAdminSession(data.message);
        return false;
      }
      toast.error(data.message);
      return false;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  const getAllAppointments = async ({ force = false } = {}) => {
    try {
      const data = await cachedRequest(
        "admin:appointments",
        async () => {
          const response = await axios.get(`${backendUrl}/api/admin/appointments`, {
            headers: { aToken },
          });
          return response.data;
        },
        { ttlMs: 30000, force }
      );
      if (data.success) {
        setAppointments(data.appointments);
      }
      else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearAdminSession(data.message);
          return;
        }
        toast.error(data.message);
      }
    }
    catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }
  const cancelAppointment=async(appointmentId)=>{
    try{
      const { data } =await  axios.post(`${backendUrl}/api/admin/admin-cancel-appointment`, {appointmentId},{ headers: { aToken } });
      if(data.success){
        toast.success(data.message);
        invalidateCache("admin:appointments");
        getAllAppointments({ force: true });
      }
      else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearAdminSession(data.message);
          return;
        }
        toast.error(data.message);
      }
    }
    catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }
  const allMessages = async ({ force = false } = {}) => {
    try {
      const data = await cachedRequest(
        "admin:messages",
        async () => {
          const response = await axios.get(
            `${backendUrl}/api/admin/messages`,
            { headers: { aToken } }
          );
          return response.data;
        },
        { ttlMs: 30000, force }
      );

      if (data.success) {
        setMessages(data.messages); // <-- FIX
        return data.messages;
      } else {
        if (String(data.message || "").toLowerCase().includes("authorized")) {
          clearAdminSession(data.message);
          return;
        }
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };
  return (
    <AdminContext.Provider
      value={{
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        updateDoctor,
        deleteDoctor,
        appointments, 
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        allMessages,
        messages,
        setMessages
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
