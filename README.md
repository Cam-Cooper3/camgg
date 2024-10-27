# CAM.GG - League of Legends Stats Tool

## Overview

**CAM.GG** is a League of Legends stats tool that retrieves real-time summoner data, including rank, win rate, and more using Riot Games' API. The project also includes a loading spinner to provide visual feedback while data is being fetched.

## Features

- Retrieve summoner details (level, profile icon, ranked stats) by entering a summoner's name and tagline.
- Displays ranked stats, including rank tier, LP, wins, losses, and win rate.
- Responsive design with a dark theme for a smooth user experience.
- Loading spinner for visual feedback during data fetching.

## Tech Stack

- **Node.js** (Express for server-side handling)
- **Axios** (for making API requests)
- **HTML/CSS/JavaScript** (for the frontend)
- **Riot Games API** (for summoner data)

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- A valid **Riot API Key**.

### Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/cam.gg.git
    cd cam.gg
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

5. Open your browser and navigate to `http://localhost:3000` to use the tool.

## Usage

1. Enter a **Summoner Name** and a **Tagline** (e.g., `SummonerName` with `#NA1`).
2. Click **Get Stats** to retrieve summoner data.
3. The summoner's profile information, ranked stats, and win rate will be displayed.
4. A loading spinner will appear while data is being fetched.
5. ...

## Project Structure

```bash
├── public
│   ├── index.html      # Main webpage structure
│   ├── script.js       # JavaScript for handling API requests and DOM updates
│   ├── style.css       # Styling for the webpage (dark theme, spinner, etc.)
├── server.js           # Node.js server using Express and Axios
├── .env                # Environment variables (not included in the repository)
├── README.md           # Project documentation (this file)
├── package.json        # Project dependencies and scripts
```

## API Used
Riot Games API: Used to fetch summoner data, including ranked stats and profile details.

## License
This project is licensed under the MIT License - see the LICENSE file for details.