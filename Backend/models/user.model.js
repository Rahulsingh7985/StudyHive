import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },
    role: {
      type: String,
      enum: ["student", "host", "guest"],
      default: "student",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;