import { getGameModeName, getChampionNameById, formatTimeInGame, isRankedGame, getGameTypeName } from './utils.js';

// Event listener for form submission
document.getElementById('summoner-form').addEventListener('submit', handleFormSubmit);

// Event listener for the "CAM.GG" link to reset the page
document.getElementById('home-link').addEventListener('click', handleHomeLinkClick);

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const { summonerName, summonerTagline } = getFormInput();
    if (!validateInput(summonerName, summonerTagline)) return;

    toggleLoadingSpinner(true);

    try {
        const latestVersion = await fetchLatestVersion();
        const summonerData = await fetchSummonerData(summonerName, summonerTagline);
        displayStats(summonerData, latestVersion);
        await checkInGameStatus(summonerData.puuid, latestVersion);
    } catch (error) {
        handleFetchError(error);
    } finally {
        toggleLoadingSpinner(false);
    }
}

// Function to get form input values
function getFormInput() {
    const summonerName = document.getElementById('summoner-name').value.trim();
    let summonerTagline = document.getElementById('summoner-tagline').value.trim() || 'NA1';
    if (summonerTagline.includes("#")) {
        summonerTagline = summonerTagline.replace("#", "");
    }
    return { summonerName, summonerTagline };
}

// Function to validate form input
function validateInput(summonerName, summonerTagline) {
    if (!summonerName || !summonerTagline) {
        alert("Please enter a summoner name and tagline.");
        return false;
    }
    return true;
}

// Function to handle the "CAM.GG" link click event
function handleHomeLinkClick(event) {
    event.preventDefault();
    resetPage();
}

// Function to reset the page
function resetPage() {
    document.getElementById('summoner-name').value = '';
    document.getElementById('summoner-tagline').value = '';

    const statsDiv = document.getElementById('stats');
    statsDiv.style.display = 'none';
    statsDiv.innerHTML = '';

    const inGameStatusDiv = document.getElementById('in-game-status');
    inGameStatusDiv.style.display = 'none';
    inGameStatusDiv.innerHTML = '';

    document.getElementById('champion-icon').style.display = 'none';
    document.getElementById('summoner-name').focus();
}

// Function to show or hide the loading spinner
function toggleLoadingSpinner(show) {
    document.getElementById('loading-spinner').style.display = show ? 'block' : 'none';
}

// Function to handle fetch errors
function handleFetchError(error) {
    console.error('Error fetching summoner data:', error);
    const statsDiv = document.getElementById('stats');
    statsDiv.innerText = 'Error retrieving data. Summoner not found';
    statsDiv.style.display = 'block';
    document.getElementById('in-game-status').style.display = 'none';
}

// Function to fetch the latest Data Dragon version
async function fetchLatestVersion() {
    const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await versionResponse.json();
    return versions[0];
}

// Function to fetch summoner data
async function fetchSummonerData(summonerName, summonerTagline) {
    const response = await fetch(`/summoner/${encodeURIComponent(summonerName)}/${encodeURIComponent(summonerTagline)}`);
    if (!response.ok) {
        throw new Error('Summoner not found or error in API call.');
    }
    return response.json();
}

// Function to check if summoner is in-game
async function checkInGameStatus(puuid, latestVersion) {
    if (!puuid) {
        console.error("PUUID not found.");
        return;
    }

    clearInGameStatus();

    try {
        const inGameResponse = await fetch(`/ingame/${puuid}`);
        if (!inGameResponse.ok) {
            throw new Error('Error fetching in-game data.');
        }

        const inGameData = await inGameResponse.json();
        handleInGameData(inGameData, puuid, latestVersion);
    } catch (error) {
        console.error('Error fetching in-game status:', error);
        clearInGameStatus();
    }
}

// Function to clear in-game status content
function clearInGameStatus() {
    const inGameStatusDiv = document.getElementById('in-game-status');
    inGameStatusDiv.style.display = 'none';
    inGameStatusDiv.innerHTML = '';
}

// Function to handle and display in-game data
async function handleInGameData(inGameData, puuid, latestVersion) {
    if (inGameData.message) {
        document.getElementById('in-game-status').style.display = 'block';
        document.getElementById('in-game-status').innerHTML = '<p>Summoner is not currently in a game.</p>';
    } else {
        const participant = inGameData.participants.find(p => p.puuid === puuid);
        if (participant) {
            displayInGameStatus(inGameData, participant, latestVersion);
        } else {
            console.log("Participant with matching puuid not found in game.");
            document.getElementById('in-game-status').style.display = 'none';
        }
    }
}

// Function to display in-game status
async function displayInGameStatus(inGameData, participant, latestVersion) {
    const gameMode = getGameModeName(inGameData.gameMode);
    const championName = await getChampionNameById(participant.championId, latestVersion);
    const championImageUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championName}.png`;
    const timeInGame = formatTimeInGame(inGameData.gameLength);
    const matchType = getGameTypeName(inGameData.gameType);
    const rankedStatus = isRankedGame(inGameData.gameQueueConfigId) ? 'Ranked Game' : matchType;

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
        <img id="champion-icon" src="${championImageUrl}" alt="Champion Icon" style="width: 90px; height: 90px; margin-left: 0px; border-radius: 10px;">
    `;
}

// Function to display summoner stats
function displayStats(data, latestVersion) {
    const statsDiv = document.getElementById('stats');
    const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${data.profileIconId}.png`;

    let rankedHtml = '';

    if (data.rankedData && data.rankedData.length > 0) {
        const soloDuoQueue = data.rankedData.find(queue => queue.queueType === "RANKED_SOLO_5x5");
        rankedHtml = soloDuoQueue ? getRankedStatsHtml(soloDuoQueue) : '<p>No Solo/Duo ranked stats available.</p>';
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

// Function to get ranked stats HTML
function getRankedStatsHtml(queueData) {
    const wins = queueData.wins;
    const losses = queueData.losses;
    const totalGames = wins + losses;
    const winRate = ((wins / totalGames) * 100).toFixed(2);

    return `
        <h3>Ranked Stats:</h3>
        <p>Rank: ${queueData.tier} ${queueData.rank}</p>
        <p>LP: ${queueData.leaguePoints}</p>
        <p>Wins: ${wins}</p>
        <p>Losses: ${losses}</p>
        <p>Win Rate: ${winRate}%</p>
    `;
}
