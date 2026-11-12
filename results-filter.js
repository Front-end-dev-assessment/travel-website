(() => {
    const cards = [...document.querySelectorAll('.destination-card')];
    if (!cards.length) return;
    const notice = document.createElement('p');
    notice.className = 'budget-note';
    notice.textContent = 'Demo estimates for testing only, not researched prices. Includes accommodation, food and public transport. Excludes flights, insurance, visas and paid attractions. Season and transport preferences are not yet used in pricing; entry eligibility is not assessed.';
    cards[0].before(notice);
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    cards[0].before(status);

    function applyFilters() {
        cards.forEach(card => {
            card.hidden = true;
            const price = card.querySelector('.destination-price');
            if (price) price.textContent = 'Estimated cost: —';
        });
        if (typeof travelDestinations === 'undefined' || typeof estimateTripCost !== 'function') {
            status.textContent = 'Destination data could not be loaded. Please check travel-data.js.';
            return;
        }
        let answers;
        try {
            answers = JSON.parse(localStorage.getItem('travel-quiz-answers') || 'null');
        } catch {
            status.textContent = 'Your answers could not be read. Please complete the travel quiz again.';
            return;
        }
        if (!answers || !Number.isInteger(answers.days) || answers.days < 1 || answers.days > 14 ||
            !Number.isFinite(answers.budget) || answers.budget < 100 || answers.budget > 2000 ||
            !Array.isArray(answers.holiday)) {
            status.textContent = 'Complete the travel quiz to see matching destinations.';
            return;
        }
        const interests = answers.holiday.filter(value => typeof value === 'string');
        let count = 0;
        cards.forEach(card => {
            const id = card.querySelector('.save-button[data-destination]')?.dataset.destination;
            const destination = travelDestinations.find(item => item.id === id);
            if (!destination) return;
            const cost = estimateTripCost(destination, answers.days, answers.stay);
            const matchesInterests = interests.length === 0 || interests.some(interest => destination.interests.includes(interest));
            const matches = Number.isFinite(cost) && cost <= answers.budget && matchesInterests;
            card.hidden = !matches;
            if (!matches) return;
            count++;
            const price = card.querySelector('.destination-price');
            if (price) price.textContent = `Demo estimate: £${cost.toLocaleString('en-GB')}/person · ${answers.days} ${answers.days === 1 ? 'day' : 'days'}`;
        });
        status.textContent = count
            ? `${count} ${count === 1 ? 'destination matches' : 'destinations match'} your budget and at least one selected interest.`
            : 'No destinations in our current demo catalogue match your budget and interests. Choose Edit my answers to adjust your preferences.';
    }
    applyFilters();
    window.addEventListener('pageshow', applyFilters);
    window.addEventListener('storage', event => {
        if (event.key === 'travel-quiz-answers' || event.key === null) applyFilters();
    });
})();
