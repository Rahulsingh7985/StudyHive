import express from "express";
const router = express.Router();

import {
  getEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  togglePin,
} from "../controllers/diary.controller.js";

// 🔐 JWT middleware
import { protect } from "../middlewares/auth.middleware.js";


// Protect all routes
router.use(protect);

// GET  /api/diary
// POST /api/diary
router.route("/").get(getEntries).post(createEntry);

// GET    /api/diary/:id
// PUT    /api/diary/:id
// DELETE /api/diary/:id
router
  .route("/:id")
  .get(getEntryById)
  .put(updateEntry)
  .delete(deleteEntry);

// PATCH /api/diary/:id/pin
router.patch("/:id/pin", togglePin);

export default router;