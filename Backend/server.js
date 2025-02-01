require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// ✅ Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// ✅ Add express-session with a secret key
app.use(session({
    secret: process.env.SESSION_SECRET,  // Use the secret from .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import Routes
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/openai'); // Import mood analysis route

app.use('/api/auth', authRoutes);
app.use('/api/openai', moodRoutes); // Mount mood analysis route

// ✅ Default Route
app.get('/', (req, res) => {
    res.send('📝 Journalify Backend is Running 🚀');
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Journalify Backend running on port ${PORT}`));