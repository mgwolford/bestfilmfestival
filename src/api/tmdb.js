const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function getPosterUrl(path) {
  return path ? `${IMAGE_BASE_URL}${path}` : null;
}

function shuffleMovies(movies) {
  const shuffled = [...movies];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function buildDiscoverUrl({ genreId, startYear, endYear, page }) {
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
    "vote_count.gte": "100",
    page: String(page),
  });

  return url;
}

async function fetchMoviePage(filters, page) {
  const url = buildDiscoverUrl({ ...filters, page });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch movies from TMDb.");
  }

  return response.json();
}

export async function getMoviesByGenreAndDecade({
  genreId,
  startYear,
  endYear,
  excludeMovieIds = [],
}) {
  const filters = {
    genreId,
    startYear,
    endYear,
  };

  const firstPage = await fetchMoviePage(filters, 1);

  // Only use pages from TMDB's top four result pages.
  const availablePages = Math.min(firstPage.total_pages || 1, 4);

  const pageNumbers = Array.from(
    { length: availablePages },
    (_, index) => index + 1
  );

  // Randomly choose 3 of the top four pages.
  const randomPages = shuffleMovies(pageNumbers).slice(0, 3);

  const pageResults = await Promise.all(
    randomPages.map((page) =>
      page === 1
        ? Promise.resolve(firstPage)
        : fetchMoviePage(filters, page)
    )
  );

  const excludedIds = new Set(excludeMovieIds);
  const uniqueMovies = new Map();

  pageResults
    .flatMap((page) => page.results || [])
    .forEach((movie) => {
      if (
        !excludedIds.has(movie.id) &&
        movie.poster_path &&
        !uniqueMovies.has(movie.id)
      ) {
        uniqueMovies.set(movie.id, movie);
      }
    });

  return shuffleMovies([...uniqueMovies.values()]);
}