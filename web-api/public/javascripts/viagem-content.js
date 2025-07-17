document.addEventListener('DOMContentLoaded', async () => {
    const selectedExcursionId = localStorage.getItem('selectedExcursionId');

    if (selectedExcursionId) {
        try {
            const response = await fetch(`/api/excursoes/${selectedExcursionId}`);

            if (!response.ok) {
                if (response.status === 404) {
                    console.error('Excursão não encontrada no servidor (rota ou ID inválido).');
                    alert('Excursão não encontrada. Redirecionando para a página inicial.');
                    window.location.href = 'index.html';
                } else {
                    throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
                }
            }

            const excursion = await response.json();

            if (excursion) {
                document.getElementById('excursoes-header-content').textContent = `Viagem ao ${excursion.localDeViagem}`;
                document.getElementById('viagem-titulo').textContent = `Viagem a ${excursion.localDeViagem}`;
                document.getElementById('organizador').textContent = excursion.organizador;
                document.getElementById('viagem-participantes').textContent = `${excursion.quantidadeDeParticipantes}`;
                document.getElementById('data').textContent = excursion.data;
                document.getElementById('destino').textContent = excursion.destino;
                document.querySelector('#descricao span').textContent = excursion.descricao;
            } else {
                console.error('Dados da excursão vazios ou inválidos recebidos do servidor.');
                alert('Erro ao carregar os dados da excursão. Redirecionando...');
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Erro ao buscar a excursão:', error);
            alert('Houve um erro ao carregar a excursão. Por favor, tente novamente.');
            window.location.href = 'index.html';
        }
    } else {
        console.warn('Nenhum ID de excursão encontrado no localStorage. Redirecionando para a página inicial.');
        window.location.href = 'index.html';
    }
});