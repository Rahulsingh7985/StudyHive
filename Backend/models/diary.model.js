import mongoose from "mongoose";

const diaryEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [10000, "Content cannot exceed 10,000 characters"],
    },
    mood: {
      type: String,
      enum: ["happy", "focused", "tired", "stressed", "motivated", "neutral"],
      default: "neutral",
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Cannot add more than 10 tags",
      },
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Index for fast sorted queries per user
diaryEntrySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("DiaryEntry", diaryEntrySchema);