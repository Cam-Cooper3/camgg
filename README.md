CAM.GG - League of Legends Stats Tool
Overview
CAM.GG is a League of Legends stats tool that retrieves real-time summoner data, including rank, win rate, and more using Riot Games' API. The project also includes a loading spinner to provide visual feedback while data is being fetched.

Features
Retrieve summoner details (level, profile icon, ranked stats) by entering a summoner's name and tagline.
Displays ranked stats, including rank tier, LP, wins, losses, and win rate.
Responsive design with a dark theme for a smooth user experience.
Loading spinner for visual feedback during data fetching.
Tech Stack
Node.js (Express for server-side handling)
Axios (for making API requests)
HTML/CSS/JavaScript (for the frontend)
Riot Games API (for summoner data)
Installation and Setup
Prerequisites
Node.js installed on your machine.
A valid Riot API Key.
Steps
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/cam.gg.git
cd cam.gg
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory.
Add your Riot API Key to the .env file like this:
bash
Copy code
RIOT_API_KEY=your-api-key-here
Run the server:

bash
Copy code
node server.js
Open your browser and navigate to http://localhost:3000 to use the tool.

Usage
Enter a Summoner Name and a Tagline (e.g., SummonerName with #NA1).
Click Get Stats to retrieve summoner data.
The summoner's profile information, ranked stats, and win rate will be displayed.
A loading spinner will appear while data is being fetched.
Project Structure
bash
Copy code
├── public
│   ├── index.html      # Main webpage structure
│   ├── script.js       # JavaScript for handling API requests and DOM updates
│   ├── style.css       # Styling for the webpage (dark theme, spinner, etc.)
├── server.js           # Node.js server using Express and Axios
├── .env                # Environment variables (not included in the repository)
├── README.md           # Project documentation (this file)
├── package.json        # Project dependencies and scripts
API Used
Riot Games API: Used to fetch summoner data, including ranked stats and profile details.
Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue if you have suggestions for improvements.

License
This project is licensed under the MIT License - see the LICENSE file for details.