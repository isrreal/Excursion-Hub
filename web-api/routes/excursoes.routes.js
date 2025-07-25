const express = require("express");
const path = require('path');
const ExcursaoService = require('../public/javascripts/services/excursoes.service');
const router = express.Router();

router.get(
    "/excursoes/:id",
    (request, response) => {
        const excursao = ExcursaoService.recuperarExcursao(parseInt(request.params.id));
        if (excursao) {
            response.json(excursao);
        } else {
            response.status(404).json({ message: "Excursão não encontrada" });
        }
    }
);

module.exports = router;

router.post(
    "/excursoes",
    (request, response) => {
        try {
            const novaExcursao = ExcursaoService.criarExcursao(request.body);
            response.status(201).json(novaExcursao);
        } catch (error) {
            response.status(400).json({ message: "Erro ao criar excursão", error: error.message });
        }
    }
);

router.get(
    "/excursoes",
    (request, response) => {
        const todasExcursoes = ExcursaoService.listarExcursoes();
        response.json(todasExcursoes);
    }
);

router.put(
    "/excursoes/:id",
    (request, response) => {
        try {
            const excursaoAtualizada = ExcursaoService.atualizarExcursao(parseInt(request.params.id), request.body);
            if (excursaoAtualizada) {
                response.json(excursaoAtualizada);
            } else {
                response.status(404).json({ message: "Excursão não encontrada" });
            }
        } catch (error) {
            response.status(400).json({ message: "Erro ao atualizar excursão", error: error.message });
        }
    }
);

router.delete(
    "/excursoes/:id",
    (request, response) => {
        try {
            const excursaoRemovida = ExcursaoService.removerExcursao(parseInt(request.params.id));
            if (excursaoRemovida) {
                response.json({ message: "Excursão removida com sucesso", excursao: excursaoRemovida });
            } else {
                response.status(404).json({ message: "Excursão não encontrada" });
            }
        } catch (error) {
            response.status(400).json({ message: "Erro ao remover excursão", error: error.message });
        }
    }
);

