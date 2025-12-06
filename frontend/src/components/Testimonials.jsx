import React from "react";
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

const Testimonials = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
    customPaging: (i) => (
      <div className="w-3 h-3 mx-1 bg-gray-300 rounded-full transition-all duration-300" />
    ),
    dotsClass: "slick-dots !bottom-[-40px] custom-dots",
    appendDots: (dots) => (
      <div>
        <ul style={{ margin: "0px" }}> {dots} </ul>
        <style>{`
          .custom-dots li.slick-active div {
            background-color: #2563eb !important;
            transform: scale(1.3);
          }
        `}</style>
      </div>
    ),
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto text-center mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Star className="w-4 h-4 fill-blue-600" />
          <span className="text-lg">What our users say</span>
        </div>
        <h2 className="text-4xl font-bold text-blue-700 mt-4 mb-3">
          Trusted by Thousands
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real feedback from people using Prescripto to manage their healthcare journey
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <Slider {...settings}>
          {TestimonialData.map((t) => (
            <div key={t.id} className="px-3">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full border-2 border-blue-100 hover:border-blue-600 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative z-10">
                  <Quote className="w-10 h-10 text-blue-600 mb-4 opacity-60" />
                  
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 min-h-[80px]">
                    "{t.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-blue-100">
                    <div className="relative">
                      <img 
                        src={t.img} 
                        alt={t.name} 
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-600"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-800 text-lg">
                        {t.name}
                      </h3>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                    
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
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
      
      <div className="text-center mt-8">
        <p className="text-gray-600 text-base text-xl">
          Over <span className="font-bold text-blue-600 text-lg">10,000+</span> happy patients
        </p>
      </div>
    </div>
  );
};

export default Testimonials;