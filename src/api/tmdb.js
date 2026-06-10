const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function getPosterUrl(path) {
  return path ? `${IMAGE_BASE_URL}${path}` : null;
}

export async function getMoviesByGenreAndDecade({ genreId, startYear, endYear }) {
  const url = new URL(`${BASE_URL}/discover/movie`);

  url.search = new URLSearchParams({
    api_key: API_KEY,
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    sort_by: "vote_count.desc",
    "primary_release_date.gte": `${startYear}-01-01`,
    "primary_release_date.lte": `${endYear}-12-31`,
    with_genres: genreId,
    "vote_count.gte": "500",
    page: "1",
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch movies from TMDb.");
  }

  const data = await response.json();

  return data.results;
}