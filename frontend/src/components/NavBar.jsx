import React, { useState } from "react";
import { assets } from "./../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between text-sm py-4 px-6 mb-5 border-b border-gray-400 relative">
      {/* Logo */}
      <img
        onClick={() => {
          navigate("/");
          scrollTo(0, 0);
        }}
        src={assets.logo}
        alt="Logo"
        className="w-44 cursor-pointer"
      />

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-5 font-medium">
        {["/", "/doctors", "/about", "/contact"].map((path, idx) => {
          const labels = ["HOME", "ALL DOCTORS", "ABOUT", "CONTACT"];
          return (
            <NavLink key={idx} to={path} className="relative group">
              <li className="py-1">{labels[idx]}</li>
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-[rgb(95,111,255)] group-hover:w-full transition-all duration-300" />
            </NavLink>
          );
        })}
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2.5 cursor-pointer relative group">
            <img
              src={assets.profile_pic}
              alt="User"
              className="w-8 rounded-full"
            />
            <img src={assets.dropdown_icon} alt="" className="w-4" />
            <div className="absolute top-12 right-0 min-w-[170px] bg-stone-100 rounded-xl flex flex-col gap-2 p-3 font-medium text-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p
                onClick={() => navigate("/my-profile")}
                className="hover:text-black cursor-pointer border-b border-gray-400 pb-1"
              >
                My Profile
              </p>
              <p
                onClick={() => navigate("/my-appointments")}
                className="hover:text-black cursor-pointer border-b border-gray-400 pb-1 pt-1"
              >
                My Appointments
              </p>
              <p
                onClick={() => setToken(false)}
                className="hover:text-black cursor-pointer pt-1"
              >
                Logout
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[rgb(95,111,255)] text-white px-6 py-2 rounded-full font-light hidden md:block hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300"
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          src={assets.menu_icon}
          alt="Menu"
          className="w-6 md:hidden cursor-pointer"
        />

        {/* Mobile Menu */}
        {/* Mobile Menu */}
        {showMenu && (
          <div className="fixed top-0 right-0 w-full h-full bg-gray-100 z-30 flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
              <img
                src={assets.logo}
                alt="Logo"
                className="w-36 cursor-pointer"
                onClick={() => {
                  navigate("/");
                  scrollTo(0, 0);
                  setShowMenu(false);
                }}
              />
              <img
                onClick={() => setShowMenu(false)}
                src={assets.cross_icon}
                alt="Close"
                className="w-6 cursor-pointer"
              />
            </div>
            <ul className="flex flex-col gap-6 text-lg font-medium">
              <NavLink onClick={() => setShowMenu(false)} to="/">
                Home
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/doctors">
                All Doctors
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/about">
                About
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/contact">
                Contact
              </NavLink>
            </ul>
            {!token && (
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="bg-[rgb(95,111,255)] text-white px-6 py-3 mt-6 rounded-full font-light hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300"
              >
                Create Account
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
