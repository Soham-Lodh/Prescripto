import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import Appointments from "./pages/Appointments";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";

const App = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

  return (
    <div className="mx-4 sm:mx-[10%]">
      {!hideLayout && <NavBar />}
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/appointments/:docId" element={<Appointments />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
