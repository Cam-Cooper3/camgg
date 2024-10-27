# CAM.GG - League of Legends Stats Tool

## Overview

**CAM.GG** is a web application allows users to search for a League of Legends summoner by name and retrieve their ranked data, such as rank and win rate, using the Riot Games API.

## Features

-   Fetch summoner data based on the summoner's name and tagline.
-   Display summoner's rank and win rate for different queue types.
-   Shows a loading spinner while fetching data.
-   Basic error handling for invalid requests or API issues.

## Tech Stack

-   **Node.js & Express**: Handles backend routes and API requests.
-   **Axios**: For making HTTP requests to Riot's API.
-   **HTML/CSS**: Frontend structure and styling.
-   **JavaScript**: Frontend interactions and data rendering.
-   **Dotenv**: For managing environment variables.
-   **Riot Games API**: Used for fetching summoner and ranked data.

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

4. **Run the server**:
    ```bash
    node server.js
    ```

5. Open your browser and navigate to `http://localhost:3000` to access the tool.

## Usage

1. Enter a **Summoner Name** and a **Tagline** (e.g., `SummonerName` with `#NA1`).
2. Click **Get Stats** to retrieve summoner data.
3. The summoner's profile information, ranked stats, and win rate will be displayed.
4. ...

## Project Structure

```bash
league-app/
├── .env                    # Environment variables (API key)
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Dependency lock file
├── README.md               # Project documentation
├── server.js               # Main server-side code
├── public/                 # Frontend code and assets
│   ├── index.html          # Main HTML file
│   ├── script.js           # Frontend JavaScript logic
│   ├── style.css           # Styling for the application
│   └── utils.js            # Utility functions for the frontend
└── routes/                 # API routes for backend
    ├── summonerRoutes.js   # Routes for summoner-related API calls
    └── inGameRoutes.js     # Routes for live game data (feature paused)`
```

## API Used
Riot Games API: Used to fetch summoner data, including ranked stats and profile details.

## License
This project is licensed under the MIT License.