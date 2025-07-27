document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            // Redireciona para a página principal após o login
            window.location.href = '/';
        } catch (error) {
            alert('Erro no login: ' + error.message);
        }
    });
});