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

// ✅ Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import Routes
const authRoutes = require("./routes/auth");
const moodRoutes = require("./routes/openai");
const spotifyAuthRoutes = require("./routes/spotifyAuth");
const spotifyApiRoutes = require("./routes/spotify");

// ✅ Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/openai", moodRoutes);
app.use("/api/spotify", spotifyAuthRoutes);
app.use("/api/spotify/songs", spotifyApiRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("📝 Journalify Backend is Running 🚀");
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Journalify Backend running on port ${PORT}`)
);
