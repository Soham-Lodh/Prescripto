import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
const NavBar = () => {
  const navigate = useNavigate();
  const { aToken, setAToken } = useContext(AdminContext);
  const logout = () => {
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    toast.success("Logged out successfully");
    navigate("/");
  };
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b">
      <div className="flex items-center gap-2 text-lg">
        <button className="" onClick={() => navigate("/")}>
          <img
            src={assets.admin_logo}
            alt="Admin Logo"
            className="w-36 sm:w-40 cursor-pointer"
          />
        </button>
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-[rgb(95,111,255)] text-white text-lg px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default NavBar;
