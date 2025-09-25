import React from "react";
import { assets } from "./../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";
const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row bg-[rgb(95,111,255)] rounded-xl px-6 sm:px-10 md:px-14 my-20">
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
          <p className="">Book Appointment</p>
          <p className="mt-4">With 100+ trusted doctors</p>
        </div>
        <button
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="bg-white mt-4 text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full hover:scale-105 transition-all "
        >
          Book an Appointment
        </button>
      </div>
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <img
          src={assets.appointment_img}
          alt="Banner Image"
          className="w-full max-w-md absolute bottom-0 right-0"
        />
      </div>
    </div>
  );
};

export default Banner;
