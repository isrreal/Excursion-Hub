function showExcursionDetails(excursionId) {
    localStorage.setItem('selectedExcursionId', excursionId);

    window.location.href = 'viagem-content.html';
}