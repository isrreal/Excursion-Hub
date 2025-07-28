const express = require("express");
const path = require('path');
const ExcursaoService = require('../public/javascripts/services/excursoes.service.js');
const router = express.Router();

// --- CORREÇÃO APLICADA AQUI ---
// Importa o router de participantes
const participantesRouter = require('./participantes.routes');
// Conecta o router de participantes à rota correta, incluindo o /excursoes/
router.use('/excursoes/:excursaoId/participantes', participantesRouter);


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

router.post(
    "/excursoes",
    (request, response) => {
        if (!request.session.user) {
            return response.status(401).json({ message: "Não autorizado: faça login para criar uma excursão." });
        }
        try {
            const novaExcursao = ExcursaoService.criarExcursao(request.body, request.session.user);
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


module.exports = router;