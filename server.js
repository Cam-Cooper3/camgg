require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const API_KEY = process.env.RIOT_API_KEY;
const tag_line = "NA1";
const acc_region = 'americas';
const sum_region = 'na1';

app.use(express.static('public'));

app.get('/summoner/:name', async (req, res) => {
    const summonerName = encodeURIComponent(req.params.name);
    try {
        // Get puuid and gameName using summoner name and tagline
        console.log(`Requesting PUUID for summoner: ${summonerName}, in region: ${acc_region}`);
        const getPuuidResponse = await axios.get(`https://${acc_region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag_line}?api_key=${API_KEY}`);
        // console.log("DEBUG: PUUID Response:", getPuuidResponse.data);

        const { puuid, gameName } = getPuuidResponse.data;

        // Get summoner data using puuid
        console.log(`Requesting summoner data by PUUID: ${puuid}`);
        const summonerResponse = await axios.get(`https://${sum_region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`);
        // console.log("DEBUG: Summoner Response:", summonerResponse.data);

        // Send all data from summonerResponse along with gameName
        res.json({
            summonerName: gameName,  // gameName from getPuuidResponse
            ...summonerResponse.data // Include all data from summonerResponse
        });
    } catch (error) {
        if (error.response) {
            console.error('API Response Error:', error.response.data);
            res.status(error.response.status).json({ error: error.response.data.message || 'Summoner data not found' });
        } else {
            console.error('Unknown Error:', error.message);
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
