const ExcursaoModel = require("../models/excursao.model")
const excursoes = require("../data/excursoes.js")

class ExcursaoService {
    static recuperarExcursao(id) {
        for(let i = 0; i < excursoes.length; ++i) {
            if(excursoes[i].id == id) return excursoes[i]
        }
        return null
    }
}

module.exports = ExcursaoService