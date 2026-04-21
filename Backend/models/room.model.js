import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    roomCode: {
      type: String,
      unique: true,
    },

    maxParticipants: {
      type: Number,
      default: 10,
    },

    currentSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;