const fs = require('fs');
const path = require('path');

const usersDbPath = path.resolve(__dirname, '../data/users.json');

const readUsers = () => JSON.parse(fs.readFileSync(usersDbPath));
const writeUsers = (data) => fs.writeFileSync(usersDbPath, JSON.stringify(data, null, 2));

class UserService {
    static register(nome, email, senha) {
        const data = readUsers();
        const userExists = data.users.find(u => u.email === email);

        if (userExists) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        // IMPORTANTE: Em um projeto real, a senha NUNCA deve ser salva em texto plano.
        // Você deve usar uma biblioteca como 'bcrypt' para gerar um "hash" seguro da senha.
        const newUser = {
            id: data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1,
            nome,
            email,
            senha // Lembre-se, isso não é seguro para produção!
        };

        data.users.push(newUser);
        writeUsers(data);
        return newUser;
    }

    static login(email, senha) {
        const data = readUsers();
        const user = data.users.find(u => u.email === email && u.senha === senha);

        if (!user) {
            throw new Error("E-mail ou senha inválidos.");
        }

        // Não retorne a senha para o frontend
        const { senha: _, ...userFound } = user;
        return userFound;
    }

    static updateUser(userId, dados) {
        const data = readUsers();
        const userIndex = data.users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error("Usuário não encontrado.");
        }

        // Atualiza os dados permitidos
        data.users[userIndex].nome = dados.nome || data.users[userIndex].nome;
        data.users[userIndex].email = dados.email || data.users[userIndex].email;

        writeUsers(data);
        const { senha: _, ...userUpdated } = data.users[userIndex];
        return userUpdated;
    }
}

module.exports = UserService;