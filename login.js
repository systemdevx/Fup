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
            // Usando Phosphor Icons (classes mudam um pouco dependendo da versão, 
            // mas mantendo a lógica do seu original ou do novo HTML)
            if(isPass) {
                icon.classList.remove('ph-eye-slash');
                icon.classList.add('ph-eye');
            } else {
                icon.classList.remove('ph-eye');
                icon.classList.add('ph-eye-slash');
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
                    
                    input.addEventListener('input', () => {
                        input.classList.remove('error');
                    }, { once: true });
                }
            });

            if (!isValid) return;

            // Feedback visual no botão com Spinner opcional ou texto
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Entrando...';
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;

            // Simulação de delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
                
                // Caso queira restaurar se o redirect falhar
                // submitBtn.innerHTML = originalContent;
                // submitBtn.disabled = false;
            }, 1500);
        });
    }
})();