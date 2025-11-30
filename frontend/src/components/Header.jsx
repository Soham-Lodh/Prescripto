import React from "react";
import { assets } from "./../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl shadow-2xl overflow-hidden max-w-7xl mx-auto relative">
        
        {/* LEFT SECTION */}
        <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-10 px-8 md:px-12 lg:px-16 z-10">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-extrabold leading-tight">
              Book Appointment
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-blue-100 font-bold leading-tight">
              With Trusted Doctors
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <img className="w-28 sm:w-32" src={assets.group_profiles} alt="Group" />
            <div className="text-white">
              <p className="text-base font-semibold mb-1">Join 10,000+ Patients</p>
              <p className="text-blue-100 text-sm leading-relaxed">
                Browse trusted doctors & schedule easily.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/doctors")}
            className="group flex items-center gap-3 bg-white px-8 py-3 rounded-full text-blue-700 text-base font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Book Appointment
            <span className="bg-blue-600 p-2 rounded-full group-hover:translate-x-1 transition-transform">
              <img src={assets.arrow_icon} className="w-4 h-4 brightness-0 invert" />
            </span>
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="md:w-1/2 relative flex justify-end items-end">
          {/* Orbs */}
          <div className="absolute top-8 right-8 w-24 h-24 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-16 left-8 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"></div>

          {/* IMAGE – controlled height */}
          <img
            src={assets.header_img}
            alt="Doctor"
            className="w-full md:w-auto max-h-[500px] object-contain absolute bottom-0 right-0 drop-shadow-2xl z-10"
          />

          {/* Floating Card */}
          <div className="hidden lg:block absolute top-14 left-10 bg-white rounded-2xl shadow-xl p-3 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-sm">Easy Booking</p>
                <p className="text-gray-500 text-xs">In 2 minutes</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
