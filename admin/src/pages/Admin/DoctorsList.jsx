import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, getAllDoctors, aToken, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6 sm:p-10">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-14">
        <div className="text-center space-y-3 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent drop-shadow-sm">
            Medical Team
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage and monitor your healthcare professionals
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-slideInLeft"></div>

            <div className="px-4 py-1.5 bg-indigo-100 rounded-full shadow-sm backdrop-blur">
              <span className="text-sm font-semibold text-indigo-700 tracking-wide">
                {doctors.length} Doctors
              </span>
            </div>

            <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-slideInRight"></div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

          {doctors.map((item, idx) => (
            <div
              key={idx}
              className="
                group relative bg-white rounded-2xl overflow-hidden border border-gray-100
                shadow-md hover:shadow-2xl transition-all duration-500
                hover:-translate-y-2 hover:scale-[1.02]
                animate-fadeUp opacity-0 translate-y-8
              "
              style={{ animationDelay: `${idx * 80}ms` }}
            >

              {/* STATUS BADGE */}
              <div className="absolute top-4 right-4 z-10">
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-lg transition-all duration-300 shadow-md
                    ${item.available
                      ? "bg-green-500/90 text-white shadow-green-500/30"
                      : "bg-red-500/90 text-white shadow-red-500/30"
                    }
                  `}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.available ? "bg-white animate-pulse" : "bg-white"
                      }`}
                    ></span>
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* IMAGE SECTION */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    w-full h-full object-cover
                    transition-all duration-[1200ms]
                    group-hover:scale-110 group-hover:rotate-[1.5deg]
                  "
                />

                {/* Overlay */}
                <div className="
                  absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500
                "></div>
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-3">
                
                {/* NAME + SPECIALITY */}
                <div className="space-y-1">
                  <h3 className="
                    text-xl font-bold text-gray-800
                    group-hover:text-indigo-600 transition-colors duration-300
                  ">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    <p className="text-sm font-medium text-gray-600">{item.speciality}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                {/* TOGGLE */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group/toggle">
                    <div className="relative">

                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={() => changeAvailability(item._id)}
                        className="sr-only peer"
                      />

                      <div className="
                        w-11 h-6 bg-gray-300 rounded-full shadow-inner
                        peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-purple-600
                        transition-all duration-300
                      "></div>

                      <div className="
                        absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md
                        peer-checked:translate-x-5 transition-all duration-300
                      "></div>
                    </div>

                    <span className="
                      text-sm font-medium text-gray-700
                      group-hover/toggle:text-indigo-600 transition-colors duration-200
                    ">
                      Availability
                    </span>
                  </label>
                </div>

              </div>

              {/* OUTER HOVER BORDER */}
              <div className="
                absolute inset-0 rounded-2xl
                border-2 border-transparent
                group-hover:border-indigo-500/50
                transition-all duration-500 pointer-events-none
              "></div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {doctors.length === 0 && (
          <div className="text-center py-24 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4 shadow-inner">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No doctors found
            </h3>

            <p className="text-gray-500">
              Start by adding doctors to your team.
            </p>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }

        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }
      `}
      </style>
    </div>
  );
};

export default DoctorsList;
