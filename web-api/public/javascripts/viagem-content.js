document.addEventListener('DOMContentLoaded', () => {
    const idExcursaoSelecionada = localStorage.getItem('selectedExcursionId');

    if (idExcursaoSelecionada) {
        const excursao = ExcursaoService.recuperarExcursao(parseInt(idExcursaoSelecionada));

        if (excursao) {
            document.getElementById('excursoes-header-content').textContent = `Viagem ao ${excursao.localDeViagem}`;
            document.getElementById('viagem-titulo').textContent = `Viagem a ${excursao.localDeViagem}`;
            document.getElementById('organizador').textContent = excursao.organizador;
            document.getElementById('viagem-participantes').textContent = `${excursao.quantidadeDeParticipantes}`;
            document.getElementById('data').textContent = excursao.data;
            document.getElementById('destino').textContent = excursao.destino;
            document.querySelector('#descricao span').textContent = excursao.descricao;
        } else {
            console.error('Excursão não encontrada para o ID:', idExcursaoSelecionada);
        }
    } else {
        console.warn('Nenhum ID de excursão encontrado no armazenamento local.');
    }
});