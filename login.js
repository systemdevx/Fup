// --- login.js ---
(() => {
    'use strict';

    const loginForm = document.getElementById('loginForm');
    const toggleBtn = document.getElementById('togglePass');
    const passInput = document.getElementById('pass');
    const submitBtn = document.getElementById('btnSubmit');

    // Toggle de Senha
    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', () => {
            const isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            
            const icon = toggleBtn.querySelector('i');
            if(isPass) {
                icon.classList.replace('ph-eye-slash', 'ph-eye');
            } else {
                icon.classList.replace('ph-eye', 'ph-eye-slash');
            }
        });
    }

    // Processar Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const user = document.getElementById('user');
            let isValid = true;

            // Validação visual simples
            [user, passInput].forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Remove o erro assim que digitar algo
                    input.addEventListener('input', () => {
                        input.classList.remove('error');
                    }, { once: true });
                }
            });

            if (!isValid) return;

            // Feedback visual no botão
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Entrando...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            // Redirecionamento simulado
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }
})();