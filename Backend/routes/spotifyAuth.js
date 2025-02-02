const express = require("express");
const axios = require("axios");
const router = express.Router();

let spotifyAccessToken = null;
let tokenExpiration = 0;

// Function to get a new access token
const getSpotifyAccessToken = async () => {
  if (spotifyAccessToken && Date.now() < tokenExpiration) {
    return spotifyAccessToken;
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    spotifyAccessToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000;
    return spotifyAccessToken;
  } catch (error) {
    console.error(
      "Error getting Spotify access token:",
      error.response?.data || error.message
    );
    return null;
  }
};

// **Route to search for a song**
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    const token = await getSpotifyAccessToken();
    if (!token) {
      return res.status(500).json({ error: "Failed to get Spotify token" });
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/search?query=${query}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.tracks.items.length) {
      return res.status(404).json({ error: "No track found" });
    }

    const track = response.data.tracks.items[0];

    res.json({
      trackId: track.id,
      trackName: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      previewUrl: track.preview_url, // Optional: Adds a 30s preview URL
    });
  } catch (error) {
    console.error(
      "Spotify search error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to search for track" });
  }
});

module.exports = router;
