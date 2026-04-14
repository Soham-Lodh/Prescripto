import React, { useContext, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";

const About = () => {
  const { doctors } = useContext(AppContext);

  const [imgLoaded, setImgLoaded] = useState(false);

  /* Init AOS */
  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-out", once: false, offset: 100 });
  }, []);

  /* Refresh AOS ONLY after image loads */
  useEffect(() => {
    if (imgLoaded) {
      AOS.refreshHard();
    }
  }, [imgLoaded]);

  return (
    <div className="bg-white">

      {/* HERO */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
            data-aos="fade-down"
          >
            About {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              Us
            </span>
          </h1>

          <p
            className="text-gray-600 text-lg max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Transforming healthcare accessibility through innovative technology
            and patient-centered solutions
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* SECTION */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">

          {/* IMAGE BLOCK */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">

            <div className="relative">

              {/* background accent */}
              <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl opacity-10"></div>

              {/* skeleton */}
              {!imgLoaded && (
                <div className="w-full h-[350px] rounded-2xl bg-gray-200 animate-pulse"></div>
              )}

              {/* actual image */}
              <img
                src={assets.about_image}
                alt="About Prescripto"
                loading="eager"
                onLoad={() => setImgLoaded(true)}
                className={`relative w-full rounded-2xl shadow-2xl border-4 border-white transition-all duration-700 ${
                  imgLoaded
                    ? "opacity-100 blur-0"
                    : "opacity-0 blur-md absolute top-0 left-0"
                }`}
              />

              {/* floating stats */}
              <div
                className={`absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 transition-all duration-500 ${
                  imgLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-gray-600 text-sm">Happy Patients</p>
              </div>

            </div>
          </div>

          {/* CONTENT */}
          <div className="w-full lg:w-1/2 space-y-6" data-aos="fade-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Your Journey to Better Health Starts Here
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Welcome to <span className="font-bold text-blue-600">Prescripto</span>,
              your trusted partner in managing healthcare conveniently and efficiently.
            </p>

            <p className="text-gray-600 leading-relaxed">
              We continuously improve our platform using modern technology to
              deliver better healthcare experiences.
            </p>

            {/* Vision */}
            <div
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl"
              data-aos="flip-up"
            >
              <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
              <p className="text-blue-100">
                To create a seamless healthcare experience by connecting patients
                with providers effortlessly.
              </p>
            </div>
          </div>
        </div>

        {/* WHY */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold" data-aos="fade-up">
              Why Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Efficiency", "Convenience", "Personalization"].map((title, i) => (
              <div
                key={title}
                className="bg-white border-2 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                <p className="text-gray-600">
                  High-quality healthcare services designed around your needs.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-white"
          data-aos="zoom-in"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold">{doctors.length}+</p>
              <p className="text-blue-200">Expert Doctors</p>
            </div>
            <div>
              <p className="text-5xl font-bold">10K+</p>
              <p className="text-blue-200">Happy Patients</p>
            </div>
            <div>
              <p className="text-5xl font-bold">98%</p>
              <p className="text-blue-200">Satisfaction</p>
            </div>
            <div>
              <p className="text-5xl font-bold">24/7</p>
              <p className="text-blue-200">Support</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;