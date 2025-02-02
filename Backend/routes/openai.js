const express = require("express");
const router = express.Router();
const axios = require("axios"); // Use Axios for OpenAI API requests
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getLikedSongs = async (token) => {
  try {
    // Decode the JWT to get the user's Spotify access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const spotifyAccessToken = decoded.accessToken;

    let allTracks = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      // Fetch liked songs from Spotify API with pagination
      const response = await axios.get(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: { Authorization: `Bearer ${spotifyAccessToken}` },
        }
      );

      // Extract only Name & Artist
      const tracks = response.data.items.map((item) => ({
        name: item.track.name,
        artist: item.track.artists.map((artist) => artist.name).join(", "),
      }));

      // Add to allTracks array
      allTracks = [...allTracks, ...tracks];

      // Update `offset` for next request
      offset += limit;

      // Check if there are more items to fetch
      hasMore = response.data.next !== null;
    }

    return allTracks;
  } catch (error) {
    console.error(
      "❌ Error fetching liked songs:",
      error.response?.data || error.message
    );
    return [];
  }
};

router.post("/analyze-mood", async (req, res) => {
  try {
    const { messages, liked, count } = req.body;
    let likedSongs = [];

    const isLikedSongs = liked === "true" ? true : false;

    if (isLikedSongs) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send("Unauthorized: No token provided");
      }

      const token = authHeader.split(" ")[1]; // Extract Bearer token
      likedSongs = await getLikedSongs(token);
    }

    console.log(likedSongs);
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).send("No journal entries provided");
    }

    // 🔹 Construct prompt with full message history
    const openAiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an AI that recommends a popular song based on the user's diary entries.",
          },
          {
            role: "user",
            content: `Given the following journal entries, return only the name of ${count} popular song and its artist${
              liked && likedSongs.length > 0
                ? `, only from this list of songs: ${likedSongs
                    .map((song) => `${song.artist} - ${song.name}`)
                    .join(", ")}`
                : ""
            }. Do not ask questions or provide explanations. Just return in this format: Artist - Track. Separate each song with a tilde (~). 
          
            ${messages.join("\n")}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 🔹 Extract the suggested song from OpenAI response
    let responseText = openAiResponse.data.choices[0]?.message?.content?.trim();

    res.send(responseText); // Returns "Artist - Track"
  } catch (error) {
    console.error("Error analyzing mood:", error);
    res.status(500).send("Error processing request");
  }
});

module.exports = router;
