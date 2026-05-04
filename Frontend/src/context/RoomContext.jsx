import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const RoomContext = createContext();

function RoomProvider({ children }) {
  const { serverUrl, token } = useContext(AuthContext);

  const [roomData, setRoomData] = useState(null);

  const getRoom = async (roomId) => {
    try {
      if (!token) return;

      const result = await axios.get(
        `${serverUrl}/api/rooms/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRoomData(result.data.room); // 🔥 important
    } catch (error) {
      console.log(error);
      setRoomData(null);
    }
  };

  const value = {
    roomData,
    setRoomData,
    getRoom,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}

export default RoomProvider;