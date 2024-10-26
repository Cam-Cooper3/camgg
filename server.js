require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const API_KEY = process.env.RIOT_API_KEY;

app.use(express.static('public'));

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
        const summonerId = summonerResponse.data.id; // Get the summoner ID for ranked data

        // Get ranked data using summoner ID
        const rankedResponse = await axios.get(`https://${sum_region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`);

        // Send all data to the frontend, including ranked data
        res.json({
            summonerName: gameName,
            summonerLevel: summonerResponse.data.summonerLevel,
            profileIconId: summonerResponse.data.profileIconId,
            rankedData: rankedResponse.data
        });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message || 'Summoner data not found' });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});