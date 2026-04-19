import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { serverUrl, setLoading } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${serverUrl}/api/auth/register`, form);
      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes morph {
          0%, 100% { border-radius: 28% 72% 38% 62% / 46% 38% 62% 54%; }
          33%       { border-radius: 62% 38% 54% 46% / 38% 62% 38% 62%; }
          66%       { border-radius: 46% 54% 62% 38% / 54% 46% 54% 46%; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .av-wrap {
          position: relative;
          width: 72px;
          height: 72px;
          margin: 0 auto 1rem;
        }
        .av-ring {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #7b5cf5, #d946ef, #3b82f6);
          border-radius: 28% 72% 38% 62% / 46% 38% 62% 54%;
          animation: morph 6s ease-in-out infinite;
          z-index: 0;
        }
        .av-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          background: #0f172a;
          border-radius: 26% 70% 36% 60% / 44% 36% 60% 52%;
          animation: morph 6s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .form-input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          color: white;
          border: 1px solid rgba(255,255,255,0.08);
          outline: none;
          font-size: 15px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .form-input::placeholder { color: #6b7280; }
        .form-input:focus { border-color: rgba(167,139,250,0.5); }
        .right-panel { animation: fadeSlideIn 0.8s ease both; }
      `}</style>

      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">

        {/* ── Form Panel ── */}
        <div className="right-panel w-full max-w-sm py-8">

          {/* Avatar + Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="av-wrap">
              <div className="av-ring" />
              <div className="av-inner">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#a78bfa">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight">
              Study
              <span style={{
                background: "linear-gradient(90deg, #a78bfa, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Hive
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Create your free account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="form-input"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="form-input"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold transition"
              style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5)", marginTop: "8px" }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              Create Account
            </button>
          </form>

          {/* Terms */}
          <p className="text-gray-600 text-xs mt-4 text-center">
            By registering, you agree to our{" "}
            <span className="text-purple-500 cursor-pointer">Terms</span>
            {" "}&{" "}
            <span className="text-purple-500 cursor-pointer">Privacy Policy</span>
          </p>

          {/* Footer */}
          <p className="text-gray-400 text-sm mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-purple-400 cursor-pointer hover:text-purple-300 transition"
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </p>
        </div>

      </div>
    </>
  );
};

export default Register;