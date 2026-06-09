import { useEffect, useState } from "react";
import { getMoviesByGenreAndDecade } from "../api/tmdb";
import { getRandomFestivalSlots } from "../data/festivalCategories";
import MovieCard from "../components/MovieCard";
import "./Home.css";

function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [slots, setSlots] = useState([]);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [movieOptions, setMovieOptions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rerollsRemaining, setRerollsRemaining] = useState(2);

  const currentSlot = slots[currentSlotIndex];
  const isComplete = picks.length === slots.length && slots.length > 0;

  function beginFestival() {
    const newSlots = getRandomFestivalSlots();

    setSlots(newSlots);
    setCurrentSlotIndex(0);
    setPicks([]);
    setSelectedMovie(null);
    setMovieOptions([]);
    setRerollsRemaining(2);
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
        });

        setMovieOptions(movies.slice(0, 8));
      } catch (error) {
        console.error(error);
        setMovieOptions([]);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [gameStarted, currentSlot]);

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
    }
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

  const festivalScore = picks.reduce((total, pick) => {
    return total + Math.round(pick.movie.vote_average * 10);
  }, 0);

  if (!gameStarted) {
    return (
      <main className="home-page">
        <section className="hero-screen">
          <div className="spotlight spotlight-left"></div>
          <div className="spotlight spotlight-right"></div>

          <div className="hero-content">
            <p className="eyebrow">Welcome to</p>
            <h1>Best Film Festival</h1>
            <p className="hero-text">
              Build the ultimate movie lineup by matching genres, decades, and
              legendary films into one unforgettable festival.
            </p>

            <button className="start-button" onClick={beginFestival}>
              Begin Festival
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="game-page">
        <section className="results-panel">
          <p className="eyebrow">Festival Complete</p>
          <h1>Your Final Lineup</h1>
          <h2>Festival Score: {festivalScore}</h2>

          <div className="lineup-list">
            {picks.map((pick) => (
              <article key={`${pick.slot.id}-${pick.movie.id}`} className="lineup-card">
                <span>
                  {pick.slot.genre.name} · {pick.slot.decade.label}
                </span>
                <strong>{pick.movie.title}</strong>
              </article>
            ))}
          </div>

          <button className="start-button" onClick={beginFestival}>
            Build Another Festival
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="game-page">
      <section className="festival-stage">
        <div className="festival-status">
          <span>
            Screening {currentSlotIndex + 1} of {slots.length}
          </span>

          <span>🎟 Rerolls Remaining: {rerollsRemaining}</span>
        </div>

        <h1>
          {currentSlot.genre.name} · {currentSlot.decade.label}
        </h1>

        <p className="hero-text">
          Pick the movie that deserves a spot in your festival lineup.
        </p>

        <div className="reroll-container">
  <button
    className="reroll-button"
    onClick={rerollCurrentSlot}
    disabled={rerollsRemaining === 0 || loading}
  >
    🎟 Reroll ({rerollsRemaining})
  </button>
</div>

{loading ? (
  <p className="loading-text">Loading movie options...</p>
) : (
  <div className="movie-grid">
    {movieOptions.map((movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        isSelected={selectedMovie?.id === movie.id}
        onSelect={() => setSelectedMovie(movie)}
      />
    ))}
  </div>
)}

<div className="festival-buttons">
  <button
    className="start-button"
    onClick={confirmPick}
    disabled={!selectedMovie}
  >
    Confirm Pick
  </button>
</div>
</section>          
    </main>
  );    
} 
export default Home;