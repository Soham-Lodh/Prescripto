import { createContext,useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const currency = "$";
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || false);
  const getDoctorsData=async()=>{
    try{
      console.log("Fetching doctors from:", `${backendURL}/api/doctor/list`);

      const { data } = await axios.get(`${backendURL}/api/doctor/list`);
      if(data.success){
        setDoctors(data.doctors);
      }
      else{
        toast.error(data.message);
      }
    }
    catch(error){
      console.error("Error fetching doctors data:", error);
      toast.error("Error fetching doctors data");
    }
  }
  useEffect(()=>{
    getDoctorsData();
  },[])
  const value = {
    doctors,
    currency,
    token,setToken,
    backendURL
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
