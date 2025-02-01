require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default Route (for testing)
app.get('/', (req, res) => {
    res.send('📝 Journalify Backend is Running 🚀');
});

// Start Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`🚀 Journalify Backend running on port ${PORT}`));