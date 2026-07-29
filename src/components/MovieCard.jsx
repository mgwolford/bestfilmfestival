import { getPosterUrl } from "../api/tmdb.js";

function MovieCard({ movie, isSelected, onSelect }) {
  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <button
      className={`movie-card ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      {posterUrl ? (
        <img src={posterUrl} alt={`${movie.title} poster`} />
      ) : (
        <div className="poster-placeholder">No Poster</div>
      )}

      <div className="movie-card-content">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.slice(0, 4)}</p>
      </div>
    </button>
  );
}

export default MovieCard;