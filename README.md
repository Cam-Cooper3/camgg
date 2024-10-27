# CAM.GG - League of Legends Stats Tool

## Overview

**CAM.GG** is a web application that allows users to search for a League of Legends summoner by name and retrieve their ranked data, such as rank and win rate, using the Riot Games API. It also displays whether the summoner is currently in a live game, including information about the game type, mode, and the champion being played.

## Features

-   Fetch summoner data based on the summoner's name and tagline.
-   Display summoner's rank and win rate for different queue types.
-   Display live game status, including game mode, match type (Ranked/Normal/Custom), and champion details.
-   Shows a loading spinner while fetching data.
-   Basic error handling for invalid requests or API issues.

## Tech Stack

-   **Node.js & Express**: Handles backend routes and API requests.
-   **Axios**: For making HTTP requests to Riot's API.
-   **HTML/CSS**: Frontend structure and styling.
-   **JavaScript**: Frontend interactions and data rendering.
-   **Dotenv**: For managing environment variables.
-   **Riot Games API**: Used for fetching summoner and ranked data.
-   **Webpack**: For bundling frontend JavaScript.
-   **CommonJS**: For module handling in Node.js.

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
    - Create a `.env` file in the root directory.
    - Add your **Riot API Key** to the `.env` file like this:
      ```bash
      RIOT_API_KEY=your-api-key-here
      ```

4. **Bundle the frontend using Webpack**:
    ```bash
    npx webpack
    ```

5. **Run the server**:
    ```bash
    node server.js
    ```

6. Open your browser and navigate to `http://localhost:3000` to access the tool.

> [!NOTE]
> - **During development:** Enable watch mode in `webpack.config.js` to automatically bundle when you make changes.
> - **Before deployment:** Manually bundle once with `webpack --mode production` for optimized production builds and change `watch: true` in `webpack.config.js`.

## Usage

1. Enter a **Summoner Name** and a **Tagline** (e.g., `SummonerName` with `#NA1`).
2. Click **Get Stats** to retrieve summoner data.
3. The summoner's profile information, ranked stats, and win rate will be displayed.
4. If the summoner is currently in a game, the in-game status will be shown, including game mode, match type (Ranked/Normal/Custom), and the champion they are playing.

## Project Structure

```bash
league-app/
├── .env                    # Environment variables (API key)
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Dependency lock file
├── webpack.config.js       # Webpack configuration for bundling frontend
├── README.md               # Project documentation
├── server.js               # Main server-side code
├── public/                 # Frontend code and assets
│   ├── index.html          # Main HTML file
│   ├── script.js           # Frontend JavaScript logic
│   ├── style.css           # Styling for the application
│   └── utils.js            # Frontend-specific utilities
├── shared/                 # Shared utilities between frontend and backend
│   └── commonUtils.js      # Utility functions shared between frontend and backend
└── routes/                 # API routes for backend
    ├── summonerRoutes.js   # Routes for summoner-related API calls
    └── inGameRoutes.js     # Routes for live game data
```

**Frontend (public directory):**

-   **index.html:** Basic structure with inputs for summoner name and tagline, and a button to submit the form.
-   **script.js:** Handles the frontend logic, such as making API calls to the backend, handling responses, and updating the UI.
-   **style.css:** Provides styling, mainly focusing on a dark theme with clean, minimal design.
-   **utils.js:** Contains frontend-specific utilities, such as fetching champion names from the Riot API and exporting shared utilities.

**Shared Utilities (shared directory):**

-   **commonUtils.js:** Contains shared utility functions, such as retrieving game modes, formatting in-game time, and checking ranked status, used by both frontend and backend.

**Backend (routes directory):**

-   **server.js:** Main server file, setting up Express.js, serving static files, and routing API requests to different modules (summoner and in-game data).
-   **summonerRoutes.js:** Fetches summoner data and ranked stats from the Riot API using summoner name and tagline.
-   **inGameRoutes.js:** Fetches current in-game data for a summoner using the Spectator v5 API.
-   **utils.js:** Backend-specific utility functions that use shared logic from `commonUtils.js`.

API Used
--------

Riot Games API: Used to fetch summoner data, including ranked stats and profile details.

License
-------

This project is licensed under the MIT License.