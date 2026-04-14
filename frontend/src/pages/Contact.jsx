import React, { useState, useContext, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Contact = () => {
  const { backendURL } = useContext(AppContext);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isReady, setIsReady] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Init AOS AFTER layout stabilizes
  useEffect(() => {
    const t = setTimeout(() => {
      setIsReady(true);
      AOS.init({ duration: 700, easing: "ease-out", once: true, offset: 80 });
    }, 120);
    return () => clearTimeout(t);
  }, []);

  // Refresh only when critical async (image) completes
  useEffect(() => {
    if (isReady && imgLoaded) {
      AOS.refreshHard();
    }
  }, [isReady, imgLoaded]);

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
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            data-aos={isReady ? "fade-down" : ""}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
          >
            Contact {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              Us
            </span>
          </h1>
          <p
            data-aos={isReady ? "fade-up" : ""}
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

          {/* LEFT */}
          <div className="space-y-8">
            {/* IMAGE with skeleton + fade */}
            <div data-aos={isReady ? "fade-right" : ""}>
              <div className="relative overflow-hidden rounded-2xl">
                {!imgLoaded && (
                  <div className="w-full h-[300px] bg-gray-200 animate-pulse" />
                )}

                <img
                  src={assets.contact_image}
                  alt="Contact"
                  loading="eager"
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full shadow-2xl border-4 border-white rounded-2xl transition-all duration-700 ${
                    imgLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md absolute top-0 left-0"
                  }`}
                />
              </div>
            </div>

            {/* INFO CARDS (container-level animation only) */}
            <div data-aos={isReady ? "fade-up" : ""} data-aos-delay="100" className="space-y-6">
              {[
                { title: "Our Office", text: "123 Harmony Avenue, Bhubaneswar, India" },
                { title: "Phone", text: "+91 0123456789" },
                { title: "Email", text: "contact@prescripto.com" },
                { title: "Working Hours", text: "Mon–Fri: 9AM–6PM" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT (FORM) */}
          <div data-aos={isReady ? "fade-left" : ""}>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">Fill out the form and we’ll get back to you.</p>

              {/* Animate container, NOT inputs */}
              <div data-aos={isReady ? "fade-up" : ""} data-aos-delay="120">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none"
                  />

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Your Message"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:border-blue-600 outline-none"
                  />

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-transform active:scale-[0.99]"
                  >
                    Send Message →
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;