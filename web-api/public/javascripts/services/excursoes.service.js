const fs = require('fs');
const path = require('path');
const ExcursaoModel = require('../models/excursao.model.js');

// Caminho para o nosso novo banco de dados em arquivo
const dbPath = path.resolve(__dirname, '../data/data.json');

// Funções auxiliares para ler e escrever no arquivo
const readData = () => JSON.parse(fs.readFileSync(dbPath));
const writeData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));


class ExcursaoService {
    static listarExcursoes() {
        const data = readData();
        const todasExcursoes = data.excursoes;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const proximas = [];
        const passadas = [];

        todasExcursoes.forEach(excursao => {
            const dataParaComparar = excursao.dataTermino ? excursao.dataTermino : excursao.data;
            const dataFinalExcursao = new Date(dataParaComparar);
            const status = dataFinalExcursao < hoje ? 'passada' : 'proxima'; // Define o status

            excursao.status = status; // Adiciona a propriedade 'status' ao objeto da excursão

            if (status === 'passada') {
                passadas.push(excursao);
            } else {
                proximas.push(excursao);
            }
        });

        return { proximas, passadas };
    }

    static recuperarExcursao(id) {
        const data = readData();
        return data.excursoes.find(excursao => excursao.id === id) || null;
    }
    
    // ...
    static criarExcursao(dadosExcursao, usuario) {
        if (!dadosExcursao.nomeExcursao || !dadosExcursao.destino || !dadosExcursao.dataInicio) {
            throw new Error("Campos obrigatórios (nome, destino, data de início) não preenchidos.");
        }
        
        const data = readData();
        const novaExcursao = new ExcursaoModel(
            data.excursoes.length > 0 ? Math.max(...data.excursoes.map(e => e.id)) + 1 : 1,
            dadosExcursao.nomeExcursao,
            usuario.nome, // Usa o nome do usuário da sessão
            dadosExcursao.dataInicio,
            dadosExcursao.destino,
            dadosExcursao.descricao,
            dadosExcursao.custoPessoa,
            dadosExcursao.veiculo,
            dadosExcursao.dataTermino
        );
        
        data.excursoes.push(novaExcursao);
        writeData(data);
        return novaExcursao;
    }
    
    static atualizarExcursao(id, dadosAtualizados) {
        const data = readData();
        const index = data.excursoes.findIndex(excursao => excursao.id === id);
        if (index === -1) return null;

        Object.keys(dadosAtualizados).forEach(key => {
            if (dadosAtualizados[key] !== undefined) {
                data.excursoes[index][key] = dadosAtualizados[key];
            }
        });

        writeData(data); // Salva os dados no arquivo
        return data.excursoes[index];
    }

    static removerExcursao(id) {
        const data = readData();
        const index = data.excursoes.findIndex(excursao => excursao.id === id);
        if (index === -1) return null;

        const excursaoRemovida = data.excursoes.splice(index, 1);
        writeData(data); // Salva os dados no arquivo
        return excursaoRemovida[0];
    }
}

module.exports = ExcursaoService;