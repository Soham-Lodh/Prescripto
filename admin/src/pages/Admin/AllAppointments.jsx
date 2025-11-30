import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-gray-600 mt-2">Manage and track all patient appointments</p>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">

          {/* TABLE HEADER — Date & Time + Actions pushed right */}
          <div
            className="
              hidden sm:grid
              grid-cols-[60px_1.7fr_2.8fr_2.6fr_200px]
              py-5 px-8
              bg-gradient-to-r from-indigo-50 to-purple-50
              border-b border-indigo-100
              text-gray-600 font-semibold text-xs uppercase tracking-wider
            "
          >
            <div className="flex items-center"><p>#</p></div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11"></div>
              <p>Patient</p>
            </div>

            <div className="flex items-center pl-12">
              <p>Date & Time</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11"></div>
              <p>Doctor</p>
            </div>

            <div className="flex items-center pl-32">
              <p>Actions</p>
            </div>
          </div>

          {/* BODY */}
          <div className="max-h-[70vh] overflow-y-auto">
            {appointments.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No appointments found
              </div>
            ) : (
              appointments.map((item, index) => (
                <div
                  key={index}
                  className="
                    sm:grid sm:grid-cols-[60px_1.7fr_2.8fr_2.6fr_200px]
                    flex flex-wrap sm:flex-nowrap gap-x-6
                    items-center py-6 px-8 border-b border-gray-100
                    hover:bg-indigo-50/40 transition-all
                  "
                >

                  {/* Index */}
                  <p className="text-gray-400 font-semibold text-sm sm:block hidden">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  {/* Patient */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.userData.image}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-sm"
                      alt=""
                    />
                    <div className="flex flex-col min-w-0">
                      <p className="font-semibold text-gray-900">{item.userData.name}</p>
                      <p className="text-xs text-gray-500">
                        Age: {calculateAge(item.userData.dob)}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex flex-col leading-tight gap-1 pl-6">
                    <span className="text-sm font-medium text-gray-900">
                      {slotDateFormat(item.slotDate)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {formatTime(item.slotTime)}
                    </span>
                  </div>

                  {/* Doctor */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.docData.image}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-sm"
                      alt=""
                    />
                    <div className="flex flex-col min-w-0">
                      <p className="font-semibold text-gray-900">{item.docData.name}</p>
                      <p className="text-xs text-gray-500 truncate">{item.docData.speciality}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pl-8">
                    {item.cancelled ? (
                      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-red-100 text-red-600 text-sm font-semibold">
                        Cancelled
                      </span>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300
                        hover:border-red-500 hover:bg-red-50 transition-all"
                      >
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* TIME FORMATTER */
function formatTime(time) {
  if (!time) return "—";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display}:${m} ${suffix}`;
}

export default AllAppointments;
