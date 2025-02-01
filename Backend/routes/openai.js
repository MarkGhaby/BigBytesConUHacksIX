const express = require("express");
const router = express.Router();
const axios = require("axios"); // Use Axios for OpenAI API requests
require("dotenv").config();

router.post("/analyze-mood", async (req, res) => {
  try {
    const { messages } = req.body;

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
            content: `Given the following journal entries, return only the name of a popular song and its artist. Do not ask questions or provide explanations. Just return in this format: Artist - Track \n\n ${messages.join(
              "\n"
            )}`,
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
