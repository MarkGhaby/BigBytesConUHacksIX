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
    `&scope=user-read-email%20user-read-private%20user-library-read` + // Added scope
    `&show_dialog=true` + 
    `&state=${state}`;

    res.redirect(authUrl);
});

// ✅ Updated Callback Route
router.get('/callback', 
    passport.authenticate('spotify', { failureRedirect: '/login-failed' }), 
    (req, res) => {
        try {
            console.log('✅ User data from Spotify:', {
                id: req.user.id,
                spotifyId: req.user.spotifyId,
                username: req.user.displayName,
                accessToken: req.user.accessToken ? '✓ Present' : '✗ Missing',
                refreshToken: req.user.refreshToken ? '✓ Present' : '✗ Missing'
            });

            const token = jwt.sign(
                { 
                    id: req.user.id, 
                    spotifyId: req.user.spotifyId,
                    username: req.user.displayName,
                    accessToken: req.user.accessToken,
                    refreshToken: req.user.refreshToken
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            console.log('✅ Generated JWT:', token);
            
            // Decode and log the token to verify contents
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('✅ Decoded JWT contents:', {
                ...decoded,
                accessToken: decoded.accessToken ? '✓ Present' : '✗ Missing',
                refreshToken: decoded.refreshToken ? '✓ Present' : '✗ Missing'
            });

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