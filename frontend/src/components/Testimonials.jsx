import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Quote, Star } from "lucide-react";

const TestimonialData = [
  {
    id: 1,
    name: "Rohit",
    role: "Patient",
    text: "Great experience — booking was smooth and the doctor was punctual.",
    img: "https://picsum.photos/101/101",
    rating: 5,
  },
  {
    id: 2,
    name: "Ananya",
    role: "Regular User",
    text: "Excellent consultation. The app flow is clean and fast.",
    img: "https://picsum.photos/102/102",
    rating: 5,
  },
  {
    id: 3,
    name: "Karan",
    role: "New Patient",
    text: "Good appointment reminders and easy rescheduling.",
    img: "https://picsum.photos/103/103",
    rating: 4,
  },
  {
    id: 4,
    name: "Priya",
    role: "Healthcare Seeker",
    text: "Found a specialist quickly. The UI is very intuitive.",
    img: "https://picsum.photos/104/104",
    rating: 5,
  },
];

// Reads actual window width — bypasses react-slick's unreliable breakpoint system
function getSlidesToShow() {
  if (typeof window === "undefined") return 3;
  const w = window.innerWidth;
  if (w < 640) return 1;
  if (w < 1024) return 2;
  return 3;
}

const Testimonials = () => {
  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow);

  useEffect(() => {
    const handleResize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener("resize", handleResize);
    // Call once immediately on mount to catch any SSR mismatch
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow,        // ← JS-controlled, not slick's responsive array
    slidesToScroll: 1,
    centerMode: false,   // ← always off, no partial card bleed
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "ease-in-out",

    customPaging: () => (
      <div className="w-3 h-3 mx-1 bg-gray-300 rounded-full transition-all duration-300" />
    ),

    dotsClass: "slick-dots !bottom-[-30px] custom-dots",

    appendDots: (dots) => (
      <div>
        <ul className="m-0 flex justify-center">{dots}</ul>
        <style>{`
          .custom-dots li.slick-active div {
            background-color: #2563eb !important;
            transform: scale(1.2);
          }
        `}</style>
      </div>
    ),
  };

  return (
    <div className="py-12 sm:py-16 bg-white">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Star className="w-4 h-4 fill-blue-600" />
          <span className="text-base sm:text-lg">What our users say</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold text-blue-700 mt-4 mb-3">
          Trusted by Thousands
        </h2>

        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Real feedback from people using Prescripto to manage their healthcare journey
        </p>
      </div>

      {/* SLIDER */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <Slider {...settings}>
          {TestimonialData.map((t) => (
            <div key={t.id} className="px-2 sm:px-3 h-full">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-8 border border-blue-100 hover:border-blue-500 relative overflow-hidden group h-full">

                <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-50 rounded-full opacity-40 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mb-4 opacity-60 flex-shrink-0" />

                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 flex-1">
                    "{t.text}"
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-blue-100">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-blue-600 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-blue-800 text-sm sm:text-lg truncate">
                        {t.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {t.role}
                      </p>
                    </div>

                    <div className="flex gap-0.5 flex-shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < t.rating
                              ? "text-blue-600 fill-blue-600"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-6 sm:mt-8">
        <p className="text-gray-600 text-base">
          Over{" "}
          <span className="font-bold text-blue-600 text-lg">10,000+</span>{" "}
          happy patients
        </p>
      </div>

      <style>{`
        .slick-track {
          display: flex !important;
        }
        .slick-slide {
          height: inherit !important;
        }
        .slick-slide > div {
          height: 100%;
        }
        .slick-list {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Testimonials;