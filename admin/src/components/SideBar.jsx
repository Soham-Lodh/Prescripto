import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const SideBar = () => {
  const { aToken } = useContext(AdminContext);

  return (
    <div className="bg-gray-200">
      {aToken && (
        <ul className="text-[#515151]">

          <NavLink
            to="/all-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 min-w-72 cursor-pointer ${isActive
                ? "border-l-4 border-[rgb(95,111,255)] bg-gray-100"
                : ""
              }`
            }
          >
            <img src={assets.appointment_icon} alt="appointment icon" />
            <p>Appointments</p>
          </NavLink>

          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 min-w-72 cursor-pointer ${isActive
                ? "border-l-4 border-[rgb(95,111,255)] bg-gray-100"
                : ""
              }`
            }
          >
            <img src={assets.add_icon} alt="add icon" />
            <p>Add Doctor</p>
          </NavLink>

          <NavLink
            to="/doctor-list"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 min-w-72 cursor-pointer ${isActive
                ? "border-l-4 border-[rgb(95,111,255)] bg-gray-100"
                : ""
              }`
            }
          >
            <img src={assets.people_icon} alt="people icon" />
            <p>Doctors List</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default SideBar;
