const ExcursaoModel = require("../models/excursao.model.js");
const excursoes = require("../data/excursoes.js");

class ExcursaoService {
    static recuperarExcursao(id) {
        return excursoes.find(excursao => excursao.id === id) || null;
    }

    static listarExcursoes() {
        return excursoes;
    }

    static criarExcursao(dadosExcursao) {
        // Validação dos campos que vêm do formulário
        if (!dadosExcursao.nomeExcursao || !dadosExcursao.destino || !dadosExcursao.dataInicio) {
            throw new Error("Campos obrigatórios (nome, destino, data de início) não preenchidos.");
        }

        const novaExcursao = new ExcursaoModel(
            excursoes.length > 0 ? Math.max(...excursoes.map(e => e.id)) + 1 : 1,
            dadosExcursao.nomeExcursao,     // Mapeado para localDeViagem
            'Novo Organizador',             // Valor padrão, já que não vem do form
            0,                              // Valor padrão para participantes
            dadosExcursao.dataInicio,       // Mapeado para data
            dadosExcursao.destino,
            dadosExcursao.descricao,
            dadosExcursao.custoPessoa,
            dadosExcursao.veiculo,
            dadosExcursao.dataTermino
        );
        
        excursoes.push(novaExcursao);
        return novaExcursao;
    }

    static atualizarExcursao(id, dadosAtualizados) {
        const index = excursoes.findIndex(excursao => excursao.id === id);
        if (index === -1) {
            return null;
        }

        Object.keys(dadosAtualizados).forEach(key => {
            if (dadosAtualizados[key] !== undefined) {
                excursoes[index][key] = dadosAtualizados[key];
            }
        });

        return excursoes[index];
    }

    static removerExcursao(id) {
        const index = excursoes.findIndex(excursao => excursao.id === id);
        if (index === -1) {
            return null;
        }

        const excursaoRemovida = excursoes.splice(index, 1);
        return excursaoRemovida[0];
    }
}

module.exports = ExcursaoService;