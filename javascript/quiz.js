const pages = [...document.querySelectorAll(".quiz-page")];
const stepLabel = document.querySelector("#step-label");
const progressFill = document.querySelector("#progress-fill");


const answers = {
  season: "",
  origin: "",
  otherCountry: "",
  holiday: [],
  stay: "",
  transport: "",
  passport: ""
};

let currentPage = 0;

function showPage(pageNumber) {
  currentPage = pageNumber;

  pages.forEach((page, index) => {
    page.hidden = index !== pageNumber;
  });

  stepLabel.textContent = `Step ${pageNumber + 1} of 3`;
  progressFill.style.width = `${((pageNumber + 1) / 3) * 100}%`;

  pages.forEach(page => {
    const message = page.querySelector(".message");
    if (message) message.textContent = "";
  });


  document.querySelector("#quiz").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

document.querySelectorAll("[data-group]").forEach(button => {
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", () => {
    const group = button.dataset.group;
    const value = button.dataset.value;
    const multiSelect = group === "holiday";

    if (multiSelect) {
      button.classList.toggle("selected");
      const selected = button.classList.contains("selected");
      button.setAttribute("aria-pressed", String(selected));

      if (selected && !answers.holiday.includes(value)) {
        answers.holiday.push(value);
      } else if (!selected) {
        answers.holiday = answers.holiday.filter(item => item !== value);
      }
    } else {
      button.closest(".quiz-page")
        .querySelectorAll(`[data-group="${group}"]`)
        .forEach(option => {
          option.classList.remove("selected");
          option.setAttribute("aria-pressed", "false");
        });

      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
      answers[group] = value;
    }

    if (group === "origin") {
      const countryField = document.querySelector("#other-country-wrap");
      countryField.hidden = value !== "Other country";
    }

    const message = button.closest(".quiz-page").querySelector(".message");
    if (message) message.textContent = "";
  });
});

document.querySelector("#other-country").addEventListener("input", event => {
  answers.otherCountry = event.target.value.trim();
});

function updateSlider(slider, output, formatValue) {
  const min = Number(slider.min);
  const max = Number(slider.max);
  const value = Number(slider.value);
  const percentage = ((value - min) / (max - min)) * 100;

  slider.style.setProperty("--fill", `${percentage}%`);
  output.textContent = formatValue(value);
}

const daysSlider = document.querySelector("#days");
const budgetSlider = document.querySelector("#budget");

function updateDays() {
  updateSlider(
    daysSlider,
    document.querySelector("#days-value"),
    value => `${value} ${value === 1 ? "day" : "days"}`
  );
}

function updateBudget() {
  updateSlider(
    budgetSlider,
    document.querySelector("#budget-value"),
    value => `£${value.toLocaleString("en-GB")}`
  );
}

daysSlider.addEventListener("input", updateDays);
budgetSlider.addEventListener("input", updateBudget);
updateDays();
updateBudget();

function showError(text) {
  pages[currentPage].querySelector(".message").textContent = text;
}

document.querySelectorAll(".next-button").forEach(button => {
  button.addEventListener("click", () => {
    if (currentPage === 0) {
      if (!answers.season) {
        showError("Choose a season before continuing.");
        return;
      }

      showPage(1);
      return;
    }

    if (currentPage === 1) {
      if (!answers.origin) {
        showError("Choose where you will be travelling from.");
        return;
      }

      if (answers.origin === "Other country" && !answers.otherCountry) {
        showError("Enter the country you will be travelling from.");
        document.querySelector("#other-country").focus();
        return;
      }

      showPage(2);
      return;
    }

    if (!answers.transport) {
      showError("Choose how you would like to get around.");
      return;
    }

    if (!answers.passport) {
      showError("Choose your passport or immigration status.");
      return;
    }

    showResults();
  });
});

document.querySelectorAll(".previous-button").forEach(button => {
  if (button.id === "edit-answers") return;

  button.addEventListener("click", () => {
    if (currentPage > 0) showPage(currentPage - 1);
  });
});


function showResults() {
  const savedAnswers = {
    ...answers,
    days: Number(daysSlider.value),
    budget: Number(budgetSlider.value),
    studentDiscount: document.querySelector("#student-discount").checked
  };
  try {
    localStorage.setItem("travel-quiz-answers", JSON.stringify(savedAnswers));
  } catch {
    showError("Your browser could not save your answers. Please allow site storage and try again.");
    return;
  }
  window.location.href = "results.html";
}

// Restore previous answers when the visitor chooses Edit my answers.
try {
  const saved = JSON.parse(localStorage.getItem("travel-quiz-answers") || "null");
  if (saved && typeof saved === "object") {
    document.querySelectorAll("[data-group]").forEach(button => {
      const group = button.dataset.group;
      const value = button.dataset.value;
      if (group === "holiday"
        ? Array.isArray(saved.holiday) && saved.holiday.includes(value)
        : saved[group] === value) {
        button.click();
      }
    });
    answers.otherCountry = typeof saved.otherCountry === "string" ? saved.otherCountry : "";
    document.querySelector("#other-country").value = answers.otherCountry;
    if (Number.isInteger(saved.days) && saved.days >= 1 && saved.days <= 14) daysSlider.value = saved.days;
    if (Number.isFinite(saved.budget) && saved.budget >= 100 && saved.budget <= 2000) budgetSlider.value = saved.budget;
    document.querySelector("#student-discount").checked = saved.studentDiscount === true;
  }
} catch {
  // A fresh quiz remains usable if stored answers cannot be read.
}
updateDays();
updateBudget();
showPage(0);
