import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Results.css";
import bronzeAward from "../assets/score-awards/bronze-award.png";
import silverAward from "../assets/score-awards/silver-award.png";
import goldAward from "../assets/score-awards/gold-award.png";

function getScoreStatue(score) {
  if (score >= 90) {
    return { src: goldAward, label: "Gold festival award" };
  }

  if (score >= 80) {
    return { src: silverAward, label: "Silver festival award" };
  }

  return { src: bronzeAward, label: "Bronze festival award" };
}

function getFestivalAward(score) {
  if (score === 100) {
    return {
      level: "perfect",
      title: "Perfect Festival",
      message: "A flawless lineup. Cinema may have peaked.",
    };
  }

  if (score >= 90) {
    return {
      level: "masterpiece",
      title: "Festival Masterpiece",
      message: "An extraordinary festival worthy of the red carpet.",
    };
  }

  if (score >= 80) {
    return {
      level: "winner",
      title: "Grand Jury Winner",
      message: "A prestigious lineup from beginning to end.",
    };
  }

  if (score >= 70) {
    return {
      level: "finalist",
      title: "Festival Finalist",
      message: "A strong festival with serious awards potential.",
    };
  }

  if (score >= 60) {
    return {
      level: "critics-choice",
      title: "Critics’ Choice",
      message: "A smart lineup that gives film lovers plenty to discuss.",
    };
  }

  if (score >= 50) {
    return {
      level: "audience-favorite",
      title: "Audience Favorite",
      message: "A crowd-pleasing festival with plenty of memorable picks.",
    };
  }

  return {
    level: "official-selection",
    title: "Official Selection",
    message: "An eclectic festival that proudly follows its own vision.",
  };
}

function Results() {
  const location = useLocation();
  const picks = location.state?.picks || [];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

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

  const award = getFestivalAward(festivalScore);
  const scoreStatue = getScoreStatue(festivalScore);

  const shareUrl = "https://www.best-film-festival.com/";

  function getShareText() {
    const movieList = picks
      .map((pick, index) => `${index + 1}. ${pick.movie.title}`)
      .join("\n");

    return `I scored ${festivalScore}/100 at Best Film Festival!

My lineup:
${movieList}

Think you can build a better film festival?

Play at
${shareUrl}`;
  }

  function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    words.forEach((word) => {
      const testLine = line ? `${line} ${word}` : word;

      if (context.measureText(testLine).width > maxWidth && line) {
        context.fillText(line, x, currentY);
        line = word;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    });

    context.fillText(line, x, currentY);
    return currentY;
  }

  async function createStoryImage() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas is not supported in this browser.");
    }

    const background = context.createLinearGradient(0, 0, 0, canvas.height);
    background.addColorStop(0, "#050505");
    background.addColorStop(0.55, "#17130b");
    background.addColorStop(1, "#050505");
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#f5c46b";
    context.lineWidth = 8;
    context.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    context.textAlign = "center";
    context.fillStyle = "#f5c46b";
    context.font = "700 42px Arial";
    context.fillText("BEST FILM FESTIVAL", canvas.width / 2, 155);

    context.fillStyle = "#f8f1df";
    context.font = "700 72px Arial";
    context.fillText(award.title.toUpperCase(), canvas.width / 2, 255);

    context.fillStyle = "#f5c46b";
    context.font = "700 190px Arial";
    context.fillText(`${festivalScore}`, canvas.width / 2, 475);

    context.fillStyle = "#f8f1df";
    context.font = "700 58px Arial";
    context.fillText("/ 100", canvas.width / 2, 550);

    context.strokeStyle = "rgba(245, 196, 107, 0.65)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(140, 625);
    context.lineTo(940, 625);
    context.stroke();

    context.fillStyle = "#f5c46b";
    context.font = "700 40px Arial";
    context.fillText("MY FESTIVAL LINEUP", canvas.width / 2, 705);

    context.textAlign = "left";
    let y = 765;

    picks.forEach((pick, index) => {
      context.fillStyle = "#f5c46b";
      context.font = "700 26px Arial";
      context.fillText(
        `${index + 1}. ${pick.slot.genre.name.toUpperCase()} · ${pick.slot.decade.label}`,
        115,
        y
      );

      context.fillStyle = "#f8f1df";
      context.font = "700 40px Arial";
      const finalTitleY = drawWrappedText(
        context,
        pick.movie.title,
        115,
        y + 50,
        850,
        44
      );

      y = finalTitleY + 78;
    });

    context.textAlign = "center";
    context.fillStyle = "#f8f1df";
    context.font = "700 36px Arial";
    context.fillText("THINK YOU CAN BUILD A BETTER FILM FESTIVAL?", canvas.width / 2, 1720);

    context.fillStyle = "#f5c46b";
    context.font = "700 34px Arial";
    context.fillText("www.best-film-festival.com", canvas.width / 2, 1795);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("The story image could not be created."));
        }
      }, "image/png");
    });
  }

  function downloadStoryImage(file) {
    const imageUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = file.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(imageUrl);
  }

  async function handleStoryShare() {
    const shareText = getShareText();

    try {
      const storyBlob = await createStoryImage();
      const storyFile = new File(
        [storyBlob],
        `best-film-festival-${festivalScore}.png`,
        { type: "image/png" }
      );

      const shareData = {
        title: `My ${festivalScore}/100 Best Film Festival`,
        text: `I scored ${festivalScore}/100. Think you can build a better film festival? Play at ${shareUrl}`,
        files: [storyFile],
      };

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [storyFile] })
      ) {
        await navigator.share(shareData);
        return;
      }

      downloadStoryImage(storyFile);
      await navigator.clipboard?.writeText(shareText);
      alert(
        "Your Story image was saved. Open Instagram, create a Story, and select the image from your photos."
      );
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Story share failed", error);
        alert("The Story image could not be shared. Please try again.");
      }
    }
  }



  return (
    <main className="game-page">
      <section className="results-panel">
        <p className="eyebrow">Festival Complete</p>
        <h1>Your Festival Lineup</h1>
        <div className={`festival-award festival-award--${award.level}`}>
          <h2>{award.title}</h2>

          <div
            className="award-score"
            aria-label={`${festivalScore} out of 100, ${scoreStatue.label}`}
          >
            <img src={scoreStatue.src} alt="" aria-hidden="true" />

            <div className="award-score__number">
              {festivalScore}
              <span>/100</span>
            </div>
          </div>

          <p className="award-message">{award.message}</p>
        </div>

        <div className="score-explainer">
          <h3>How the judges scored your festival</h3>

          <p>
            Our panel looked at the overall quality of your selections and how
            well they've resonated with audiences over time. A festival filled
            with acclaimed classics and beloved crowd-pleasers will earn the
            highest ratings.
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

        <div className="lineup-score" aria-label={`Festival Score: ${festivalScore} out of 100`}>
          <span>Festival Score</span>
          <strong>
            {festivalScore}
            <small>/100</small>
          </strong>
        </div>

        <div className="results-actions">
          <button className="share-btn" onClick={handleStoryShare}>
            Share Results
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