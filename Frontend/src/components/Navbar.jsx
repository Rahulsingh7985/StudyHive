import React from "react";
import { Search, Sun, Bell, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <div className="flex items-center justify-between bg-[#141427] px-6 py-3 rounded-xl mb-3">

      {/* Left Section */}
      <div className="flex gap-6 items-center">
        {/* Hamburger (for mobile sidebar toggle) */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>

        <span className="text-purple-400 border-b-2 border-purple-500 pb-1">
          Dashboard
        </span>
        <span className="text-gray-400 hover:text-white cursor-pointer hidden sm:block">
          Planner
        </span>
        <span className="text-gray-400 hover:text-white cursor-pointer hidden sm:block">
          Calendar
        </span>
        <span className="text-gray-400 hover:text-white cursor-pointer hidden sm:block">
          ToDo
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden sm:flex items-center bg-[#1e1e2f] px-3 py-1 rounded-lg">
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
        <div className="bg-[#1e1e2f] px-3 py-1 rounded-lg text-sm hidden sm:block">
          EN
        </div>
      </div>
    </div>
  );
}