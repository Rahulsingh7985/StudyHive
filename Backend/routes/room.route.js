import express from "express";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoom,
  endRoom,
} from "../controllers/room.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


// 🟢 Create Room
router.post("/create", protect, createRoom);

// 🟢 Join Room (by code)
router.post("/join", protect, joinRoom);

// 🟢 Get Room Details
router.get("/:roomId", protect, getRoom);

// 🟢 Leave Room
router.delete("/leave/:roomId", protect, leaveRoom);

// 🟢 End Room (Host only)
router.put("/end/:roomId", protect, endRoom);


export default router;