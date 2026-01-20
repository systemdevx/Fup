// --- intro.js ---
(() => {
    'use strict';

    const CONFIG = {
        redirectUrl: 'login.html',
        bgAttr: 'data-bg'
    };

    const body = document.body;

    function lazyLoadBackground() {
        const bg = document.querySelector('.bg-image');
        if (!bg) return;
        const src = bg.getAttribute(CONFIG.bgAttr);
        if (!src) {
            bg.style.background = '#dbe4ea';
            bg.classList.add('loaded');
            return;
        }
        const img = new Image();
        img.src = src;
        img.onload = () => {
            bg.style.backgroundImage = `url("${src}")`;
            bg.classList.add('loaded');
        };
    }

    let isRedirecting = false;
    function enterSystem() {
        if (isRedirecting) return;
        isRedirecting = true;
        
        // Ativa a animação de saída no CSS
        body.classList.add('fade-out');

        setTimeout(() => {
            window.location.href = CONFIG.redirectUrl;
        }, 600);
    }

    document.addEventListener('DOMContentLoaded', () => {
        lazyLoadBackground();
        
        // Qualquer clique ou tecla Enter avança
        document.addEventListener('click', enterSystem);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') enterSystem();
        });
    });
})();