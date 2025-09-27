import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const [filterDoc, setFilterDoc] = useState([]);
  const [activeSpec, setActiveSpec] = useState(null);
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false); // Mobile filter toggle

  const doctorTypes = [
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "Gastroenterologist",
    "Orthopedic",
    "Psychiatrist",
    "Cardiologist",
    "ENT Specialist",
  ];

  // Filter doctors by speciality
  const applyFilter = (spec) => {
    if (spec) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === spec));
    } else if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  // Sync filter with doctors & speciality param
  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  // Keep activeSpec synced with current URL
  useEffect(() => {
    if (speciality) {
      setActiveSpec(speciality);
    } else {
      setActiveSpec(null);
    }
  }, [speciality]);

  return (
    <div className="px-4 sm:px-0">
      <p className="text-gray-600 text-center text-lg">
        Browse through our list of specialized doctors
      </p>

      {/* Mobile Filter Toggle */}
      <div className="sm:hidden flex justify-start mt-4 mb-4">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-[rgb(95,111,255)] text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
        >
          {showFilter ? (
            "Close Filter"
          ) : (
            <>
              Filter
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Mobile Filter List */}
      {showFilter && (
        <div className="sm:hidden flex flex-col gap-2 mb-4">
          {doctorTypes.map((spec) => (
            <button
              key={spec}
              onClick={() => {
                applyFilter(spec);
                navigate(`/doctors/${spec}`);
                setShowFilter(false);
              }}
              className={`text-left w-full px-4 py-2 border border-gray-300 rounded transition-all
                ${
                  activeSpec === spec
                    ? "bg-[rgb(95,111,255)] text-white"
                    : "bg-white text-black hover:bg-[rgb(95,111,255)] hover:text-white"
                }`}
            >
              {spec}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-5 sm:flex-row items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden sm:flex flex-col gap-4 text-sm text-gray-600">
          {doctorTypes.map((spec) => (
            <p
              key={spec}
              onClick={() => navigate(`/doctors/${spec}`)}
              className={`w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer
                ${
                  activeSpec === spec
                    ? "bg-[rgb(95,111,255)] text-white"
                    : "hover:bg-[rgb(95,111,255)] hover:text-white"
                }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointments/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img className="bg-blue-50" src={item.image} alt={item.name} />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                  <p className="">Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
