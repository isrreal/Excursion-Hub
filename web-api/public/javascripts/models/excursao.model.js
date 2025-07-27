class ExcursaoModel {
    constructor(id, localDeViagem, organizador, data, destino, descricao, custoPessoa, veiculo, dataTermino) {
        this.id = id;
        this.localDeViagem = localDeViagem; // Usado para o título principal
        this.organizador = organizador;
        this.data = data; // Data de início
        this.destino = destino;
        this.descricao = descricao;
        this.custoPessoa = custoPessoa;
        this.veiculo = veiculo;
        this.dataTermino = dataTermino;
        
        // --- ALTERAÇÕES AQUI ---
        this.participantes = []; // Inicializa com uma lista vazia
        this.quantidadeDeParticipantes = 0; // Inicializa com zero
    }
}

module.exports = ExcursaoModel;