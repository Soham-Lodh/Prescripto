import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const calculateAge=(dob)=>{
    const today=new Date();
    const bDay=new Date(dob);
    let age=today.getFullYear()-bDay.getFullYear();
    return age
  }
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const [day, month, year] = slotDate.split("-");
    return `${day} ${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };
  const value = {
    user,
    setUser,
    calculateAge,
    slotDateFormat
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
