import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppContext } from "../context/AppContext";
import FlipCard from "../components/FlipCard";
import AOS from "aos";

const Doctors = () => {
  const [filterDoc, setFilterDoc] = useState([]);
  const [activeSpec, setActiveSpec] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const formatExperience = (exp) => {
    const num = Number(exp);
    if (isNaN(num)) return `Experience: ${exp}`;
    return `Experience: ${num} ${num === 1 ? "year" : "years"}`;
  };

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

  const applyFilterAndSort = () => {
    let filtered = [...doctors];

    if (speciality) {
      filtered = filtered.filter(
        (doc) => doc.speciality?.toLowerCase() === speciality.toLowerCase()
      );
      setActiveSpec(speciality);
    } else {
      setActiveSpec(null);
    }

    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "low-high") filtered.sort((a, b) => a.fees - b.fees);
    else if (sortOrder === "high-low") filtered.sort((a, b) => b.fees - a.fees);

    setFilterDoc(filtered);
    setTimeout(() => setIsLoading(false), 300);
  };

  useEffect(() => {
    setIsLoading(true);
    if (doctors.length >= 0) applyFilterAndSort();
  }, [doctors, speciality, sortOrder, searchTerm]);

  useEffect(() => {
    if (!isLoading) AOS.refresh();
  }, [isLoading]);

  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-out", once: false, offset: 100 });
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-0 overflow-hidden shadow-sm animate-pulse h-96">
      <div className="bg-gray-200 h-56 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="mt-4 h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="px-3 sm:px-6 py-8 max-w-7xl mx-auto" data-aos="fade-up">
      <Helmet>
        <title>{speciality ? `${speciality}s` : "All Doctors"} | Prescripto</title>
      </Helmet>

      <div className="text-center mb-8" data-aos="fade-down">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Our Specialized Doctors
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Find the best healthcare professionals for your needs.
        </p>
      </div>

      <div className="flex justify-center mb-10" data-aos="fade-up">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 transition-colors shadow-sm"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4" data-aos="fade-up">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="sm:hidden w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
        >
          {showFilter ? "Close Filters" : "Filter by Speciality"}
        </button>

        <div className="w-full sm:w-auto flex justify-end">
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:border-blue-500"
          >
            <option value="">Sort by: Relevance</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {showFilter && (
        <div className="sm:hidden bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200" data-aos="fade-down">
          <div className="grid grid-cols-2 gap-2">
            {doctorTypes.map((spec) => (
              <button
                key={spec}
                onClick={() => {
                  navigate(`/doctors/${spec}`);
                  setShowFilter(false);
                }}
                className={`text-sm px-3 py-2.5 rounded-lg border-2 font-medium ${
                  activeSpec === spec
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-500"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="hidden sm:block w-full lg:w-64 flex-shrink-0" data-aos="fade-right">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Specialities</h3>

            <div className="space-y-2">
              {doctorTypes.map((spec, i) => (
                <button
                  key={spec}
                  onClick={() => navigate(`/doctors/${spec}`)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm border-2 ${
                    activeSpec === spec
                      ? "bg-blue-50 text-blue-700 border-blue-500"
                      : "bg-gray-50 text-gray-700 border-transparent hover:bg-white hover:border-gray-300"
                  }`}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : filterDoc.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200" data-aos="fade-up">
              <p className="text-gray-600 text-lg font-medium">
                No doctors found matching criteria.
              </p>
              <button
                onClick={() => {
                  navigate("/doctors");
                  setSearchTerm("");
                }}
                className="mt-3 text-blue-600 underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600 font-medium" data-aos="fade-up">
                Showing {filterDoc.length} doctors
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterDoc.map((item, i) => (
                  <div key={item._id} data-aos="fade-up" data-aos-delay={i * 50}>
                    <FlipCard
                      onClick={() => navigate(`/appointments/${item._id}`)}
                      className="hover:translate-y-[-5px] transition-transform duration-300"
                      frontContent={
                        <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-all cursor-pointer">
                          <div className="relative h-60 overflow-hidden bg-gray-100">
                            <img
                              className="w-full h-full object-cover object-top"
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                            />
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                              {item.available ? (
                                <span className="bg-green-500/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                                  Available
                                </span>
                              ) : (
                                <span className="bg-red-500/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm">
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
                              <span>{formatExperience(item.experience)}</span>
                              <span className="font-bold text-gray-700">${item.fees}</span>
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
                              <p>{formatExperience(item.experience)}</p>
                            </div>
                            {item.about && (
                              <p className="text-xs text-blue-200 italic mb-4 line-clamp-3">
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
                  </div>
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
