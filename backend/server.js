const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

// Initialize the app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const dbURI =
  "mongodb+srv://paulpapnol18:CoK1ekZsPI1k1KBm@cluster0.xdaihpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Registration model
const Registration = require("./models/Registration");

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Registration route (only)
app.post("/register", upload.single("receipt"), async (req, res) => {
  const {
    firstName,
    lastName,
    nickName,
    phone,
    role,
    paymentMethod,
    playerType,
  } = req.body;
  const receipt = req.file;

  if (paymentMethod === "online" && !receipt) {
    return res
      .status(400)
      .send({ message: "Please upload a payment receipt." });
  }

  try {
    const newRegistration = new Registration({
      firstName,
      lastName,
      nickName,
      phone,
      role,
      paymentMethod,
      playerType,
      receipt: receipt ? receipt.path : null,
      status: "pending",
    });

    await newRegistration.save();
    res.status(201).send({ message: "Registration successful." });
  } catch (error) {
    console.error("Error saving registration:", error);
    res.status(500).send({ message: "Failed to register." });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Get all registrations
app.get("/registrations", async (req, res) => {
  try {
    // Only select firstName, lastName, and nickName fields
    const registrations = await Registration.find().select(
      "firstName lastName nickName"
    );
    res.json(registrations);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch registrations." });
  }
});

// Get registration by ID
app.get("/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).send({ message: "User not found." });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch user." });
  }
});
