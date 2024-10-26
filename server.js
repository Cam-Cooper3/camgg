require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const API_KEY = process.env.RIOT_API_KEY;
const tag_line = "NA1";
const acc_region = 'americas';
const sum_region = 'na1'; // Adjust to euw1, kr, etc., based on the summoner region

app.use(express.static('public'));

app.get('/summoner/:name', async (req, res) => {
    const summonerName = encodeURIComponent(req.params.name);
    try {
        // Fetching puuid
        const getPuuidResponse = await axios.get(`https://${acc_region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag_line}?api_key=${API_KEY}`);        
        const puuid = getPuuidResponse.data.puuid;
        
        // Using puuid to fetch summoner data
        const summonerResponse = await axios.get(`https://${sum_region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`);
        
        res.json(summonerResponse.data);
    } catch (error) {
        if (error.response) {
            console.error('Error fetching data:', error.response.data);
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            console.error('Unknown Error:', error.message);
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
