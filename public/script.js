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
    console.log("Profile Icon ID: ", data.profileIconId); // Add this to check the icon ID
    const statsDiv = document.getElementById('stats');
    const profileIconUrl = `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${data.profileIconId}.png`; 

    statsDiv.innerHTML = `
        <h2>Summoner: ${data.summonerName}</h2>
        <p>Level: ${data.summonerLevel}</p>
        <img src="${profileIconUrl}" alt="Profile Icon" id="profile-icon" style="width:100px;height:100px;">
    `;
}
