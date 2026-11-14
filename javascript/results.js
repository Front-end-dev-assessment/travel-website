// Result-card controls: show saved destinations and keep them in this browser.
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "travel-favourite-destinations";
  let favourites = [];
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(stored)) favourites = stored.filter(value => typeof value === "string");
  } catch {
    favourites = [];
  }

  document.querySelectorAll(".save-button[data-destination]").forEach(button => {
    const destination = button.dataset.destination;
    const render = () => {
      const saved = favourites.includes(destination);
      button.classList.toggle("saved", saved);
      button.setAttribute("aria-pressed", String(saved));
      button.textContent = saved ? "♥ Saved" : "♡ Save";
    };
    render();
    button.addEventListener("click", () => {
      favourites = favourites.includes(destination)
        ? favourites.filter(item => item !== destination)
        : [...favourites, destination];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
        render();
      } catch {
        button.textContent = "Could not save";
      }
    });
  });
});
