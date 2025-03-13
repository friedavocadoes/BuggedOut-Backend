const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Team = require("../models/Team");
require("dotenv").config();

const router = express.Router();

// Team Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const team = await Team.findOne({ email });
  if (!team) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, team.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: team._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

module.exports = router;
