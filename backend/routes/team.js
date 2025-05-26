// Import models
const express = require("express");
const router = express.Router();
const Registration = require("../models/registration"); // Your player schema
const Team = require("../models/teamModels"); // Your team schema

// ✅ API to get players who are NOT assigned to any team
router.get("/unassigned-players", async (req, res) => {
  try {
    // Get all player IDs who are already in a team
    const teams = await Team.find({}, "players");
    const assignedIds = teams.flatMap((team) =>
      team.players.map((p) => p.toString())
    );

    // Get only those players not in any team
    const unassignedPlayers = await Registration.find({
      _id: { $nin: assignedIds },
    }).select("firstName lastName nickName");

    res.json(unassignedPlayers);
  } catch (err) {
    console.error("Error getting unassigned players:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { teamName, managerName, players } = req.body;

    // 1. Check for duplicate player use
    const alreadyAssigned = await Team.find({
      players: { $in: players },
    });

    if (alreadyAssigned.length > 0) {
      return res
        .status(400)
        .json({ message: "Some players are already assigned to a team." });
    }

    // 2. Create team if all players are unassigned
    const newTeam = new Team({
      teamName,
      managerName,
      players,
    });

    await newTeam.save();
    res.status(201).json({ message: "Team created successfully!" });
  } catch (err) {
    console.error("Error creating team:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
