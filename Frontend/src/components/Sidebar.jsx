import React from "react";
import Profile from "./Profile";
import { Navigate, useNavigate } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
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
            <p  className="text-gray-400 hover:text-white cursor-pointer" onClick={()=>navigate("/Dashboard")}>Dashboard</p>
            <p className="text-gray-400 hover:text-white cursor-pointer" onClick={() => navigate("/room")}>Room</p>
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