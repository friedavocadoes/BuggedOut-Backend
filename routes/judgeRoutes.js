const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Judge = require("../models/Judge");
const router = express.Router();

// Register a new judge
router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingJudge = await Judge.findOne({ username });
  if (existingJudge) {
    return res.status(400).json({ message: "Judge already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newJudge = new Judge({
    name,
    username,
    password: hashedPassword,
  });

  await newJudge.save();
  res.json({ message: "Judge registered successfully!" });
});

// Login a judge
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const judge = await Judge.findOne({ username });
  if (!judge) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, judge.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: judge._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    token,
    judge: { id: judge._id, name: judge.name, username: judge.username },
  });
});

module.exports = router;
