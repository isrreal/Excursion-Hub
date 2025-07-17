class ExcursaoModel {
    constructor(localDeViagem, organizador, quantidadeDeParticipantes,
        data, destino, descricao) {
            this.localDeViagem = localDeViagem
            this.organizador = organizador
            this.quantidadeDeParticipantes = quantidadeDeParticipantes
            this.data = data
            this.destino = destino
            this.descricao = descricao
    }
}

module.exports = ExcursaoModel