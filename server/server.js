const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from config/.env
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

const summonerRoutes = require('./routes/summonerRoutes');
const inGameRoutes = require('./routes/inGameRoutes');

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Use routes
app.use('/summoner', summonerRoutes);
app.use('/ingame', inGameRoutes);

// Listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
