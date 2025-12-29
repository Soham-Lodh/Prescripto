import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { AppContext } from "../context/AppContext";
import FlipCard from "../components/FlipCard";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const formatExperience = (exp) => {
    const num = Number(exp);
    if (isNaN(num)) return `Experience: ${exp}`;
    return `Experience: ${num} ${num === 1 ? "year" : "years"}`;
  };

  const getDoctorCount = () => {
    if (window.innerWidth >= 1280) return 8;
    if (window.innerWidth >= 1024) return 6;
    return 4;
  };

  const [doctorCount, setDoctorCount] = useState(getDoctorCount());

  /* ---------- Resize handling ---------- */
  useEffect(() => {
    const handleResize = () => setDoctorCount(getDoctorCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- AOS refresh after data changes ---------- */
  useEffect(() => {
    AOS.refreshHard();
  }, [doctors, doctorCount]);

  return (
    <div className="flex flex-col items-center gap-6 my-20 text-gray-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* HEADER */}
      <div className="text-center max-w-3xl" data-aos="fade-down">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Top{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
            Doctors
          </span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Meet our highly qualified and experienced medical professionals
        </p>
      </div>

      {/* GRID */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
        {doctors.slice(0, doctorCount).map((item, index) => (
          <div
            key={item._id}
            className="h-[420px]"              /* 🔥 CRITICAL FIX */
            data-aos="fade-up"
            data-aos-delay={Math.min(index * 50, 200)}
          >
            <FlipCard
              className="h-full"             /* 🔥 REQUIRED */
              onClick={() => navigate(`/appointments/${item._id}`)}
              frontContent={
                <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl cursor-pointer">
                  {/* IMAGE */}
                  <div className="relative h-60 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded text-white ${
                          item.available ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-blue-600 text-sm font-semibold mb-3">
                      {item.speciality}
                    </p>

                    <div className="mt-auto pt-4 border-t flex justify-between text-sm text-gray-500">
                      <span>{formatExperience(item.experience)}</span>
                      <span className="font-bold text-gray-700">
                        ${item.fees}
                      </span>
                    </div>
                  </div>
                </div>
              }
              backContent={
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 flex flex-col justify-between h-full text-center text-white shadow-xl">
                  <div>
                    <h3 className="font-bold text-xl mb-1">{item.name}</h3>
                    <p className="text-blue-100 text-sm mb-4">{item.degree}</p>

                    <div className="text-sm space-y-2 opacity-90">
                      <p>Speciality: {item.speciality}</p>
                      <p>Fees: ${item.fees}</p>
                      <p>{formatExperience(item.experience)}</p>
                    </div>
                  </div>

                  <button className="bg-white text-blue-700 px-6 py-2 rounded-lg font-bold text-sm">
                    Book Now
                  </button>
                </div>
              }
            />
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        data-aos="fade-up"
        data-aos-delay="150"
        onClick={() => {
          navigate("/doctors");
          window.scrollTo(0, 0);
        }}
        className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-full font-bold hover:scale-105 transition-transform"
      >
        View All Doctors
      </button>
    </div>
  );
};

export default TopDoctors;
