import express from "express";
import JournalEntry from "../models/JournalEntry.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

// Add new journal entry
router.post("/entries", auth, async (req, res) => {
  try {
    const { text, type } = req.body;
    if (!text) return res.status(400).json({ message: "Entry text required" });

    const newEntry = new JournalEntry({
      userId: req.userId,
      text,
      type: type || "user",
    });

    await newEntry.save();
    res.status(201).json({ message: "Entry saved successfully", entry: newEntry });
  } catch (err) {
    console.error("Save Entry Error:", err);
    res.status(500).json({ message: "Failed to save entry" });
  }
});

// Get all journal entries for user
router.get("/entries", auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ entries });
  } catch (err) {
    console.error("Fetch Entries Error:", err);
    res.status(500).json({ message: "Failed to fetch entries" });
  }
});

export default router;
