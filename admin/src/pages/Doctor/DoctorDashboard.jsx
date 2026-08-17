import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashboardData,
    doctorData,
    getDoctorProfile,
  } = useContext(DoctorContext);
  const { slotDateFormat } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) {
      getDoctorProfile();
      getDashboardData();
    }
  }, [dToken]);

  const formatTime = (time) => {
    if (!time) return "—";
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 || 12;
    return `${display}:${m} ${suffix}`;
  };

  const stats = [
    {
      label: "Total Appointments",
      value: dashData.appointments || 0,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Patients",
      value: dashData.patients || 0,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Completed",
      value: dashData.completed || 0,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Cancelled",
      value: dashData.cancelled || 0,
      color: "from-red-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome, Dr. {doctorData.name}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Here's your practice overview
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="
                group relative bg-white rounded-2xl overflow-hidden
                shadow-md hover:shadow-xl transition-all duration-300
                hover:-translate-y-1 border border-gray-100
                animate-fadeUp opacity-0 translate-y-4
              "
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              <div className="relative p-6 space-y-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
            </div>
          ))}
        </div>

        {/* LATEST APPOINTMENTS */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Appointments
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
                  dashData.latestAppointments.map((apt, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-indigo-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={apt.userData?.image}
                            alt="Patient"
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {apt.userData?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {apt.userData?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div>
                          <p className="font-medium text-gray-900">
                            {slotDateFormat(apt.slotDate)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatTime(apt.slotTime)}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {apt.cancelled ? (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            Cancelled
                          </span>
                        ) : apt.isCompleted ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Completed
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            Scheduled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-8 py-12 text-center text-gray-500">
                      No appointments yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
      `}
      </style>
    </div>
  );
};

export default DoctorDashboard;
