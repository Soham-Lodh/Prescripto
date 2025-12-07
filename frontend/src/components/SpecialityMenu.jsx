import React from "react";
import { Link } from "react-router-dom";
import { specialityData } from "./../assets/assets_frontend/assets";

const SpecialityMenu = () => {
  const specialityIcons = {
    "General Physician": "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    "Gynecologist": "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    "Dermatologist": "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    "Pediatrician": "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    "Neurologist": "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    "Gastroenterologist": "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    "Orthopedic": "M13 10V3L4 14h7v7l9-11h-7z",
    "Psychiatrist": "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    "Cardiologist": "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    "ENT Specialist": "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
  };

  const getIcon = (speciality) =>
    specialityIcons[speciality] ||
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z";

  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-6 py-20 px-4 text-gray-800 bg-white"
      data-aos="fade-up"
    >
      <div className="text-center max-w-3xl" data-aos="fade-down">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Find By{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
            Speciality
          </span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          Browse through our extensive list of trusted doctors across various specialities.
          Schedule your appointment hassle-free and get the care you deserve.
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pt-8 w-full max-w-7xl"
      >
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            to={`/doctors/${item.speciality}`}
            key={index}
            className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-500"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative p-6 flex flex-col items-center gap-4 transform group-hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-blue-100 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <svg
                  className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(item.speciality)} />
                </svg>
              </div>

              <div className="text-center">
                <h3 className="text-gray-900 group-hover:text-white font-bold text-base sm:text-lg transition-colors duration-300">
                  {item.speciality}
                </h3>
                <p className="text-gray-500 group-hover:text-blue-100 text-xs mt-1 transition-colors duration-300">
                  View Specialists
                </p>
              </div>

              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center" data-aos="fade-up" data-aos-delay="200">
        <p className="text-gray-600 text-sm mb-4">Can't find what you're looking for?</p>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Browse All Doctors
        </Link>
      </div>
    </div>
  );
};

export default SpecialityMenu;
