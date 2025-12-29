import React, { useState, useContext, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Contact = () => {
  const { backendURL } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    AOS.refreshHard();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendURL}/api/user/contact-us`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success("Message sent successfully");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="bg-white">
      {/* HERO */}
      <div className="bg-gradient-to-br py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            data-aos="fade-down"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
          >
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              Us
            </span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-gray-600 text-lg max-w-3xl mx-auto"
          >
            We're here to help and answer any questions you might have.
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT SIDE */}
          <div className="space-y-8">
            {/* IMAGE (overflow ONLY here) */}
            <div data-aos="fade-right">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={assets.contact_image}
                  alt="Contact"
                  className="w-full shadow-2xl border-4 border-white rounded-2xl"
                />
              </div>
            </div>

            {/* INFO CARDS */}
            {[
              { title: "Our Office", text: "123 Harmony Avenue, Bhubaneswar, India" },
              { title: "Phone", text: "+91 0123456789" },
              { title: "Email", text: "contact@prescripto.com" },
              { title: "Working Hours", text: "Mon–Fri: 9AM–6PM" },
            ].map((item, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-6 shadow-md"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div>
            {/* DO NOT animate wrapper */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
              <h2
                data-aos="fade-left"
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                Send Us a Message
              </h2>

              <p
                data-aos="fade-left"
                data-aos-delay="100"
                className="text-gray-600 mb-8"
              >
                Fill out the form and we’ll get back to you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  data-aos="fade-up"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600"
                />

                <input
                  data-aos="fade-up"
                  data-aos-delay="100"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600"
                />

                <textarea
                  data-aos="fade-up"
                  data-aos-delay="200"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:border-blue-600"
                />

                <button
                  data-aos="zoom-in"
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl"
                >
                  Send Message →
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
