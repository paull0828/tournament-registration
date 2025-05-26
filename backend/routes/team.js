const express = require("express");
const router = express.Router();
const Team = require("../models/teamModels");
const Registration = require("../models/registration");

router.post("/api/teams/create", async (req, res) => {
  try {
    const { teamName, playerIds, captain, viceCaptain } = req.body;

    if (
      !teamName ||
      !playerIds ||
      !Array.isArray(playerIds) ||
      playerIds.length !== 11 // must be exactly 11 now
    ) {
      return res.status(400).json({
        message: "Missing required fields or exactly 11 players required",
      });
    }

    if (!captain || !viceCaptain) {
      return res
        .status(400)
        .json({ message: "Captain and Vice Captain must be specified" });
    }

    // Check if players exist
    const players = await Player.find({ _id: { $in: playerIds } });
    if (players.length !== playerIds.length) {
      return res.status(400).json({ message: "Some players not found" });
    }

    // Check captain and viceCaptain are in playerIds array
    if (
      !playerIds.includes(captain) ||
      !playerIds.includes(viceCaptain) ||
      captain === viceCaptain
    ) {
      return res.status(400).json({
        message:
          "Captain and Vice Captain must be different and among the selected players",
      });
    }

    // Create team document
    const newTeam = new Team({
      teamName,
      players: playerIds,
      captain,
      viceCaptain,
    });

    await newTeam.save();

    return res
      .status(201)
      .json({ message: "Team created successfully", team: newTeam });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
//Get all teams
router.get("/api/teams", async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teams." });
  }
});

// Get unassigned players
router.get("/api/teams/unassigned-players", async (req, res) => {
  try {
    // Find all player IDs assigned to teams
    const teams = await Team.find();
    const assignedIds = teams.flatMap((team) =>
      team.players.map((id) => id.toString())
    );
    // Find registrations not in assignedIds
    const unassigned = await Registration.find({
      _id: { $nin: assignedIds },
    });
    res.json(unassigned);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch unassigned players." });
  }
});

module.exports = router;
