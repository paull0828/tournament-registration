const express = require("express");
const router = express.Router();
const Team = require("../models/team");

// Create a new team
router.post("/create", async (req, res) => {
  try {
    const { teamName, players, captain, viceCaptain } = req.body;

    if (!teamName || !players || !captain || !viceCaptain) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!Array.isArray(players)) {
      return res.status(400).json({ message: "Players must be an array." });
    }

    const newTeam = new Team({
      teamName,
      players,
      captain,
      viceCaptain,
    });

    await newTeam.save();

    res
      .status(201)
      .json({ message: "Team created successfully.", team: newTeam });
  } catch (error) {
    console.error("Error creating team:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Team name already exists." });
    }
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get all teams
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("players", "firstName lastName nickName")
      .populate("captain", "firstName lastName nickName")
      .populate("viceCaptain", "firstName lastName nickName");
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get a single team by ID
router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("players", "firstName lastName nickName")
      .populate("captain", "firstName lastName nickName")
      .populate("viceCaptain", "firstName lastName nickName");

    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    res.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Delete a team by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Team.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Team not found." });
    }
    res.json({ message: "Team deleted successfully." });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// New route: Get unassigned players (players not assigned to any team)
router.get("/unassigned-players", async (req, res) => {
  try {
    // Get all player IDs assigned to teams
    const assignedPlayerIds = await Team.find().distinct("players");

    // Find players not assigned to any team
    const unassignedPlayers = await Registration.find({
      _id: { $nin: assignedPlayerIds },
    }).select("firstName lastName nickName"); // Select relevant fields

    res.json(unassignedPlayers);
  } catch (error) {
    console.error("Error fetching unassigned players:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
