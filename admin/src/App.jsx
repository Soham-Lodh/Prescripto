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
import { DoctorContext } from "./context/DoctorContext.jsx";
import Messages from "./pages/Admin/Messages.jsx";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments.jsx";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className=" bg-gray-100">
      <NavBar />
      <ToastContainer />
      <div className="flex items-start">
        <SideBar />
        <div className="flex-1">
          <Routes>
            {/* Admin Routes */}
            {aToken && (
              <>
                <Route path="/" element={<Navigate to="/doctor-list" />} />
                <Route path="/all-appointments" element={<AllAppointments />} />
                <Route path="/add-doctor" element={<AddDoctors />} />
                <Route path="/doctor-list" element={<DoctorsList />} />
                <Route path="/messages" element={<Messages />} />
              </>
            )}

            {/* Doctor Routes */}
            {dToken && (
              <>
                <Route path="/" element={<Navigate to="/doctor-dashboard" />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor-profile" element={<DoctorProfile />} />
                <Route path="/doctor-appointments" element={<DoctorAppointments />} />
              </>
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <div className="mx-4 bg-gray-100 sm:mx-[10%]">
      <Login />
      <ToastContainer />
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
