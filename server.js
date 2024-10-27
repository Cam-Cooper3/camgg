require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const API_KEY = process.env.RIOT_API_KEY;

app.use(express.static('public'));

// Existing route to fetch summoner and ranked data
app.get('/summoner/:name/:tagline', async (req, res) => {
    const summonerName = encodeURIComponent(req.params.name);
    const summonerTagline = encodeURIComponent(req.params.tagline);
    const acc_region = 'americas';
    const sum_region = 'na1';

    try {
        // Get puuid and gameName using summoner name and tagline
        const getPuuidResponse = await axios.get(`https://${acc_region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${summonerTagline}?api_key=${API_KEY}`);
        const { puuid, gameName } = getPuuidResponse.data;

        // Get summoner data using puuid
        const summonerResponse = await axios.get(`https://${sum_region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`);
        const summonerId = summonerResponse.data.id; // Keep summonerId if needed, but we're focusing on puuid

        // Get ranked data using summoner ID
        const rankedResponse = await axios.get(`https://${sum_region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`);

        // Send all data to the frontend, including puuid and ranked data
        res.json({
            summonerName: gameName,
            summonerLevel: summonerResponse.data.summonerLevel,
            profileIconId: summonerResponse.data.profileIconId,
            rankedData: rankedResponse.data,
            puuid: puuid // Pass puuid to the client
        });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message || 'Summoner data not found' });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

// New route to check if summoner is in-game
app.get('/ingame/:puuid', async (req, res) => {
    const puuid = req.params.puuid;
    const sum_region = 'na1';  // Update this based on your region

    try {
        // Use puuid for the Spectator v5 API request
        const inGameResponse = await axios.get(`https://${sum_region}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}?api_key=${API_KEY}`);
        console.log('In-game API response:', inGameResponse.data);
        res.json(inGameResponse.data);
    } catch (error) {
        console.error('Error fetching in-game status:', error.response ? error.response.data : error.message);
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
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
