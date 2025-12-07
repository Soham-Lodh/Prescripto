import React from "react";
import { Helmet } from "react-helmet-async";

import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Prescripto | Book Doctor Appointments Online</title>
        <meta
          name="description"
          content="Book appointments with trusted doctors across various specialities. Prescripto offers a seamless healthcare experience with real-time availability."
        />
        <meta
          name="keywords"
          content="doctor appointment, healthcare, medical booking, physicians, specialists"
        />
      </Helmet>

      <div data-aos="fade-up" data-aos-delay="0">
        <Header />
      </div>

      <div data-aos="fade-up" data-aos-delay="150">
        <SpecialityMenu />
      </div>

      <div data-aos="fade-up" data-aos-delay="250">
        <TopDoctors />
      </div>

      <div data-aos="zoom-in" data-aos-delay="350">
        <Banner />
      </div>

      <div data-aos="fade-up" data-aos-delay="450">
        <Testimonials />
      </div>
    </div>
  );
};

export default Home;
