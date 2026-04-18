import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// DB connect
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});