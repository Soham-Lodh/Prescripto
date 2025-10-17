import React from "react";
import { assets } from "./../assets/assets_frontend/assets";
import {useNavigate} from "react-router-dom";
const Header = () => {
  const navigate=useNavigate();
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-[rgb(95,111,255)] rounded-lg px-6 md:px-10 lg:px-20">
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-2xl md:text-3xl lg:text-3xl text-white font-bold lg:leading-tight">
          Book Appointment
          <br />
          With trusted doctors
        </p>
        <div className="flex flex-col md:flex-row items-center text-white text-md font-light">
          <img
            className="w-30 pr-2"
            src={assets.group_profiles}
            alt="Group Photo"
          />
          <p>
            Simply browse through list
            <br />
            of our trusted doctors
          </p>
        </div>
        <button
          onClick={()=>navigate("/doctors")}
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-md auto md:m-0 hover:scale-105 transition-all duration-300"
        >
          Book Appointment <img src={assets.arrow_icon} alt="Arrow" />
        </button>
      </div>
      <div className="md:w-1/2 relative">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt="HEader Image"
        />
      </div>
    </div>
  );
};

export default Header;
