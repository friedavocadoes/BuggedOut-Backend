const express = require("express");
const authMiddleware = require("../middleware/judgeAuth");
const Team = require("../models/Team");
const router = express.Router();

// Submit a bug (linked to the team)
router.post("/submit", async (req, res) => {
  const { bugForm, teamId } = req.body;
  const { round, category, description, steps, filename, fix, explanation } =
    bugForm;

  if (!round || !category || !description || !steps || !filename)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const newBug = {
      round,
      category,
      description,
      steps,
      filename,
      status: "pending",
      fix,
      explanation,
      score: 0,
      submittedAt: new Date(),
    };

    team.bugs.push(newBug);

    await team.save();

    res.json({ message: "Bug submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all bug submissions (for judges)
router.get("/all", async (req, res) => {
  try {
    const teams = await Team.find().populate("bugs.team", "name");
    const bugs = teams.flatMap((team) => team.bugs);

    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get bugs for a specific team
router.get("/team/:teamId", async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json(team.bugs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update bug info (score and status) by judge
router.put("/update/:bugId", authMiddleware, async (req, res) => {
  const { bugId } = req.params;
  const { status, score } = req.body;

  if (!status || score === undefined)
    return res.status(400).json({ message: "Status and score are required" });

  try {
    const team = await Team.findOne({ "bugs._id": bugId });
    if (!team) return res.status(404).json({ message: "Bug not found" });

    const bug = team.bugs.id(bugId);
    bug.status = status;
    bug.score = score;

    await team.save();

    const updatedBug = {
      ...bug.toObject(),
      team: {
        id: team._id,
        name: team.name,
      },
    };

    res.json({ message: "Bug updated successfully", bug: updatedBug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
