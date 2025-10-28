import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import FlipCard from "../components/FlipCard";

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
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading doctors...</p>
        </div>
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Our Specialized Doctors
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Browse through our list of experienced and specialized doctors to find the perfect match for your healthcare needs
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="sm:hidden flex justify-between items-center mb-6">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilter ? "Close Filters" : "Show Filters"}
        </button>
        {activeSpec && (
          <button
            onClick={() => {
              navigate('/doctors');
              setActiveSpec(null);
            }}
            className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Mobile Filter Options */}
      {showFilter && (
        <div className="sm:hidden bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200 animate-fadeIn">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Filter by Speciality</h3>
          <div className="grid grid-cols-2 gap-2">
            {doctorTypes.map((spec) => (
              <button
                key={spec}
                onClick={() => {
                  navigate(`/doctors/${spec}`);
                  setShowFilter(false);
                }}
                className={`text-sm px-3 py-2.5 rounded-lg border-2 transition-all duration-300 font-medium
                  ${
                    activeSpec === spec
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600"
                  }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden sm:block w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Specialities</h3>
              {activeSpec && (
                <button
                  onClick={() => navigate('/doctors')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2">
              {doctorTypes.map((spec) => (
                <button
                  key={spec}
                  onClick={() => navigate(`/doctors/${spec}`)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm border-2
                    ${
                      activeSpec === spec
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-md transform scale-[1.02]"
                        : "bg-gray-50 text-gray-700 border-transparent hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                    }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctors Grid with Flip Cards */}
        <div className="flex-1 w-full">
          {filterDoc.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 text-lg font-medium">No doctors found</p>
              <p className="text-gray-500 text-sm mt-2">Try selecting a different speciality</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600 font-medium">
                Showing {filterDoc.length} {filterDoc.length === 1 ? 'doctor' : 'doctors'}
                {activeSpec && <span className="text-blue-600"> in {activeSpec}</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterDoc.map((doc) => (
                  <FlipCard
                    className="hover:translate-y-[-8px] transition-transform duration-300"
                    onClick={() => navigate(`/appointments/${doc._id}`)}
                    key={doc._id}
                    frontContent={
                      <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <div className="relative">
                          <img
                            className="w-full h-56 object-cover"
                            src={doc.image}
                            alt={doc.name}
                          />
                          <div className="absolute top-3 right-3">
                            {doc.available ? (
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
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-gray-900 text-lg font-bold mb-1 line-clamp-1">{doc.name}</h3>
                          <p className="text-blue-600 text-sm font-semibold mb-2">{doc.speciality}</p>
                          <div className="mt-auto pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center font-medium">Click to view details</p>
                          </div>
                        </div>
                      </div>
                    }
                    backContent={
                      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 flex flex-col justify-center h-full text-center shadow-xl cursor-pointer">
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-white font-bold text-xl mb-1">{doc.name}</h3>
                          <p className="text-blue-200 text-sm mb-4">{doc.speciality}</p>
                          
                          <div className="space-y-3 text-white">
                            <div className="flex justify-between items-center">
                              <span className="text-blue-200 text-sm">Degree:</span>
                              <span className="font-semibold text-sm">{doc.degree}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-blue-200 text-sm">Experience:</span>
                              <span className="font-semibold text-sm">{doc.experience} {doc.experience === "1" ? "year" : "years"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-blue-200 text-sm">Consultation:</span>
                              <span className="font-bold text-lg text-yellow-300">${doc.fees}</span>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;