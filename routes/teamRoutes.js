const express = require("express");
const auth = require("../middleware/judgeAuth");
const teauth = require("../middleware/authMiddleware");
const Team = require("../models/Team");
const Bug = require("../models/Bug");

const router = express.Router();

// Create a team with password and detailed members
router.post("/create", async (req, res) => {
  const { name, members = [], password } = req.body;
  if (!name || !password)
    return res
      .status(400)
      .json({ message: "Team name and password are required" });

  try {
    const newTeam = new Team({
      name,
      members, // Now members will be an array of objects
      score: 0,
      blacklisted: false,
      password,
    });

    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: "Error creating team" });
  }
});

// Add a member with details to an existing team
router.post("/:teamId/add-member", auth, async (req, res) => {
  const { name, reg_no, gender } = req.body;
  const { teamId } = req.params;

  if (!name || !reg_no || !gender)
    return res
      .status(400)
      .json({ message: "Member name, email, and role are required" });

  try {
    const team = await Team.findById(teamId);

    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members.push({ name, reg_no, gender });
    console.log(gender);
    await team.save();

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: "Error adding member" });
  }
});

// Get logged-in team's details
router.get("/me", teauth, async (req, res) => {
  try {
    const team = await Team.findById(req.team._id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team details" });
  }
});

// Get all teams
router.get("/", auth, async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams" });
  }
});

// Edit a team (update name or members)
router.put("/:id", auth, async (req, res) => {
  const { name, members } = req.body;

  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (name) team.name = name;
    if (members) team.members = members;

    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Error updating team" });
  }
});

// Delete a team
router.delete("/:id", auth, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting team" });
  }
});

// Blacklist a team
router.put("/blacklist/:id", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.blacklisted = !team.blacklisted;
    await team.save();

    res.json({
      message: `Team ${
        team.blacklisted ? "blacklisted" : "removed from blacklist"
      }`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error blacklisting team" });
  }
});

// View all bug submissions
router.get("/bugs", auth, async (req, res) => {
  try {
    const bugs = await Bug.find().populate("team");
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bugs" });
  }
});

// Review bug submissions (Accept/Reject)
router.put("/bug/:id", auth, async (req, res) => {
  const { status, score } = req.body;
  if (!status || score === undefined)
    return res.status(400).json({ message: "Status & Score required" });

  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ message: "Bug not found" });

    bug.status = status;
    await bug.save();

    if (status === "Accepted") {
      const team = await Team.findById(bug.team);
      if (team) {
        team.score += score;
        await team.save();
      }
    }

    res.json({ message: "Bug reviewed" });
  } catch (error) {
    res.status(500).json({ message: "Error reviewing bug" });
  }
});

// Get leaderboard (sorted by score)
router.get("/leaderboard", auth, async (req, res) => {
  try {
    const teams = await Team.find().sort({ score: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

module.exports = router;
