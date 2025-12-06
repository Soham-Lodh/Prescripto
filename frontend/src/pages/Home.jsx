import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Prescripto | Book Doctor Appointments Online</title>
        <meta
          name="description"
          content="Book appointments with trusted doctors across various specialities. Prescripto offers a seamless healthcare experience with real-time availability."
        />
        <meta name="keywords" content="doctor appointment, healthcare, medical booking, physicians, specialists" />
      </Helmet>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
};

export default Home;