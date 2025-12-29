import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ---------- SCROLL EFFECT ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/");
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md border-b"
            : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 max-w-7xl mx-auto">
          {/* LOGO */}
          <img
            src={assets.logo}
            alt="Logo"
            className="w-44 cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* DESKTOP LINKS */}
          <nav className="hidden md:flex gap-8 font-medium text-gray-800">
            <NavLink to="/">HOME</NavLink>
            <NavLink to="/doctors">ALL DOCTORS</NavLink>
            <NavLink to="/about">ABOUT</NavLink>
            <NavLink to="/contact">CONTACT</NavLink>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {!token ? (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block bg-blue-600 text-white px-8 py-2.5 rounded-full font-semibold"
              >
                Create Account
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <img
                  src={userData?.image}
                  alt="user"
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <button onClick={logout} className="text-red-600 font-semibold">
                  Logout
                </button>
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setMobileOpen((p) => !p)}
            >
              <img src={assets.menu_icon} className="w-6" alt="menu" />
            </button>
          </div>
        </div>
      </header>

      {/* SPACER */}
      <div className="h-20" />

      {/* FULL SCREEN MOBILE SIDEBAR */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8 text-xl font-bold">
            <NavLink to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
            <NavLink to="/doctors" onClick={() => setMobileOpen(false)}>All Doctors</NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)}>About</NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)}>Contact</NavLink>

            <hr className="w-1/2 border-gray-300" />

            {!token ? (
              <NavLink
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="bg-blue-600 text-white px-12 py-4 rounded-full"
              >
                Create Account
              </NavLink>
            ) : (
              <>
                <NavLink to="/my-profile" onClick={() => setMobileOpen(false)}>
                  My Profile
                </NavLink>
                <NavLink to="/my-appointments" onClick={() => setMobileOpen(false)}>
                  My Appointments
                </NavLink>
                <button onClick={logout} className="text-red-600">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
