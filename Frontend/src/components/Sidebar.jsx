import React from "react";
import Profile from "./Profile";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:relative z-20 h-full md:h-auto
        w-64 bg-[#141427] p-5 flex flex-col justify-between px-6 rounded-xl md:mb-6 md:mt-6 md:ml-4
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div>
          <Profile />

          <nav className="space-y-3 mt-8">
            <p
              onClick={() => navigate("/dashboard")}
              className={`cursor-pointer ${location.pathname === "/dashboard"
                  ? "text-purple-400 font-semibold"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              Dashboard
            </p>

            <p
              onClick={() => navigate("/room")}
              className={`cursor-pointer ${location.pathname.startsWith("/room")
                  ? "text-purple-400 font-semibold"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              Room
            </p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Overview</p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Analytics</p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Statistic</p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Settings</p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Support</p>
          </nav>
        </div>

        <button className="bg-[#1e1e2f] border border-gray-600 rounded-lg py-2 hover:bg-purple-600 transition">
          Logout
        </button>
      </div>
    </>
  );
}