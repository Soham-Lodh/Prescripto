import React from "react";
import { assets } from "./../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  
  return (
    <div className="my-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT CONTENT - COMPACTED */}
        <div className="flex-1 py-10 px-8 sm:px-12 md:px-14 lg:px-16 relative">

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-28 h-28 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white text-sm font-semibold">Available 24/7</span>
            </div>

            {/* Main Heading - REDUCED */}
            <div className="space-y-3 mb-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Book Appointment
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-100 leading-tight">
                With 100+ Trusted Doctors
              </p>
            </div>

            {/* Description - Compact */}
            <p className="text-blue-100 text-sm sm:text-base mb-6 max-w-md leading-relaxed">
              Access verified healthcare professionals instantly. Book your consultation in just a few clicks.
            </p>

            {/* CTA */}
            <button
              onClick={() => {
                navigate("/doctors");
                scrollTo(0, 0);
              }}
              className="group inline-flex items-center gap-3 bg-white text-blue-700 px-8 py-3 rounded-full font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-blue-50"
            >
              Book Appointment Now
              <span className="bg-blue-600 p-2 rounded-full group-hover:translate-x-1 transition-transform duration-300">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            {/* Features – compact */}
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { title: "Verified Doctors", desc: "100% Certified" },
                { title: "Quick Booking", desc: "In 2 mins" },
                { title: "24/7 Support", desc: "Always here" }
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-white">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{f.title}</p>
                    <p className="text-blue-200 text-xs">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE SECTION - NOT STRETCHED */}
        <div className="hidden md:flex md:w-1/2 lg:w-[420px] relative items-end justify-end">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 bg-white/5 rounded-full"></div>
          <img
            src={assets.appointment_img}
            alt="Healthcare professional"
            className="w-full max-w-sm relative z-10 object-contain drop-shadow-2xl"
          />
        </div>

      </div>
    </div>
  );
};

export default Banner;
