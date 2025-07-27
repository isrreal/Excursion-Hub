document.addEventListener('DOMContentLoaded', function() {
    const novaExcursaoButton = document.getElementById('nova-excursao-button');
    const proximasButton = document.getElementById('proximas-button');
    const passadasButton = document.getElementById('passadas-button');
    const container = document.getElementById('left-section');

    let todasAsExcursoes = { proximas: [], passadas: [] };

    // --- FUNÇÕES ---

    function showExcursionDetails(excursionId) {
        localStorage.setItem('selectedExcursionId', excursionId);
        window.location.href = 'viagem-content.html';
    }
    
    // Função para formatar uma data de 'YYYY-MM-DD' para 'DD/MM/YYYY'
    function formatarData(dataString) {
        if (!dataString) return '';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Função para criar a string de data a ser exibida
    // DEFINIDA ANTES de ser usada.
    function criarStringDeData(excursao) {
        const dataInicio = formatarData(excursao.data);
        const dataTermino = formatarData(excursao.dataTermino);

        if (dataInicio && dataTermino && dataInicio !== dataTermino) {
            return `${dataInicio} a ${dataTermino}`;
        }
        return dataInicio; // Retorna apenas a data de início se não houver término ou se for o mesmo dia
    }

    // Função para renderizar a lista de excursões na tela
    function displayExcursions(lista) {
        container.innerHTML = ''; // Limpa o conteúdo anterior

        if (!lista || lista.length === 0) {
            container.innerHTML = '<p>Nenhuma excursão encontrada.</p>';
            return;
        }

        lista.forEach(excursao => {
            const excursaoElement = document.createElement('div');
            excursaoElement.className = `excursao ${excursao.status}`; 

            excursaoElement.addEventListener('click', () => showExcursionDetails(excursao.id));

            excursaoElement.innerHTML = `
                <div>
                    <h3 class="local-excursao">${excursao.localDeViagem || excursao.nomeExcursao}</h3>
                    <ul class="excursao-info">
                        <li>${excursao.quantidadeDeParticipantes || '0'} participantes</li>
                        <li>${criarStringDeData(excursao)}</li>
                    </ul>
                </div>
                <div class="status-dot"></div>
            `;
            container.appendChild(excursaoElement);
        });
    }

    // Função principal para carregar os dados da API
    async function loadExcursions() {
        try {
            const response = await fetch('/api/excursoes');
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            todasAsExcursoes = await response.json();
            
            displayExcursions(todasAsExcursoes.proximas);
            proximasButton.classList.add('active');
            passadasButton.classList.remove('active');

        } catch (error) {
            console.error('Falha ao buscar excursões:', error);
            container.innerHTML = '<p>Não foi possível carregar as excursões. Tente novamente mais tarde.</p>';
        }
    }

    // --- EVENTOS ---

    if (novaExcursaoButton) {
        novaExcursaoButton.addEventListener('click', () => {
            window.location.href = 'criar-excursao.html';
        });
    }

    proximasButton.addEventListener('click', () => {
        displayExcursions(todasAsExcursoes.proximas);
        proximasButton.classList.add('active');
        passadasButton.classList.remove('active');
    });

    passadasButton.addEventListener('click', () => {
        displayExcursions(todasAsExcursoes.passadas);
        passadasButton.classList.add('active');
        proximasButton.classList.remove('active');
    });

    // --- INICIALIZAÇÃO ---
    loadExcursions();
});