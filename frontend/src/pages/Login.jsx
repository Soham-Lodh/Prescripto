import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
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
        state === "Sign Up" ? { name, email, password } : { email, password };

      const { data } = await axios.post(url, payload);
      if (data.success) {
        toast.success(state === "Sign Up" ? "Account created!" : "Login successful!");
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/");
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white border border-gray-200 shadow-2xl rounded-3xl p-8 sm:p-10 w-full max-w-md flex flex-col gap-5 text-gray-700"
      >
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-500 text-sm">
            {state === "Sign Up"
              ? "Sign up to book your first appointment"
              : "Login to manage your bookings"}
          </p>
        </div>

        {/* Full Name */}
        {state === "Sign Up" && (
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="border border-gray-300 rounded-xl py-2.5 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            className="border border-gray-300 rounded-xl py-2.5 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col relative">
          <label className="text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="border border-gray-300 rounded-xl py-2.5 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-xs text-blue-600 hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-bold py-2.5 rounded-xl mt-2 hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 1v4a7 7 0 00-7 7h-1z"
                ></path>
              </svg>
              <span>Processing...</span>
            </div>
          ) : state === "Sign Up" ? (
            "Create Account"
          ) : (
            "Login"
          )}
        </button>

        {/* Switch Mode */}
        <div className="text-center text-sm text-gray-600">
          {state === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => setState("Login")}
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don’t have an account?{" "}
              <button
                type="button"
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => setState("Sign Up")}
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
