(() => {
  function showQuizSummary() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem("travel-quiz-answers") || "null");
    } catch {}
    const budget = document.getElementById("trip-budget");
    const duration = document.getElementById("trip-duration");
    const interests = document.getElementById("trip-interests");
    if (budget) budget.textContent = Number.isFinite(saved?.budget) ? `£${saved.budget.toLocaleString("en-GB")}` : "—";
    if (duration) duration.textContent = Number.isInteger(saved?.days) ? `${saved.days} ${saved.days === 1 ? "day" : "days"}` : "—";
    if (interests) interests.textContent = Array.isArray(saved?.holiday) ? saved.holiday.filter(item => typeof item === "string").join(", ") || "Any type" : "—";
  }
  showQuizSummary();
  window.addEventListener("pageshow", showQuizSummary);
  window.addEventListener("storage", event => {
    if (event.key === "travel-quiz-answers" || event.key === null) showQuizSummary();
  });
})();
