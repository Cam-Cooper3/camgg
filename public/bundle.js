/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/script.js":
/*!**************************!*\
  !*** ./public/script.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ \"./public/utils.js\");\n\r\n\r\n// Centralized error handler for displaying error messages\r\nfunction displayError(message, elementId = 'stats') {\r\n    const element = document.getElementById(elementId);\r\n    element.innerHTML = `<p style=\"color: red;\">${message}</p>`;\r\n    element.style.display = 'block';\r\n}\r\n\r\n// Fetch data from the server or external APIs\r\nasync function fetchData(url) {\r\n    try {\r\n        const response = await fetch(url);\r\n        if (!response.ok) {\r\n            throw new Error('Error in API call');\r\n        }\r\n        return await response.json();\r\n    } catch (error) {\r\n        console.error('Error fetching data:', error);\r\n        return null;\r\n    }\r\n}\r\n\r\ndocument.getElementById('summoner-form').addEventListener('submit', async (e) => {\r\n    e.preventDefault();  // Prevent form from reloading the page\r\n\r\n    const summonerName = document.getElementById('summoner-name').value.trim(); \r\n    var summonerTagline = document.getElementById('summoner-tagline').value.trim();\r\n    \r\n    // If the user does not enter a tagline, default to NA1\r\n    var summonerTagline = summonerTagline || 'NA1';\r\n\r\n    // Remove the # from the tagline if the user enters it\r\n    if (summonerTagline.includes(\"#\")) {\r\n        summonerTagline = summonerTagline.replace(\"#\", \"\");\r\n    }\r\n\r\n    // Display page warning to user if nothing is entered in prompt(s)\r\n    if (!summonerName || !summonerTagline) {  // Check for both summoner name and tagline\r\n        alert(\"Please enter a summoner name and tagline.\");\r\n        return;\r\n    }\r\n\r\n    // Show loading spinner\r\n    document.getElementById('loading-spinner').style.display = 'block';\r\n\r\n    try {\r\n        // Fetch the latest Data Dragon version\r\n        const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');\r\n        const versions = await versionResponse.json();\r\n        const latestVersion = versions[0];  // Get the latest version\r\n\r\n        // Send a request to the server to get summoner data\r\n        const response = await fetch(`/summoner/${encodeURIComponent(summonerName)}/${encodeURIComponent(summonerTagline)}`);\r\n        if (!response.ok) {\r\n            throw new Error('Summoner not found or error in API call.');\r\n        }\r\n        const data = await response.json();\r\n        displayStats(data, latestVersion);\r\n\r\n        // Pass puuid and latest version for in-game status check\r\n        checkInGameStatus(data.puuid, latestVersion);\r\n    } catch (error) {\r\n        console.error('Error fetching summoner data:', error);\r\n        document.getElementById('stats').innerText = 'Error retrieving data. Summoner not found';\r\n    } finally {\r\n        // Hide loading spinner\r\n        document.getElementById('loading-spinner').style.display = 'none';\r\n    }\r\n});\r\n\r\n// Function to check if summoner is in-game\r\nasync function checkInGameStatus(puuid, latestVersion) {\r\n    if (!puuid) {\r\n        return;  // If no puuid is provided, exit the function\r\n    }\r\n\r\n    // Clear or hide the in-game status section before making a new request\r\n    document.getElementById('in-game-status').style.display = 'none';\r\n    document.getElementById('in-game-status').innerHTML = '';  // Clear previous content\r\n\r\n    try {\r\n        const inGameResponse = await fetch(`/ingame/${puuid}`);\r\n        const inGameData = await inGameResponse.json();\r\n\r\n        if (inGameData.message) {\r\n            // Show the in-game status section and display the message\r\n            document.getElementById('in-game-status').style.display = 'block';\r\n            document.getElementById('in-game-status').innerText = inGameData.message;\r\n        } else {\r\n            // Find the correct participant by matching puuid\r\n            const participant = inGameData.participants.find(p => p.puuid === puuid);\r\n\r\n            if (participant) {\r\n                const gameMode = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getGameModeName)(inGameData.gameMode);\r\n                const championName = await (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getChampionNameById)(participant.championId, latestVersion);\r\n                const timeInGame = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTimeInGame)(inGameData.gameLength);\r\n                \r\n                // Check if the game is custom or matched\r\n                const matchType = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getGameTypeName)(inGameData.gameType);\r\n\r\n                // Check if the game is ranked\r\n                const rankedStatus = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isRankedGame)(inGameData.gameQueueConfigId) ? 'Ranked Game' : matchType;\r\n\r\n                // Display the in-game status and show the section\r\n                document.getElementById('in-game-status').style.display = 'block';\r\n                document.getElementById('in-game-status').innerHTML = `\r\n                    <h3>In-Game Status:</h3>\r\n                    <p>Game Mode: ${gameMode}</p>\r\n                    <p>Match Type: ${rankedStatus}</p>\r\n                    <p>Champion: ${championName}</p>\r\n                    <p>Time in game: ${timeInGame}</p>\r\n                `;\r\n            } else {\r\n                document.getElementById('in-game-status').style.display = 'block';\r\n                document.getElementById('in-game-status').innerText = 'Summoner not found in game.';\r\n            }\r\n        }\r\n    } catch (error) {\r\n        console.error('Error fetching in-game status:', error);\r\n        document.getElementById('in-game-status').style.display = 'block';\r\n        document.getElementById('in-game-status').innerText = 'Error retrieving in-game status.';\r\n    }\r\n}\r\n\r\nfunction displayStats(data, latestVersion) {\r\n    const statsDiv = document.getElementById('stats');\r\n    const profileIconUrl = `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${data.profileIconId}.png`;\r\n\r\n    let rankedHtml = '';\r\n\r\n    // Check if ranked data is available\r\n    if (data.rankedData && data.rankedData.length > 0) {\r\n        // Filter for a specific ranked queue if needed (e.g., Solo/Duo)\r\n        const soloDuoQueue = data.rankedData.find(queue => queue.queueType === \"RANKED_SOLO_5x5\");\r\n\r\n        if (soloDuoQueue) {\r\n            const wins = soloDuoQueue.wins;\r\n            const losses = soloDuoQueue.losses;\r\n            const totalGames = wins + losses;\r\n            const winRate = ((wins / totalGames) * 100).toFixed(2);\r\n\r\n            rankedHtml = `\r\n                <h3>Ranked Stats:</h3>\r\n                <p>Rank: ${soloDuoQueue.tier} ${soloDuoQueue.rank}</p>\r\n                <p>LP: ${soloDuoQueue.leaguePoints}</p>\r\n                <p>Wins: ${wins}</p>\r\n                <p>Losses: ${losses}</p>\r\n                <p>Win Rate: ${winRate}%</p>\r\n            `;\r\n        } else {\r\n            rankedHtml = '<p>No Solo/Duo ranked stats available.</p>';\r\n        }\r\n    } else {\r\n        rankedHtml = '<p>No ranked stats available.</p>';\r\n    }\r\n\r\n    statsDiv.innerHTML = `\r\n        <h2>Summoner: ${data.summonerName}</h2>\r\n        <p>Level: ${data.summonerLevel}</p>\r\n        <img src=\"${profileIconUrl}\" alt=\"Profile Icon\" id=\"profile-icon\" style=\"width:100px;height:100px;border-radius:50px\">\r\n        ${rankedHtml}\r\n    `;\r\n\r\n    // Show the stats section if it's hidden\r\n    statsDiv.style.display = 'block';\r\n}\r\n\n\n//# sourceURL=webpack://league-app/./public/script.js?");

/***/ }),

/***/ "./public/utils.js":
/*!*************************!*\
  !*** ./public/utils.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   formatTimeInGame: () => (/* binding */ formatTimeInGame),\n/* harmony export */   getChampionNameById: () => (/* binding */ getChampionNameById),\n/* harmony export */   getGameModeName: () => (/* binding */ getGameModeName),\n/* harmony export */   getGameTypeName: () => (/* binding */ getGameTypeName),\n/* harmony export */   isRankedGame: () => (/* binding */ isRankedGame)\n/* harmony export */ });\n// Import shared utilities from commonUtils.js\r\nconst { getGameModeName, getGameTypeName, formatTimeInGame, isRankedGame } = __webpack_require__(/*! ../shared/commonUtils */ \"./shared/commonUtils.js\");\r\n\r\n// Frontend-specific logic for fetching champion name\r\nasync function getChampionNameById(championId, latestVersion) {\r\n    try {\r\n        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);\r\n        const championData = await response.json();\r\n\r\n        for (let champKey in championData.data) {\r\n            if (championData.data[champKey].key == championId) {\r\n                return championData.data[champKey].name;\r\n            }\r\n        }\r\n    } catch (error) {\r\n        console.error('Error fetching champion data:', error);\r\n        return 'Unknown Champion';\r\n    }\r\n}\r\n\r\n// Re-export the shared utilities for frontend use\r\n\r\n\n\n//# sourceURL=webpack://league-app/./public/utils.js?");

/***/ }),

/***/ "./shared/commonUtils.js":
/*!*******************************!*\
  !*** ./shared/commonUtils.js ***!
  \*******************************/
/***/ ((module) => {

eval("// Utility function to map game modes\r\nfunction getGameModeName(gameMode) {\r\n    const gameModes = {\r\n        CLASSIC: \"Summoner's Rift\",\r\n        ARAM: \"ARAM\",\r\n    };\r\n    return gameModes[gameMode] || gameMode;  // Default to the original mode if not mapped\r\n}\r\n\r\n// Utility function to map game types\r\nfunction getGameTypeName(gameType) {\r\n    if (gameType === 'CUSTOM') {\r\n        return 'Custom Match';\r\n    } else if (gameType === 'MATCHED' || gameType === 'NORMAL') {\r\n        return 'Normal Game';\r\n    }\r\n    return 'Unknown Game Type';\r\n}\r\n\r\n// Utility function to format time in-game\r\nfunction formatTimeInGame(seconds) {\r\n    const minutes = Math.floor(seconds / 60);\r\n    const remainingSeconds = seconds % 60;\r\n    return `${minutes}m ${remainingSeconds}s`;\r\n}\r\n\r\n// Utility function to check if a game is ranked\r\nfunction isRankedGame(gameQueueConfigId) {\r\n    const rankedQueues = [420, 440];  // Ranked Solo/Duo and Ranked Flex queue IDs\r\n    return rankedQueues.includes(gameQueueConfigId);\r\n}\r\n\r\n// Export for CommonJS (Node.js)\r\nmodule.exports = {\r\n    getGameModeName,\r\n    getGameTypeName,\r\n    formatTimeInGame,\r\n    isRankedGame\r\n};\r\n\n\n//# sourceURL=webpack://league-app/./shared/commonUtils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/script.js");
/******/ 	
/******/ })()
;