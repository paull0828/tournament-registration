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

// Validate players array length to be exactly 11 and captain/viceCaptain conditions
teamSchema.pre("validate", function (next) {
  if (this.players.length !== 11) {
    return next(new Error("A team must have exactly 11 players."));
  }
  if (
    !this.players.some((p) => p.toString() === this.captain.toString()) ||
    !this.players.some((p) => p.toString() === this.viceCaptain.toString())
  ) {
    return next(
      new Error("Captain and Vice Captain must be among the selected players.")
    );
  }
  if (this.captain.toString() === this.viceCaptain.toString()) {
    return next(
      new Error("Captain and Vice Captain must be different players.")
    );
  }
  next();
});

module.exports = mongoose.model("Team", teamSchema);
