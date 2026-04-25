import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#1e1e2f] text-white relative overflow-hidden">

      {/* Sidebar Component */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

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