// --- login.js ---
(() => {
    'use strict';

    const bgLayer = document.querySelector('.bg-layer');
    
    // 1. Carregar Imagem
    function initBackground() {
        if(!bgLayer) return;
        const src = bgLayer.getAttribute('data-bg');
        if (!src) return;
        
        const img = new Image();
        img.src = src;
        img.onload = () => {
            bgLayer.style.backgroundImage = `url('${src}')`;
            bgLayer.classList.add('loaded');
        };
    }

    // 2. Toggle Senha
    function initPasswordToggle() {
        const btn = document.getElementById('togglePassword');
        const input = document.getElementById('password');
        
        if(btn && input) {
            btn.addEventListener('click', () => {
                const isPass = input.type === 'password';
                input.type = isPass ? 'text' : 'password';
                btn.style.opacity = isPass ? '1' : '0.5'; // Feedback visual no botão
            });
        }
    }

    // 3. Submit
    function initForm() {
        const form = document.getElementById('loginForm');
        
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const btn = document.getElementById('submitBtn');
                const user = document.getElementById('username');
                const pass = document.getElementById('password');
                let valid = true;

                // Validação Visual (Borda vermelha)
                if(!user.value.trim()) {
                    user.style.boxShadow = '0 0 0 2px #EF4444';
                    valid = false;
                } else {
                    user.style.boxShadow = '';
                }

                if(!pass.value.trim()) {
                    pass.style.boxShadow = '0 0 0 2px #EF4444';
                    valid = false;
                } else {
                    pass.style.boxShadow = '';
                }

                if(!valid) return;

                // Sucesso
                btn.classList.add('loading');
                btn.disabled = true;

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1200);
            });
            
            // Limpar erro ao digitar
            ['username', 'password'].forEach(id => {
                document.getElementById(id).addEventListener('input', function() {
                    this.style.boxShadow = '';
                });
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        initBackground();
        initPasswordToggle();
        initForm();
    });

})();