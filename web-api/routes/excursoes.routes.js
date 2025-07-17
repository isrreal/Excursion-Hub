const express = require("express")
const ExcursaoService = require("../public/javascripts/services/excursoes.service")
const router = express.Router()


router.get(
    "/excursoes/:id", 
    (request, response) => {
        const excursao = ExcursaoService.recuperarExcursao(request.params.id)
        response.json(excursao)
    }
)

module.exports = router