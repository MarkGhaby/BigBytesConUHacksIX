const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('../config/spotifyAuth'); // Load Spotify OAuth config

router.get('/spotify', (req, res) => {
    console.log("✅ /spotify route was accessed!"); // Debugging log

    const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-email%20user-read-private`;

    console.log("🔄 Redirecting to Spotify:", authUrl); // Debugging log

    // Send an HTML response that redirects using JavaScript
    res.send(`
        <html>
            <head>
                <meta http-equiv="refresh" content="0; url=${authUrl}" />
                <script>
                    window.location.href = "${authUrl}";
                </script>
            </head>
            <body>
                Redirecting to Spotify...
            </body>
        </html>
    `);
});

// ✅ Callback Route (Spotify Redirects Here)
router.get('/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
    // Generate JWT Token
    const token = jwt.sign(
        { id: req.user.id, spotifyId: req.user.spotifyId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
    );

    // Send token as JSON instead of redirecting
    res.json({
        message: "Login successful",
        token: token,
        user: req.user
    });
});

// ✅ Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: "Logged out successfully" });
});

module.exports = router;