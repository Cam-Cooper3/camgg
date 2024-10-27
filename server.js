require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;

// Import route modules
const summonerRoutes = require('./routes/summonerRoutes');
const inGameRoutes = require('./routes/inGameRoutes');

app.use(express.static('public'));

// Use routes
app.use('/summoner', summonerRoutes);
app.use('/ingame', inGameRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
