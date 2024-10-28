# CAM.GG - League of Legends Stats Tool

## Overview

**CAM.GG** is a web application that allows users to search for a League of Legends summoner by name and retrieve their ranked data, such as rank and win rate, using the Riot Games API. It also displays whether the summoner is currently in a live game, including information about the game type, mode, and the champion being played.

## Features

- Fetch summoner data based on the summoner's name and tagline.
- Display summoner's rank and win rate for different queue types.
- Display live game status, including game mode, match type (Ranked/Normal/Custom), and champion details.
- Shows a loading spinner while fetching data.
- Basic error handling for invalid requests or API issues.

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- A valid **Riot API Key**.

### Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/league-app.git
    cd league-app
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env` file in the `config/` directory.
    - Add your **Riot API Key** to the `.env` file like this:
      ```bash
      RIOT_API_KEY=your-api-key-here
      ```

4. **Bundle the frontend using Webpack**:
    ```bash
    npx webpack --config config/webpack.config.js
    ```

5. **Run the server**:
    ```bash
    node ./server/server.js
    ```

6. Open your browser and navigate to `http://localhost:3000` to access the tool.

> [!NOTE]
> - **During development:** Enable watch mode in `webpack.config.js` to automatically bundle when you make changes.
> - **Before deployment:** Manually bundle once with `webpack --mode production` for optimized production builds and change `watch: false` in `webpack.config.js`.

## Usage

1. Enter a **Summoner Name** and a **Tagline** (e.g., `SummonerName` with `#NA1`).
2. Click **Get Stats** to retrieve summoner data.
3. The summoner's profile information, ranked stats, and win rate will be displayed.
4. If the summoner is currently in a game, the in-game status will be shown, including game mode, match type (Ranked/Normal/Custom), and the champion they are playing.

## Tech Stack

- **Node.js & Express**: Handles backend routes and API requests.
- **Axios**: For making HTTP requests to Riot's API.
- **HTML/CSS**: Frontend structure and styling.
- **JavaScript**: Frontend interactions and data rendering.
- **Dotenv**: For managing environment variables.
- **Riot Games API**: Used for fetching summoner and ranked data.
- **Webpack**: For bundling frontend JavaScript.
- **CommonJS**: For module handling in Node.js.

## Project Structure

```bash
league-app/
├── common/                   # Shared utilities between frontend and backend
│   └── commonUtils.js        # Utility functions shared between frontend and backend
├── config/                   # Contains environment variables and Webpack configuration
│   ├── .env                  # Environment variables (API key, ignored in Git) 
│   └── webpack.config.js     # Webpack configuration for bundling frontend
├── node_modules/             # Installed dependencies (ignored in Git)
├── public/                   # Frontend code and assets
│   ├── bundle.js             # Loads all fontend code in single request (ignored in Git)
│   ├── index.html            # Main HTML file
│   ├── script.js             # Frontend JavaScript logic
│   ├── style.css             # Styling for the application
│   └── utils.js              # Frontend-specific utilities
├── server/                   # Backend server and routes
│   ├── routes/               # API routes for backend
│   │   ├── summonerRoutes.js # Routes for summoner-related API calls
│   │   ├── inGameRoutes.js   # Routes for live game data
│   │   └── utils.js          # Backend-specific utilities
│   └── server.js             # Main server-side code
├── .gitignore                # Specifies files and directories to ignore in Git
├── package.json              # Project metadata and dependencies
├── package-lock.json         # Dependency lock file
└── README.md                 # Project documentation
```

### Common Utilities

**`/common/commonUtils.js`**: Contains shared utility functions such as:

-   `getGameModeName()`: Maps game modes to readable names.
-   `getGameTypeName()`: Identifies the game type (e.g., Custom or Normal).
-   `formatTimeInGame()`: Formats time from seconds into a readable `minutes:seconds` format.
-   `isRankedGame()`: Checks if a game is a ranked game based on queue ID.

### Configuration

**`/config/.env`**: Contains environment variables, primarily the Riot API key.

**`/config/webpack.config.js`**: Contains the Webpack configuration used for bundling the frontend JavaScript.

### Frontend (Public)

**`/public/index.html`**:

-   Defines the structure of the webpage.
-   Contains the summoner name and tagline input fields and a form to submit.
-   Elements to display loading, stats, in-game status, and champion information.

**`/public/script.js`**:

-   Handles form submission for summoner search.
-   Fetches summoner data and displays ranked information.
-   Checks if the summoner is in a game and displays in-game details.

**`/public/style.css`**:

-   Contains the styling for the page, which includes a dark theme.

**`/public/utils.js`**:

-   Imports shared utilities from `commonUtils.js`.
-   Has a frontend-specific function, `getChampionNameById()`, which fetches champion names using Data Dragon API.

### Backend (Server)

**`/server/server.js`**:

-   Sets up the Express server.
-   Serves static files from the `public` directory.
-   Defines routes for `/summoner` and `/ingame` using imported route modules.

**`/server/routes/inGameRoutes.js`**:

-   Defines the `/ingame/:puuid` endpoint.
-   Uses the Riot Spectator API to check if a summoner is currently in a game.
-   Responds with in-game data or error messages.

**`/server/routes/summonerRoutes.js`**:

-   Defines the `/summoner/:name/:tagline` endpoint.
-   Retrieves a summoner's data, including PUUID, level, profile icon, and ranked data.

**`/server/routes/utils.js`**:

-   Imports utility functions from `commonUtils.js`.
-   Has a backend-specific function, `getChampionNameById()`, to fetch champion names using Data Dragon API.

API Used
--------

Riot Games API: Used to fetch summoner data, including ranked stats and profile details.

License
-------

This project is licensed under the MIT License.