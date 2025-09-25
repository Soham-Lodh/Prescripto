import { createContext, useState } from "react";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  // Example state for doctors (you can add more)
  const [dToken, setDToken] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    dToken,
    setDToken,
    backendUrl,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
