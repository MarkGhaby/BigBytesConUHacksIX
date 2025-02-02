const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

require("../config/spotifyAuth"); // Load Spotify OAuth config

// ✅ Redirect to Spotify for Authentication
router.get("/spotify", (req, res) => {
    console.log("✅ /spotify route was accessed!");

    const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-email%20user-read-private`;

    console.log("🔄 Redirecting to Spotify:", authUrl);
    res.redirect(authUrl);
});

// ✅ Spotify OAuth Callback
router.get("/callback", passport.authenticate("spotify", { failureRedirect: "/" }), (req, res) => {
    const token = jwt.sign(
        { id: req.user.id, spotifyId: req.user.spotifyId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    console.log("✅ User logged in successfully!");

    // ✅ Redirect back to frontend and store token
    res.redirect(`http://localhost:9000?token=${token}`);
});

// ✅ Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    res.json({ message: "Logged out successfully" });
});

module.exports = router;