import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import FlipCard from "../components/FlipCard";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const getDoctorCount = () => {
    if (typeof window !== 'undefined') {
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 my-20 text-gray-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Doctors</span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          Meet our highly qualified and experienced medical professionals who are committed to providing you with the best healthcare
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
        {doctors.slice(0, doctorCount).map((item, index) => (
          <FlipCard
            onClick={() => navigate(`/appointments/${item._id}`)}
            className="hover:translate-y-[-8px] transition-transform duration-300"
            key={index}
            frontContent={
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="relative">
                  <img
                    className="w-full h-56 object-cover"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    {item.available ? (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Available
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        Unavailable
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Top
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-gray-900 text-lg font-bold mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-blue-600 text-sm font-semibold mb-2">
                    {item.speciality}
                  </p>
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center font-medium">
                      Click to view details
                    </p>
                  </div>
                </div>
              </div>
            }
            backContent={
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 flex flex-col justify-center h-full text-center shadow-xl cursor-pointer">
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-white font-bold text-xl mb-1">{item.name}</h3>
                  <p className="text-blue-200 text-sm mb-4">{item.speciality}</p>

                  <div className="space-y-3 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200 text-sm">Degree:</span>
                      <span className="font-semibold text-sm">{item.degree}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200 text-sm">Experience:</span>
                      <span className="font-semibold text-sm">
                        {item.experience} {item.experience === "1" ? "year" : "years"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200 text-sm">Consultation:</span>
                      <span className="font-bold text-lg text-yellow-300">${item.fees}</span>
                    </div>
                  </div>
                </div>

                <button className="mt-4 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg w-full">
                  Book Appointment
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <div className="grid grid-cols-3 gap-6 w-full max-w-4xl mt-12 pt-12 border-t border-gray-200">
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-600 mb-2">{doctors.length}+</p>
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