const express = require('express');
const router = express.Router();
const openai = require('../config//configai'); // ✅ Import OpenAI instance

// ✅ Route to analyze mood from journal entries
router.post('/analyze-mood', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "No journal entry provided" });
        }

        // OpenAI API call
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an AI that detects emotions from journal entries." },
                { role: "user", content: `Analyze this journal entry and determine the user's mood in one word (Happy, Sad, Stressed, Excited, etc.): "${text}"` }
            ]
        });

        const mood = response.choices[0]?.message?.content?.trim() || "Neutral";
        res.json({ mood });
    } catch (error) {
        console.error("Error analyzing mood:", error);
        res.status(500).json({ error: "Error processing request" });
    }
});

module.exports = router;