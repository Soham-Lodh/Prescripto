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
    <div className="px-3 sm:px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Our Specialized Doctors
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Browse through our list of experienced and specialized doctors to find
          the perfect match for your healthcare needs.
        </p>
      </div>

      {/* Mobile Filter */}
      <div className="sm:hidden flex justify-between items-center mb-6">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h18M4 8h16M6 12h12M8 16h8M10 20h4"
            />
          </svg>
          {showFilter ? "Close Filters" : "Show Filters"}
        </button>
        {activeSpec && (
          <button
            onClick={() => {
              navigate("/doctors");
              setActiveSpec(null);
            }}
            className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {showFilter && (
        <div className="sm:hidden bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Filter by Speciality
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {doctorTypes.map((spec) => (
              <button
                key={spec}
                onClick={() => {
                  navigate(`/doctors/${spec}`);
                  setShowFilter(false);
                }}
                className={`text-sm px-3 py-2.5 rounded-lg border-2 transition-all font-medium ${
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
        {/* Desktop Filter */}
        <div className="hidden sm:block w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Specialities</h3>
              {activeSpec && (
                <button
                  onClick={() => navigate("/doctors")}
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
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm border-2 ${
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

        {/* Doctor Cards */}
        <div className="flex-1 w-full">
          {filterDoc.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 text-lg font-medium">No doctors found</p>
              <p className="text-gray-500 text-sm mt-2">
                Try selecting a different speciality
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600 font-medium">
                Showing {filterDoc.length}{" "}
                {filterDoc.length === 1 ? "doctor" : "doctors"}
                {activeSpec && (
                  <span className="text-blue-600"> in {activeSpec}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 ml-2 sm:ml-0">
                {filterDoc.map((doc) => (
                  <FlipCard
                    key={doc._id}
                    className="hover:translate-y-[-8px] transition-transform duration-300"
                    onClick={() => navigate(`/appointments/${doc._id}`)}
                    frontContent={
                      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl overflow-hidden flex flex-col h-full shadow-lg hover:shadow-2xl hover:border-blue-300 transition-all cursor-pointer">
                        <div className="relative h-96">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 z-20">
                            <span
                              className={`text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 ${
                                doc.available
                                  ? "bg-gradient-to-r from-green-500 to-green-600"
                                  : "bg-gradient-to-r from-red-500 to-red-600"
                              }`}
                            >
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                              {doc.available ? "Available" : "Unavailable"}
                            </span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                              <h3 className="text-gray-900 text-lg font-bold truncate">
                                {doc.name}
                              </h3>
                              <p className="text-blue-600 text-sm font-semibold">
                                {doc.speciality}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    backContent={
                      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 flex flex-col h-full shadow-2xl cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

                        <div className="relative z-10 flex-1 flex flex-col overflow-y-auto no-scrollbar">
                          <div className="text-center mb-5">
                            <h3 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-lg break-words">
                              {doc.name}
                            </h3>
                            <p className="text-blue-100 text-sm font-medium">
                              {doc.speciality}
                            </p>
                          </div>

                          <div className="flex-1 flex items-center">
                            <div className="w-full space-y-3 text-white bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                              <div className="flex justify-between items-center pb-2.5 border-b border-white/20">
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-blue-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="text-blue-200 text-xs font-medium">
                                    Experience
                                  </span>
                                </div>
                                <span className="font-bold text-sm text-white whitespace-nowrap">
                                  {doc.experience}&nbsp;
                                  {doc.experience === "1" ? "Year" : "Years"}
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-yellow-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="text-blue-200 text-xs font-medium">
                                    Consultation Fee
                                  </span>
                                </div>
                                <span className="font-bold text-lg text-yellow-300 drop-shadow-lg">
                                  ${doc.fees}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="relative z-20 mt-5">
                          <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 w-full">
                            Book Appointment →
                          </button>
                        </div>
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
