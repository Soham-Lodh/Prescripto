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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --blue-900: #042C53;
          --blue-800: #0C447C;
          --blue-600: #185FA5;
          --blue-500: #378ADD;
          --blue-200: #85B7EB;
          --blue-100: #B5D4F4;
          --blue-50:  #E6F1FB;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: #f8f9fb;
        }

        /* ── LEFT PANEL ── */
        .panel-left {
          position: relative;
          background: var(--blue-900);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem 3.5rem;
          overflow: hidden;
        }

        .panel-left::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: var(--blue-800);
          opacity: 0.45;
        }

        .panel-left::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 340px; height: 340px;
          border-radius: 50%;
          background: var(--blue-600);
          opacity: 0.25;
        }

        .panel-left-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
        }

        .brand-mark {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-dot {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: var(--blue-500);
          display: flex; align-items: center; justify-content: center;
        }

        .brand-dot svg { width: 18px; height: 18px; stroke: #fff; fill: none; }

        .brand-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.01em;
        }

        .panel-headline {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.5rem;
        }

        .headline-text {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.4rem, 3.5vw, 3.2rem);
          line-height: 1.1;
          color: #fff;
          font-style: italic;
        }

        .headline-text em {
          font-style: normal;
          color: var(--blue-200);
        }

        .headline-sub {
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.5);
          max-width: 340px;
          font-weight: 300;
        }

        .trust-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.65);
          font-weight: 400;
        }

        .pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--blue-200);
        }

        .panel-footer-left {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
        }

        /* ── RIGHT PANEL ── */
        .panel-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2.5rem;
          background: #fff;
          position: relative;
        }

        .form-shell {
          width: 100%;
          max-width: 400px;
        }

        .form-header {
          margin-bottom: 2.25rem;
        }

        .form-eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--blue-500);
          margin-bottom: 0.75rem;
        }

        .form-title {
          font-family: 'Instrument Serif', serif;
          font-size: 2.2rem;
          line-height: 1.1;
          color: var(--blue-900);
          font-style: italic;
        }

        .form-title em {
          font-style: normal;
          color: var(--blue-600);
        }

        .form-subtitle {
          margin-top: 0.6rem;
          font-size: 0.88rem;
          color: #6b7280;
          font-weight: 300;
        }

        /* ── FIELDS ── */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .field-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--blue-800);
          margin-bottom: 5px;
          letter-spacing: 0.03em;
        }

        .field-input {
          width: 100%;
          background: var(--blue-50);
          border: 1.5px solid transparent;
          border-radius: 10px;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          color: var(--blue-900);
          transition: border-color 0.2s, background 0.2s;
          outline: none;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: #aab3c0; }

        .field-input:focus {
          border-color: var(--blue-500);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(55, 138, 221, 0.12);
        }

        .field-input:disabled { opacity: 0.55; cursor: not-allowed; }

        .password-wrap { position: relative; }

        .password-wrap .field-input { padding-right: 70px; }

        .show-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--blue-500);
          font-family: 'DM Sans', sans-serif;
          padding: 4px 6px;
          letter-spacing: 0.03em;
        }

        /* ── BUTTONS ── */
        .btn-primary {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: var(--blue-900);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .btn-primary:hover:not(:disabled) { background: var(--blue-800); }
        .btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

        .btn-primary .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .btn-secondary {
          width: 100%;
          padding: 13px;
          border: 1.5px solid var(--blue-100);
          border-radius: 10px;
          background: var(--blue-50);
          color: var(--blue-600);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          letter-spacing: 0.01em;
        }

        .btn-secondary:hover { background: var(--blue-100); border-color: var(--blue-200); }

        /* ── DIVIDER ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.25rem 0;
          color: #c8d3de;
          font-size: 0.75rem;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1;
          height: 1px;
          background: #e8edf2;
        }

        /* ── SWITCH ── */
        .switch-text {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.84rem;
          color: #8899a6;
        }

        .switch-text button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--blue-600);
          text-decoration: underline;
          text-underline-offset: 2px;
          padding: 0;
        }

        .switch-text button:hover { color: var(--blue-800); }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .login-root { grid-template-columns: 1fr; }
          .panel-left { display: none; }
          .panel-right { padding: 2rem 1.5rem; min-height: 100vh; }
        }
      `}</style>

      <div className="login-root">

        {/* ── LEFT PANEL ── */}
        <div className="panel-left">
          <div className="panel-left-inner">

            <div className="brand-mark">
              <div className="brand-dot">
                <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <span className="brand-name">MediBook</span>
            </div>

            <div className="panel-headline">
              <h1 className="headline-text" data-aos="fade-up">
                Your health,<br />
                <em>managed</em> with<br />
                clarity.
              </h1>
              <p className="headline-sub" data-aos="fade-up" data-aos-delay="80">
                Book appointments, track your health history, and stay connected with your care team — all in one place.
              </p>
              <div className="trust-pills" data-aos="fade-up" data-aos-delay="160">
                <span className="pill"><span className="pill-dot" />Verified Doctors</span>
                <span className="pill"><span className="pill-dot" />Instant Booking</span>
                <span className="pill"><span className="pill-dot" />Secure Records</span>
              </div>
            </div>

            <p className="panel-footer-left">© 2025 MediBook. All rights reserved.</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="panel-right">
          <div className="form-shell">

            <div className="form-header" data-aos="fade-down">
              <p className="form-eyebrow">
                {state === "Sign Up" ? "New here?" : "Welcome back"}
              </p>
              <h2 className="form-title">
                {state === "Sign Up"
                  ? <><em>Create</em> your account</>
                  : <><em>Sign</em> back in</>}
              </h2>
              <p className="form-subtitle">
                {state === "Sign Up"
                  ? "Book your first appointment in under 2 minutes."
                  : "Access your bookings and health records."}
              </p>
            </div>

            <form onSubmit={onSubmitHandler}>
              <div className="field-group">

                {state === "Sign Up" && (
                  <div data-aos="fade-up">
                    <label className="field-label">Full Name</label>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                <div data-aos="fade-up" data-aos-delay="60">
                  <label className="field-label">Email Address</label>
                  <input
                    className="field-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div data-aos="fade-up" data-aos-delay="120">
                  <label className="field-label">Password</label>
                  <div className="password-wrap">
                    <input
                      className="field-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="show-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                data-aos="zoom-in"
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  state === "Sign Up" ? "Create Account →" : "Sign In →"
                )}
              </button>
            </form>

            <div className="divider">or</div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/")}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              ← Back to Home
            </button>

            <div className="switch-text">
              {state === "Sign Up" ? (
                <p>
                  Already have an account?{" "}
                  <button onClick={() => setState("Login")}>Sign in</button>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => setState("Sign Up")}>Create one</button>
                </p>
              )}
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default Login;