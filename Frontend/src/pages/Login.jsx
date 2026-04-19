import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { serverUrl, login, setLoading } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${serverUrl}/api/auth/login`, form);
      login(res.data.token);
      navigate("/dashboard");
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
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); }
          50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .av-wrap {
          position: relative;
          width: 80px;
          height: 80px;
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
        .session-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          margin-right: 5px;
          animation: pulse-dot 2s ease-in-out infinite;
          vertical-align: middle;
        }
        .left-panel {
          animation: fadeSlideIn 0.8s ease both;
        }
        .right-panel {
          animation: fadeSlideIn 0.8s ease 0.15s both;
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
        }
        .form-input::placeholder { color: #6b7280; }
        .form-input:focus { border-color: rgba(167,139,250,0.5); }
        @media (max-width: 768px) {
          .left-panel { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">

        {/* Outer wrapper — two columns */}
        <div className="w-full max-w-4xl flex items-center gap-12">

          {/* ── LEFT: Illustration Panel ── */}
          <div className="left-panel hidden md:flex flex-col items-center justify-center flex-1 gap-6">
            <img
              src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif"
              alt="Developer at work"
              className="w-full max-w-sm rounded-2xl"
              style={{ opacity: 0.9 }}
            />

            <div className="text-center">
              <h2 className="text-white text-2xl font-bold tracking-tight">
                Learn. Build.{" "}
                <span style={{
                  background: "linear-gradient(90deg, #a78bfa, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Grow.
                </span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xs">
                Your all-in-one platform for collaborative studying and focused productivity.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              {["Flashcards", "Quizzes", "Study Groups", "Progress Tracking"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full text-purple-300"
                  style={{ background: "rgba(139,92,246,0.12)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            className="hidden md:block self-stretch"
            style={{ width: "1px", background: "rgba(255,255,255,0.06)" }}
          />

          {/* ── RIGHT: Login Panel (no card box) ── */}
          <div className="right-panel w-full max-w-sm flex-shrink-0 py-8">

            {/* Avatar + Brand */}
            <div className="flex flex-col items-center mb-8">
              <div className="av-wrap">
                <div className="av-ring" />
                <div className="av-inner">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="#a78bfa">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
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

              <p className="text-xs mt-1 tracking-widest uppercase" style={{ color: "#6b7280" }}>
                <span className="session-dot" />
                Secure Portal
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
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
                style={{
                  background: "linear-gradient(90deg, #7c3aed, #4f46e5)",
                  marginTop: "8px",
                }}
                onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
                onMouseOut={e => e.currentTarget.style.opacity = "1"}
              >
                Login
              </button>
            </form>

            {/* Footer */}
            <p className="text-gray-400 text-sm mt-6 text-center">
              Don't have an account?{" "}
              <span
                className="text-purple-400 cursor-pointer hover:text-purple-300 transition"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;