require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Environment variables for API_KEY and region
const API_KEY = process.env.RIOT_API_KEY;
const acc_region = 'americas';
const sum_region = 'na1';

// Route to fetch summoner and ranked data
router.get('/:name/:tagline', async (req, res) => {
    const summonerName = encodeURIComponent(req.params.name);
    const summonerTagline = encodeURIComponent(req.params.tagline);

    try {
        // Get puuid and gameName using summoner name and tagline
        const getPuuidResponse = await axios.get(`https://${acc_region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${summonerTagline}?api_key=${API_KEY}`);
        const { puuid, gameName } = getPuuidResponse.data;

        // Get summoner data using puuid
        const summonerResponse = await axios.get(`https://${sum_region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`);
        const summonerId = summonerResponse.data.id; // Keep summonerId if needed, but we're focusing on puuid

        // Get ranked data using summoner ID
        const rankedResponse = await axios.get(`https://${sum_region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`);

        // Send all data to the frontend (client)
        res.json({
            summonerName: gameName,
            summonerLevel: summonerResponse.data.summonerLevel,
            profileIconId: summonerResponse.data.profileIconId,
            rankedData: rankedResponse.data,
            puuid: puuid
        });
    } catch (error) {
        handleApiError(error, res);
    }
});

// Error handling helper function
function handleApiError(error, res) {
    if (error.response) {
        res.status(error.response.status).json({ error: error.response.data.message || 'Summoner data not found' });
    } else {
        res.status(500).json({ error: 'Unknown error occurred' });
    }
}

module.exports = router;
