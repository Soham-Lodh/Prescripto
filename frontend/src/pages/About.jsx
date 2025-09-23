import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const About = () => {
  return (
    <div className="mt-10 px-6 md:px-16 lg:px-24">
      <div className="w-full mb-8 text-center">
        <p className="text-3xl text-gray-600">
          ABOUT <span className="text-gray-900">US</span>
        </p>
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-10 items-center">
        <div className="w-full lg:w-1/2">
          <img
            src={assets.about_image}
            alt="About"
            className="w-full rounded-lg shadow-md border border-gray-300"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-3 text-lg text-gray-500 text-justify">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-gray-800">Prescripto</span>,
            your trusted partner in managing your healthcare needs conveniently
            and efficiently. At Prescripto, we understand the challenges
            individuals face when it comes to scheduling doctor appointments and
            managing their health records.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>
          <div className="mt-2">
            <p className="text-gray-800 text-xl underline font-semibold mb-2">
              Our Vision
            </p>
            <p>
              Our vision at Prescripto is to create a seamless healthcare
              experience for every user. We aim to bridge the gap between
              patients and healthcare providers, making it easier for you to
              access the care you need, when you need it.
            </p>
          </div>
        </div>
      </div>
      <p className="text-gray-800 text-center mt-10 text-2xl font-semibold mb-6">
        WHY CHOOSE US
      </p>
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center text-lg">
        <div className="relative px-12 py-8 border border-gray-300 rounded-lg overflow-hidden cursor-pointer group w-full lg:w-1/3">
          <div className="absolute left-0 bottom-0 w-full h-0 bg-[rgb(95,111,255)] transition-all duration-500 ease-in-out group-hover:h-full"></div>
          <div className="relative z-10 w-full transition-colors duration-500 group-hover:text-white">
            <p className="text-center mb-3 font-semibold text-gray-800">
              EFFICIENCY
            </p>
            <p className="text-center">
              Streamlined appointment scheduling that fits into your busy
              lifestyle.
            </p>
          </div>
        </div>
        <div className="relative px-12 py-8 border border-gray-300 rounded-lg overflow-hidden cursor-pointer group w-full lg:w-1/3">
          <div className="absolute left-0 bottom-0 w-full h-0 bg-[rgb(95,111,255)] transition-all duration-500 ease-in-out group-hover:h-full"></div>
          <div className="relative z-10 transition-colors duration-500 group-hover:text-white">
            <p className="text-center mb-3 font-semibold text-gray-800">
              CONVENIENCE
            </p>
            <p className="text-center">
              Access to a network of trusted healthcare professionals in your
              area.
            </p>
          </div>
        </div>
        <div className="relative px-12 py-8 border border-gray-300 rounded-lg overflow-hidden cursor-pointer group w-full lg:w-1/3">
          <div className="absolute left-0 bottom-0 w-full h-0 bg-[rgb(95,111,255)] transition-all duration-500 ease-in-out group-hover:h-full"></div>
          <div className="relative z-10 transition-colors duration-500 group-hover:text-white">
            <p className="text-center mb-3 font-semibold text-gray-800">
              PERSONALIZATION
            </p>
            <p className="text-center">
              Tailored recommendations and reminders to help you stay on top of
              your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
