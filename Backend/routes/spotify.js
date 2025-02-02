const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const router = express.Router();

router.get('/liked-songs', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Decode the JWT to get the user's Spotify access token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const spotifyAccessToken = decoded.accessToken;

        if (!spotifyAccessToken) {
            return res.status(401).json({ message: "Spotify token missing" });
        }

        // Fetch liked songs from Spotify API
        const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
            headers: { Authorization: `Bearer ${spotifyAccessToken}` }
        });

        // ✅ Filter the response to return only needed details
        const filteredSongs = response.data.items.map(item => ({
            name: item.track.name,
            artist: item.track.artists.map(artist => artist.name).join(", "),
            album: item.track.album.name,
            albumCover: item.track.album.images[0]?.url || "No Image Available",
            spotifyUrl: item.track.external_urls.spotify,
            duration: `${Math.floor(item.track.duration_ms / 60000)}:${String(Math.floor((item.track.duration_ms % 60000) / 1000)).padStart(2, '0')}`
        }));

        res.json(filteredSongs);
    } catch (error) {
        console.error('❌ Error fetching liked songs:', error.response?.data || error.message);
        res.status(500).json({ message: "Failed to fetch liked songs" });
    }
});

module.exports = router;