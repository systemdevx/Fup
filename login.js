(() => {
    'use strict';

    // --- LÓGICA DO LOGIN ---
    const toggleBtn = document.getElementById('togglePass');
    const passInput = document.getElementById('pass');
    const form = document.getElementById('loginForm');
    const btn = document.getElementById('btnSubmit');

    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', () => {
            const isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            toggleBtn.style.color = isPass ? '#2563EB' : '';
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = 'Acessando...';
            btn.style.opacity = '0.8';
            setTimeout(() => {
                alert("Login realizado com sucesso.");
                btn.disabled = false;
                btn.innerText = originalText;
                btn.style.opacity = '1';
            }, 1200);
        });
    }

    // --- ANIMAÇÃO DE FIOS ORGÂNICOS (CANVAS) ---
    const canvas = document.getElementById('organic-wires');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let lines = [];
    
    // Configurações dos Fios
    const config = {
        lineCount: 15,        // Quantidade de fios
        color: 'rgba(255, 255, 255, 0.3)', // Cor branca translúcida
        speedBase: 0.002,     // Velocidade do movimento
    };

    // Objeto Linha (Fio)
    class Wire {
        constructor() {
            this.init();
        }

        init() {
            // Posição inicial aleatória
            this.y = Math.random() * height;
            // Amplitude da onda (o quão curva ela é)
            this.amplitude = Math.random() * 50 + 20; 
            // Comprimento da onda
            this.frequency = Math.random() * 0.01 + 0.002;
            // Fase (posição atual na animação)
            this.phase = Math.random() * Math.PI * 2;
            // Velocidade individual
            this.speed = config.speedBase + Math.random() * 0.002;
            // Espessura fina (fio de cabelo)
            this.lineWidth = Math.random() * 1.5 + 0.5; 
        }

        update() {
            this.phase += this.speed;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = config.color;

            // Desenha uma curva senoide suave através da tela
            for (let x = 0; x <= width; x += 5) {
                // Fórmula da onda: y base + (seno(x * frequencia + fase) * amplitude)
                // Adicionamos um segundo seno para tornar o movimento mais "caótico/orgânico"
                const y = this.y + 
                          Math.sin(x * this.frequency + this.phase) * this.amplitude +
                          Math.sin(x * this.frequency * 0.5 + this.phase * 0.5) * (this.amplitude * 0.5);
                
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        // Recria as linhas ao redimensionar para manter distribuição
        lines = [];
        for (let i = 0; i < config.lineCount; i++) {
            lines.push(new Wire());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        lines.forEach(line => {
            line.update();
            line.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    // Inicialização
    window.addEventListener('resize', resize);
    resize();
    animate();

})();