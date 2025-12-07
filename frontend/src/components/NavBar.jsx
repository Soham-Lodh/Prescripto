import React, { useState, useRef, useEffect, useContext } from "react";
import { assets } from "./../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // SCROLL ANIMATION
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dropdownRef = useRef(null);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    setShowDropdown(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          scrolled
            ? "bg-white/90 backdrop-blur-md py-4 shadow-sm border-b border-gray-200"
            : "bg-transparent py-7"
        }`}
      >
        <div className="flex items-center justify-between text-sm px-6 max-w-7xl mx-auto">

          {/* LOGO */}
          <img
            src={assets.logo}
            alt="Logo"
            className="w-44 cursor-pointer hover:opacity-70 transition"
            onClick={() => {
              navigate("/");
              scrollTo(0, 0);
            }}
          />

          {/* DESKTOP LINKS (ALWAYS DARK) */}
          <ul className="hidden md:flex items-center gap-8 font-medium text-gray-800">
            {[
              { path: "/", label: "HOME" },
              { path: "/doctors", label: "ALL DOCTORS" },
              { path: "/about", label: "ABOUT" },
              { path: "/contact", label: "CONTACT" },
            ].map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => scrollTo(0, 0)}
                className={({ isActive }) =>
                  `relative py-2 transition-colors duration-300 ${
                    isActive
                      ? "text-blue-600 font-bold"
                      : "text-gray-800 hover:text-blue-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </ul>

          {/* RIGHT SIDE (ALWAYS DARK) */}
          <div className="flex items-center gap-4 text-gray-800">

            {/* USER LOGGED IN */}
            {token ? (
              <div
                className="flex items-center gap-2 cursor-pointer relative"
                ref={dropdownRef}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={userData.image}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                />

                <img
                  src={assets.dropdown_icon}
                  className={`w-4 transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />

                {showDropdown && (
                  <div className="absolute top-14 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="bg-blue-600 text-white p-4">
                      <p className="font-bold text-sm">{userData.name}</p>
                      <p className="text-xs">{userData.email}</p>
                    </div>

                    <div className="p-2">
                      <p
                        className="cursor-pointer px-4 py-3 hover:bg-blue-50 text-sm"
                        onClick={() => {
                          navigate("/my-profile");
                          setShowDropdown(false);
                        }}
                      >
                        My Profile
                      </p>
                      <p
                        className="cursor-pointer px-4 py-3 hover:bg-blue-50 text-sm"
                        onClick={() => {
                          navigate("/my-appointments");
                          setShowDropdown(false);
                        }}
                      >
                        My Appointments
                      </p>

                      <hr className="my-2" />

                      <p
                        className="cursor-pointer px-4 py-3 text-red-600 hover:bg-red-50"
                        onClick={logout}
                      >
                        Logout
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block bg-blue-600 text-white px-8 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition"
              >
                Create Account
              </button>
            )}

            {/* MOBILE MENU ICON */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-200 transition"
              onClick={() => setShowMenu(true)}
            >
              <img src={assets.menu_icon} className="w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* SPACER */}
      <div className="h-[84px]"></div>

      {/* FULLSCREEN OVERLAY MENU */}
      <div
        className={`fixed inset-0 bg-white z-40 flex flex-col justify-center items-center
          transition-all duration-500 ease-in-out
          ${
            showMenu
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-10 pointer-events-none"
          }`}
      >
        <button
          onClick={() => setShowMenu(false)}
          className="absolute top-6 right-6 text-3xl text-gray-700"
        >
          ✕
        </button>

        <ul className="flex flex-col items-center space-y-10 text-2xl font-semibold text-gray-800">
          <li onClick={() => { navigate("/"); setShowMenu(false); }}>Home</li>
          <li onClick={() => { navigate("/doctors"); setShowMenu(false); }}>All Doctors</li>
          <li onClick={() => { navigate("/about"); setShowMenu(false); }}>About</li>
          <li onClick={() => { navigate("/contact"); setShowMenu(false); }}>Contact</li>
        </ul>
      </div>
    </>
  );
};

export default NavBar;
