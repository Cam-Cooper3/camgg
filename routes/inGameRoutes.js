const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getGameTypeName } = require('./utils');

// Environment variable for API_KEY and region
const API_KEY = process.env.RIOT_API_KEY;
const sum_region = 'na1';

// Route to check if summoner is in-game
router.get('/:puuid', async (req, res) => {
    const puuid = req.params.puuid;

    try {
        // Use puuid for the Spectator v5 API request
        const inGameResponse = await axios.get(`https://${sum_region}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}?api_key=${API_KEY}`);
        const gameData = inGameResponse.data;

        // Use the utility function to determine if the game is a Custom Match or Matched Game
        const matchType = getGameTypeName(gameData.gameType);

        // Send the game data and match type in the response
        res.json({ ...gameData, matchType });
    } catch (error) {
        handleApiError(error, res);
    }
});

// Error handling helper function
function handleApiError(error, res) {
    if (error.response) {
        if (error.response.status === 403) {
            res.status(403).json({ error: 'Invalid or expired API key, or API key does not have permissions for this endpoint.' });
        } else if (error.response.status === 404) {
            res.json({ message: 'Summoner is not currently in a game.' });
        } else {
            res.status(500).json({ error: 'Error fetching in-game status' });
        }
    } else {
        res.status(500).json({ error: 'Unknown error occurred while fetching in-game status.' });
    }
}

module.exports = router;
