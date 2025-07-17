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