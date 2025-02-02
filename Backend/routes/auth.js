const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('../config/spotifyAuth'); // Load Spotify OAuth config

router.get('/spotify', (req, res) => {
    console.log("✅ /spotify route was accessed!");

    const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${process.env.SPOTIFY_CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${redirectUri}` +
        `&scope=user-read-email%20user-read-private` +
        `&show_dialog=true` + // Force showing the Spotify login dialog
        `&state=${state}`;

    res.redirect(authUrl);
});

// ✅ Updated Callback Route
router.get('/callback', 
    passport.authenticate('spotify', { failureRedirect: '/login-failed' }), 
    (req, res) => {
        try {
            const token = jwt.sign(
                { 
                    id: req.user.id, 
                    spotifyId: req.user.spotifyId,
                    username: req.user.displayName 
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Redirect to frontend with token
            const redirectUrl = `${process.env.FRONTEND_URL}?token=${token}`;
            res.redirect(redirectUrl);
        } catch (error) {
            console.error('Auth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}?error=authentication_failed`);
        }
    }
);

// Add error handling route
router.get('/login-failed', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}?error=login_failed`);
});

// ✅ Updated Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({ message: "Logout failed" });
        }
        
        // Clear all cookies
        res.clearCookie('connect.sid');
        res.clearCookie('spotify_auth_state');
        
        // Send response with Spotify logout URL
        res.json({
            message: "Logged out successfully",
            spotifyLogoutUrl: 'https://accounts.spotify.com/logout'
        });
    });
});

module.exports = router;