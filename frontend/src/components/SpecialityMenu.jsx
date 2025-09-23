import React from "react";
import { Link } from "react-router-dom";
import { specialityData } from "./../assets/assets_frontend/assets";
const SpecialityMenu = () => {
  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 py-16 text-gray-800"
    >
      <h1 className="text-3xl font-medium">Find By Speciality</h1>
      <p className="sm:w-1/2 text-lg text-center">
        Browse through our extensive list of trusted doctors. Schedule your
        appointment hassle-free
      </p>
      <div className="flex flex-wrap justify-center gap-5 pt-5 w-full">
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className="rounded-xl bg-[rgb(95,111,255)] px-12 py-4 items-center text-xs cursor-pointer flex-shrink-0  hover:translate-y-[-5px] transition-all duration-500"
            to={`/doctors/${item.speciality}`}
            key={index}
          >
            <p className="text-lg">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
