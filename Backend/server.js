require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

// ✅ Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// ✅ Import Routes
const openaiRoutes = require("./routes/openai");
const spotifyRoutes = require("./routes/spotifyAuth"); // Add Spotify API routes

app.use("/api", openaiRoutes);
app.use("/spotify", spotifyRoutes); // Add Spotify routes

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("📝 Journalify Backend is Running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000; // Change from 6000 to 5000
app.listen(PORT, () =>
  console.log(`🚀 Journalify Backend running on port ${PORT}`)
);
