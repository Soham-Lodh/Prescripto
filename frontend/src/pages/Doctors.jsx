import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const [filterDoc, setFilterDoc] = useState([]);
  const [activeSpec, setActiveSpec] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

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

  // ✅ Filter doctors based on speciality
  useEffect(() => {
    if (doctors.length > 0) {
      if (speciality) {
        setFilterDoc(
          doctors.filter(
            (doc) =>
              doc.speciality?.toLowerCase() === speciality.toLowerCase()
          )
        );
        setActiveSpec(speciality);
      } else {
        setFilterDoc(doctors);
        setActiveSpec(null);
      }
    }
  }, [doctors, speciality]);

  if (!doctors || doctors.length === 0)
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        Loading doctors...
      </div>
    );

  return (
    <div className="px-4 sm:px-0">
      <p className="text-gray-600 text-center text-lg mt-4">
        Browse through our list of specialized doctors
      </p>

      {/* 🔹 Mobile Filter Toggle */}
      <div className="sm:hidden flex justify-start mt-4 mb-4">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-[rgb(95,111,255)] text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
        >
          {showFilter ? "Close Filter" : "Filter"}
        </button>
      </div>

      {/* 🔹 Mobile Filter Options */}
      {showFilter && (
        <div className="sm:hidden flex flex-col gap-2 mb-4">
          {doctorTypes.map((spec) => (
            <button
              key={spec}
              onClick={() => {
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
        {/* 🔹 Desktop Sidebar Filter */}
        <div className="hidden sm:flex flex-col gap-3 text-sm text-gray-600">
          {doctorTypes.map((spec) => (
            <p
              key={spec}
              onClick={() => navigate(`/doctors/${spec}`)}
              className={`cursor-pointer px-3 py-1.5 border border-gray-300 rounded transition-all
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

        {/* 🔹 Doctors Grid */}
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6">
          {filterDoc.map((doc) => (
            <div
              key={doc._id}
              onClick={() => navigate(`/appointments/${doc._id}`)}
              className="border border-blue-200 p-2 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform duration-300"
            >
              <img
                className="bg-blue-50 w-full h-48 object-cover"
                src={doc.image}
                alt={doc.name}
              />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                  {doc.available ? (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <p>Available</p>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <p>Unavailable</p>
                    </>
                  )}
                </div>
                <p className="text-gray-900 text-lg font-medium">{doc.name}</p>
                <p className="text-gray-600 text-sm">{doc.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
