document.addEventListener('DOMContentLoaded', () => {
    // === Seletores de Elementos ===
    const excursionId = localStorage.getItem('selectedExcursionId');
    const tabs = document.querySelectorAll('.menu-viagem li');
    const views = document.querySelectorAll('.content-view');
    const openModalBtn = document.getElementById('add-participant-btn');
    const modal = document.getElementById('add-participant-modal');
    const closeModalBtn = document.getElementById('cancel-modal-btn');
    const participantForm = document.getElementById('add-participant-form');
    const participantsListContainer = document.getElementById('lista-participantes-container');

    // === Funções ===

    /**
     * Busca e exibe os dados da excursão principal.
     */
    const loadExcursionData = async () => {
        if (!excursionId) {
            console.warn('Nenhum ID de excursão encontrado. Redirecionando...');
            window.location.href = 'index.html';
            return;
        }
        try {
            const response = await fetch(`/api/excursoes/${excursionId}`);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            
            const excursion = await response.json();
            
            document.getElementById('excursoes-header-content').textContent = `Viagem a ${excursion.localDeViagem}`;
            document.getElementById('viagem-titulo').textContent = `Viagem a ${excursion.localDeViagem}`;
            document.getElementById('organizador').textContent = excursion.organizador;
            document.getElementById('viagem-participantes').textContent = excursion.quantidadeDeParticipantes;
            document.getElementById('data').textContent = new Date(excursion.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            document.getElementById('destino').textContent = excursion.destino;
            document.querySelector('#descricao span').textContent = excursion.descricao;

            // Carrega os participantes associados
            loadParticipants(excursion.participantes || []);

        } catch (error) {
            console.error('Erro ao buscar a excursão:', error);
            alert('Houve um erro ao carregar os dados da excursão.');
            window.location.href = 'index.html';
        }
    };

    /**
     * Carrega e exibe a lista de participantes na tela.
     * @param {Array} participants - O array de objetos de participantes.
     */
    const loadParticipants = (participants) => {
        participantsListContainer.innerHTML = ''; // Limpa a lista antes de adicionar
        if(participants.length === 0) {
            participantsListContainer.innerHTML = '<p>Ainda não há participantes nesta excursão.</p>';
            return;
        }
        participants.forEach(participant => {
            appendParticipantToDOM(participant);
        });
    };

    /**
     * Cria e adiciona o HTML de um participante à lista na tela.
     * @param {object} participant - O objeto do participante com nome, email, etc.
     */
    const appendParticipantToDOM = (participant) => {
         // Remove a mensagem "nenhum participante" se ela existir
        const noParticipantsMessage = participantsListContainer.querySelector('p');
        if (noParticipantsMessage) {
            noParticipantsMessage.remove();
        }

        const item = document.createElement('div');
        item.className = 'participante-item';
        item.innerHTML = `
            <div class="participante-info">
                <img src="images/user_placeholder.png" alt="Avatar" class="participante-avatar">
                <div>
                    <div class="nome-participante">${participant.nome || 'Nome não informado'}</div>
                    <span class="status-participante pago">${participant.email || 'Status pendente'}</span>
                </div>
            </div>
            <div class="participante-acoes">
                <button class="btn-acao editar">Editar</button>
                <button class="btn-acao remover">Remover</button>
            </div>
        `;
        participantsListContainer.appendChild(item);
    };

    /**
     * Lida com a submissão do formulário para adicionar um novo participante.
     * @param {Event} event - O evento de submissão do formulário.
     */
    const handleAddParticipant = async (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        
        const formData = new FormData(participantForm);
        const newParticipant = {
            nome: formData.get('name'),
            email: formData.get('email'),
            telefone: formData.get('phone')
        };

        try {
            // IMPORTANTE: A sua API deve ter um endpoint como este:
            // POST /api/excursoes/{id}/participantes
            const response = await fetch(`/api/excursoes/${excursionId}/participantes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newParticipant)
            });

            if (!response.ok) {
                throw new Error('Falha ao adicionar participante.');
            }
            
            const savedParticipant = await response.json(); // A API deve retornar o participante salvo
            
            appendParticipantToDOM(savedParticipant); // Adiciona na tela
            closeModal(); // Fecha o modal
            participantForm.reset(); // Limpa o formulário

        } catch (error) {
            console.error('Erro ao salvar participante:', error);
            alert('Não foi possível adicionar o participante. Tente novamente.');
        }
    };
    
    // Funções de controle do Modal
    const openModal = () => modal.classList.add('show');
    const closeModal = () => modal.classList.remove('show');

    // === Lógica de Eventos ===

    // Troca de Abas (Visão Geral / Participantes)
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const viewId = tab.getAttribute('data-view');
            views.forEach(view => {
                view.style.display = view.id === viewId ? 'block' : 'none';
            });
        });
    });

    // Controle do Modal
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // Fecha se clicar fora do conteúdo
    });

    // Submissão do Formulário
    participantForm.addEventListener('submit', handleAddParticipant);

    // === Inicialização ===
    loadExcursionData();
});