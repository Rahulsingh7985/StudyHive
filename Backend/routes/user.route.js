import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const router = express.Router();

// 🔥 GET CURRENT USER
router.get("/me", protect, getCurrentUser);

export default router;