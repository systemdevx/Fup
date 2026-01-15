// --- intro.js ---
// Versão limpa e performática: temas sazonais, acessibilidade, partículas chunked, reduced-motion.
// Pode ser sobrescrito com data-test-month / data-test-day no <body> para testes.

(() => {
    'use strict';

    const CONFIG = {
        particleCount: 50,
        mobileParticleCount: 28,
        progressTransitionMs: 600,
        redirectUrl: 'login.html',
        newYearWindowDays: 7,
        chunkSize: 12
    };

    function prefersReducedMotion() {
        try {
            return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (e) {
            return false;
        }
    }

    function safeText(el, text) {
        if (el) el.textContent = text;
    }

    function isMobileUA() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const body = document.body;
        const mainButton = document.getElementById('entry-button') || document.querySelector('.main-container') || body;
        const msgEl = document.querySelector('.status-message');
        const progressEl = document.querySelector('.progress');
        const particlesContainer = document.getElementById('particles');

        // Data com possibilidade de override para testes
        const today = new Date();
        const testMonth = parseInt(body.getAttribute('data-test-month'), 10);
        const testDay = parseInt(body.getAttribute('data-test-day'), 10);
        const month = Number.isFinite(testMonth) ? testMonth : (today.getMonth() + 1);
        const day = Number.isFinite(testDay) ? testDay : today.getDate();
        const year = today.getFullYear();

        // Aplicar tema sazonal
        try {
            if (month === 12) {
                body.classList.add('theme-christmas');
                safeText(msgEl, 'Boas Festas • Carregando...');
                if (!prefersReducedMotion() && particlesContainer) {
                    scheduleParticlesCreation(particlesContainer, isMobileUA() ? CONFIG.mobileParticleCount : CONFIG.particleCount);
                }
            } else if (month === 1 && day <= CONFIG.newYearWindowDays) {
                body.classList.add('theme-gold');
                safeText(msgEl, `Feliz ${year} • Iniciando...`);
            } else {
                safeText(msgEl, 'Toque para acessar');
            }
        } catch (err) {
            console.warn('Erro ao aplicar tema:', err);
        }

        // Acessibilidade: role/tabindex/aria
        try {
            mainButton.setAttribute('role', 'button');
            if (!mainButton.hasAttribute('tabindex')) mainButton.setAttribute('tabindex', '0');
            if (!mainButton.hasAttribute('aria-label')) mainButton.setAttribute('aria-label', 'Abrir FUP ALM');
        } catch (e) {
            // ignore
        }

        let blinkInterval = null;
        let entered = false;

        function enterApp() {
            if (entered) return;
            entered = true;

            safeText(msgEl, 'Entrando...');

            if (progressEl) {
                try {
                    progressEl.style.animation = 'none';
                    progressEl.style.transition = `width ${CONFIG.progressTransitionMs}ms ease`;
                    // força reflow
                    // eslint-disable-next-line no-unused-expressions
                    progressEl.offsetWidth;
                    progressEl.style.width = '100%';
                    // atualizar aria
                    progressEl.setAttribute('aria-valuenow', '100');
                } catch (e) {}
            }

            if (blinkInterval !== null) {
                clearInterval(blinkInterval);
                blinkInterval = null;
            }

            body.classList.add('fade-out');

            setTimeout(() => {
                try {
                    window.location.replace(CONFIG.redirectUrl);
                } catch (e) {
                    window.location.href = CONFIG.redirectUrl;
                }
            }, CONFIG.progressTransitionMs);
        }

        // Interações
        mainButton.addEventListener('click', enterApp, { passive: true });
        mainButton.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                enterApp();
            }
        });

        // Pulsar sugestão se não interagir (respeita reduced motion)
        if (!prefersReducedMotion()) {
            setTimeout(() => {
                if (!msgEl) return;
                msgEl.style.opacity = '0.5';
                blinkInterval = setInterval(() => {
                    if (!msgEl) return;
                    msgEl.style.opacity = msgEl.style.opacity === '0.5' ? '1' : '0.5';
                }, 800);
            }, 2500);
        } else {
            if (progressEl) progressEl.style.width = '100%';
        }

        // Partículas: criação em chunks para evitar travar frames
        function scheduleParticlesCreation(container, totalCount) {
            if (!container || totalCount <= 0) return;
            let created = 0;
            const chunk = () => {
                const frag = document.createDocumentFragment();
                const particleColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-color') || 'rgba(255,255,255,0.9)';
                const toCreate = Math.min(CONFIG.chunkSize, totalCount - created);

                for (let i = 0; i < toCreate; i++) {
                    const p = document.createElement('div');
                    p.className = 'dot';

                    const sizePx = Math.round(Math.random() * 4 + 2);
                    p.style.width = `${sizePx}px`;
                    p.style.height = `${sizePx}px`;

                    p.style.left = `${Math.random() * 100}vw`;
                    p.style.top = `-10px`;

                    p.style.animationDuration = `${(Math.random() * 3 + 3).toFixed(2)}s`;
                    p.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;

                    p.style.background = particleColor.trim();
                    p.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2);

                    frag.appendChild(p);
                }

                container.appendChild(frag);
                created += toCreate;

                if (created < totalCount) {
                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(chunk, { timeout: 200 });
                    } else {
                        setTimeout(chunk, 40);
                    }
                }
            };

            if ('requestIdleCallback' in window) {
                requestIdleCallback(chunk, { timeout: 200 });
            } else {
                setTimeout(chunk, 40);
            }
        }
    });
})();