const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const Bug = require("../models/Bug");

const router = express.Router();

// Submit a bug
router.post("/submit", authMiddleware, async (req, res) => {
  const { round, description } = req.body;
  if (!round || !description)
    return res.status(400).json({ message: "All fields are required" });

  const newBug = new Bug({ team: req.team._id, round, description });
  await newBug.save();

  res.json({ message: "Bug submitted successfully!" });
});

// Get all bug submissions (for judges)
router.get("/all", async (req, res) => {
  const bugs = await Bug.find().populate("team", "name");
  res.json(bugs);
});

module.exports = router;
