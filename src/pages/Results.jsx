import { Link, useLocation } from "react-router-dom";
import "./Home.css";

function Results() {
  const location = useLocation();
  const picks = location.state?.picks || [];

  const averageRating =
    picks.reduce((total, pick) => total + pick.movie.vote_average, 0) /
    picks.length;

  const festivalScore = Math.round(averageRating * 10);

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
  <h3>What your score means</h3>

  <p>
    Your festival score is based on the average TMDb rating of the movies in
    your final lineup. A higher score means your festival is packed with movies
    that audiences and critics rated more highly.
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