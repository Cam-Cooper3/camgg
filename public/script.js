document.getElementById('summoner-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const summonerName = document.getElementById('summoner-name').value;
    if (!summonerName) return;

    try {
        const response = await fetch(`/summoner/${summonerName}`);
        const data = await response.json();
        displayStats(data);
    } catch (error) {
        document.getElementById('stats').innerText = 'Error retrieving data.';
    }
});

function displayStats(data) {
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
        <h2>Summoner: ${data.name}</h2>
        <p>Level: ${data.summonerLevel}</p>
    `;
}

async function displayStats(data) {
    console.log(data); // Log the data to check its structure
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
        <h2>Summoner: ${data.name || "Name not found"}</h2>
        <p>Level: ${data.summonerLevel || "N/A"}</p>
    `;
}
