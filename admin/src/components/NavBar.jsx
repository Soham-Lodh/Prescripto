import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate = useNavigate();
  const { aToken, setAToken } = useContext(AdminContext);
  const [isHovered, setIsHovered] = useState(false);

  const logout = () => {
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="flex justify-between items-center px-6 sm:px-12 py-4 max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="group relative transition-transform hover:scale-105 active:scale-95"
          >
            <img
              src={assets.admin_logo}
              alt="Admin Logo"
              className="w-36 sm:w-40 cursor-pointer transition-opacity group-hover:opacity-90"
            />
          </button>
          
          {/* Role Badge */}
          <div className="relative">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/50 shadow-sm">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
              {aToken ? "Admin" : "Doctor"}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm sm:text-base px-8 py-2.5 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                isHovered ? "translate-x-1" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </span>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;