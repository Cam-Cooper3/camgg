// Utility function to map game modes
function getGameModeName(gameMode) {
    const gameModes = {
        CLASSIC: "Summoner's Rift",
        ARAM: "ARAM",
    };
    return gameModes[gameMode] || gameMode;  // Default to the original mode if not mapped
}

// Utility function to map game types
function getGameTypeName(gameType) {
    if (gameType === 'CUSTOM') {
        return 'Custom Match';
    } else if (gameType === 'MATCHED' || gameType === 'NORMAL') {
        return 'Normal Game';
    }
    return 'Unknown Game Type';
}

// Utility function to format time in-game
function formatTimeInGame(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Utility function to check if a game is ranked
function isRankedGame(gameQueueConfigId) {
    const rankedQueues = [420, 440];  // Ranked Solo/Duo and Ranked Flex queue IDs
    return rankedQueues.includes(gameQueueConfigId);
}

// Export for CommonJS (Node.js)
module.exports = {
    getGameModeName,
    getGameTypeName,
    formatTimeInGame,
    isRankedGame
};
