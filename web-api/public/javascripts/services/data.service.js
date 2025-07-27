const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../public/javascripts/data/data.json');

class DataService {
    static readData() {
        try {
            const rawData = fs.readFileSync(dbPath);
            return JSON.parse(rawData);
        } catch (error) {
            console.error("Erro ao ler o arquivo de dados:", error);
            // Retorna uma estrutura vazia se o arquivo não existir ou for inválido
            return { excursoes: [] };
        }
    }

    static writeData(data) {
        try {
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Erro ao escrever no arquivo de dados:", error);
        }
    }
}

module.exports = DataService;