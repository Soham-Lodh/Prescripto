import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  const [sortOrder, setSortOrder] = useState("latest"); // same as Messages

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  /* SORT LOGIC */
  const sortedAppointments = [...appointments].sort((a, b) => {
  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 0;

    // Assuming format: DD-MM-YYYY or DD_MM_YYYY
    const parts = dateStr.split(/[-_/]/);
    const [day, month, year] = parts;

    const [hour, minute] = timeStr.split(":");

    return new Date(year, month - 1, day, hour, minute);
  };

  const dateA = parseDateTime(a.slotDate, a.slotTime);
  const dateB = parseDateTime(b.slotDate, b.slotTime);

  return sortOrder === "latest"
    ? dateB - dateA
    : dateA - dateB;
});

  const sortLabel =
    sortOrder === "latest" ? "Latest First" : "Oldest First";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and track all patient appointments
          </p>

          {/* ✅ SAME SORT BUTTON UI */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() =>
                setSortOrder(sortOrder === "latest" ? "oldest" : "latest")
              }
              className="px-5 py-2 bg-white border border-indigo-300 text-indigo-700 rounded-xl shadow hover:bg-indigo-50 font-medium transition"
            >
              Sort: {sortLabel}
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">

          {/* TABLE HEADER */}
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
            <div><p>#</p></div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11"></div>
              <p>Patient</p>
            </div>
            <div className="pl-12"><p>Date & Time</p></div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11"></div>
              <p>Doctor</p>
            </div>
            <div className="pl-32"><p>Actions</p></div>
          </div>

          {/* BODY */}
          <div className="max-h-[70vh] overflow-y-auto">
            {appointments.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No appointments found
              </div>
            ) : (
              sortedAppointments.map((item, index) => (
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
                  <div className="flex items-center gap-3">
                    <img
                      src={item.userData.image}
                      className="w-11 h-11 rounded-full object-cover border"
                      alt=""
                    />
                    <div>
                      <p className="font-semibold">{item.userData.name}</p>
                      <p className="text-xs text-gray-500">
                        Age: {calculateAge(item.userData.dob)}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex flex-col pl-6">
                    <span className="text-sm font-medium">
                      {slotDateFormat(item.slotDate)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {formatTime(item.slotTime)}
                    </span>
                  </div>

                  {/* Doctor */}
                  <div className="flex items-center gap-3">
                    <img
                      src={item.docData.image}
                      className="w-11 h-11 rounded-full object-cover border"
                      alt=""
                    />
                    <div>
                      <p className="font-semibold">{item.docData.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.docData.speciality}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pl-8">
                    {item.cancelled ? (
                      <span className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold">
                        Cancelled
                      </span>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:border-red-500 hover:bg-red-50 transition"
                      >
                        ✕
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