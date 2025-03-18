const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Judge = require("../models/Judge");
const Team = require("../models/Team");
const router = express.Router();
const auth = require("../middleware/judgeAuth");

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

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const judge = await Judge.findOne({ username });
    if (!judge) return res.status(404).json({ message: "Judge not found" });

    const isMatch = await bcrypt.compare(password, judge.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: judge._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      judge: { id: judge._id, name: judge.name, username: judge.username },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/protected", auth, async (req, res) => {
  try {
    const judge = await Judge.findById(req.judge.id);
    if (!judge) return res.status(404).json({ message: "Judge not found" });

    res.json({ username: judge.username });
  } catch (error) {
    res.status(500).json({ message: "Error fetching judge data" });
  }
});

// Review bug submissions (Accept/Reject)
router.put("/bug/:id", auth, async (req, res) => {
  const { status, score } = req.body;
  if (!status || score === undefined)
    return res.status(400).json({ message: "Status & Score required" });

  try {
    const team = await Team.findOne({ "bugs._id": req.params.id });
    if (!team) return res.status(404).json({ message: "Bug not found" });

    const bug = team.bugs.id(req.params.id);
    bug.status = status;
    bug.score = score;
    await team.save();

    res.json({ message: "Bug reviewed" });
  } catch (error) {
    res.status(500).json({ message: "Error reviewing bug" });
  }
});

module.exports = router;
