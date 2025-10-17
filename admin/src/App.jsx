import React, { useContext } from "react";
import Login from "./pages/Login.jsx";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./context/AdminContext.jsx";
import NavBar from "./components/NavBar.jsx";
import SideBar from "./components/SideBar.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import { Routes, Route } from "react-router-dom";
import AllAppointments from "./pages/Admin/AllAppointments.jsx";
import AddDoctors from "./pages/Admin/AddDoctor.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";
const App = () => {
  const { aToken } = useContext(AdminContext);
  return aToken ? (
    <div className=" bg-gray-100">
      <NavBar />
      <ToastContainer />
      <div className="flex items-start">
        <SideBar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctors />} />
          <Route path="/doctor-list" element={<DoctorsList />} />
        </Routes>
      </div>
    </div>
  ) : (
    <div className="mx-4 bg-gray-100 sm:mx-[10%]">
      <Login />
      <ToastContainer />
    </div>
  );
};

export default App;
