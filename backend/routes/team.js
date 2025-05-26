const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const Team = require("../models/team"); // This import was missing

// Get unassigned players
router.get("/unassigned-players", async (req, res) => {
  try {
    const allPlayers = await Registration.find({});
    const allTeams = await Team.find({});
    const assignedPlayerIds = new Set();

    allTeams.forEach((team) => {
      team.players.forEach((playerId) =>
        assignedPlayerIds.add(playerId.toString())
      );
    });

    const unassignedPlayers = allPlayers.filter(
      (p) => !assignedPlayerIds.has(p._id.toString())
    );
    res.json(unassignedPlayers);
  } catch (err) {
    console.error("Error fetching unassigned players:", err);
    res.status(500).json({ message: "Error fetching unassigned players" });
  }
});

module.exports = router;
