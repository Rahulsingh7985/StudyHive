import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { RoomContext } from "../context/RoomContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const RoomDetail = () => {
  const { userData } = useContext(UserContext);
  const { roomData, getRoom } = useContext(RoomContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { roomId } = useParams();

  useEffect(() => {
    if (roomId) {
      getRoom(roomId);
    }
  }, [roomId]);

  return (
    <div className="flex h-screen bg-[#1e1e2f] text-white relative overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col p-6 min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 bg-[#141427] rounded-xl p-6">
          <h1 className="text-xl font-semibold text-purple-400">
            Dashboard Content Here 🚀
          </h1>
          <h2 className="font-bold text-xl text-purple-400">
            {roomData?.name}
          </h2>
          <h2 className="font-semibold text-lg text-gray-500">
            Host: {roomData?.host?.name}
          </h2>
          <h2 className="font-semibold text-lg text-gray-500">
            Participants: {roomData?.participants?.length || 0} /{" "}
            {roomData?.maxParticipants}
          </h2>
          <h2 className="font-semibold text-lg text-gray-500">
            Participants:
            {roomData?.participants?.map((p) => (
              <span key={p._id}>
                {p.name},
              </span>
            ))}
          </h2>

        </div>
      </div>
    </div>
  );
};

export default RoomDetail;