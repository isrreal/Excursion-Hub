const fs = require('fs');
const path = require('path');

// Caminho para o nosso novo banco de dados em arquivo
const dbPath = path.resolve(__dirname, '../data/data.json');

// Funções auxiliares para ler e escrever no arquivo
const readData = () => JSON.parse(fs.readFileSync(dbPath));
const writeData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));


class ParticipanteService {
    
    static adicionarParticipante(excursaoId, dadosParticipante) {
        const data = readData();
        const excursao = data.excursoes.find(e => e.id === excursaoId);
        if (!excursao) throw new Error("Excursão não encontrada.");
        if (!dadosParticipante.nome || !dadosParticipante.email) throw new Error("Nome e email do participante são obrigatórios.");

        const novoParticipante = {
            id: excursao.participantes.length > 0 ? Math.max(...excursao.participantes.map(p => p.id)) + 1 : 1,
            nome: dadosParticipante.nome,
            email: dadosParticipante.email,
            telefone: dadosParticipante.telefone,
            // --- NOVOS CAMPOS DE PAGAMENTO ---
            valorAPagar: excursao.custoPessoa || 0,
            statusPagamento: 'Pendente',
            valorPago: 0
        };
        
        excursao.participantes.push(novoParticipante);
        excursao.quantidadeDeParticipantes = excursao.participantes.length;

        writeData(data); // Salva os dados no arquivo
        return novoParticipante;
    }

    static atualizarParticipante(excursaoId, participanteId, dadosAtualizados) {
        const data = readData();
        const excursao = data.excursoes.find(e => e.id === excursaoId);
        if (!excursao) return null;

        const participanteIndex = excursao.participantes.findIndex(p => p.id === participanteId);
        if (participanteIndex === -1) return null;
        
        const participanteAtualizado = { ...excursao.participantes[participanteIndex], ...dadosAtualizados };
        excursao.participantes[participanteIndex] = participanteAtualizado;

        writeData(data); // Salva os dados no arquivo
        return participanteAtualizado;
    }

    static removerParticipante(excursaoId, participanteId) {
        const data = readData();
        const excursao = data.excursoes.find(e => e.id === excursaoId);
        if (!excursao) return false;

        const participanteIndex = excursao.participantes.findIndex(p => p.id === participanteId);
        if (participanteIndex === -1) return false;

        excursao.participantes.splice(participanteIndex, 1);
        excursao.quantidadeDeParticipantes = excursao.participantes.length;
        
        writeData(data); // Salva os dados no arquivo
        return true;
    }

     static atualizarStatusPagamento(excursaoId, participanteId) {
        const data = readData();
        const excursao = data.excursoes.find(e => e.id === excursaoId);
        if (!excursao) throw new Error("Excursão não encontrada.");

        const participante = excursao.participantes.find(p => p.id === participanteId);
        if (!participante) throw new Error("Participante não encontrado.");

        // Lógica para alternar o status e atualizar o valor pago
        if (participante.statusPagamento === 'Pendente') {
            participante.statusPagamento = 'Pago';
            participante.valorPago = participante.valorAPagar;
        } else {
            participante.statusPagamento = 'Pendente';
            participante.valorPago = 0;
        }

        writeData(data); // Salva a alteração no arquivo
        return participante; // Retorna o participante com os dados atualizados
    }

}

module.exports = ParticipanteService;