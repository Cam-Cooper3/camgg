document.getElementById('summoner-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const summonerName = document.getElementById('summoner-name').value.trim(); // Trim to avoid extra spaces
    if (!summonerName) {
        alert("Please enter a summoner name.");
        return;
    }

    try {
        // Send a request to the server to get summoner data
        const response = await fetch(`/summoner/${encodeURIComponent(summonerName)}`); // Encode the name for URL safety
        if (!response.ok) {
            throw new Error('Summoner not found or error in API call.');
        }
        const data = await response.json();
        displayStats(data);
    } catch (error) {
        console.error('Error fetching summoner data:', error);
        document.getElementById('stats').innerText = 'Error retrieving data. Summoner not found or API issue.';
    }
});

function displayStats(data) {
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
        <h2>Summoner: ${data.summonerName}</h2>
        <p>Level: ${data.summonerLevel}</p>
        <p>Profile Icon ID: ${data.profileIconId}</p>
    `;
}
