import React, { useContext, useEffect } from "react";
import AOS from "aos";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";

const About = () => {
  const { doctors } = useContext(AppContext);

  // Refresh AOS after dynamic data
  useEffect(() => {
    AOS.refreshHard();
  }, [doctors]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
            data-aos="fade-down"
          >
            About{" "}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
          {/* Image */}
          <div
            className="w-full lg:w-1/2"
            data-aos="fade-right"
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl opacity-10"></div>
              <img
                src={assets.about_image}
                alt="About Prescripto"
                className="relative w-full rounded-2xl shadow-2xl border-4 border-white"
              />

              {/* Floating Stats */}
              <div
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-gray-600 text-sm">Happy Patients</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className="w-full lg:w-1/2 space-y-6"
            data-aos="fade-left"
          >
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

            {/* Vision Card */}
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

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold"
              data-aos="fade-up"
            >
              Why Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Efficiency", "Convenience", "Personalization"].map((title, i) => (
              <div
                key={title}
                className="bg-white border-2 rounded-2xl p-8 shadow-md hover:shadow-xl"
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

        {/* Stats */}
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
