// DEMONSTRATION DATA ONLY.
// These amounts are examples for testing, not researched travel prices.
// All amounts are in GBP per person.

const travelDestinations = [
    {
        id: "lisbon",
        interests: ["Culture and history", "Nightlife"],
        accommodationPerNight: {
            "Hotel": 80,
            "Budget hotel": 50,
            "Apartment": 65,
            "Any affordable option": 30
        },
        foodPerDay: 25,
        transportPerDay: 7
    },
    {
        id: "amsterdam",
        interests: ["Culture and history", "Nightlife"],
        accommodationPerNight: {
            "Hotel": 120,
            "Budget hotel": 80,
            "Apartment": 100,
            "Any affordable option": 45
        },
        foodPerDay: 35,
        transportPerDay: 10
    },
    {
        id: "menorca",
        interests: ["Beach", "Nature and mountains"],
        accommodationPerNight: {
            "Hotel": 100,
            "Budget hotel": 65,
            "Apartment": 80,
            "Any affordable option": 45
        },
        foodPerDay: 30,
        transportPerDay: 10
    },
    {
        id: "copenhagen",
        interests: ["Culture and history", "Nightlife"],
        accommodationPerNight: {
            "Hotel": 130,
            "Budget hotel": 90,
            "Apartment": 110,
            "Any affordable option": 50
        },
        foodPerDay: 40,
        transportPerDay: 12
    },
    {
        id: "paris",
        interests: ["Culture and history", "Nightlife"],
        accommodationPerNight: {
            "Hotel": 110,
            "Budget hotel": 75,
            "Apartment": 95,
            "Any affordable option": 40
        },
        foodPerDay: 35,
        transportPerDay: 10
    },
    {
        id: "barcelona",
        interests: ["Beach", "Culture and history", "Nightlife"],
        accommodationPerNight: {
            "Hotel": 95,
            "Budget hotel": 60,
            "Apartment": 75,
            "Any affordable option": 35
        },
        foodPerDay: 30,
        transportPerDay: 8
    }
];

function estimateTripCost(destination, days, accommodation) {
    const nights = Math.max(0, days - 1);

    const nightlyCost =
        destination.accommodationPerNight[accommodation] ??
        destination.accommodationPerNight["Any affordable option"];

    return Math.round(
        nightlyCost * nights +
        destination.foodPerDay * days +
        destination.transportPerDay * days
    );
}