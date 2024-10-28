import { getGameModeName, getChampionNameById, formatTimeInGame, isRankedGame, getGameTypeName } from './utils.js';

document.getElementById('summoner-form').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent form from reloading the page

    const summonerName = document.getElementById('summoner-name').value.trim(); 
    let summonerTagline = document.getElementById('summoner-tagline').value.trim();

    // If the user does not enter a tagline, default to NA1
    summonerTagline = summonerTagline || 'NA1';

    // Remove the # from the tagline if the user enters it
    if (summonerTagline.includes("#")) {
        summonerTagline = summonerTagline.replace("#", "");
    }

    // Display page warning to user if nothing is entered in prompt(s)
    if (!summonerName || !summonerTagline) {
        alert("Please enter a summoner name and tagline.");
        return;
    }

    // Show loading spinner
    document.getElementById('loading-spinner').style.display = 'block';

    try {
        const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionResponse.json();
        const latestVersion = versions[0];

        const response = await fetch(`/summoner/${encodeURIComponent(summonerName)}/${encodeURIComponent(summonerTagline)}`);
        if (!response.ok) {
            throw new Error('Summoner not found or error in API call.');
        }
        const data = await response.json();
        console.log("Summoner Data:", data); // Debugging Log
        displayStats(data, latestVersion);

        // Check if summoner is in-game
        await checkInGameStatus(data.puuid, latestVersion);
    } catch (error) {
        console.error('Error fetching summoner data:', error);
        document.getElementById('stats').innerText = 'Error retrieving data. Summoner not found';
        document.getElementById('stats').style.display = 'block';
        
        // Hide the in-game status div in case of an error
        document.getElementById('in-game-status').style.display = 'none';
    } finally {
        // Hide loading spinner
        document.getElementById('loading-spinner').style.display = 'none';
    }
});

// Function to check if summoner is in-game
async function checkInGameStatus(puuid, latestVersion) {
    if (!puuid) {
        console.error("PUUID not found.");
        return;
    }

    // Clear or hide the in-game status section before making a new request
    document.getElementById('in-game-status').style.display = 'none';
    document.getElementById('in-game-status').innerHTML = '';  // Clear previous content

    try {
        const inGameResponse = await fetch(`/ingame/${puuid}`);
        if (!inGameResponse.ok) {
            throw new Error('Error fetching in-game data.');
        }

        const inGameData = await inGameResponse.json();
        console.log("In-Game Data Response:", inGameData);

        if (inGameData.message) {
            // Summoner is not currently in a game
            document.getElementById('in-game-status').style.display = 'block';
            document.getElementById('in-game-status').innerHTML = '<p>Summoner is not currently in a game.</p>';
        } else {
            const participant = inGameData.participants.find(p => p.puuid === puuid);

            if (participant) {
                const gameMode = getGameModeName(inGameData.gameMode);
                const championName = await getChampionNameById(participant.championId, latestVersion);
                const championImageUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championName}.png`;

                // Format and display in-game time
                const timeInGame = formatTimeInGame(inGameData.gameLength);

                // Check if the game is custom or matched
                const matchType = getGameTypeName(inGameData.gameType);

                // Check if the game is ranked
                const rankedStatus = isRankedGame(inGameData.gameQueueConfigId) ? 'Ranked Game' : matchType;

                // Set up the HTML for the in-game status including the champion icon
                const inGameStatusDiv = document.getElementById('in-game-status');
                inGameStatusDiv.style.display = 'flex';
                inGameStatusDiv.style.alignItems = 'center';
                inGameStatusDiv.style.justifyContent = 'center';
                inGameStatusDiv.style.textAlign = 'center';

                inGameStatusDiv.innerHTML = `
                    <div style="flex-grow: 1;">
                        <h3>In-Game Status:</h3>
                        <p>Game Mode: ${gameMode}</p>
                        <p>Match Type: ${rankedStatus}</p>
                        <p>Champion: ${championName}</p>
                        <p>Time in game: ${timeInGame}</p>
                    </div>
                    <img id="champion-icon" src="${championImageUrl}" alt="Champion Icon" style="width: 90px; height: 90px; margin-left: -100px; border-radius: 10px;">
                `;
            } else {
                console.log("Participant with matching puuid not found in game.");
                document.getElementById('in-game-status').style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error fetching in-game status:', error);
        // Hide the in-game status div in case of an error
        document.getElementById('in-game-status').style.display = 'none';
    }
}

function displayStats(data, latestVersion) {
    const statsDiv = document.getElementById('stats');
    const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${data.profileIconId}.png`;

    let rankedHtml = '';

    if (data.rankedData && data.rankedData.length > 0) {
        const soloDuoQueue = data.rankedData.find(queue => queue.queueType === "RANKED_SOLO_5x5");

        if (soloDuoQueue) {
            const wins = soloDuoQueue.wins;
            const losses = soloDuoQueue.losses;
            const totalGames = wins + losses;
            const winRate = ((wins / totalGames) * 100).toFixed(2);

            rankedHtml = `
                <h3>Ranked Stats:</h3>
                <p>Rank: ${soloDuoQueue.tier} ${soloDuoQueue.rank}</p>
                <p>LP: ${soloDuoQueue.leaguePoints}</p>
                <p>Wins: ${wins}</p>
                <p>Losses: ${losses}</p>
                <p>Win Rate: ${winRate}%</p>
            `;
        } else {
            rankedHtml = '<p>No Solo/Duo ranked stats available.</p>';
        }
    } else {
        rankedHtml = '<p>No ranked stats available.</p>';
    }

    statsDiv.innerHTML = `
        <h2>Summoner: ${data.summonerName}</h2>
        <p>Level: ${data.summonerLevel}</p>
        <img src="${profileIconUrl}" alt="Profile Icon" id="profile-icon" style="width:100px;height:100px;border-radius:50px">
        ${rankedHtml}
    `;

    statsDiv.style.display = 'block';
}
