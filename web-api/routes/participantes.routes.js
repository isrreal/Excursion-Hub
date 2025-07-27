const express = require("express");
const ParticipanteService = require('../public/javascripts/services/participantes.service.js');
const router = express.Router({ mergeParams: true }); 

router.post("/", (request, response) => {
    try {
        const excursaoId = parseInt(request.params.excursaoId); 
        const novoParticipante = ParticipanteService.adicionarParticipante(excursaoId, request.body);
        response.status(201).json(novoParticipante);
    } catch (error) {
        response.status(400).json({ message: "Erro ao adicionar participante", error: error.message });
    }
});

// NOVA ROTA PUT PARA ATUALIZAR
router.put("/:participanteId", (request, response) => {
    try {
        const excursaoId = parseInt(request.params.excursaoId);
        const participanteId = parseInt(request.params.participanteId);
        const participanteAtualizado = ParticipanteService.atualizarParticipante(excursaoId, participanteId, request.body);
        if (participanteAtualizado) {
            response.json(participanteAtualizado);
        } else {
            response.status(404).json({ message: "Participante não encontrado" });
        }
    } catch (error) {
        response.status(400).json({ message: "Erro ao atualizar participante", error: error.message });
    }
});

// NOVA ROTA DELETE PARA REMOVER
router.delete("/:participanteId", (request, response) => {
    try {
        const excursaoId = parseInt(request.params.excursaoId);
        const participanteId = parseInt(request.params.participanteId);
        const sucesso = ParticipanteService.removerParticipante(excursaoId, participanteId);
        if (sucesso) {
            response.status(204).send(); // 204 No Content indica sucesso sem corpo de resposta
        } else {
            response.status(404).json({ message: "Participante não encontrado" });
        }
    } catch (error) {
        response.status(400).json({ message: "Erro ao remover participante", error: error.message });
    }
});

router.patch("/:participanteId/pagamento", (request, response) => {
    try {
        const excursaoId = parseInt(request.params.excursaoId);
        const participanteId = parseInt(request.params.participanteId);
        const participanteAtualizado = ParticipanteService.atualizarStatusPagamento(excursaoId, participanteId);
        response.json(participanteAtualizado);
    } catch (error) {
        response.status(400).json({ message: "Erro ao atualizar pagamento", error: error.message });
    }
});


module.exports = router;