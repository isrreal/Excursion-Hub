document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            alert('Registro realizado com sucesso! Faça o login.');
            window.location.href = '/login.html';
        } catch (error) {
            alert('Erro no registro: ' + error.message);
        }
    });
});