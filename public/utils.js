// Import shared utilities from commonUtils.js
const { getGameModeName, getGameTypeName, formatTimeInGame, isRankedGame } = require('../shared/commonUtils');

// Frontend-specific logic for fetching champion name
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

// Export the shared utilities for frontend use
export { getGameModeName, getGameTypeName, formatTimeInGame, isRankedGame };
