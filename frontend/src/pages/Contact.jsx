import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Contact = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full mt-16 px-6 md:px-20 lg:px-32">
      <p className="text-center text-3xl font-bold text-gray-600 mb-12">
        CONTACT <span className="text-[rgb(95,111,255)]">US</span>
      </p>
      <div className="w-full flex flex-col md:flex-row gap-10 items-center">
        <div className="w-full md:w-1/2">
          <img
            src={assets.contact_image}
            alt="Contact"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-6 text-gray-700">
          <p className="text-xl font-semibold text-gray-800 border-b pb-2">
            OUR OFFICE
          </p>
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[rgb(95,111,255)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <div>
              <p className="font-medium">Address</p>
              <p>123 Harmony Avenue,</p>
              <p>Bhubaneswar, Odisha 751024,</p>
              <p>India</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[rgb(95,111,255)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
            <div>
              <p className="font-medium">Phone</p>
              <p>+91 0123456789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
