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
    const paymentsListContainer = document.getElementById('lista-pagamentos-container');
    
    // Verifica se os elementos cruciais existem antes de prosseguir
    if (!modal || !participantForm || !openModalBtn) {
        console.error("ERRO: Elementos do modal ou botão de adicionar não foram encontrados no HTML.");
        return; 
    }

    const modalTitle = modal.querySelector('h2');
    const submitButton = modal.querySelector('button[type="submit"]');
    let editingParticipantId = null;

    // === Funções ===

    const loadExcursionData = async () => {
        if (!excursionId) {
            window.location.href = 'index.html';
            return;
        }
        try {
            const response = await fetch(`/api/excursoes/${excursionId}`);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            
            const excursion = await response.json();
            
            document.getElementById('viagem-titulo').textContent = `Viagem a ${excursion.localDeViagem}`;
            document.getElementById('organizador').textContent = excursion.organizador;
            document.getElementById('viagem-participantes').textContent = excursion.quantidadeDeParticipantes;
            document.getElementById('data').textContent = new Date(excursion.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            document.getElementById('destino').textContent = excursion.destino;
            document.querySelector('#descricao span').textContent = excursion.descricao;

            loadParticipants(excursion.participantes || []);
            loadPayments(excursion.participantes || []);

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
        if (noParticipantsMessage) noParticipantsMessage.remove();

        const item = document.createElement('div');
        item.className = 'participante-item';
        item.setAttribute('data-participant-id', participant.id);
        item.innerHTML = `
            <div class="participante-info">
                <img src="images/user-icon.png" alt="Avatar" class="participante-avatar">
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
        item.querySelector('.editar').addEventListener('click', () => handleEdit(participant));
        item.querySelector('.remover').addEventListener('click', () => handleRemove(participant.id));
    };
    
    const loadPayments = (participants) => {
        paymentsListContainer.innerHTML = '';
        if (participants.length === 0) {
            paymentsListContainer.innerHTML = '<p>Nenhum participante para exibir pagamentos.</p>';
            return;
        }
        participants.forEach(participant => {
            appendPaymentToDOM(participant);
        });
    };

    const appendPaymentToDOM = (participant) => {
        const item = document.createElement('div');
        item.className = 'pagamento-item';
        // Adiciona um ID ao elemento para facilitar a atualização
        item.setAttribute('data-payment-item-id', participant.id);
        
        const statusClass = (participant.statusPagamento === 'Pago') ? 'pago' : 'pendente';
        const valorPagoFormatado = (participant.valorPago || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const valorAPagarFormatado = (participant.valorAPagar || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        item.innerHTML = `
            <div class="pagamento-participante">
                <img src="images/user-icon.png" alt="Avatar" class="pagamento-avatar">
                <span>${participant.nome}</span>
            </div>
            <div class="pagamento-valor" id="valor-a-pagar-${participant.id}">
                <strong>Valor a Pagar:</strong> ${valorAPagarFormatado}
            </div>
            <div class="pagamento-status">
                <span class="status-tag ${statusClass}" style="cursor: pointer;" title="Clique para alterar">${participant.statusPagamento}</span>
            </div>
            <div class="pagamento-valor" id="valor-pago-${participant.id}">
                <strong>Valor Pago:</strong> ${valorPagoFormatado}
            </div>
        `;
        paymentsListContainer.appendChild(item);

        // --- LÓGICA DO CLIQUE ADICIONADA AQUI ---
        const statusTag = item.querySelector('.status-tag');
        statusTag.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/excursoes/${excursionId}/participantes/${participant.id}/pagamento`, {
                    method: 'PATCH'
                });
                if (!response.ok) throw new Error('Falha na atualização');

                const participanteAtualizado = await response.json();

                // Atualiza a tela em tempo real, sem recarregar tudo
                const novoStatusClass = (participanteAtualizado.statusPagamento === 'Pago') ? 'pago' : 'pendente';
                const novoValorPago = (participanteAtualizado.valorPago || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                statusTag.textContent = participanteAtualizado.statusPagamento;
                statusTag.className = `status-tag ${novoStatusClass}`;
                
                const valorPagoElement = document.getElementById(`valor-pago-${participant.id}`);
                valorPagoElement.innerHTML = `<strong>Valor Pago:</strong> ${novoValorPago}`;

            } catch (error) {
                console.error("Erro ao atualizar status:", error);
                alert("Não foi possível atualizar o status do pagamento.");
            }
        });
    };
    
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(participantForm);
        const participantData = {
            nome: formData.get('name'),
            email: formData.get('email'),
            telefone: formData.get('phone')
        };
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
            await loadExcursionData();
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar participante:', error);
            alert('Não foi possível adicionar o participante.');
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
            await loadExcursionData();
            closeModal();
        } catch (error) {
            console.error('Erro ao atualizar participante:', error);
            alert('Não foi possível atualizar o participante.');
        }
    };

    const handleRemove = async (participantId) => {
        if (!confirm('Tem certeza que deseja remover este participante?')) return;
        try {
            await fetch(`/api/excursoes/${excursionId}/participantes/${participantId}`, { method: 'DELETE' });
            await loadExcursionData();
        } catch (error) {
            console.error('Erro ao remover participante:', error);
            alert('Não foi possível remover o participante.');
        }
    };
    
    const handleEdit = (participant) => {
        editingParticipantId = participant.id;
        modalTitle.textContent = 'Editar Participante';
        submitButton.textContent = 'Salvar Alterações';
        
        participantForm.querySelector('#participant-name').value = participant.nome;
        participantForm.querySelector('#participant-email').value = participant.email;
        participantForm.querySelector('#participant-phone').value = participant.telefone || '';

        openModal();
    };

    const openModal = () => modal.classList.add('show');

    const closeModal = () => {
        modal.classList.remove('show');
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
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    participantForm.addEventListener('submit', handleFormSubmit);

    // === Inicialização ===
    loadExcursionData();
});