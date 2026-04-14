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

  const formatExperience = (exp) => {
    const num = Number(exp);
    if (isNaN(num)) return `Experience: ${exp}`;
    return `Experience: ${num} ${num === 1 ? "year" : "years"}`;
  };

  const clearAllFilters = () => {
    setActiveSpec(null);
    setSearchTerm("");
    setSortOrder("");
    navigate("/doctors");
  };

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
    if (sortOrder === "high-low") filtered.sort((a, b) => b.fees - a.fees);

    setFilterDoc(filtered);
  };

  useEffect(() => {
    setIsLoading(true);

    if (doctors.length > 0) {
      applyFilterAndSort();
      setIsLoading(false);
    }
  }, [doctors, speciality, sortOrder, searchTerm]);

  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-out", once: false, offset: 100 });
  }, []);

  useEffect(() => {
    if (!isLoading) AOS.refresh();
  }, [isLoading]);

  const SkeletonCard = () => (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex flex-col h-[420px] shadow-md relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

      <div className="h-60 bg-gray-200"></div>

      <div className="p-4 flex flex-col flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

        <div className="flex-1"></div>

        <div className="flex justify-between items-center border-t pt-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white px-3 sm:px-6 py-8 max-w-7xl mx-auto">
      <Helmet>
        <title>{speciality ? `${speciality}s` : "All Doctors"} | Prescripto</title>
      </Helmet>

      <div className="text-center mb-8" data-aos="fade-down">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Our Specialized Doctors
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find the best healthcare professionals for your needs.
        </p>
      </div>

      <div className="flex justify-center mb-10" data-aos="fade-up">
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg px-5 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="sm:hidden bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {showFilter ? "Close Filters" : "Filter by Speciality"}
        </button>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border-2 border-gray-200 rounded-lg px-4 py-2"
        >
          <option value="">Sort by: Relevance</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden sm:block w-64">
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-4">
            <h3 className="font-bold mb-4">Specialities</h3>
            <div className="space-y-2">
              {doctorTypes.map((spec) => (
                <button
                  key={spec}
                  onClick={() => navigate(`/doctors/${spec}`)}
                  className={`w-full text-left px-4 py-2 rounded-lg border ${
                    activeSpec === spec
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filterDoc.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-xl">
              <p>No doctors found.</p>
              <button
                onClick={clearAllFilters}
                className="mt-3 text-blue-600 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterDoc.map((doc, i) => (
                <div
                  key={doc._id}
                  className="h-[420px]"
                  data-aos="fade-up"
                  data-aos-delay={i * 50}
                >
                  <FlipCard
                    className="h-full"
                    onClick={() => navigate(`/appointments/${doc._id}`)}
                    frontContent={
                      <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-md">
                        <div className="relative h-60 bg-gray-100">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-lg line-clamp-1">
                            {doc.name}
                          </h3>
                          <p className="text-blue-600 text-sm font-semibold mb-3">
                            {doc.speciality}
                          </p>

                          <div className="mt-auto flex justify-between text-sm text-gray-600 border-t pt-4">
                            <span>{formatExperience(doc.experience)}</span>
                            <span className="font-bold">${doc.fees}</span>
                          </div>
                        </div>
                      </div>
                    }
                    backContent={
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 flex flex-col justify-between h-full text-white shadow-xl">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{doc.name}</h3>
                          <p className="text-blue-100 text-sm mb-4">
                            {doc.degree}
                          </p>

                          <div className="space-y-2 text-sm opacity-90">
                            <p>Speciality: {doc.speciality}</p>
                            <p>Fees: ${doc.fees}</p>
                            <p>{formatExperience(doc.experience)}</p>
                          </div>

                          {doc.about && (
                            <p className="mt-4 text-xs italic opacity-90 line-clamp-3">
                              "{doc.about}"
                            </p>
                          )}
                        </div>

                        <button className="bg-white text-blue-700 py-2 rounded-lg font-bold text-sm">
                          Book Now
                        </button>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>
        {`@keyframes shimmer {
          100% { transform: translateX(100%); }
        }`}
      </style>
    </div>
  );
};

export default Doctors;