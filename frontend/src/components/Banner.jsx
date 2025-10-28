import React from "react";
import { assets } from "./../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  
  return (
    <div className="my-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Content Section */}
        <div className="flex-1 py-12 sm:py-16 md:py-20 lg:py-28 px-8 sm:px-12 md:px-16 lg:px-20 relative">
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white text-sm font-semibold">Available 24/7</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Book Appointment
              </h2>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-100 leading-tight">
                With 100+ Trusted Doctors
              </p>
            </div>

            {/* Description */}
            <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
              Get instant access to our network of verified healthcare professionals. 
              Book your consultation in just a few clicks.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => {
                navigate("/doctors");
                scrollTo(0, 0);
              }}
              className="group inline-flex items-center gap-3 bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-blue-50"
            >
              Book Appointment Now
              <span className="bg-blue-600 p-2 rounded-full group-hover:translate-x-1 transition-transform duration-300">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mt-10">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm">Verified Doctors</p>
                  <p className="text-blue-200 text-xs">100% Certified</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm">Quick Booking</p>
                  <p className="text-blue-200 text-xs">In 2 Minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm">24/7 Support</p>
                  <p className="text-blue-200 text-xs">Always Here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:flex md:w-1/2 lg:w-[450px] relative items-end justify-center md:justify-end">
          {/* Decorative Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 lg:w-96 lg:h-96 bg-white/5 rounded-full"></div>
          
          {/* Main Image */}
          <img
            src={assets.appointment_img}
            alt="Healthcare professional"
            className="w-full max-w-md relative z-10 object-contain drop-shadow-2xl"
          />


        </div>
      </div>
    </div>
  );
};

export default Banner;