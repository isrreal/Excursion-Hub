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
    const modalTitle = modal.querySelector('h2');
    const submitButton = modal.querySelector('button[type="submit"]');

    let editingParticipantId = null; // Variável para controlar se estamos editando ou adicionando

    // === Funções ===

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

            loadParticipants(excursion.participantes || []);

        } catch (error) {
            console.error('Erro ao buscar a excursão:', error);
            alert('Houve um erro ao carregar os dados da excursão.');
            window.location.href = 'index.html';
        }
    };

    const loadParticipants = (participants) => {
        participantsListContainer.innerHTML = ''; 
        if(participants.length === 0) {
            participantsListContainer.innerHTML = '<p>Ainda não há participantes nesta excursão.</p>';
            return;
        }
        participants.forEach(participant => {
            appendParticipantToDOM(participant);
        });
    };

    const appendParticipantToDOM = (participant) => {
        const noParticipantsMessage = participantsListContainer.querySelector('p');
        if (noParticipantsMessage) {
            noParticipantsMessage.remove();
        }

        const item = document.createElement('div');
        item.className = 'participante-item';
        item.setAttribute('data-participant-id', participant.id); // Adiciona ID ao item
        item.innerHTML = `
            <div class="participante-info">
                <img src="images/user.png" alt="Avatar" class="participante-avatar">
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

        // Adiciona os eventos DEPOIS de criar o elemento
        item.querySelector('.editar').addEventListener('click', () => handleEdit(participant));
        item.querySelector('.remover').addEventListener('click', () => handleRemove(participant.id));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault(); 
        
        const formData = new FormData(participantForm);
        const participantData = {
            nome: formData.get('name'),
            email: formData.get('email'),
            telefone: formData.get('phone')
        };
        
        // Decide se cria um novo ou atualiza um existente
        if (editingParticipantId) {
            await updateParticipant(editingParticipantId, participantData);
        } else {
            await createParticipant(participantData);
        }
    };

    const createParticipant = async (data) => {
         try {
            const response = await fetch(`/api/excursoes/${excursionId}/participantes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Falha ao adicionar participante.');
            
            const savedParticipant = await response.json(); 
            appendParticipantToDOM(savedParticipant);

            // Atualiza contagem
            const countSpan = document.getElementById('viagem-participantes');
            countSpan.textContent = parseInt(countSpan.textContent) + 1;
            
            closeModal(); 
        } catch (error) {
            console.error('Erro ao salvar participante:', error);
            alert('Não foi possível adicionar o participante. Tente novamente.');
        }
    };

    const updateParticipant = async (participantId, data) => {
        try {
            const response = await fetch(`/api/excursoes/${excursionId}/participantes/${participantId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Falha ao atualizar participante.');

            const updatedParticipant = await response.json();
            
            // Atualiza a interface
            const itemToUpdate = participantsListContainer.querySelector(`[data-participant-id='${participantId}']`);
            if (itemToUpdate) {
                itemToUpdate.querySelector('.nome-participante').textContent = updatedParticipant.nome;
                itemToUpdate.querySelector('.status-participante').textContent = updatedParticipant.email;
            }
            
            closeModal();
        } catch (error) {
            console.error('Erro ao atualizar participante:', error);
            alert('Não foi possível atualizar o participante. Tente novamente.');
        }
    };

    const handleEdit = (participant) => {
        editingParticipantId = participant.id;
        modalTitle.textContent = 'Editar Participante';
        submitButton.textContent = 'Salvar Alterações';
        
        // Preenche o formulário
        participantForm.querySelector('#participant-name').value = participant.nome;
        participantForm.querySelector('#participant-email').value = participant.email;
        participantForm.querySelector('#participant-phone').value = participant.telefone || '';

        openModal();
    };

    const handleRemove = async (participantId) => {
        if (!confirm('Tem certeza que deseja remover este participante?')) {
            return;
        }

        try {
            const response = await fetch(`/api/excursoes/${excursionId}/participantes/${participantId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Falha ao remover participante.');
            
            // Remove da tela
            const itemToRemove = participantsListContainer.querySelector(`[data-participant-id='${participantId}']`);
            if (itemToRemove) itemToRemove.remove();

            // Atualiza contagem
            const countSpan = document.getElementById('viagem-participantes');
            countSpan.textContent = parseInt(countSpan.textContent) - 1;

            // Mostra mensagem se a lista ficar vazia
            if(participantsListContainer.children.length === 0){
                participantsListContainer.innerHTML = '<p>Ainda não há participantes nesta excursão.</p>';
            }

        } catch (error) {
            console.error('Erro ao remover participante:', error);
            alert('Não foi possível remover o participante. Tente novamente.');
        }
    };
    
    // Funções de controle do Modal
    const openModal = () => modal.classList.add('show');
    const closeModal = () => {
        modal.classList.remove('show');
        // Reseta o estado do modal para "Adicionar"
        editingParticipantId = null;
        modalTitle.textContent = 'Adicionar Novo Participante';
        submitButton.textContent = 'Salvar Participante';
        participantForm.reset();
    };

    // === Lógica de Eventos ===

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

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); 
    });

    participantForm.addEventListener('submit', handleFormSubmit);

    // === Inicialização ===
    loadExcursionData();
});