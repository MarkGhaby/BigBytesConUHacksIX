require('dotenv').config({ path: __dirname + '/../.env' }); // ✅ Ensures .env is loaded
const { OpenAI } = require('openai');

// ✅ Debugging: Check if API key is loaded
console.log("🔑 OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "NOT FOUND");

if (!process.env.OPENAI_API_KEY) {
    throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}

// ✅ Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

module.exports = openai;