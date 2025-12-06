import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import FlipCard from "../components/FlipCard";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const getDoctorCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 8;
      if (window.innerWidth >= 1024) return 6;
      return 4;
    }
    return 8;
  };

  const [doctorCount, setDoctorCount] = React.useState(getDoctorCount());

  React.useEffect(() => {
    const handleResize = () => {
      setDoctorCount(getDoctorCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 my-20 text-gray-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Top{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
            Doctors
          </span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          Meet our highly qualified and experienced medical professionals who
          are committed to providing you with the best healthcare
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
        {doctors.slice(0, doctorCount).map((item, index) => (
          <FlipCard
            onClick={() => navigate(`/appointments/${item._id}`)}
            className="hover:translate-y-[-8px] transition-transform duration-300"
            key={index}
            frontContent={
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-all cursor-pointer">
                <div className="relative h-60 overflow-hidden bg-gray-100">
                  <img
                    className="w-full h-full object-cover object-top"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />

                  {/* Availability Tag */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {item.available ? (
                      <span className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                        Available
                      </span>
                    ) : (
                      <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-gray-900 text-lg font-bold line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-blue-600 text-sm font-semibold mb-3">
                    {item.speciality}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                    <span>{item.experience} Exp</span>
                    <span className="font-bold text-gray-700">
                      ${item.fees}
                    </span>
                  </div>
                </div>
              </div>
            }
            backContent={
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 flex flex-col justify-center h-full text-center shadow-xl cursor-pointer text-white">
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-xl mb-1">{item.name}</h3>
                  <p className="text-blue-100 text-sm mb-4">{item.degree}</p>

                  <div className="space-y-2 text-sm opacity-90 mb-4">
                    <p>Spec: {item.speciality}</p>
                    <p>Fees: ${item.fees}</p>
                    <p>{item.experience} Experience</p>
                  </div>

                  {item.about && (
                    <p className="text-xs text-blue-200 line-clamp-3 italic mb-4">
                      "{item.about}"
                    </p>
                  )}
                </div>

                <button className="bg-white text-blue-700 px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-gray-50 w-full">
                  Book Now
                </button>
              </div>
            }
          />
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="group mt-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-full font-bold text-base hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
      >
        View All Doctors
        <svg
          className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </button>

      <div className="grid grid-cols-3 gap-6 w-full max-w-4xl mt-12 pt-12 border-t border-gray-200">
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {doctors.length}+
          </p>
          <p className="text-gray-600 text-sm font-medium">Expert Doctors</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-600 mb-2">10K+</p>
          <p className="text-gray-600 text-sm font-medium">Happy Patients</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-600 mb-2">98%</p>
          <p className="text-gray-600 text-sm font-medium">Satisfaction Rate</p>
        </div>
      </div>
    </div>
  );
};

export default TopDoctors;
