import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const currency = "$";
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || false);
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      }
      else {
        toast.error(data.message);
      }
    }
    catch (error) {
      console.error("Error fetching doctors data:", error);
      toast.error("Error fetching doctors data");
    }
  }
  const loadUserProfile = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.success) {
        setUserData(data.user);
      }
      else {
        toast.error(data.message);
      }
    }
    catch (error) {
      console.error("Error loading user profile:", error);
      toast.error("Error loading user profile");
    }
  }
  useEffect(() => {
    getDoctorsData();
  }, []);
  useEffect(() => {
    if (token) {
      loadUserProfile();
    }
    else {
      setUserData(false);
    }
  }, [token]);
  const value = {
    doctors, getDoctorsData,
    currency,
    token, setToken,
    backendURL,
    userData, setUserData,
    loadUserProfile
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
