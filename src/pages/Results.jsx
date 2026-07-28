import { Link, useLocation } from "react-router-dom";
import "./Home.css";

function Results() {
  const location = useLocation();
  const picks = location.state?.picks || [];

  if (picks.length === 0) {
    return (
      <main className="game-page">
        <section className="results-panel">
          <h1>No Festival Found</h1>
          <p>Start a new festival to build your lineup.</p>

          <Link to="/" className="start-button">
            Start Festival
          </Link>
        </section>
      </main>
    );
  }

  const averageRating =
    picks.reduce((sum, pick) => sum + pick.movie.vote_average, 0) /
    picks.length;

  const averagePopularity =
    picks.reduce((sum, pick) => sum + pick.movie.popularity, 0) /
    picks.length;

  const ratingBenchmarks = [
    { rating: 0, score: 0 },
    { rating: 4, score: 40 },
    { rating: 5, score: 55 },
    { rating: 6, score: 68 },
    { rating: 7, score: 80 },
    { rating: 8, score: 90 },
    { rating: 9, score: 97 },
    { rating: 10, score: 100 },
  ];

  function getRatingScore(rating) {
    const upperIndex = ratingBenchmarks.findIndex(
      (benchmark) => rating <= benchmark.rating
    );

    if (upperIndex <= 0) {
      return ratingBenchmarks[0].score;
    }

    const lower = ratingBenchmarks[upperIndex - 1];
    const upper = ratingBenchmarks[upperIndex];
    const progress = (rating - lower.rating) / (upper.rating - lower.rating);

    return lower.score + progress * (upper.score - lower.score);
  }

  const ratingScore = getRatingScore(averageRating);
  const popularityScore = Math.min(
    100,
    (Math.log10(averagePopularity + 1) / Math.log10(1001)) * 100
  );

  const festivalScore = Math.round(
    ratingScore * 0.9 + popularityScore * 0.1
  );

  async function handleShare() {
    const shareText = `I built a ${festivalScore}/100 film festival on Best Film Festival. Can you beat my lineup?`;
    const shareUrl = "https://mgwolford.github.io/bestfilmfestival/";

    const shareData = {
      title: "Best Film Festival",
      text: shareText,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert("Share text copied!");
      }
    } catch (error) {
      console.log("Share canceled or failed", error);
    }
  }

  return (
    <main className="game-page">
      <section className="results-panel">
        <p className="eyebrow">Festival Complete</p>
        <h1>Your Festival Lineup</h1>
        <div className="score-box">
  <p className="score-label">Festival Score</p>
  <h2>{festivalScore}/100</h2>
</div>

<div className="score-explainer">
  <h3>How the judges scored your festival</h3>

  <p>
  Our panel looked at the overall quality of your selections and how well they've resonated with audiences over time. A festival filled with acclaimed classics and beloved crowd-pleasers will earn the highest ratings.
  </p>
</div>

        <div className="lineup-list">
          {picks.map((pick) => (
            <article
              key={`${pick.slot.id}-${pick.movie.id}`}
              className="lineup-card"
            >
              <span>
                {pick.slot.genre.name} · {pick.slot.decade.label}
              </span>
              <strong>{pick.movie.title}</strong>
            </article>
          ))}
        </div>

        <div className="results-actions">
          <button className="share-btn" onClick={handleShare}>
            Share Your Festival
          </button>

          <Link to="/" className="start-button">
            Build Another Festival
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Results;