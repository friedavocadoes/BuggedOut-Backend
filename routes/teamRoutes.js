const express = require("express");
const auth = require("../middleware/judgeAuth");
const Team = require("../models/Team");

const router = express.Router();

// Create a team with password and detailed members
router.post("/create", async (req, res) => {
  const { name, members = [], password, stack } = req.body;
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
      stack,
    });

    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: "Error creating team" });
  }
});

// Update stack of a team
router.put("/:id/stack", async (req, res) => {
  try {
    const { stack } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    team.stack = stack;
    await team.save();

    res.json(team);
  } catch (error) {
    console.error("Error updating team stack:", error);
    res.status(500).json({ message: "Server Error" });
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

    await team.save();
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: "Error adding member" });
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
    const teams = await Team.find().populate("bugs");
    const bugs = teams.flatMap((team) =>
      team.bugs.map((bug) => ({
        ...bug.toObject(),
        team: {
          id: team._id,
          name: team.name,
        },
      }))
    );
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bugs" });
  }
});

// Get leaderboard (sorted by score)
router.get("/leaderboard", async (req, res) => {
  try {
    const teams = await Team.find(); // Fetch all teams
    const leaderboard = teams.map((team) => {
      const totalScore = team.bugs.reduce((sum, bug) => sum + bug.score, 0); // Sum up scores of all bugs
      return {
        teamName: team.name,
        score: totalScore,
      };
    });

    // Sort leaderboard by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

module.exports = router;
