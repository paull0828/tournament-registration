const mongoose = require("mongoose");

// Define registration schema
const registrationSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    nickName: String,
    phone: String,
    role: String,
    paymentMethod: String,
    playerType: String,
    receipt: String,
    status: {
      type: String,
      default: "pending", // Default until confirmed
    },
  },
  { timestamps: true }
);

// Create the model
const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
