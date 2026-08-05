import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMoviesByGenreAndDecade } from "../api/tmdb";
import {
  getDailyChallenge,
  getRandomFestivalSlots,
} from "../data/festivalCategories";
import MovieCard from "../components/MovieCard";
import tmdbLogo from "../assets/tmdb-logo.svg";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [gameStarted, setGameStarted] = useState(false);
  const [slots, setSlots] = useState([]);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [movieOptions, setMovieOptions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rerollsRemaining, setRerollsRemaining] = useState(2);
  const offeredMovieIdsRef = useRef(new Set());
  const [gameMode, setGameMode] = useState("casual");
  const dailyChallenge = getDailyChallenge();

  const currentSlot = slots[currentSlotIndex];

  function beginFestival() {
    const newSlots =
      gameMode === "daily"
        ? dailyChallenge.slots
        : getRandomFestivalSlots();

    setSlots(newSlots);
    setCurrentSlotIndex(0);
    setPicks([]);
    setSelectedMovie(null);
    setMovieOptions([]);
    setRerollsRemaining(gameMode === "daily" ? 0 : 2);
    offeredMovieIdsRef.current = new Set();
    setGameStarted(true);
  }

  useEffect(() => {
    async function loadMovies() {
      if (!gameStarted || !currentSlot) return;

      setLoading(true);
      setSelectedMovie(null);

      try {
const movies = await getMoviesByGenreAndDecade({
  genreId: currentSlot.genre.id,
  startYear: currentSlot.decade.startYear,
  endYear: currentSlot.decade.endYear,
  excludeMovieIds: offeredMovieIdsRef.current,
  mode: gameMode === "hardcore" ? "hardcore" : "casual",
});
        const primaryGenreMovies = movies.filter(
          (movie) => movie.genre_ids?.[0] === currentSlot.genre.id
        );

        const otherGenreMovies = movies.filter(
          (movie) => movie.genre_ids?.[0] !== currentSlot.genre.id
        );

        const moviesToShow = [
          ...primaryGenreMovies.slice(0, 6),
          ...otherGenreMovies.slice(0, 2),
        ];

        if (moviesToShow.length < 8) {
          const selectedIds = new Set(moviesToShow.map((movie) => movie.id));
          const remainingMovies = movies.filter(
            (movie) => !selectedIds.has(movie.id)
          );

          moviesToShow.push(
            ...remainingMovies.slice(0, 8 - moviesToShow.length)
          );
        }

        moviesToShow.forEach((movie) =>
          offeredMovieIdsRef.current.add(movie.id)
        );

        setMovieOptions(moviesToShow);
      } catch (error) {
        console.error(error);
        setMovieOptions([]);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [gameStarted, currentSlot, gameMode]);

  function confirmPick() {
    if (!selectedMovie) return;

    const newPick = {
      slot: currentSlot,
      movie: selectedMovie,
    };

    const updatedPicks = [...picks, newPick];
    setPicks(updatedPicks);

    if (currentSlotIndex < slots.length - 1) {
      setCurrentSlotIndex(currentSlotIndex + 1);
    } else {
    navigate("/results", {
      state: {
        picks: updatedPicks,
        gameMode,
        dailyChallenge: gameMode === "daily" ? dailyChallenge : null,
      },
      });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function rerollCurrentSlot() {
    if (rerollsRemaining === 0) return;

    const possibleSlots = getRandomFestivalSlots(20).filter(
      (slot) =>
        !slots.some(
          (existingSlot) =>
            existingSlot.genre.name === slot.genre.name &&
            existingSlot.decade.label === slot.decade.label
        )
    );

    if (possibleSlots.length === 0) return;

    const replacementSlot =
      possibleSlots[Math.floor(Math.random() * possibleSlots.length)];

    const updatedSlots = [...slots];
    updatedSlots[currentSlotIndex] = replacementSlot;

    setSlots(updatedSlots);
    setSelectedMovie(null);
    setRerollsRemaining((current) => current - 1);
  }

  if (!gameStarted) {
    return (
      <main className="home-page">
        <section className="hero-screen">
          <div className="spotlight spotlight-left"></div>
          <div className="spotlight spotlight-right"></div>

          <div className="hero-content">
            <p className="eyebrow">Welcome to</p>
            <h1>Best Film Festival</h1>

            <p className="intro-text">
              Select the greatest films spanning 6 decades dating back to the 1970's and across 11 genres. With every choice, you'll build a one-of-a-kind
              film festival and discover how your lineup stacks up against the
              best.
            </p>

            <p className="intro-text intro-challenge">
              Can you create the best film festival?
            </p>

     <div className="mode-section">
  <p className="mode-heading">Choose Your Mode</p>

  <div className="mode-selection">
    <button
      type="button"
      className={`mode-button ${
        gameMode === "casual" ? "selected" : ""
      }`}
      onClick={() => setGameMode("casual")}
    >
      <strong>Casual</strong>
      <span>Popular and recognizable films</span>
      <span className="mode-reroll-note">Includes 2 rerolls</span>
    </button>

    <button
      type="button"
      className={`mode-button ${
        gameMode === "hardcore" ? "selected" : ""
      }`}
      onClick={() => setGameMode("hardcore")}
    >
      <strong>Hardcore</strong>
      <span>More variety and deeper cuts</span>
      <span className="mode-reroll-note">Includes 2 rerolls</span>
    </button>

    <button
      type="button"
      className={`mode-button daily-mode-button ${
        gameMode === "daily" ? "selected" : ""
      }`}
      onClick={() => setGameMode("daily")}
    >
      <strong>Daily Challenge</strong>
      <span>A new shared theme every day</span>
      <span className="mode-reroll-note">No rerolls</span>
    </button>
  </div>

  {gameMode === "daily" && (
    <div className="daily-challenge-preview">
      <span>Today's Challenge</span>
      <strong>{dailyChallenge.title}</strong>
      <p>{dailyChallenge.description}</p>
    </div>
  )}
</div>

<button className="clapper-btn" onClick={beginFestival}>
  <span className="clapper-top"></span>

  <span className="clapper-body">
    <small>TAKE ONE</small>
    <strong>BEGIN FESTIVAL</strong>
  </span>
</button>
          </div>
        </section>

        <section className="tmdb-credit">
          <div className="tmdb-credit-content">
            <div className="tmdb-credit-image">
              <img src={tmdbLogo} alt="The Movie Database Logo" />
            </div>

            <div className="tmdb-credit-text">
              <h2>Powered by The Movie Database</h2>

              <p>
                Movie information, posters, ratings, release dates, and other
                film data used throughout Best Film Festival are provided by The
                Movie Database (TMDb).
              </p>

              <p>
                This product uses the TMDb API but is not endorsed or certified
                by TMDb.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="game-page">
      <section className="festival-stage">
        {gameMode === "daily" && (
          <div className="daily-challenge-banner">
            <span>Today's Challenge</span>
            <strong>{dailyChallenge.title}</strong>
          </div>
        )}

        <div className="festival-status">
          <span>
            Screening {currentSlotIndex + 1} of {slots.length}
          </span>

          {gameMode !== "daily" && (
            <span>🎟 Rerolls Remaining: {rerollsRemaining}</span>
          )}
        </div>

        <h1>
          {currentSlot.genre.name} · {currentSlot.decade.label}
        </h1>

        <p className="hero-text">
          Pick the movie that deserves a spot in your festival lineup.
        </p>

        {gameMode !== "daily" && <div className="reroll-container">
          <button
            className="reroll-button"
            onClick={rerollCurrentSlot}
            disabled={rerollsRemaining === 0 || loading}
          >
            🎟 Reroll
          </button>
        </div>}

        {loading ? (
          <p className="loading-text">Loading movie options...</p>
        ) : (
          <div className="movie-grid">
          {movieOptions.map((movie) => (
            <div
              key={movie.id}
              className={`movie-option ${
                selectedMovie?.id === movie.id ? "selected" : ""
              }`}
            >
              <MovieCard
                movie={movie}
                isSelected={selectedMovie?.id === movie.id}
                onSelect={() => setSelectedMovie(movie)}
              />
        
              {selectedMovie?.id === movie.id && (
                <button
                  className="inline-confirm-button"
                  onClick={confirmPick}
                >
                  Confirm Pick
                </button>
              )}
            </div>
          ))}
        </div>
        )}
      </section>
    </main>
  );
}

export default Home;