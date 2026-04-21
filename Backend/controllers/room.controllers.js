import Room from "../models/room.model.js";
import User from "../models/user.model.js";

// 🔑 Generate Room Code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};



// 🟢 1. Create Room
export const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    const roomCode = generateRoomCode();

    const room = await Room.create({
      name,
      host: userId,
      participants: [userId],
      roomCode,
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating room",
      error: error.message,
    });
  }
};



// 🟢 2. Join Room using Code
export const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;
    const userId = req.user._id;

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // already joined check
    if (!room.participants.includes(userId)) {
      room.participants.push(userId);
      await room.save();
    }

    res.status(200).json({
      success: true,
      message: "Joined room successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error joining room",
      error: error.message,
    });
  }
};



// 🟢 3. Leave Room
export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // remove user
    room.participants = room.participants.filter(
      (id) => id.toString() !== userId.toString()
    );

    await room.save();

    res.status(200).json({
      success: true,
      message: "Left room successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error leaving room",
      error: error.message,
    });
  }
};



// 🟢 4. Get Room Details
export const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId)
      .populate("host", "name email profilePic")
      .populate("participants", "name email profilePic");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching room",
      error: error.message,
    });
  }
};



// 🟢 5. End Room (Host Only)
export const endRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // only host can end
    if (room.host.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only host can end the room",
      });
    }

    room.isActive = false;
    await room.save();

    res.status(200).json({
      success: true,
      message: "Room ended successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error ending room",
      error: error.message,
    });
  }
};