const express = require('express');
const router = express.Router();
const openai = require('../config/configai'); // ✅ Import OpenAI instance

// ✅ Route to analyze mood from journal entries
router.post('/analyze-mood', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).send("No journal entry provided");
        }

        // OpenAI API call with an improved prompt
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an AI that recommends a popular song based on the provided journal entry." },
                { role: "user", content: `Given the following journal entry, return only the name of a popular song and its artist. Do not ask any questions or provide explanations. Just return the song title and artist. 
                
                Journal entry: "${text}"` }
            ]
        });

        let responseText = response.choices[0]?.message?.content?.trim();

        res.send(responseText); // ✅ Returns only the song title and artist
    } catch (error) {
        console.error("Error analyzing mood:", error);
        res.status(500).send("Error processing request");
    }
});

module.exports = router;