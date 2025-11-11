import React from "react";
import { assets } from "./../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="flex flex-col md:flex-row flex-wrap bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl shadow-2xl overflow-hidden max-w-7xl mx-auto relative">
        {/* Left Content Section */}
        <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 px-8 md:px-12 lg:px-16 md:py-[10vw] z-10">
          {/* Headings */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-extrabold leading-tight">
              Book Appointment
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-blue-100 font-bold leading-tight">
              With Trusted Doctors
            </h2>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <img
              className="w-32 sm:w-36"
              src={assets.group_profiles}
              alt="Group of doctors"
            />
            <div className="text-white">
              <p className="text-lg font-semibold mb-1">
                Join 10,000+ Happy Patients
              </p>
              <p className="text-blue-100 text-sm font-light leading-relaxed">
                Simply browse through our extensive list of trusted doctors and
                schedule your appointment hassle-free.
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/doctors")}
            className="group flex items-center gap-3 bg-white px-10 py-4 rounded-full text-blue-700 text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-blue-50"
          >
            Book Appointment
            <span className="bg-blue-600 p-2 rounded-full group-hover:translate-x-1 transition-transform duration-300">
              <img
                src={assets.arrow_icon}
                alt="Arrow"
                className="w-4 h-4 brightness-0 invert"
              />
            </span>
          </button>

          {/* Features */}
          <div className="flex flex-wrap gap-4 mt-2">
            {["Verified Doctors", "Instant Booking", "24/7 Support"].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-white text-sm">
                <svg
                  className="w-5 h-5 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image Section */}
        <div className="md:w-1/2 relative flex items-end justify-center md:justify-end">
          {/* Background accents */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>

          {/* Main Image */}
          <img
            src={assets.header_img}
            alt="Healthcare professional"
            className="w-full md:w-auto md:h-[640px] lg:h-[720px] object-contain absolute bottom-0 right-0 drop-shadow-2xl z-10"
          />

          {/* Floating Info Card */}
          <div className="hidden lg:block absolute top-20 left-10 bg-white rounded-2xl shadow-2xl p-4 animate-bounce-slow z-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-sm">Easy Booking</p>
                <p className="text-gray-500 text-xs">In just 2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
