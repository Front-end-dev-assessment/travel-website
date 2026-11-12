function updateTripPrices() {
    let answers = null;

    try {
        answers = JSON.parse(
            localStorage.getItem("travel-quiz-answers") || "null"
        );
    } catch {
        answers = null;
    }

    const validAnswers =
        answers &&
        Number.isInteger(answers.days) &&
        answers.days >= 1 &&
        answers.days <= 14;

    function getPriceText(destinationId) {
        if (!validAnswers) {
            return "Complete the quiz to see your estimate.";
        }

        if (
            typeof travelDestinations === "undefined" ||
            typeof estimateTripCost !== "function"
        ) {
            return "Price data could not be loaded.";
        }

        const destination = travelDestinations.find(
            place => place.id === destinationId
        );

        if (!destination) {
            return "Estimate unavailable.";
        }

        const accommodation =
            typeof answers.stay === "string" &&
                Object.prototype.hasOwnProperty.call(
                    destination.accommodationPerNight,
                    answers.stay
                )
                ? answers.stay
                : "Any affordable option";

        const cost = estimateTripCost(
            destination,
            answers.days,
            accommodation
        );

        const aboveBudget =
            Number.isFinite(answers.budget) &&
            cost > answers.budget;

        return (
            "Demo estimate: £" +
            cost.toLocaleString("en-GB") +
            "/person" +
            (aboveBudget ? " · Above your current budget" : "")
        );
    }

    // Prices on the Favourites page.
    document.querySelectorAll(".favourite-card").forEach(card => {
        const price = card.querySelector(".favourite-price");

        if (price) {
            price.textContent = getPriceText(
                card.dataset.destination
            );
        }
    });

    // Price on a destination details page.
    const destinationId = document.body.dataset.tripDestination;

    document.querySelectorAll("[data-trip-price]").forEach(element => {
        element.textContent = getPriceText(destinationId);
    });

    // Duration on a destination details page.
    document.querySelectorAll("[data-trip-duration]").forEach(element => {
        if (!validAnswers) {
            element.textContent =
                "Complete the quiz to choose your trip length.";
            return;
        }

        const days = answers.days;
        const nights = days - 1;

        element.textContent =
            days + (days === 1 ? " day" : " days") +
            " / " +
            nights + (nights === 1 ? " night" : " nights");
    });
}

updateTripPrices();

window.addEventListener("pageshow", updateTripPrices);

window.addEventListener("storage", event => {
    if (event.key === "travel-quiz-answers" || event.key === null) {
        updateTripPrices();
    }
});