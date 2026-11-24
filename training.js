
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("trainingVideos");
  const teamFilter = document.getElementById("trainingTeam");
  const categoryFilter = document.getElementById("trainingCategory");

  if (!container || !teamFilter || !categoryFilter) return;

  let videos = [];

  function renderVideos() {
    const team = teamFilter.value;
    const category = categoryFilter.value;

    const filtered = videos.filter(video => {
      const matchesTeam =
        team === "All Teams" ||
        video.team === "All Teams" ||
        video.team === team;

      const matchesCategory =
        category === "All Categories" ||
        video.category === category;

      return matchesTeam && matchesCategory;
    });

    container.replaceChildren();

    if (filtered.length === 0) {
      const message = document.createElement("p");
      message.className = "muted";
      message.textContent = "No training videos available for these filters yet.";
      container.appendChild(message);
      return;
    }

    filtered.forEach(video => {
      const panel = document.createElement("div");
      panel.className = "hub-panel";

      const title = document.createElement("h3");
      title.textContent = video.title;

      const details = document.createElement("p");
      details.className = "muted";
      details.textContent = `${video.team} • ${video.category}`;

      const description = document.createElement("p");
      description.textContent = video.description || "";

      const link = document.createElement("a");
      link.className = "btn";
      link.textContent = "WATCH VIDEO ↗";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      try {
        const url = new URL(video.youtubeUrl);
        const hostname = url.hostname.toLowerCase();

        if (
          url.protocol !== "https:" ||
          !["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(hostname)
        ) {
          return;
        }

        link.href = url.href;
      } catch {
        return;
      }

      
const videoUrl = new URL(link.href);
let videoId = "";

if (videoUrl.hostname === "youtu.be") {
  videoId = videoUrl.pathname.split("/")[1];
} else if (videoUrl.pathname.startsWith("/shorts/")) {
  videoId = videoUrl.pathname.split("/")[2];
} else {
  videoId = videoUrl.searchParams.get("v");
}

if (videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)) {
  const thumbnail = document.createElement("img");

  thumbnail.src =
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  thumbnail.alt = video.title;
  thumbnail.loading = "lazy";
  thumbnail.style.width = "100%";
  thumbnail.style.aspectRatio = "16 / 9";
  thumbnail.style.objectFit = "cover";
  thumbnail.style.borderRadius = "10px";
  thumbnail.style.marginBottom = "15px";

  thumbnail.addEventListener("error", () => {
    thumbnail.remove();
  });

  
thumbnail.style.cursor = "pointer";
thumbnail.title = "Click to play video";

const playButton = document.createElement("button");
playButton.type = "button";
playButton.className = "btn";
playButton.textContent = "▶ PLAY VIDEO";
playButton.style.width = "100%";
playButton.style.marginBottom = "15px";

function playVideo() {
  const player = document.createElement("iframe");

  player.src =
    `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;

  player.title = video.title;
  player.style.width = "100%";
  player.style.aspectRatio = "16 / 9";
  player.style.border = "0";
  player.style.borderRadius = "10px";
  player.style.marginBottom = "15px";

  player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  player.allowFullscreen = true;

  thumbnail.replaceWith(player);
  playButton.remove();
}

thumbnail.addEventListener("click", playVideo);
playButton.addEventListener("click", playVideo);

panel.appendChild(thumbnail);
panel.appendChild(playButton);

}

panel.append(title, details, description, link);

      container.appendChild(panel);
    });
  }

  teamFilter.addEventListener("change", renderVideos);
  categoryFilter.addEventListener("change", renderVideos);

  try {
    const response = await fetch("venom-data.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    videos = Array.isArray(data.trainingVideos)
      ? data.trainingVideos
      : [];

    renderVideos();
  } catch (error) {
    console.error("Training videos could not be loaded:", error);
    container.textContent = "Unable to load training videos right now.";
  }
});
