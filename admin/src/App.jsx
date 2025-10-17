import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./context/AdminContext.jsx";
import NavBar from "./components/NavBar.jsx";
import SideBar from "./components/SideBar.jsx";
import { Routes, Route } from "react-router-dom";
import AllAppointments from "./pages/Admin/AllAppointments.jsx";
import AddDoctors from "./pages/Admin/AddDoctor.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";
import NotFound from "./pages/NotFound.jsx";
const App = () => {
  const { aToken } = useContext(AdminContext);
  return aToken ? (
    <div className=" bg-gray-100">
      <NavBar />
      <ToastContainer />
      <div className="flex items-start">
        <SideBar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/doctor-list" />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-doctor" element={<AddDoctors />} />
            <Route path="/doctor-list" element={<DoctorsList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
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
