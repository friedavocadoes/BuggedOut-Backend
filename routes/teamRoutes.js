const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Team = require("../models/Team");
const router = express.Router();

// Judge creates a new team
router.post("/add-team", async (req, res) => {
  const { name, email, password, members } = req.body;

  if (!name || !email || !password || !members) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingTeam = await Team.findOne({ email });
  if (existingTeam) {
    return res.status(400).json({ message: "Team already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newTeam = new Team({
    name,
    email,
    password: hashedPassword,
    members,
  });

  await newTeam.save();
  res.json({ message: "Team created successfully!" });
});

// Get all teams
router.get("/all-teams", async (req, res) => {
  const teams = await Team.find().select("-password");
  res.json(teams);
});

// Remove a team
router.delete("/remove-team/:id", async (req, res) => {
  await Team.findByIdAndDelete(req.params.id);
  res.json({ message: "Team removed successfully" });
});

module.exports = router;
