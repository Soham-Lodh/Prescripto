import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        { headers: { aToken } }
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
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
        setDoctors((prev) =>
          prev.map((doc) =>
            doc._id === docId ? { ...doc, available: !doc.available } : doc
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } =await  axios.get(`${backendUrl}/api/admin/appointments`, { headers: { aToken } });
      if (data.success) {
        setAppointments(data.appointments);
      }
      else {
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
        getAllAppointments();
      }
      else {
        toast.error(data.message);
      }
    }
    catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }
  return (
    <AdminContext.Provider
      value={{
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments, 
        setAppointments,
        getAllAppointments,
        cancelAppointment
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
