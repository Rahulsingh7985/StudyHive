
import DiaryEntry from "../models/diary.model.js";

// ─── GET ALL ENTRIES (with pagination + search) ──────────────────────────────
const getEntries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      mood = "",
      tag = "",
      pinned = "",
    } = req.query;

    const query = { user: req.user.id };

    // Filter by mood
    if (mood) query.mood = mood;

    // Filter by tag
    if (tag) query.tags = { $in: [tag] };

    // Filter pinned only
    if (pinned === "true") query.isPinned = true;

    // Search in title or content
    if (search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [entries, total] = await Promise.all([
      DiaryEntry.find(query)
        .sort({ isPinned: -1, createdAt: -1 }) // pinned first, then newest
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      DiaryEntry.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: entries,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalEntries: total,
        hasNextPage: skip + entries.length < total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch diary entries", error: error.message });
  }
};

// ─── GET SINGLE ENTRY ─────────────────────────────────────────────────────────
const getEntryById = async (req, res) => {
  try {
    const entry = await DiaryEntry.findOne({
      _id: req.params.id,
      user: req.user.id, // ensures only owner can access
    });

    if (!entry) {
      return res.status(404).json({ success: false, message: "Diary entry not found" });
    }

    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch entry", error: error.message });
  }
};

// ─── CREATE ENTRY ─────────────────────────────────────────────────────────────
const createEntry = async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    // Clean and deduplicate tags
    const cleanedTags = tags
      ? [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 10)
      : [];

    const entry = await DiaryEntry.create({
      user: req.user.id,
      title: title.trim(),
      content: content.trim(),
      mood: mood || "neutral",
      tags: cleanedTags,
    });

    res.status(201).json({ success: true, message: "Diary entry created", data: entry });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Failed to create entry", error: error.message });
  }
};

// ─── UPDATE ENTRY ─────────────────────────────────────────────────────────────
const updateEntry = async (req, res) => {
  try {
    const { title, content, mood, tags, isPinned } = req.body;

    const entry = await DiaryEntry.findOne({ _id: req.params.id, user: req.user.id });

    if (!entry) {
      return res.status(404).json({ success: false, message: "Diary entry not found" });
    }

    // Only update fields that were sent
    if (title !== undefined) entry.title = title.trim();
    if (content !== undefined) entry.content = content.trim();
    if (mood !== undefined) entry.mood = mood;
    if (isPinned !== undefined) entry.isPinned = isPinned;
    if (tags !== undefined) {
      entry.tags = [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 10);
    }

    await entry.save();

    res.status(200).json({ success: true, message: "Entry updated", data: entry });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Failed to update entry", error: error.message });
  }
};

// ─── DELETE ENTRY ─────────────────────────────────────────────────────────────
const deleteEntry = async (req, res) => {
  try {
    const entry = await DiaryEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({ success: false, message: "Diary entry not found" });
    }

    res.status(200).json({ success: true, message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete entry", error: error.message });
  }
};

// ─── TOGGLE PIN ───────────────────────────────────────────────────────────────
const togglePin = async (req, res) => {
  try {
    const entry = await DiaryEntry.findOne({ _id: req.params.id, user: req.user.id });

    if (!entry) {
      return res.status(404).json({ success: false, message: "Diary entry not found" });
    }

    entry.isPinned = !entry.isPinned;
    await entry.save();

    res.status(200).json({ success: true, message: `Entry ${entry.isPinned ? "pinned" : "unpinned"}`, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to toggle pin", error: error.message });
  }
};


export { getEntries, getEntryById, createEntry, updateEntry, deleteEntry, togglePin };