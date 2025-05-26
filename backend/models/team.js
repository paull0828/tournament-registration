const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Registration", // refers to player registration
        required: true,
      },
    ],
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },
    viceCaptain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Optional: validate players array length to be exactly 11
teamSchema.pre("validate", function (next) {
  if (this.players.length !== 11) {
    next(new Error("A team must have exactly 11 players."));
  } else if (
    !this.players.includes(this.captain) ||
    !this.players.includes(this.viceCaptain)
  ) {
    next(
      new Error("Captain and Vice Captain must be among the selected players.")
    );
  } else if (this.captain.toString() === this.viceCaptain.toString()) {
    next(new Error("Captain and Vice Captain must be different players."));
  } else {
    next();
  }
});

module.exports = mongoose.model("Team", teamSchema);
