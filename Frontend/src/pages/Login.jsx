import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

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

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const res = await axios.post(`${serverUrl}/api/auth/google`, {
                credential: credentialResponse.credential,
            });
            login(res.data.token);
            navigate("/dashboard"); // ✅ navigate after Google login
        } catch (error) {
            console.log(error);
            alert("Google login failed. Please try again.");
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
                .left-panel { animation: fadeSlideIn 0.8s ease both; }
                .right-panel { animation: fadeSlideIn 0.8s ease 0.15s both; }
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
                .divider-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.08);
                }
                .google-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 11px 16px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.10);
                    color: #e5e7eb;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s, border-color 0.2s;
                    position: relative;
                    box-sizing: border-box;
                }
                .google-btn:hover {
                    background: rgba(255,255,255,0.09);
                    border-color: rgba(255,255,255,0.18);
                }
                .google-btn-hidden {
                    position: absolute;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    cursor: pointer;
                }
                /* Hide default Google button rendered inside */
                .google-btn-hidden iframe,
                .google-btn-hidden div {
                    width: 100% !important;
                    height: 100% !important;
                }
                @media (max-width: 768px) {
                    .left-panel { display: none !important; }
                }
            `}</style>

            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
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

                    {/* ── RIGHT: Login Panel ── */}
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

                        {/* OR Divider */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
                            <div className="divider-line" />
                            <span style={{ color: "#4b5563", fontSize: "13px", whiteSpace: "nowrap" }}>or continue with</span>
                            <div className="divider-line" />
                        </div>

                        {/* Custom Google Button */}
                        <div className="google-btn" style={{ position: "relative", overflow: "hidden" }}>
                            {/* Google "G" SVG logo */}
                            <svg width="18" height="18" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.09-6.09C34.46 3.1 29.5 1 24 1 14.82 1 7.07 6.48 3.58 14.21l7.1 5.52C12.4 13.74 17.74 9.5 24 9.5z"/>
                                <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.67c-.55 2.94-2.2 5.43-4.67 7.1l7.18 5.58C43.27 37.28 46.52 31.36 46.52 24.5z"/>
                                <path fill="#FBBC05" d="M10.68 28.27A14.6 14.6 0 0 1 9.5 24c0-1.49.26-2.93.68-4.27l-7.1-5.52A23.94 23.94 0 0 0 0 24c0 3.87.93 7.53 2.58 10.79l7.1-5.52z"/>
                                <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.95l-7.18-5.58c-1.8 1.21-4.1 1.93-6.32 1.93-6.26 0-11.6-4.24-13.32-9.93l-7.1 5.52C7.07 41.52 14.82 47 24 47z"/>
                                <path fill="none" d="M0 0h48v48H0z"/>
                            </svg>
                            <span>Continue with Google</span>

                            {/* Invisible real GoogleLogin overlaid on top */}
                            <div style={{
                                position: "absolute",
                                top: 0, left: 0,
                                width: "100%", height: "100%",
                                opacity: 0,
                                cursor: "pointer",
                            }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => alert("Google login failed.")}
                                    width="400"
                                />
                            </div>
                        </div>

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