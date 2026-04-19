import express from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  googleLogin,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
// 👇 PROFILE UPDATE WITH IMAGE
router.put("/profile", protect, upload.single("profilePic"), updateProfile);

export default router;