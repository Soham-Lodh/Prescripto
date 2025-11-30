import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const SideBar = () => {
  const { aToken } = useContext(AdminContext);

  const menuItems = [
    {
      to: "/all-appointments",
      icon: assets.appointment_icon,
      label: "Appointments",
      description: "View all bookings",
      iconType: "image"
    },
    {
      to: "/add-doctor",
      icon: assets.add_icon,
      label: "Add Doctor",
      description: "Register new doctor",
      iconType: "image"
    },
    {
      to: "/doctor-list",
      icon: assets.people_icon,
      label: "Doctors List",
      description: "Manage doctors",
      iconType: "image"
    },
    {
      to: "/messages",
      label: "Messages",
      description: "User inquiries",
      iconType: "svg"
    }
  ];

  return (
    <aside className="min-h-screen bg-gradient-to-b from-gray-50 to-white border-r border-gray-200/80 shadow-sm">
      {aToken && (
        <nav className="py-8 px-4">
          {/* Header */}
          <div className="mb-8 px-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Navigation
            </h2>
            <div className="h-0.5 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </div>

          {/* Menu Items */}
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-4 py-4 px-6 rounded-2xl min-w-[280px] transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                        : "text-gray-700 hover:bg-white hover:shadow-md hover:scale-[1.01]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full transition-all duration-300 ${
                          isActive
                            ? "bg-white shadow-lg shadow-white/50"
                            : "bg-transparent group-hover:bg-indigo-200"
                        }`}
                      ></div>

                      {/* Icon Container */}
                      <div
                        className={`relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-white/20 shadow-inner"
                            : "bg-gray-100 group-hover:bg-indigo-100 group-hover:scale-110"
                        }`}
                      >
                        {item.iconType === "image" ? (
                          <img
                            src={item.icon}
                            alt={`${item.label} icon`}
                            className={`w-5 h-5 transition-all duration-300 ${
                              isActive 
                                ? "filter brightness-0 invert" 
                                : "opacity-70 group-hover:opacity-100"
                            } group-hover:scale-110`}
                          />
                        ) : (
                          <svg
                            className={`w-5 h-5 transition-all duration-300 ${
                              isActive
                                ? "text-white"
                                : "text-gray-600 group-hover:text-indigo-600"
                            } group-hover:scale-110`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold text-base transition-colors ${
                            isActive ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-xs mt-0.5 transition-colors ${
                            isActive
                              ? "text-white/80"
                              : "text-gray-500 group-hover:text-indigo-600"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>

                      {/* Arrow Indicator */}
                      <svg
                        className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                          isActive
                            ? "text-white translate-x-1 opacity-100"
                            : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>

                      {/* Shine Effect on Hover */}
                      <div
                        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                          isActive ? "hidden" : ""
                        }`}
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                          transform: "translateX(-100%)",
                          animation: isActive
                            ? "none"
                            : "shine 2s infinite"
                        }}
                      ></div>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Bottom Decoration */}
          <div className="mt-12 px-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-xs font-semibold text-gray-700">System Status</p>
              </div>
              <p className="text-xs text-gray-600">All systems operational</p>
            </div>
          </div>
        </nav>
      )}

      <style>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </aside>
  );
};

export default SideBar;