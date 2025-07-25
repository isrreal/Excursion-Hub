class ExcursaoModel {
    constructor(id, localDeViagem, organizador, quantidadeDeParticipantes, data, destino, descricao, custoPessoa, veiculo, dataTermino) {
        this.id = id;
        this.localDeViagem = localDeViagem; // Usado para o título principal
        this.organizador = organizador;
        this.quantidadeDeParticipantes = quantidadeDeParticipantes;
        this.data = data; // Data de início
        this.destino = destino;
        this.descricao = descricao;
        this.custoPessoa = custoPessoa;
        this.veiculo = veiculo;
        this.dataTermino = dataTermino;
    }
}

module.exports = ExcursaoModel;