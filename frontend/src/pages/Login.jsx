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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        :root {
          --blue-600: #185FA5;
          --blue-500: #378ADD;
          --blue-400: #5B9FE5;
          --blue-300: #7DBAF0;
          --blue-200: #85B7EB;
          --blue-100: #B5D4F4;
          --blue-50:  #E6F1FB;
          --text-dark: #1a2b3c;
          --text-mid:  #4a6380;
          --text-soft: #8899a6;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: var(--blue-50);
        }

        /* ── LEFT PANEL ── */
        .panel-left {
          position: relative;
          background: linear-gradient(145deg, var(--blue-600) 0%, var(--blue-500) 60%, var(--blue-400) 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem 3.5rem;
          overflow: hidden;
        }

        .panel-left::before {
          content: '';
          position: absolute;
          top: -140px; right: -140px;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }

        .panel-left::after {
          content: '';
          position: absolute;
          bottom: -100px; left: -80px;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
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
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
        }

        .brand-dot svg { width: 18px; height: 18px; stroke: #fff; fill: none; }

        .brand-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
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
          font-size: clamp(2.2rem, 3.2vw, 3rem);
          font-weight: 700;
          line-height: 1.12;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .headline-text span {
          color: var(--blue-100);
        }

        .headline-sub {
          font-size: 0.95rem;
          line-height: 1.75;
          color: rgba(255,255,255,0.65);
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
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }

        .pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--blue-100);
        }

        .panel-footer-left {
          font-size: 0.74rem;
          color: rgba(255,255,255,0.3);
        }

        /* ── RIGHT PANEL ── */
        .panel-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2.5rem;
          background: #fff;
        }

        .form-shell {
          width: 100%;
          max-width: 400px;
        }

        .form-header {
          margin-bottom: 2rem;
        }

        .form-eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--blue-500);
          margin-bottom: 0.65rem;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.15;
          color: var(--text-dark);
          letter-spacing: -0.02em;
        }

        .form-title span {
          color: var(--blue-500);
        }

        .form-subtitle {
          margin-top: 0.5rem;
          font-size: 0.88rem;
          color: var(--text-soft);
          font-weight: 400;
          line-height: 1.6;
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
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--text-mid);
          margin-bottom: 5px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .field-input {
          width: 100%;
          background: var(--blue-50);
          border: 1.5px solid var(--blue-100);
          border-radius: 10px;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          color: var(--text-dark);
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          outline: none;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: #aab8c8; }

        .field-input:focus {
          border-color: var(--blue-500);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(55, 138, 221, 0.14);
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
          font-size: 0.74rem;
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
          background: var(--blue-500);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 0.75rem;
          box-shadow: 0 4px 14px rgba(55, 138, 221, 0.35);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--blue-600);
          box-shadow: 0 6px 20px rgba(55, 138, 221, 0.4);
        }
        .btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; box-shadow: none; }

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
          border: 1.5px solid var(--blue-200);
          border-radius: 10px;
          background: var(--blue-50);
          color: var(--blue-600);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          letter-spacing: 0.01em;
        }

        .btn-secondary:hover { background: var(--blue-100); border-color: var(--blue-300); }

        /* ── DIVIDER ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.1rem 0;
          color: var(--text-soft);
          font-size: 0.74rem;
          font-weight: 500;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1;
          height: 1px;
          background: var(--blue-100);
        }

        /* ── SWITCH ── */
        .switch-text {
          text-align: center;
          margin-top: 1.1rem;
          font-size: 0.84rem;
          color: var(--text-soft);
        }

        .switch-text button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--blue-500);
          text-decoration: underline;
          text-underline-offset: 2px;
          padding: 0;
          transition: color 0.15s;
        }

        .switch-text button:hover { color: var(--blue-600); }

        /* ── TABLET: 820px – 1024px ── */
        @media (max-width: 1024px) {
          .panel-left {
            padding: 2.25rem 2rem;
          }
          .headline-text {
            font-size: 2rem;
          }
          .panel-right {
            padding: 2.25rem 1.75rem;
          }
        }

        /* ── TABLET PORTRAIT: collapse left panel, show banner strip ── */
        @media (max-width: 820px) {
          .login-root {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            min-height: 100vh;
          }
          .panel-left {
            padding: 1.5rem 2rem;
            min-height: unset;
          }
          .panel-left::before, .panel-left::after { display: none; }
          .panel-left-inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: auto;
          }
          .panel-headline { display: none; }
          .panel-footer-left { display: none; }
          .trust-pills { display: none; }
          .panel-right {
            padding: 2.5rem 1.5rem;
            align-items: center;
          }
        }

        /* ── MOBILE ── */
        @media (max-width: 480px) {
          .panel-left { padding: 1.25rem 1.25rem; }
          .panel-right { padding: 2rem 1.25rem; }
          .form-title { font-size: 1.7rem; }
        }
      `}</style>

      <div className="login-root">

        {/* ── LEFT PANEL ── */}
        <div className="panel-left">
          <div className="panel-left-inner">

            <div
              className="brand-mark"
              data-aos="fade-right"
              data-aos-duration="600"
              data-aos-once="true"
            >
              <div className="brand-dot">
                <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <span className="brand-name">MediBook</span>
            </div>

            <div className="panel-headline">
              <h1
                className="headline-text"
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay="200"
                data-aos-once="true"
              >
                Your health,<br />
                <span>managed</span> with<br />
                clarity.
              </h1>
              <p
                className="headline-sub"
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay="350"
                data-aos-once="true"
              >
                Book appointments, track your health history, and stay connected with your care team — all in one place.
              </p>
              <div
                className="trust-pills"
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay="500"
                data-aos-once="true"
              >
                <span className="pill"><span className="pill-dot" />Verified Doctors</span>
                <span className="pill"><span className="pill-dot" />Instant Booking</span>
                <span className="pill"><span className="pill-dot" />Secure Records</span>
              </div>
            </div>

            <p
              className="panel-footer-left"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="650"
              data-aos-once="true"
            >
              © 2025 MediBook. All rights reserved.
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="panel-right">
          <div className="form-shell">

            <div
              className="form-header"
              data-aos="fade-down"
              data-aos-duration="600"
              data-aos-once="true"
            >
              <p className="form-eyebrow">
                {state === "Sign Up" ? "New here?" : "Welcome back"}
              </p>
              <h2 className="form-title">
                {state === "Sign Up"
                  ? <><span>Create</span> your account</>
                  : <><span>Sign</span> back in</>}
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
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    data-aos-once="true"
                  >
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

                <div
                  data-aos="fade-up"
                  data-aos-duration="500"
                  data-aos-delay="200"
                  data-aos-once="true"
                >
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

                <div
                  data-aos="fade-up"
                  data-aos-duration="500"
                  data-aos-delay="300"
                  data-aos-once="true"
                >
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
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay="400"
                data-aos-once="true"
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
              data-aos-duration="500"
              data-aos-delay="460"
              data-aos-once="true"
            >
              ← Back to Home
            </button>

            <div
              className="switch-text"
            >
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