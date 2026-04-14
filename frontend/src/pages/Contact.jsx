import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
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

  const [imgLoaded, setImgLoaded] = useState(false);

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

  /* Animation Variants */
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: 60 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: -60 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
        >
          Contact{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
            Us
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-lg max-w-3xl mx-auto"
        >
          We're here to help and answer any questions you might have.
        </motion.p>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            {/* IMAGE BLOCK (FIXED PROPERLY) */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Background accent */}
                <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl opacity-10"></div>

                {/* Skeleton loader */}
                {!imgLoaded && (
                  <div className="w-full h-[350px] rounded-2xl bg-gray-200 animate-pulse"></div>
                )}

                {/* Image */}
                <motion.img
                  src={assets.contact_image}
                  alt="Contact"
                  onLoad={() => setImgLoaded(true)}
                  initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  animate={
                    imgLoaded
                      ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                      : {}
                  }
                  transition={{ duration: 0.8 }}
                  className={`relative w-full rounded-2xl shadow-2xl border-4 border-white ${
                    imgLoaded ? "block" : "absolute top-0 left-0"
                  }`}
                />
              </div>
            </motion.div>

            {/* INFO CARDS */}
            {[
              {
                title: "Our Office",
                text: "123 Harmony Avenue, Bhubaneswar, India",
              },
              { title: "Phone", text: "+91 0123456789" },
              { title: "Email", text: "contact@prescripto.com" },
              { title: "Working Hours", text: "Mon–Fri: 9AM–6PM" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4, // faster animation
                  delay: i * 0.08, // reduced stagger (was too slow)
                  ease: "easeOut",
                }}
                viewport={{
                  once: true,
                  margin: "-50px", // triggers earlier (important fix)
                }}
                className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* RIGHT SIDE (FORM) */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                Send Us a Message
              </motion.h2>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-gray-600 mb-8"
              >
                Fill out the form and we’ll get back to you.
              </motion.p>

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
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
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-transform active:scale-[0.98]"
                >
                  Send Message →
                </button>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
