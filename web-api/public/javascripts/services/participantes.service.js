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
            ...dadosParticipante,
            status: 'pago'
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
}

module.exports = ParticipanteService;