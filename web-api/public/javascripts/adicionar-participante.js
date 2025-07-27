document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const form = document.querySelector('form');
    const nomeParticipante = document.getElementById('nomeParticipante');
    const telefone = document.getElementById('telefone');
    const endereco = document.getElementById('endereco');

    // --- FUNÇÕES INTERNAS ---

    function setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        clearFieldError(field);
        
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        } else if (field.id === 'nomeParticipante' && value.length > 0 && value.length < 3) {
            isValid = false;
            errorMessage = 'Nome deve ter pelo menos 3 caracteres';
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        return isValid;
    }

    function showFieldError(field, message) {
        field.style.borderColor = '#e74c3c';
        field.style.backgroundColor = '#fdf2f2';
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '5px';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearFieldError(field) {
        field.style.borderColor = '#e0e0e0';
        field.style.backgroundColor = '#f8f9fa';
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function validateAllFields() {
        let isFormValid = true;
        const allInputs = form.querySelectorAll('input, textarea');
        allInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    function showSuccessMessage() {
        let successMessage = document.querySelector('.success-message');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.style.cssText = `
                background-color: #d4edda; color: #155724; padding: 12px 16px;
                border: 1px solid #c3e6cb; border-radius: 6px; margin-bottom: 20px;
                text-align: center; font-weight: 500;
            `;
            form.parentNode.insertBefore(successMessage, form);
        }
        successMessage.textContent = 'Participante adicionado com sucesso! Redirecionando...';
        successMessage.style.display = 'block';
    }

    function hideSuccessMessage() {
        const successMessage = document.querySelector('.success-message');
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        // Marca campos como obrigatórios para a validação
        nomeParticipante.required = true;
        telefone.required = true;
        endereco.required = true;
        
        const isFormValid = validateAllFields();

        if (isFormValid) {
            const dadosParticipante = {
                nomeParticipante: nomeParticipante.value,
                telefone: telefone.value,
                endereco: endereco.value,
            };

            try {
                const response = await fetch('/api/excursoes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosParticipante),
                });

                if (!response.ok) {
                    throw new Error('Erro na resposta do servidor');
                }

                const data = await response.json();
                console.log('Participante adicionado com sucesso:', data);
                showSuccessMessage();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);

            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                // Aqui você pode adicionar uma mensagem de erro para o usuário
            }
        } else {
             const firstError = document.querySelector('.error-message');
             if (firstError) {
                firstError.parentNode.querySelector('input, textarea').focus();
            }
        }
    }

    // --- INICIALIZAÇÃO ---
    
    setupRealTimeValidation();
    form.addEventListener('submit', handleFormSubmit);
});
