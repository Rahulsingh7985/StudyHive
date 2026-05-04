import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { RoomContext } from "../context/RoomContext";

const RoomDetail = () => {
  const { userData } = useContext(UserContext);
  const { roomData, getRoom } = useContext(RoomContext);

  const { roomId } = useParams();

  useEffect(() => {
    if (roomId) {
      getRoom(roomId);
    }
  }, [roomId]);

  return (
    <div>
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
  );
};

export default RoomDetail;