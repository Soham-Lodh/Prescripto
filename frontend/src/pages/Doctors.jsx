import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const FlipCard = ({ frontContent, backContent, className = "", onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative w-full h-80 cursor-pointer [perspective:1000px] ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={onClick} // ✅ now it's defined
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden] hover:bg-gray-100 transition-colors">
          {frontContent}
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {backContent}
        </div>
      </div>
    </div>
  );
};



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

  useEffect(() => {
    if (doctors.length > 0) {
      if (speciality) {
        setFilterDoc(
          doctors.filter(
            (doc) => doc.speciality?.toLowerCase() === speciality.toLowerCase()
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

      {/* Mobile Filter Toggle */}
      <div className="sm:hidden flex justify-start mt-4 mb-4">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-[rgb(95,111,255)] text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
        >
          {showFilter ? "Close Filter" : "Filter"}
        </button>
      </div>

      {/* Mobile Filter Options */}
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
        {/* Desktop Sidebar Filter */}
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

        {/* Doctors Grid with Flip Cards */}
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6 mt-2">
          {filterDoc.map((doc) => (
            <FlipCard
              onClick={()=>navigate(`/appointments/${doc._id}`)}
              key={doc._id}
              frontContent={
                <div className="border border-blue-200 p-2 rounded-xl overflow-hidden flex flex-col h-full">
                  <img
                    className="bg-blue-50 w-full h-48 object-cover mb-2 rounded"
                    src={doc.image}
                    alt={doc.name}
                  />
                  <div className="flex-1 p-2">
                    <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                      {doc.available ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <p>Available</p>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <p className="text-red-500">Unavailable</p>
                        </>
                      )}
                    </div>
                    <p className="text-gray-900 text-lg font-medium">{doc.name}</p>
                    <p className="text-gray-600 text-sm">{doc.speciality}</p>
                  </div>
                </div>
              }
              backContent={
                <div className="border border-blue-200 p-4 rounded-xl bg-gray-100 flex flex-col justify-center items-center gap-2 h-full text-center">
                  <p className="text-[rgb(95,111,255)] font-semibold mb-1 text-xl">{doc.name}</p>
                  <p className="text-gray-900 text-lg mb-1">{doc.speciality}</p>
                  <p className="text-gray-600 text-md mb-1">Degree: <span className="text-black">{doc.degree}</span></p>
                  <p className="text-gray-600 text-md mb-1">
                    Experience: <span className="text-black">{doc.experience} {doc.experience === "1" ? "year" : "years"}</span>
                  </p>
                  <p className="text-gray-600 text-md mb-1">Fees: <span className="text-black">${doc.fees}</span></p>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
