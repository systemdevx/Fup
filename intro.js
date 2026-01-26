(() => {
    'use strict';

    const CONFIG = {
        redirectUrl: 'login.html',
        bgAttr: 'data-bg',
        autoRedirectDelay: 2000 // Ficou mais rápido: 2 segundos
    };

    const body = document.body;
    let isRedirecting = false;

    function lazyLoadBackground() {
        const bg = document.querySelector('.bg-image');
        if (!bg) return;
        const src = bg.getAttribute(CONFIG.bgAttr);
        if (src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                bg.style.backgroundImage = `url("${src}")`;
                bg.classList.add('loaded');
            };
        } else {
            bg.classList.add('loaded');
        }
    }

    function enterSystem() {
        if (isRedirecting) return;
        isRedirecting = true;
        
        // Ativa apenas o desvanecimento (fade), sem crescer o ícone
        body.classList.add('fade-out');

        setTimeout(() => {
            window.location.href = CONFIG.redirectUrl;
        }, 300); // Transição rápida de 0.3s
    }

    document.addEventListener('DOMContentLoaded', () => {
        lazyLoadBackground();
        
        const autoTimer = setTimeout(enterSystem, CONFIG.autoRedirectDelay);

        const skip = () => {
            clearTimeout(autoTimer);
            enterSystem();
        };

        document.addEventListener('click', skip);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') skip();
        });
    });
})();