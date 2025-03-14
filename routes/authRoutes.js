const express = require("express");
const jwt = require("jsonwebtoken");
const Team = require("../models/Team");
require("dotenv").config();

const router = express.Router();

// Team Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Team.findOne({ name: username });
  console.log(user);
  if (!user || !(password === user.password)) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.json({ success: true, token });
});

// Get logged-in team's details
router.get("/me/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team data" });
  }
});

module.exports = router;
