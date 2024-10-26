document.getElementById('summoner-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const summonerName = document.getElementById('summoner-name').value.trim(); 
    if (!summonerName) {
        alert("Please enter a summoner name.");
        return;
    }

    try {
        // Fetch the latest Data Dragon version
        const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionResponse.json();
        const latestVersion = versions[0];  // Get the latest version

        // Send a request to the server to get summoner data
        const response = await fetch(`/summoner/${encodeURIComponent(summonerName)}`);
        if (!response.ok) {
            throw new Error('Summoner not found or error in API call.');
        }
        const data = await response.json();
        displayStats(data, latestVersion);  // Pass the latest version to displayStats
    } catch (error) {
        console.error('Error fetching summoner data:', error);
        document.getElementById('stats').innerText = 'Error retrieving data. Summoner not found or API issue.';
    }
});

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
            const winRate = ((wins / totalGames) * 100).toFixed(2);  // Calculate win rate

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
        <img src="${profileIconUrl}" alt="Profile Icon" id="profile-icon" style="width:100px;height:100px;">
        ${rankedHtml}
    `;
}

