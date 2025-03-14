const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Bug = require("../models/Bug");

const router = express.Router();

// Submit a bug (linked to the team)
router.post("/submit", authMiddleware, async (req, res) => {
  const { round, category, description, steps, filename } = req.body;

  if (!round || !category || !description || !steps || !filename)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const newBug = new Bug({
      team: req.team._id,
      round,
      category,
      description,
      steps,
      filename,
    });

    await newBug.save();
    res.json({ message: "Bug submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all bug submissions (for judges)
router.get("/all", async (req, res) => {
  try {
    const bugs = await Bug.find().populate("team", "name");
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
