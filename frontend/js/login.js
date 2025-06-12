document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validación básica
        if (!email || !password) {
            showError('Por favor, complete todos los campos');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al iniciar sesión');
            }

            const data = await response.json();
            
            // Guardar información del usuario
            localStorage.setItem('user', JSON.stringify(data));
            // Redirigir al dashboard
            window.location.href = '/principal.html';
        } catch (error) {
            showError(error.message);
            console.error('Error:', error);
        }
    });

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        loginForm.insertBefore(errorDiv, loginForm.firstChild);

        // Eliminar el mensaje de error después de 3 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
});