// Utility function to map game modes
export function getGameModeName(gameMode) {
    const gameModes = {
        CLASSIC: "Summoner's Rift",
        ARAM: "ARAM",
        // Add more mappings as needed
    };
    return gameModes[gameMode] || gameMode;  // Default to the original mode if not mapped
}

// Utility function to fetch champion name by ID
export async function getChampionNameById(championId, latestVersion) {
    try {
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
        const championData = await response.json();

        for (let champKey in championData.data) {
            if (championData.data[champKey].key == championId) {
                return championData.data[champKey].name;
            }
        }
    } catch (error) {
        console.error('Error fetching champion data:', error);
        return 'Unknown Champion';
    }
}

// Utility function to format time in-game
export function formatTimeInGame(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Utility function to check if a game is ranked
export function isRankedGame(gameQueueConfigId) {
    const rankedQueues = [420, 440];  // Ranked Solo/Duo and Ranked Flex queue IDs
    return rankedQueues.includes(gameQueueConfigId);
}
