import React from "react";
import { useNavigate } from "react-router-dom";
import FuzzyText from "../components/FuzzyText";

const NotFound = () => {
  const navigate = useNavigate();
  const textLines = ["4 0 4", "N O T", "F O U N D"];

  return (
    <div className="fixed inset-0 min-h-screen w-full flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-white">
      
      {/* Fuzzy Text */}
      <div className="z-10 flex flex-col gap-2 lg:gap-3">
        {textLines.map((line, idx) => (
          <FuzzyText
            key={idx}
            fontWeight={900}
            color="rgb(67, 89, 255)"
            enableHover={true}
            baseIntensity={0.15}
            hoverIntensity={0.5}
            fontSize="clamp(2rem, 10vw, 6rem)"
          >
            {line}
          </FuzzyText>
        ))}
      </div>

      {/* Subtitle */}
      <p className="z-10 text-gray-700 text-lg sm:text-xl mt-4 font-medium">
        The page you’re looking for doesn’t exist.
      </p>

      {/* CTA */}
      <button
        onClick={() => navigate("/")}
        className="z-10 mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
      >
        Go Back Home →
      </button>

      {/* Floating Orbs */}
      <div className="absolute w-48 h-48 bg-blue-300/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-64 h-64 bg-indigo-400/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
    </div>
  );
};

export default NotFound;
