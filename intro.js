// --- intro.js ---
(() => {
    'use strict';

    const CONFIG = {
        redirectUrl: 'login.html',
    };

    const body = document.body;
    const title = document.querySelector('.hero-title');

    // --- 1. Temas Sazonais ---
    function checkSeason() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        if (month === 12) body.classList.add('theme-christmas');
        else if (month === 1 && day <= 7) body.classList.add('theme-gold');
    }

    // --- 2. Reflexo Interativo (Luxo) ---
    function handleMouseMove(e) {
        if (!title) return;

        // Calcula porcentagem da tela (0 a 100)
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        // Ajustamos a posição do background gradiente sutilmente com o mouse
        // Isso faz o brilho "correr" pelo texto
        // Somamos com a animação CSS padrão
        title.style.backgroundPosition = `${x}% ${y}%`;
    }

    // --- 3. Sistema de Entrada ---
    let isRedirecting = false;

    function enterSystem() {
        if (isRedirecting) return;
        isRedirecting = true;

        body.classList.add('fade-out');

        setTimeout(() => {
            window.location.href = CONFIG.redirectUrl;
        }, 700);
    }

    // --- Inicialização ---
    document.addEventListener('DOMContentLoaded', () => {
        checkSeason();

        // Apenas desktop para o efeito de mouse
        if (window.matchMedia("(min-width: 768px)").matches) {
            document.addEventListener('mousemove', handleMouseMove);
        }

        document.addEventListener('click', enterSystem);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') enterSystem();
        });
    });

})();