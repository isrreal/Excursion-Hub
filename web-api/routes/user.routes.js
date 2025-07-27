const express = require('express');
const router = express.Router();
const UserService = require('../public/javascripts/services/user.service');

// Rota de Registro
router.post('/register', (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const newUser = UserService.register(nome, email, senha);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rota de Login
router.post('/login', (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = UserService.login(email, senha);
        req.session.user = user; // A MÁGICA ACONTECE AQUI: Salva o usuário na sessão
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

// Rota de Logout
router.post('/logout', (req, res) => {
    req.session.destroy(); // Destrói a sessão
    res.json({ message: 'Logout realizado com sucesso.' });
});

// Rota para pegar os dados do usuário logado
router.get('/me', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Não autorizado.' });
    }
    res.json(req.session.user);
});

// Rota para atualizar o perfil
router.put('/me', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Não autorizado.' });
    }
    try {
        const updatedUser = UserService.updateUser(req.session.user.id, req.body);
        req.session.user = updatedUser; // Atualiza a sessão com os novos dados
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;