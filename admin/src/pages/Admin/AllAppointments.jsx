import React,{useContext,useEffect} from 'react';
import {AdminContext} from "../../context/AdminContext";
const AllAppointments = () => {
  const {aToken,appointments,getAllAppointments}=useContext(AdminContext);
  useEffect(()=>{
    if(aToken){
      getAllAppointments();
    }
  },[aToken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className="text-center text-3xl font-bold text-gray-600 mb-12">
        ALL <span className="text-[rgb(95,111,255)]"> APPOINTMENTS</span>
      </p>
      <div className="">
        <div className="">
          <p className=""></p>
          <p className="">Patient</p>
          <p className="">Age</p>
          <p className=""> Date & Time</p>
          <p className="">Doctor</p>
          <p className="">Fees</p>
          <p className="">Actions</p>
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;