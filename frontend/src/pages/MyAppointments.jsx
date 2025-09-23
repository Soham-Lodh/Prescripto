import React,{useContext} from "react";
import {AppContext} from "../context/AppContext";
const MyAppointments = () => {
  const {doctors}=useContext(AppContext);
  return <div>
    <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
    <div className="">
      {doctors.slice(0,2).map((item,index)=>(
        <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
          <div className="">
            <img src={item.image} alt="" className="w-32 bg-indigo-100 rounded-lg" />
          </div>
          <div className="flex-1 text-lg text-zinc-600">
            <p className="text-neutral font-semi-bold">{item.name}</p>
            <p className="">{item.speciality}</p>
            <p className="text-zinc-700 font-medium mt-1">Address:</p>
            <p className="text-sm">{item.address.line1}</p>
            <p className="text-sm">{item.address.line2}</p>
            <p className="text-sm mt-1"><span className='text-zinc-700 font-medium mt-1 text-lg'>Date & Time:</span>26 Oct 2025 | 10:30 am</p>
          </div>
          <div className=""></div>
          <div className="flex flex-col gap-2 justify-end">
            <button
  className="
    text-lg text-white bg-[rgb(95,111,255)] 
    sm:min-w-48 py-3 px-4 
    rounded-md shadow-md 
    hover:bg-[rgb(49,61,151)] 
    transition-all duration-300
  "
>
  Pay Online
</button>

<button
  className="
    text-lg text-white bg-red-500 
    sm:min-w-48 py-3 px-4 
    rounded-md shadow-md 
    hover:bg-red-700 
    transition-all duration-300
  "
>
  Cancel Appointment
</button>

          </div>
        </div>
      ))}
    </div>
  </div>;
};

export default MyAppointments;
