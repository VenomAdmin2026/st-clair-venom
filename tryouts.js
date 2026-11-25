
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tryoutAnnouncements");

  if (!container) return;

  function showMessage(message) {
    container.replaceChildren();

    const panel = document.createElement("div");
    panel.className = "hub-panel";

    const text = document.createElement("p");
    text.className = "muted";
    text.textContent = message;

    panel.appendChild(text);
    container.appendChild(panel);
  }

  function formatDate(value) {
    if (!value) return "";

    const date = new Date(value + "T12:00:00");

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function addDetail(panel, label, value) {
    if (!value) return;

    const paragraph = document.createElement("p");
    const heading = document.createElement("strong");

    heading.textContent = label + ": ";
    paragraph.appendChild(heading);
    paragraph.appendChild(document.createTextNode(value));

    panel.appendChild(paragraph);
  }

  function safeRegistrationURL(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : null;
    } catch {
      return null;
    }
  }

  try {
    const response = await fetch("venom-data.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to load announcement data.");
    }

    const data = await response.json();

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());

    const announcements = (
      Array.isArray(data.tryoutAnnouncements)
        ? data.tryoutAnnouncements
        : []
    ).filter(item =>
      !item.expirationDate ||
      item.expirationDate >= today
    );

    announcements.sort((a, b) =>
      (a.tryoutDate || "9999-12-31").localeCompare(
        b.tryoutDate || "9999-12-31"
      )
    );

    if (!announcements.length) {
      showMessage(
        "No upcoming tryout dates have been announced. Check back for future opportunities."
      );
      return;
    }

    container.replaceChildren();

    announcements.forEach(item => {
      const panel = document.createElement("div");
      panel.className = "hub-panel";

      const category = document.createElement("p");
      category.className = "eyebrow";
      category.textContent = item.team + " • TRYOUTS";
      panel.appendChild(category);

      const title = document.createElement("h3");
      title.textContent = item.title;
      panel.appendChild(title);

      addDetail(panel, "Date", formatDate(item.tryoutDate));
      addDetail(panel, "Time", item.tryoutTime);
      addDetail(panel, "Location", item.location);

      if (item.announcement) {
        const description = document.createElement("p");
        description.textContent = item.announcement;
        panel.appendChild(description);
      }

      const registrationURL = safeRegistrationURL(
        item.registrationLink
      );

      if (registrationURL) {
        const button = document.createElement("a");

        button.className = "btn";
        button.href = registrationURL;
        button.target = "_blank";
        button.rel = "noopener noreferrer";
        button.textContent = "REGISTER FOR TRYOUTS ↗";

        panel.appendChild(button);
      }

      container.appendChild(panel);
    });

  } catch (error) {
    console.error("Tryout announcements:", error);

    showMessage(
      "Tryout announcements are temporarily unavailable. Please check back later."
    );
  }
});
