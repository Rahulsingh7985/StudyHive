import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";

export default function Room() {
  const { serverUrl, token } = useContext(AuthContext);
  const { userData } = useContext(UserContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Modal toggle ──
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  // ── Inputs ──
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  // ── Loading / Error ──
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState("");


  // ── Rooms list — fetched from backend (works across devices) ──
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const fetchMyRooms = async () => {
    if (!token) return;
    setRoomsLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/rooms/my-rooms`, { headers: { Authorization: `Bearer ${token}` } });
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.log("Failed to fetch rooms:", err.message);
    } finally {
      setRoomsLoading(false);
    }
  };

  // Fetch on mount and whenever token changes (new login / device)
  useEffect(() => {
    fetchMyRooms();
  }, [token]);

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ── Helper: is current user the host ──
  const isHost = (room) =>
    room.host?._id === userData?._id || room.host === userData?._id;

  // ─────────────────────────────────────────
  // 1. Create Room  →  POST /api/rooms/create
  // ─────────────────────────────────────────
  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    setCreateLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${serverUrl}/api/rooms/create`,
        { name: roomName },
        authHeaders
      );
      setRooms((prev) => [res.data.room, ...prev]);
      setRoomName("");
      setShowCreate(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setCreateLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // 2. Join Room  →  POST /api/rooms/join
  // ─────────────────────────────────────────
  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;
    setJoinLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${serverUrl}/api/rooms/join`,
        { roomCode: joinCode },
        authHeaders
      );
      const joined = res.data.room;
      setRooms((prev) =>
        prev.find((r) => r._id === joined._id) ? prev : [joined, ...prev]
      );
      setJoinCode("");
      setShowJoin(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join room");
    } finally {
      setJoinLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // 3. Leave Room  →  DELETE /api/rooms/leave/:roomId
  // ─────────────────────────────────────────
  const handleLeaveRoom = async (roomId) => {
    setError("");
    try {
      await axios.delete(
        `${serverUrl}/api/rooms/leave/${roomId}`,
        authHeaders
      );
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to leave room");
    }
  };

  // ─────────────────────────────────────────
  // 4. End Room  →  PUT /api/rooms/end/:roomId
  // ─────────────────────────────────────────
  const handleEndRoom = async (roomId) => {
    setError("");
    try {
      await axios.put(
        `${serverUrl}/api/rooms/end/${roomId}`,
        {},
        authHeaders
      );
      setRooms((prev) =>
        prev.map((r) => (r._id === roomId ? { ...r, isActive: false } : r))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to end room");
    }
  };

  return (
    <div className="flex h-screen bg-[#1e1e2f] text-white relative overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main */}
      <div className="flex-1 flex flex-col p-6 min-w-0 overflow-y-auto">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 bg-[#141427] rounded-xl p-6 space-y-8">

          {/* ── Page Header ── */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-xl">
              🚪
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Rooms</h1>
              <p className="text-gray-400 text-sm">
                Welcome, {userData?.name || "User"} — create, join, or manage your rooms
              </p>
            </div>
          </div>

          {/* ── Global Error ── */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-white text-lg leading-none ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* ── Action Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Create Card */}
            <div className="bg-[#1e1e2f] border border-purple-500/20 rounded-2xl p-6 flex flex-col gap-4 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-2xl">
                  ➕
                </div>
                <div>
                  <h2 className="font-semibold text-white text-base">Create a Room</h2>
                  <p className="text-gray-500 text-xs mt-0.5">Start a new collaborative space</p>
                </div>
              </div>

              {showCreate && (
                <input
                  type="text"
                  placeholder="Enter room name..."
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                  autoFocus
                  className="bg-[#141427] border border-gray-700 focus:border-purple-500 outline-none rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 transition"
                />
              )}

              <div className="flex gap-2">
                {!showCreate ? (
                  <button
                    onClick={() => {
                      setShowCreate(true);
                      setShowJoin(false);
                      setError("");
                    }}
                    className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-semibold transition-all duration-200"
                  >
                    Create Room
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCreateRoom}
                      disabled={!roomName.trim() || createLoading}
                      className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold transition-all duration-200"
                    >
                      {createLoading ? "Creating..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => {
                        setShowCreate(false);
                        setRoomName("");
                      }}
                      className="px-4 py-2.5 rounded-lg border border-gray-700 hover:border-gray-500 text-sm text-gray-400 hover:text-white transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Join Card */}
            <div className="bg-[#1e1e2f] border border-indigo-500/20 rounded-2xl p-6 flex flex-col gap-4 hover:border-indigo-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
                  🔗
                </div>
                <div>
                  <h2 className="font-semibold text-white text-base">Join a Room</h2>
                  <p className="text-gray-500 text-xs mt-0.5">Enter a code to join an existing room</p>
                </div>
              </div>

              {showJoin && (
                <input
                  type="text"
                  placeholder="Enter room code..."
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                  autoFocus
                  className="bg-[#141427] border border-gray-700 focus:border-indigo-500 outline-none rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 font-mono tracking-widest transition"
                />
              )}

              <div className="flex gap-2">
                {!showJoin ? (
                  <button
                    onClick={() => {
                      setShowJoin(true);
                      setShowCreate(false);
                      setError("");
                    }}
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition-all duration-200"
                  >
                    Join Room
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleJoinRoom}
                      disabled={!joinCode.trim() || joinLoading}
                      className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold transition-all duration-200"
                    >
                      {joinLoading ? "Joining..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => {
                        setShowJoin(false);
                        setJoinCode("");
                      }}
                      className="px-4 py-2.5 rounded-lg border border-gray-700 hover:border-gray-500 text-sm text-gray-400 hover:text-white transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── My Rooms List ── */}
          <div>
            <h2 className="text-base font-semibold text-white mb-4">
              List of My Rooms
              {rooms.length > 0 && (
                <span className="ml-2 text-xs text-gray-500 font-normal">
                  ({rooms.length})
                </span>
              )}
            </h2>

            {roomsLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-gray-500 text-sm">Loading your rooms...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-4xl mb-3">🏠</div>
                <p className="text-gray-500 text-sm">No rooms yet.</p>
                <p className="text-gray-600 text-xs mt-1">
                  Create or join a room to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    className="flex items-center justify-between bg-[#1e1e2f] border border-gray-700/40 hover:border-purple-500/40 rounded-xl px-5 py-4 transition-all duration-200 group"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-lg font-bold text-purple-400">
                        {room.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">
                            {room.name}
                          </p>
                          {isHost(room) && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/20">
                              Host
                            </span>
                          )}
                          {!room.isActive && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-500 border border-gray-600/30">
                              Ended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {room.participants?.length || 1} members ·{" "}
                          <span className="font-mono tracking-wide text-gray-400">
                            {room.roomCode}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right — actions on hover */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button
                        onClick={() => handleLeaveRoom(room._id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-600/40 text-gray-400 hover:border-red-500/50 hover:text-red-400 transition-all duration-200"
                      >
                        Leave
                      </button>

                      {isHost(room) && room.isActive && (
                        <button
                          onClick={() => handleEndRoom(room._id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-600/40 text-gray-400 hover:border-orange-500/50 hover:text-orange-400 transition-all duration-200"
                        >
                          End
                        </button>
                      )}

                      <button className="text-xs px-3 py-1.5 rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 hover:bg-purple-600 hover:text-white transition-all duration-200">
                        Enter →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}