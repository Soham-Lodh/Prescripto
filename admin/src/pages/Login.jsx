import React, { useState, useContext } from 'react';
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import {toast} from "react-toastify";
const Login = () => {
  const [state, setState] = useState("Admin");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
        if (data.success) {
          localStorage.setItem("aToken",data.token);
          setAToken(data.token);
          toast.success("Logged in succesfully");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data || err.message);    
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col gap-6 p-8 w-full max-w-md border rounded-2xl bg-white shadow-lg text-gray-700">
        <p className="text-3xl font-semibold text-center">
          <span className="text-[rgb(95,111,255)]">{state}</span> Login
        </p>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium">Email</label>
          <input 
            type="email" 
            placeholder="Enter Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[rgb(95,111,255)] transition"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium">Password</label>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[rgb(95,111,255)] transition"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-[rgb(95,111,255)] text-white font-semibold rounded-full shadow-md transition-all duration-300
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5 hover:shadow-lg"}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {state === "Admin" ? (
          <p className="text-center text-sm text-gray-500">
            Doctor Login?{" "}
            <span 
              className="text-[rgb(95,111,255)] font-medium cursor-pointer hover:underline"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p className="text-center text-sm text-gray-500">
            Admin Login?{" "}
            <span 
              className="text-[rgb(95,111,255)] font-medium cursor-pointer hover:underline"
              onClick={() => setState("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
