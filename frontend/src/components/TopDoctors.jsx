import React, { useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import FlipCard from "../components/FlipCard";
const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors</h1>
      <p className="sm:w-1/2 text-center text-lg">
        Browse through our list of trusted doctors
      </p>
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 8).map((item, index) => (
          <FlipCard
            onClick={() => navigate(`/appointments/${item._id}`)}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
            frontContent={
              <div>
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
            }
            backContent={
                <div className="border border-blue-200 p-4 rounded-xl bg-gray-100 flex flex-col justify-center items-center gap-2 h-full text-center">
                  <p className="text-[rgb(95,111,255)] font-semibold mb-1 text-xl">{item.name}</p>
                  <p className="text-gray-900 text-lg mb-1">{item.speciality}</p>
                  <p className="text-gray-600 text-md mb-1">Degree: <span className="text-black">{item.degree}</span></p>
                  <p className="text-gray-600 text-md mb-1">
                    Experience: <span className="text-black">{item.experience} {item.experience === "1" ? "year" : "years"}</span>
                  </p>
                  <p className="text-gray-600 text-md mb-1">Fees: <span className="text-black">${item.fees}</span></p>
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
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-[rgb(95,111,255)] hover:text-white transition-all duration-500"
      >
        More ...
      </button>
    </div>
  );
};

export default TopDoctors;
