const saveButtons = document.querySelectorAll(".save-button");

let favourites = [];

try {
    const stored = JSON.parse(
        localStorage.getItem("travel-favourites") || "[]"
    );

    if (Array.isArray(stored)) {
        favourites = stored.filter(item => typeof item === "string");
    }
} catch {
    favourites = [];
}

saveButtons.forEach(button => {
    const destination = button.dataset.destination;

    function updateButton() {
        const isSaved = favourites.includes(destination);

        button.textContent = isSaved ? "♥ Saved" : "♡ Save";
        button.setAttribute("aria-pressed", String(isSaved));
    }

    updateButton();

    button.addEventListener("click", () => {
        const updated = favourites.includes(destination)
            ? favourites.filter(item => item !== destination)
            : [...favourites, destination];

        try {
            localStorage.setItem(
                "travel-favourites",
                JSON.stringify(updated)
            );

            favourites = updated;
            updateButton();
        } catch {
            alert("Your browser could not save this destination.");
        }
    });
});
function refreshSaveButtons() {
    try {
        const stored = JSON.parse(
            localStorage.getItem("travel-favourites") || "[]"
        );

        favourites = Array.isArray(stored)
            ? stored.filter(item => typeof item === "string")
            : [];
    } catch {
        favourites = [];
    }

    saveButtons.forEach(button => {
        const isSaved = favourites.includes(
            button.dataset.destination
        );

        button.textContent = isSaved ? "♥ Saved" : "♡ Save";
        button.setAttribute("aria-pressed", String(isSaved));
    });
}

// Обновляем кнопки при открытии страницы и возвращении назад.
window.addEventListener("pageshow", refreshSaveButtons);

// Обновляем кнопки, если избранное изменилось в другой вкладке.
window.addEventListener("storage", event => {
    if (event.key === "travel-favourites" || event.key === null) {
        refreshSaveButtons();
    }
});

refreshSaveButtons();