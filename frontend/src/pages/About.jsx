import React,{useContext} from "react";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
const About = () => {
  const { doctors } = useContext(AppContext);
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Us</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Transforming healthcare accessibility through innovative technology and patient-centered solutions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl opacity-10"></div>
              <img
                src={assets.about_image}
                alt="About Prescripto"
                className="relative w-full rounded-2xl shadow-2xl border-4 border-white"
              />
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">10K+</p>
                    <p className="text-gray-600 text-sm">Happy Patients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Trusted Healthcare Partner
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Your Journey to Better Health Starts Here
            </h2>

            <p className="text-gray-600 text-base leading-relaxed">
              Welcome to <span className="font-bold text-blue-600">Prescripto</span>,
              your trusted partner in managing your healthcare needs conveniently
              and efficiently. We understand the challenges individuals face when
              it comes to scheduling doctor appointments and managing their health records.
            </p>

            <p className="text-gray-600 text-base leading-relaxed">
              Prescripto is committed to excellence in healthcare technology. We
              continuously strive to enhance our platform, integrating the latest
              advancements to improve user experience and deliver superior
              service. Whether you're booking your first appointment or managing
              ongoing care, Prescripto is here to support you every step of the way.
            </p>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="text-blue-100 leading-relaxed">
                Our vision at Prescripto is to create a seamless healthcare
                experience for every user. We aim to bridge the gap between
                patients and healthcare providers, making it easier for you to
                access the care you need, when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Us</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We combine cutting-edge technology with personalized care to deliver the best healthcare experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Efficiency Card */}
            <div className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-600 transition-all duration-500 overflow-hidden shadow-md hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-100 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500">
                  <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-4 transition-colors duration-500">
                  Efficiency
                </h3>
                <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed transition-colors duration-500">
                  Streamlined appointment scheduling that fits into your busy
                  lifestyle with real-time availability and instant confirmations.
                </p>
              </div>
            </div>

            {/* Convenience Card */}
            <div className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-600 transition-all duration-500 overflow-hidden shadow-md hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-100 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500">
                  <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-4 transition-colors duration-500">
                  Convenience
                </h3>
                <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed transition-colors duration-500">
                  Access to a network of trusted healthcare professionals in your
                  area, available 24/7 at your fingertips.
                </p>
              </div>
            </div>

            {/* Personalization Card */}
            <div className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-600 transition-all duration-500 overflow-hidden shadow-md hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-100 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500">
                  <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-4 transition-colors duration-500">
                  Personalization
                </h3>
                <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed transition-colors duration-500">
                  Tailored recommendations and reminders to help you stay on top of
                  your health with customized care plans.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">{doctors.length}+</p>
              <p className="text-blue-200">Expert Doctors</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">10K+</p>
              <p className="text-blue-200">Happy Patients</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">98%</p>
              <p className="text-blue-200">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">24/7</p>
              <p className="text-blue-200">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;