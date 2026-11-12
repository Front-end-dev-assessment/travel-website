function showFavourites() {
    const detailsButton = document.getElementById("random-details");
    detailsButton.hidden = true;
    detailsButton.removeAttribute("href");
    requestAnimationFrame(drawWheel);
    document.getElementById("random-result").textContent = "";
    const status = document.getElementById("favourites-status");
    const cards = document.querySelectorAll(".favourite-card");

    let favourites = [];

    try {
        const stored = JSON.parse(
            localStorage.getItem("travel-favourites") || "[]"
        );

        if (Array.isArray(stored)) {
            favourites = stored.filter(item => typeof item === "string");
        }
    } catch {
        cards.forEach(card => {
            card.hidden = true;
        });

        status.textContent = "Could not load your favourites.";
        return;
    }

    let visibleCount = 0;

    cards.forEach(card => {
        const destination = card.dataset.destination;
        const isSaved = favourites.includes(destination);

        card.hidden = !isSaved;

        if (isSaved) {
            visibleCount += 1;
        }
    });

    if (visibleCount === 0) {
        status.textContent =
            "No favourites yet. Save a destination on the results page.";
    } else {
        status.textContent =
            visibleCount === 1
                ? "1 saved destination"
                : visibleCount + " saved destinations";
    }
}

window.addEventListener("pageshow", showFavourites);
document.querySelectorAll(".remove-favourite").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".favourite-card");
        const destination = card.dataset.destination;

        try {
            const stored = JSON.parse(
                localStorage.getItem("travel-favourites") || "[]"
            );

            if (!Array.isArray(stored)) {
                throw new Error("Invalid favourites list");
            }

            const updated = stored.filter(item => item !== destination);

            localStorage.setItem(
                "travel-favourites",
                JSON.stringify(updated)
            );

            showFavourites();
        } catch {
            alert("Could not remove this destination. Please try again.");
        }
    });
});
const spinButton = document.getElementById("spin-button");
const randomResult = document.getElementById("random-result");
const randomDetails = document.getElementById("random-details");

spinButton.addEventListener("click", async () => {
    const savedCards = Array.from(
        document.querySelectorAll(".favourite-card")
    ).filter(card => !card.hidden);

    if (savedCards.length === 0) {
        randomResult.textContent =
            randomDetails.hidden = true;
        randomDetails.removeAttribute("href");
        "Save a destination first to use the wheel.";
        return;
    }

    const canvas = document.getElementById("destination-wheel");

    const selectedIndex = Math.floor(
        Math.random() * savedCards.length
    );

    const selectedCard = savedCards[selectedIndex];

    const destinationName = selectedCard
        .querySelector("h2")
        .textContent.trim();

    const sectorAngle = 360 / savedCards.length;

    const stoppingAngle =
        360 - (selectedIndex + 0.5) * sectorAngle;

    const totalRotation = 360 * 5 + stoppingAngle;

    const removeButtons = document.querySelectorAll(
        ".remove-favourite"
    );

    spinButton.disabled = true;
    spinButton.textContent = "Spinning…";
    randomResult.textContent = "";

    removeButtons.forEach(button => {
        button.disabled = true;
    });

    canvas.style.transform = "rotate(0deg)";

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    try {
        const animation = canvas.animate(
            [
                { transform: "rotate(0deg)" },
                { transform: `rotate(${totalRotation}deg)` }
            ],
            {
                duration: reduceMotion ? 0 : 4000,
                easing: "cubic-bezier(0.12, 0.75, 0.15, 1)",
                fill: "forwards"
            }
        );

        await animation.finished;

        canvas.style.transform = `rotate(${stoppingAngle}deg)`;
        animation.cancel();

        randomResult.textContent =
            "Your next adventure is… " + destinationName;
        const detailsLink = selectedCard.querySelector("a.view-details");

        if (detailsLink) {
            randomDetails.href = detailsLink.getAttribute("href");
            randomDetails.hidden = false;
        } else {
            randomResult.textContent += " — details coming soon.";
        }
    } finally {
        spinButton.disabled = false;
        spinButton.textContent = "Spin again";

        removeButtons.forEach(button => {
            button.disabled = false;
        });
    }
});
function drawWheel() {
    const canvas = document.getElementById("destination-wheel");
    canvas.style.transform = "rotate(0deg)";
    const context = canvas.getContext("2d");

    const cards = Array.from(
        document.querySelectorAll(".favourite-card")
    ).filter(card => !card.hidden);

    const names = cards.map(card =>
        card.querySelector("h2").textContent.trim().split(",")[0]
    );

    context.clearRect(0, 0, canvas.width, canvas.height);

    const centre = canvas.width / 2;
    const radius = centre - 12;

    if (names.length === 0) {
        context.beginPath();
        context.arc(centre, centre, radius, 0, Math.PI * 2);
        context.fillStyle = "#e3dcac";
        context.fill();

        context.fillStyle = "#333333";
        context.font = "28px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("Save destinations first", centre, centre);

        canvas.setAttribute("aria-label", "No saved destinations");
        return;
    }

    const colours = [
        "#697800",
        "#e3dcac",
        "#f8f6e9",
        "#c7cc9a",
        "#404b00",
        "#eee8c9"
    ];

    const slice = (Math.PI * 2) / names.length;

    names.forEach((name, index) => {
        const start = -Math.PI / 2 + index * slice;
        const end = start + slice;
        const middle = start + slice / 2;

        context.beginPath();
        context.moveTo(centre, centre);
        context.arc(centre, centre, radius, start, end);
        context.closePath();

        context.fillStyle = colours[index % colours.length];
        context.fill();

        context.strokeStyle = "#f8f6e9";
        context.lineWidth = 4;
        context.stroke();

        const labelRadius = names.length === 1 ? 0 : radius * 0.6;
        const x = centre + Math.cos(middle) * labelRadius;
        const y = centre + Math.sin(middle) * labelRadius;

        const darkSector = index % colours.length === 0
            || index % colours.length === 4;

        context.fillStyle = darkSector ? "#ffffff" : "#202020";
        context.font = "bold 28px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(name, x, y, 190);
    });

    context.beginPath();
    context.arc(centre, centre, radius, 0, Math.PI * 2);
    context.strokeStyle = "#697800";
    context.lineWidth = 5;
    context.stroke();

    canvas.setAttribute(
        "aria-label",
        "Destination wheel: " + names.join(", ")
    );
}