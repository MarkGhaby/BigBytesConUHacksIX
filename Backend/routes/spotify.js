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

        let allTracks = [];
        let offset = 0;
        const limit = 50;
        let hasMore = true;

        while (hasMore) {
            // Fetch liked songs from Spotify API with pagination
            const response = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
                headers: { Authorization: `Bearer ${spotifyAccessToken}` }
            });

            // Extract only Name & Artist
            const tracks = response.data.items.map(item => ({
                name: item.track.name,
                artist: item.track.artists.map(artist => artist.name).join(", "),
            }));

            // Add to allTracks array
            allTracks = [...allTracks, ...tracks];

            // Update `offset` for next request
            offset += limit;

            // Check if there are more items to fetch
            hasMore = response.data.next !== null;
        }

        res.json(allTracks);
    } catch (error) {
        console.error('❌ Error fetching liked songs:', error.response?.data || error.message);
        res.status(500).json({ message: "Failed to fetch liked songs" });
    }
});

module.exports = router;