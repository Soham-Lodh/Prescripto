import React, { useContext, useEffect } from 'react';
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments,cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);
  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className="text-center text-3xl font-bold text-gray-600 mb-12">
        ALL <span className="text-[rgb(95,111,255)]"> APPOINTMENTS</span>
      </p>
      <div className="border rounded texxt-md max-h-[80vh] overflow-y-scroll min-h-[60vh]">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p className=""></p>
          <p className="">Patient</p>
          <p className="">Age</p>
          <p className=""> Date & Time</p>
          <p className="">Doctor</p>
          <p className="">Fees</p>
          <p className="">Actions</p>
        </div>
        {appointments.map((item, index) => {
          return (
            <div className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-200 transition-all duration-500" key={index}>
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img src={item.userData.image} alt="" className="w-8 rounded-full" />
                <p>{item.userData.name}</p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p className="">{slotDateFormat(item.slotDate)}, {item.slotTime
                ? (() => {
                  const [h, m] = item.slotTime.split(":");
                  const hour = parseInt(h, 10);
                  const suffix = hour >= 12 ? "pm" : "am";
                  const displayHour = hour % 12 || 12;
                  return `${displayHour}:${m} ${suffix}`;
                })()
                : "—"}</p>
              <div className="flex items-center gap-2">
                <img src={item.docData.image} alt="" className="w-8 rounded-full bg-gray-200" />
                <p>{item.docData.name}</p>
              </div>
              <p className="">$ {item.amount}</p>
              {
                item.cancelled?
                <p className="text-red-500 font-medium">Cancelled</p>
                :<button onClick={()=>{cancelAppointment(item._id)}} className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-black hover:border-red-500 cursor-pointer transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-black hover:text-red-500 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                  <line x1="6" y1="18" x2="18" y2="6" strokeLinecap="round" />
                </svg>
              </button>
              }
              


            </div>
          )

        })}
      </div>
    </div>
  );
};

export default AllAppointments;