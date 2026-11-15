// Wait until the quiz page HTML is loaded.
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "travel-quiz-answers";
  const pages = [...document.querySelectorAll(".quiz-page")];
  const stepLabel = document.querySelector("#step-label");
  const progressFill = document.querySelector("#progress-fill");
  const daysSlider = document.querySelector("#days");
  const budgetSlider = document.querySelector("#budget");
  const daysOutput = document.querySelector("#days-value");
  const budgetOutput = document.querySelector("#budget-value");
  const studentCheckbox = document.querySelector("#student-discount");

  if (!pages.length || !daysSlider || !budgetSlider || !studentCheckbox) return;

  const answers = {
    season: "",
    planning: "",
    holiday: [],
    stay: "",
    transport: "",
    companions: ""
  };
  let currentPage = 0;

  function showPage(pageNumber) {
    currentPage = pageNumber;
    pages.forEach((page, index) => { page.hidden = index !== pageNumber; });
    if (stepLabel) stepLabel.textContent = `Step ${pageNumber + 1} of ${pages.length}`;
    if (progressFill) progressFill.style.width = `${((pageNumber + 1) / pages.length) * 100}%`;
    pages.forEach(page => {
      const message = page.querySelector(".message");
      if (message) message.textContent = "";
    });
    document.querySelector("#quiz")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll("[data-group]").forEach(button => {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      const { group, value } = button.dataset;
      if (!group || !value) return;

      if (group === "holiday") {
        const selected = button.classList.toggle("selected");
        button.setAttribute("aria-pressed", String(selected));
        answers.holiday = selected
          ? [...new Set([...answers.holiday, value])]
          : answers.holiday.filter(item => item !== value);
      } else {
        button.closest(".quiz-page")
          ?.querySelectorAll(`[data-group="${group}"]`)
          .forEach(option => {
            option.classList.remove("selected");
            option.setAttribute("aria-pressed", "false");
          });
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
        if (Object.hasOwn(answers, group)) answers[group] = value;
      }

      const message = button.closest(".quiz-page")?.querySelector(".message");
      if (message) message.textContent = "";
    });
  });

  function updateSlider(slider, output, formatter) {
    const min = Number(slider.min);
    const max = Number(slider.max);
    const value = Number(slider.value);
    const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;
    slider.style.setProperty("--fill", `${percentage}%`);
    if (output) output.textContent = formatter(value);
  }
  const updateDays = () => updateSlider(daysSlider, daysOutput, value => `${value} ${value === 1 ? "day" : "days"}`);
  const updateBudget = () => updateSlider(budgetSlider, budgetOutput, value => `£${value.toLocaleString("en-GB")}`);
  daysSlider.addEventListener("input", updateDays);
  budgetSlider.addEventListener("input", updateBudget);

  function showError(message) {
    const element = pages[currentPage]?.querySelector(".message");
    if (element) element.textContent = message;
  }

  function validatePage() {
    if (currentPage === 0 && !answers.season) {
      showError("Please choose a season before continuing.");
      return false;
    }
    if (currentPage === 1) {
      if (!answers.planning) {
        showError("Please choose your preferred planning style.");
        return false;
      }
      if (!answers.holiday.length) {
        showError("Please choose at least one holiday type.");
        return false;
      }
      if (!answers.stay) {
        showError("Please choose your preferred accommodation.");
        return false;
      }
    }
    if (currentPage === 2) {
      if (!answers.transport) {
        showError("Please choose your preferred transport.");
        return false;
      }
      if (!answers.companions) {
        showError("Please choose who you are travelling with.");
        return false;
      }
    }
    return true;
  }

  function showResults() {
    const savedAnswers = {
      ...answers,
      days: Number(daysSlider.value),
      budget: Number(budgetSlider.value),
      studentDiscount: studentCheckbox.checked
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAnswers));
      window.location.href = "tips.html";
    } catch {
      showError("Unable to save your answers. Please check browser storage.");
    }
  }

  document.querySelectorAll(".next-button").forEach(button => {
    button.addEventListener("click", () => {
      if (!validatePage()) return;
      if (currentPage < pages.length - 1) showPage(currentPage + 1);
      else showResults();
    });
  });
  document.querySelectorAll(".previous-button").forEach(button => {
    button.addEventListener("click", () => {
      if (currentPage > 0) showPage(currentPage - 1);
    });
  });

  function restoreAnswers() {
    let saved;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return;
    }
    if (!saved || typeof saved !== "object") return;

    ["season", "planning", "stay", "transport", "companions"].forEach(group => {
      if (typeof saved[group] !== "string") return;
      const button = [...document.querySelectorAll(`[data-group="${group}"]`)]
        .find(option => option.dataset.value === saved[group]);
      if (button) {
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
        answers[group] = saved[group];
      }
    });

    if (Array.isArray(saved.holiday)) {
      saved.holiday.forEach(value => {
        const button = [...document.querySelectorAll('[data-group="holiday"]')]
          .find(option => option.dataset.value === value);
        if (button && !answers.holiday.includes(value)) {
          button.classList.add("selected");
          button.setAttribute("aria-pressed", "true");
          answers.holiday.push(value);
        }
      });
    }
    if (Number.isInteger(saved.days) && saved.days >= Number(daysSlider.min) && saved.days <= Number(daysSlider.max)) {
      daysSlider.value = saved.days;
    }
    if (Number.isFinite(saved.budget) && saved.budget >= Number(budgetSlider.min) && saved.budget <= Number(budgetSlider.max)) {
      budgetSlider.value = saved.budget;
    }
    studentCheckbox.checked = saved.studentDiscount === true;
  }

  restoreAnswers();
  updateDays();
  updateBudget();
  showPage(0);
});
