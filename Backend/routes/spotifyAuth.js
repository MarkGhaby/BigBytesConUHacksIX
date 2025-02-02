const express = require("express");
const axios = require("axios");
const router = express.Router();

let spotifyAccessToken = null;
let tokenExpiration = 0;

function formatSearchParams(req) {
  const params = [];

  const addParam = (key, value) => {
    if (value !== undefined && value !== null) {
      params.push(`${key}=${encodeURIComponent(value)}`);
    }
  };

  addParam("seed_genres", req.body.genres);
  addParam("limit", req.body.limit);
  addParam("market", "CA");
  addParam("target_popularity", req.body.popularity);
  addParam("target_speechiness", req.body.speechiness);
  addParam("target_liveness", req.body.liveness);
  addParam("target_instrumentalness", req.body.instrumentalness);
  addParam("target_energy", req.body.energy);
  addParam("target_tempo", req.body.tempo);
  addParam("target_duration_ms", req.body.duration);
  addParam("target_acousticness", req.body.acousticness);
  addParam("target_danceability", req.body.danceability);

  return params.join("&");
}

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
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    spotifyAccessToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000;
    return spotifyAccessToken;
  } catch (error) {
    console.error(
      "Error getting Spotify access token:",
      error.response?.data || error.message,
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

    const limit = 1;

    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } },
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
      error.response?.data || error.message,
    );
    res.status(500).json({ error: "Failed to search for track" });
  }
});

router.post("/recommendation", async (req, res) => {
  console.log("Finding a recommendation");
  let token;
  try {
    token = await getSpotifyAccessToken();
    if (!token) {
      return res.status(500).json({ error: "Failed to get Spotify token" });
    }

    console.log(token);
    const url = `https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA`;

    const spotifyRes = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("hello");
    console.log(spotifyRes);

    res.status(200).json({
      message: "Recommendations fetched successfully",
      recommendations: spotifyRes,
    });
  } catch (error) {
    console.log("big sad");
    console.error(error)
    res.status(400).json({ message: token });
  }
});

module.exports = router;
