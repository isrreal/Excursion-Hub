document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('profile-form');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');

    // Carrega os dados do usuário atual e preenche o formulário
    try {
        const response = await fetch('/api/users/me');
        if (!response.ok) throw new Error('Usuário não logado.');
        const user = await response.json();
        nomeInput.value = user.nome;
        emailInput.value = user.email;
    } catch (error) {
        window.location.href = '/login.html';
    }

    // Lida com o envio do formulário para atualizar os dados
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = nomeInput.value;
        const email = emailInput.value;

        try {
            const response = await fetch('/api/users/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email })
            });
            if (!response.ok) {
                 const error = await response.json();
                throw new Error(error.message);
            }
            alert('Perfil atualizado com sucesso!');
            window.location.href = '/';
        } catch (error) {
            alert('Erro ao atualizar perfil: ' + error.message);
        }
    });
});