import React from 'react';
import {useNavigate} from 'react-router-dom';
import FuzzyText from "../components/FuzzyText";
const NotFound = () => {
    const navigate = useNavigate();
    const textLines = ["4 0 4", "N O T","F O U N D"];
  return (
    <div
      className="h-[80vh] flex flex-col gap-4 justify-center items-center text-center cursor-pointer px-4 text-xl lg:text-3xl"
      onClick={() => navigate("/")}
    >
      {textLines.map((line, idx) => (
        <FuzzyText
          key={idx}
          fontWeight={900}
          color="rgb(95,111,255)"
          enableHover={true}
          baseIntensity={0.18}
          hoverIntensity={0.5}
          fontSize="clamp(2rem, 10vw, 6rem)"
        >
          {line}
        </FuzzyText>
      ))}
    </div>
  );
};

export default NotFound;