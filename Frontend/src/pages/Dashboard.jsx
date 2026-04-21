import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#1e1e2f] text-white relative overflow-hidden">

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
        {/* 🔥 Profile Component */}
        <div>
          <Profile />

          {/* Menu */}
          <nav className="space-y-3 mt-8">
            <p className="text-purple-400 font-semibold">Dashboard</p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Activity</p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Overview</p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Analytics</p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Statistic</p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Settings</p>
            <p className="text-gray-400 hover:text-white cursor-pointer">Support</p>
          </nav>
        </div>

        {/* Logout */}
        <button className="bg-[#1e1e2f] border border-gray-600 rounded-lg py-2 hover:bg-purple-600 transition">
          Logout
        </button>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col p-6 min-w-0">

        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 bg-[#141427] rounded-xl p-6">
          <h1 className="text-xl font-semibold text-purple-400">
            Dashboard Content Here 🚀
          </h1>
        </div>
      </div>
    </div>
  );
}