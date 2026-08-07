# Best Film Festival 🎬

Best Film Festival is a React movie-picking game where players build their ideal six-film festival from randomized genre and decade combinations.

Each round presents a new category, eight movie options, and one important choice. Once the lineup is complete, the festival receives a score out of 100 that players can share and challenge their friends to beat.

## Live Site

https://best-film-festival.com

## Features

Build a six-film festival across randomized genres and decades

Choose between Casual, Hardcore game modes or the Daily Challenge

Browse eight movie options during each round

Use two rerolls to replace difficult genre and decade combinations

Receive a final Festival Score out of 100

Share your score, movie lineup, website link, and a challenge for friends

Movie information and posters powered by The Movie Database (TMDB) API

Responsive design for desktop and mobile devices

# Game Modes

## Casual Mode

Casual Mode draws from more familiar and popular movies, making it easier to recognize the choices and build a strong festival lineup.

## Hardcore Mode

Hardcore Mode searches a wider selection of films. It offers more variety, less predictable choices, and a tougher challenge for dedicated movie fans.

## Daily Challenge

A daily randomized challenge. The challenge changes between the user picking just 1 genre or 1 decade for their six films. Example: Pick the best films of 1990's or Pick the best Animation films through the decades. No rerolls allow to allow all users to see the same challenge details.

# How It Works

Choose Casual or Hardcore mode.

Click Begin Festival.

Receive a randomized genre and decade combination.

Select one movie from the eight available options.

Confirm the selection to add it to the festival lineup.

Use either of the two rerolls when a category is especially difficult.

Repeat until the six-film festival is complete.

View the final Festival Score and share the results.

# Festival Scoring

Every completed lineup earns a Festival Score out of 100. The score is calculated from TMDB audience ratings and movie popularity, rewarding festivals that combine highly rated films with audience favorites.

The scoring formula stays behind the scenes so players can focus on choosing the movies they want in their festival—not calculating the safest picks.

# Sharing Results

The results page includes a sharing feature designed to bring friends into the game. Shared results include:

The final Festival Score

The complete six-film lineup

A link to Best Film Festival

A “Can you beat my score?” challenge

On supported phones and browsers, the share button uses the device’s native sharing menu, making it easy to send results through text messages or compatible social media apps.

# Technology Used

React

Vite

JavaScript (ES6+)

CSS3

TMDB API

Web Share API

Installation

# Clone the repository:

git clone https://github.com/mgwolford/bestfilmfestival

Navigate into the project:

cd bestfilmfestival

Install dependencies:

npm install

Create a .env file in the project root and add a valid TMDB API key using the environment variable expected by the application.

Run locally:

npm run dev

Build for production:

npm run build

## Future Enhancements

Social-ready result images for apps such as Instagram Stories

Additional game modes and difficulty settings

Player statistics and festival history

# Acknowledgements

Movie information, posters, ratings, popularity data, and metadata are provided by The Movie Database (TMDB).

This product uses the TMDB API but is not endorsed or certified by TMDB.