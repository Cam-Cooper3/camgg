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

    // Display warning to user if nothing is entered in prompt(s)
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

        // Pass puuid for in-game status check
        checkInGameStatus(data.puuid);
    } catch (error) {
        console.error('Error fetching summoner data:', error);
        document.getElementById('stats').innerText = 'Error retrieving data. Summoner not found';
    } finally {
        // Hide loading spinner
        document.getElementById('loading-spinner').style.display = 'none';
    }
});


// Function to check if summoner is in-game
async function checkInGameStatus(puuid) {
    try {
        const inGameResponse = await fetch(`/ingame/${puuid}`);
        const inGameData = await inGameResponse.json();

        if (inGameData.message) {
            document.getElementById('in-game-status').innerText = inGameData.message;
        } else if (inGameData.participants && inGameData.participants.length > 0) {
            // Display relevant in-game data
            document.getElementById('in-game-status').innerText = `In-game: ${inGameData.gameMode}, Champion: ${inGameData.participants[0].championId}, Time in game: ${Math.floor(inGameData.gameLength / 60) + 2} minutes`;
        } else {
            document.getElementById('in-game-status').innerText = 'Unable to retrieve in-game data.';
        }
    } catch (error) {
        console.error('Error fetching in-game status:', error);
        document.getElementById('in-game-status').innerText = 'Error retrieving in-game status.';
    }
}

// Function to display ranked stats of summoner
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
