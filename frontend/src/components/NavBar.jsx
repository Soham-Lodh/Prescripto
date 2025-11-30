import React, { useState, useRef, useEffect, useContext } from "react";
import { assets } from "./../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm py-4 px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <img
            onClick={() => {
              navigate("/");
              scrollTo(0, 0);
            }}
            src={assets.logo}
            alt="Logo"
            className="w-44 cursor-pointer hover:opacity-80 transition-opacity"
          />

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 font-medium">
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
                      ? "text-[rgb(95,111,255)] font-bold"
                      : "text-gray-700 hover:text-[rgb(95,111,255)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <li>{item.label}</li>
                    <span
                      className={`absolute left-0 bottom-0 h-0.5 bg-[rgb(95,111,255)] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {token ? (
              <div
                className="flex items-center gap-2.5 cursor-pointer relative"
                ref={dropdownRef}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <img
                  src={userData.image}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-[rgb(95,111,255)] transition-all duration-300 object-cover shadow-sm"
                />
                <img
                  src={assets.dropdown_icon}
                  alt=""
                  className={`w-4 transition-transform duration-300 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />

                {showDropdown && (
                  <div className="absolute top-14 right-0 min-w-[200px] bg-white rounded-xl flex flex-col shadow-2xl border border-gray-200 overflow-hidden z-20">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                      <p className="font-bold text-sm truncate">
                        {userData.name || "User"}
                      </p>
                      <p className="text-xs text-blue-100 truncate mt-0.5">
                        {userData.email || ""}
                      </p>
                    </div>
                    <div className="p-2">
                      <p
                        onClick={() => {
                          navigate("/my-profile");
                          setShowDropdown(false);
                        }}
                        className="hover:bg-blue-50 cursor-pointer px-4 py-3 rounded-lg text-gray-700 hover:text-[rgb(95,111,255)] transition-all font-medium text-sm flex items-center gap-3"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        My Profile
                      </p>
                      <p
                        onClick={() => {
                          navigate("/my-appointments");
                          setShowDropdown(false);
                        }}
                        className="hover:bg-blue-50 cursor-pointer px-4 py-3 rounded-lg text-gray-700 hover:text-[rgb(95,111,255)] transition-all font-medium text-sm flex items-center gap-3"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        My Appointments
                      </p>
                      <hr className="my-2 border-gray-200" />
                      <p
                        onClick={logout}
                        className="hover:bg-red-50 cursor-pointer px-4 py-3 rounded-lg text-red-600 hover:text-red-700 transition-all font-medium text-sm flex items-center gap-3"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-2.5 rounded-full font-semibold hidden md:block hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
              >
                Create Account
              </button>
            )}

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setShowMenu(true)}
              className="w-10 h-10 md:hidden cursor-pointer flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img src={assets.menu_icon} alt="Menu" className="w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-[72px]"></div>

      {/* Mobile Menu */}
      {showMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowMenu(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <img
                src={assets.logo}
                alt="Logo"
                className="w-32 cursor-pointer brightness-0 invert"
                onClick={() => {
                  navigate("/");
                  scrollTo(0, 0);
                  setShowMenu(false);
                }}
              />
              <button
                onClick={() => setShowMenu(false)}
                className="w-9 h-9 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"
              >
                <img
                  src={assets.cross_icon}
                  alt="Close"
                  className="w-5 brightness-0 invert"
                />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-6">
              <ul className="flex flex-col gap-2">
                {[
                  { path: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                  { path: "/doctors", label: "All Doctors", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
                  { path: "/about", label: "About", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                  { path: "/contact", label: "Contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                ].map((item, idx) => (
                  <NavLink
                    key={idx}
                    onClick={() => setShowMenu(false)}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 flex items-center gap-3 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "text-gray-700 hover:bg-blue-50 hover:text-[rgb(95,111,255)] hover:pl-6"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
              </ul>

              {token ? (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={userData.image}
                      alt="User"
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {userData.name || "User"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {userData.email || ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setShowMenu(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 mt-6 rounded-xl font-bold w-full hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </button>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;