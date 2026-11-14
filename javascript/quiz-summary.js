// Wait until the results page HTML is loaded.
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "travel-quiz-answers";

  function getSavedAnswers() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return saved && typeof saved === "object" ? saved : null;
    } catch {
      return null;
    }
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function formatBudget(value) {
    const budget = Number(value);
    return Number.isFinite(budget)
      ? `£${budget.toLocaleString("en-GB")}`
      : "—";
  }

  function updatePlanningGuide(saved) {
    const intro = document.getElementById("planning-intro");
    const checklist = document.getElementById("planning-checklist");
    if (!intro || !checklist) return;

    const budget = Number(saved.budget);
    const days = Number(saved.days);
    const duration = Number.isInteger(days) && days >= 1
      ? `${days} ${days === 1 ? "day" : "days"}`
      : "your chosen trip length";
    const budgetText = Number.isFinite(budget) ? formatBudget(budget) : "your budget";

    intro.textContent = `Plan a ${duration} trip within ${budgetText}, focusing on ${
      Array.isArray(saved.holiday) && saved.holiday.length
        ? saved.holiday.join(", ").toLowerCase()
        : "your preferred experiences"
    }.`;

    const tasks = [
      "Choose a destination that matches your interests and budget.",
      "Compare flight prices and travel dates.",
      "Check passport validity and entry requirements.",
      "Compare accommodation prices, locations and booking conditions.",
      "Research local transport options.",
      "Plan activities and check attraction opening times."
    ];

    if (saved.planning === "Everything planned in advance") {
      tasks.unshift("Create a detailed itinerary and book important activities in advance.");
    } else if (saved.planning === "A few main activities") {
      tasks.unshift("Choose a few main attractions and leave free time in your itinerary.");
    } else if (saved.planning === "Decide as I go") {
      tasks.unshift("Keep your itinerary flexible and research activities you can decide on later.");
    }

    if (saved.stay === "Apartment") {
      tasks.push("Compare apartment locations, facilities and check-in conditions.");
    } else if (saved.stay === "Budget hotel") {
      tasks.push("Compare budget hotels and check which extras are included.");
    } else if (saved.stay === "Hotel") {
      tasks.push("Compare hotel facilities, locations and guest reviews.");
    }

    if (saved.transport === "Renting a car") {
      tasks.push("Check driving licence requirements, rental insurance and parking.");
    } else if (saved.transport === "Public transport") {
      tasks.push("Research public transport passes and local travel cards.");
    } else if (saved.transport === "Walking") {
      tasks.push("Check walking distances between attractions and your accommodation.");
    }

    checklist.replaceChildren();
    tasks.forEach(task => {
      const item = document.createElement("li");
      item.textContent = task;
      checklist.appendChild(item);
    });
  }

  function showQuizSummary() {
    const saved = getSavedAnswers();
    const studentTip = document.getElementById("student-tip");

    if (!saved) {
      setText("trip-season", "Not selected");
      setText("trip-budget", "—");
      setText("trip-duration", "—");
      setText("trip-interests", "—");
      setText("trip-planning", "—");
      setText("trip-stay", "—");
      setText("trip-transport", "—");
      setText("trip-passport", "—");
      if (studentTip) studentTip.hidden = true;
      return;
    }

    const days = Number(saved.days);
    setText("trip-season", saved.season || "Not selected");
    setText("trip-budget", formatBudget(saved.budget));
    setText(
      "trip-duration",
      Number.isInteger(days) && days >= 1
        ? `${days} ${days === 1 ? "day" : "days"}`
        : "—"
    );
    setText(
      "trip-interests",
      Array.isArray(saved.holiday) && saved.holiday.length
        ? saved.holiday.join(", ")
        : "Any type"
    );
    setText("trip-planning", saved.planning || "—");
    setText("trip-stay", saved.stay || "—");
    setText("trip-transport", saved.transport || "—");
    setText("trip-passport", saved.passport || "—");

    if (studentTip) studentTip.hidden = saved.studentDiscount !== true;
    updatePlanningGuide(saved);
  }

  showQuizSummary();
});
