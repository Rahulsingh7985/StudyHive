import React from "react";
import { Search, Sun, Bell } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#1e1e2f] text-white">
      
      {/* 🔹 Sidebar */}
      <div className="w-64 bg-[#141427] p-5 flex flex-col justify-between px-6 rounded-xl mb-6 mt-6 ml-4">
        
        {/* Profile */}
        <div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-full border-4 border-purple-500 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold">Hi, @user</h2>
            <p className="text-sm text-gray-400">Session: 12:45</p>
          </div>

          {/* Menu */}
          <nav className="space-y-4">
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

      {/* 🔹 Main Section */}
      <div className="flex-1 flex flex-col p-6">
        
        {/* Navbar */}
        <div className="flex items-center justify-between bg-[#141427] px-6 py-3 rounded-xl mb-3">
          
          {/* Left Menu */}
          <div className="flex gap-6 items-center">
            <span className="text-purple-400 border-b-2 border-purple-500 pb-1">Dashboard</span>
            <span className="text-gray-400 hover:text-white cursor-pointer">Planner</span>
            <span className="text-gray-400 hover:text-white cursor-pointer">Calendar</span>
            <span className="text-gray-400 hover:text-white cursor-pointer">ToDo</span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            
            {/* Search */}
            <div className="flex items-center bg-[#1e1e2f] px-3 py-1 rounded-lg">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none px-2 text-sm"
              />
            </div>

            {/* Icons */}
            <Bell className="cursor-pointer text-gray-400 hover:text-white" />
            <Sun className="cursor-pointer text-gray-400 hover:text-white" />

            {/* Language */}
            <div className="bg-[#1e1e2f] px-3 py-1 rounded-lg text-sm">
              EN
            </div>
          </div>
        </div>

        {/* Content Placeholder */}
        <div className="flex-1 bg-[#141427] rounded-xl p-6">
          <h1 className="text-xl font-semibold text-purple-400">
            Dashboard Content Here
          </h1>
        </div>
      </div>
    </div>
  );
}