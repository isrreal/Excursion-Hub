class ExcursaoModel {
    constructor(id, localDeViagem, organizador, quantidadeDeParticipantes,
        data, destino, descricao) {
            this.id = id
            this.localDeViagem = localDeViagem
            this.organizador = organizador
            this.quantidadeDeParticipantes = quantidadeDeParticipantes
            this.data = data
            this.destino = destino
            this.descricao = descricao
    }
}

module.exports = ExcursaoModel