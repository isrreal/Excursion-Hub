

function showExcursionDetails(excursionId) {
    localStorage.setItem('selectedExcursionId', excursionId);
    window.location.href = 'viagem-content.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const novaExcursaoButton = document.getElementById('nova-excursao-button');
    if (novaExcursaoButton) {
        novaExcursaoButton.addEventListener('click', function() {
            window.location.href = 'criar-excursao.html';
        });
    }

    // Função para carregar as excursões da API
    loadExcursions();
});

async function loadExcursions() {
    try {
        const response = await fetch('/api/excursoes');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const excursoes = await response.json();
        displayExcursions(excursoes);
    } catch (error) {
        console.error('Falha ao buscar excursões:', error);
        const container = document.getElementById('left-section');
        container.innerHTML = '<p>Não foi possível carregar as excursões. Tente novamente mais tarde.</p>';
    }
}

function displayExcursions(excursoes) {
    const container = document.getElementById('left-section');
    container.innerHTML = ''; // Limpa o conteúdo estático

    if (excursoes.length === 0) {
        container.innerHTML = '<p>Nenhuma excursão encontrada.</p>';
        return;
    }

    excursoes.forEach(excursao => {
        const excursaoElement = document.createElement('div');
        excursaoElement.className = 'excursao';
        excursaoElement.setAttribute('onclick', `showExcursionDetails(${excursao.id})`);

        excursaoElement.innerHTML = `
            <div>
                <h3 class="local-excursao">${excursao.localDeViagem || excursao.nomeExcursao}</h3>
                <ul class="excursao-info">
                    <li>${excursao.quantidadeDeParticipantes || '0'} participantes</li>
                    <li>${excursao.data || excursao.dataInicio}</li>
                </ul>
            </div>
            <div class="status-dot"></div>
        `;
        container.appendChild(excursaoElement);
    });
}