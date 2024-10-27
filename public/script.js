document.getElementById('summoner-form').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent form from reloading the page

    const summonerName = document.getElementById('summoner-name').value.trim(); 
    var summonerTagline = document.getElementById('summoner-tagline').value.trim();
    
    // If the user does not enter a tagline, default to NA1
    var summonerTagline = summonerTagline || 'NA1';

    // Remove the # from the tagline if the user enters it
    if (summonerTagline.includes("#")) {
        summonerTagline = summonerTagline.replace("#", "");
    }

    // Display page warning to user if nothing is entered in prompt(s)
    if (!summonerName) {
        alert("Please enter both summoner name and tagline.");
        return;
    }

    // Show loading spinner
    document.getElementById('loading-spinner').style.display = 'block';

    try {
        // Fetch the latest Data Dragon version
        const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionResponse.json();
        const latestVersion = versions[0];  // Get the latest version

        // Send a request to the server to get summoner data
        const response = await fetch(`/summoner/${encodeURIComponent(summonerName)}/${encodeURIComponent(summonerTagline)}`);
        if (!response.ok) {
            throw new Error('Summoner not found or error in API call.');
        }
        const data = await response.json();
        displayStats(data, latestVersion);  // Pass the latest version to displayStats

        // Pass puuid and latest version for in-game status check
        checkInGameStatus(data.puuid, latestVersion);  // Pass latestVersion here
    } catch (error) {
        console.error('Error fetching summoner data:', error);
        document.getElementById('stats').innerText = 'Error retrieving data. Summoner not found';
    } finally {
        // Hide loading spinner
        document.getElementById('loading-spinner').style.display = 'none';
    }
});

// Function to check if summoner is in-game
async function checkInGameStatus(puuid, latestVersion) {
    try {
        const inGameResponse = await fetch(`/ingame/${puuid}`);
        const inGameData = await inGameResponse.json();

        if (inGameData.message) {
            document.getElementById('in-game-status').innerText = inGameData.message;
        } else {
            // Find the correct participant by matching puuid
            const participant = inGameData.participants.find(p => p.puuid === puuid);

            if (participant) {
                const gameMode = getGameModeName(inGameData.gameMode);
                const championName = await getChampionNameById(participant.championId, latestVersion);
                const timeInGame = formatTimeInGame(inGameData.gameLength);
                
                // Check if the match is ranked
                const rankedStatus = isRankedGame(inGameData.gameQueueConfigId) ? 'Ranked Game' : 'Normal Game';

                document.getElementById('in-game-status').innerHTML = `
                    <strong>In-Game Status:</strong> <br>
                    Game Mode: ${gameMode} <br>
                    Match Type: ${rankedStatus} <br>
                    Champion: ${championName} <br>
                    Time in game: ${timeInGame}
                `;
            } else {
                document.getElementById('in-game-status').innerText = 'Summoner not found in game.';
            }
        }
    } catch (error) {
        console.error('Error fetching in-game status:', error);
        document.getElementById('in-game-status').innerText = 'Error retrieving in-game status.';
    }
}

// Function to get champion name from Data Dragon
async function getChampionNameById(championId, latestVersion) {
    try {
        // Fetch champion data using the latest game version
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
        const championData = await response.json();
        
        for (let champKey in championData.data) {
            if (championData.data[champKey].key == championId) {
                return championData.data[champKey].name;
            }
        }
    } catch (error) {
        console.error('Error fetching champion data:', error);
    }
    return 'Unknown Champion';
}

// Function to map the game mode to something more "human-readable"
function getGameModeName(gameMode) {
    const gameModes = {
        CLASSIC: "Summoner's Rift",
        ARAM: "ARAM",
        // Add more mappings as needed
    };
    return gameModes[gameMode] || gameMode;  // Default to the original mode if not mapped
}

// Function to check if the game is a ranked match based on gameQueueConfigId
function isRankedGame(gameQueueConfigId) {
    const rankedQueues = [420, 440];  // Ranked Solo/Duo and Ranked Flex queue IDs
    return rankedQueues.includes(gameQueueConfigId);
}

// Function to format the in-game time
function formatTimeInGame(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Function to display summoner ranked stats
function displayStats(data, latestVersion) {
    const statsDiv = document.getElementById('stats');
    const profileIconUrl = `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${data.profileIconId}.png`;

    let rankedHtml = '';

    // Check if ranked data is available
    if (data.rankedData && data.rankedData.length > 0) {
        rankedHtml = '<h3>Ranked Stats:</h3>';
        data.rankedData.forEach(queue => {
            const wins = queue.wins;
            const losses = queue.losses;
            const totalGames = wins + losses;
            const winRate = ((wins / totalGames) * 100).toFixed(2);

            rankedHtml += `
                <p>Rank: ${queue.tier} ${queue.rank}</p>
                <p>LP: ${queue.leaguePoints} LP</p>
                <p>Wins: ${wins}</p>
                <p>Losses: ${losses}</p>
                <p>Win Rate: ${winRate}%</p>
            `;
        });
    } else {
        rankedHtml = '<p>This summoner has no ranked stats available.</p>';
    }

    statsDiv.innerHTML = `
        <h2>Summoner: ${data.summonerName}</h2>
        <p>Level: ${data.summonerLevel}</p>
        <img src="${profileIconUrl}" alt="Profile Icon" id="profile-icon" style="width:100px;height:100px;border-radius:50px">
        ${rankedHtml}
    `;
}
