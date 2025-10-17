import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-md">
        <div>
          <img
            onClick={() => {
              navigate("/");
              scrollTo(0, 0);
            }}
            src={assets.logo}
            alt="Logo"
            className="mb-5 w-40 cursor-pointer"
          />
          <p className="w-full md:w-2/3 text-gray-600 leading-6 text-justify">
            Prescripto is an intuitive web application designed to simplify
            doctor appointment bookings. It allows users to view detailed doctor
            profiles, check real-time availability, and reserve time slots
            seamlessly. With a focus on user-friendly navigation and secure
            scheduling, Prescripto streamlines the healthcare booking experience
            for both patients and healthcare providers.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li
              onClick={() => {
                navigate("/");
                scrollTo(0, 0);
              }}
              className="cursor-pointer hover:text-black"
            >
              Home
            </li>
            <li
              onClick={() => {
                navigate("/about");
                scrollTo(0, 0);
              }}
              className="cursor-pointer hover:text-black"
            >
              About Us
            </li>
            <li
              onClick={() => {
                navigate("/contact");
                scrollTo(0, 0);
              }}
              className="cursor-pointer hover:text-black"
            >
              Contact Us
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91 0123456789</li>
            <li>test@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr className="h-2" />
        <p className="py-5 text-sm text-center">
          © 2025 Prescripto. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
