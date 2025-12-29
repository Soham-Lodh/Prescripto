import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AOS from "aos";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { backendURL, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.refreshHard();
  }, []);

  if (localStorage.getItem("token")) navigate("/");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url =
        state === "Sign Up"
          ? `${backendURL}/api/user/register`
          : `${backendURL}/api/user/login`;

      const payload =
        state === "Sign Up"
          ? { name, email, password }
          : { email, password };

      const { data } = await axios.post(url, payload);

      if (!data.success) return toast.error(data.message);

      toast.success(
        state === "Sign Up" ? "Account created!" : "Login successful!"
      );
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-10 relative">

      {/* FORM WRAPPER (not animated) */}
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-2xl rounded-3xl p-8 sm:p-10 w-full max-w-md relative z-10">

        {/* HEADER */}
        <div className="text-center space-y-2 mb-8">
          <div
            data-aos="zoom-in"
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <h2 data-aos="fade-down" className="text-3xl font-bold text-gray-900">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </h2>

          <p data-aos="fade-up" data-aos-delay="100" className="text-gray-500 text-sm">
            {state === "Sign Up"
              ? "Sign up to book your first appointment"
              : "Login to manage your bookings"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">

          {state === "Sign Up" && (
            <input
              data-aos="fade-up"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-xl py-3 px-4"
            />
          )}

          <input
            data-aos="fade-up"
            data-aos-delay="100"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-xl py-3 px-4"
          />

          <div data-aos="fade-up" data-aos-delay="200" className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-xl py-3 px-4 pr-20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            data-aos="zoom-in"
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 rounded-xl mt-2"
          >
            {loading
              ? "Processing..."
              : state === "Sign Up"
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        {/* BACK TO HOME */}
        <button
          type="button"
          data-aos="fade-up"
          data-aos-delay="150"
          onClick={() => navigate("/")}
          className="w-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-bold py-3.5 rounded-xl mt-3 hover:from-blue-100 hover:to-blue-200 transition-all"
        >
          ← Back to home
        </button>

        {/* SWITCH (NO AOS — FIXED) */}
        <div className="text-center text-sm text-gray-600 mt-6">
          {state === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setState("Login")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setState("Sign Up")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
