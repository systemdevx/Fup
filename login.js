// --- CONFIGURAÇÃO DO SUPABASE ---
// URL do seu projeto (confirmado pelo seu print)
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';

// ⚠️ COLE SUA CHAVE 'ANON PUBLIC' AQUI DENTRO DAS ASPAS ⚠️
const SUPABASE_KEY = 'SUA_CHAVE_GIGANTE_QUE_COMECA_COM_ey_AQUI'; 

// Inicializa a conexão
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

(() => {
    'use strict';

    const toggleBtn = document.getElementById('togglePass');
    const passInput = document.getElementById('pass');
    const userInput = document.getElementById('user'); 
    const form = document.getElementById('loginForm');
    const btn = document.getElementById('btnSubmit');
    const forgotLink = document.querySelector('.forgot-link');

    // 1. Alternar visualização da senha
    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', () => {
            const isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            toggleBtn.style.color = isPass ? '#2563EB' : '';
        });
    }

    // 2. Função de Login
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = userInput.value;
            const password = passInput.value;

            // Feedback visual (Carregando...)
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = 'Acessando...';
            btn.style.opacity = '0.8';

            // Tenta logar no Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                alert('Erro ao entrar: ' + error.message);
                btn.disabled = false;
                btn.innerText = originalText;
                btn.style.opacity = '1';
            } else {
                console.log('Login realizado:', data);
                // SUCESSO: Redireciona para o painel principal
                window.location.href = "dashboard.html"; 
            }
        });
    }

    // 3. Função "Esqueci minha senha"
    if (forgotLink) {
        forgotLink.addEventListener('click', async (e) => {
            e.preventDefault();

            let email = userInput.value;
            // Se o campo de email estiver vazio, pede pro usuário digitar
            if (!email) {
                email = prompt("Digite seu e-mail para recuperar a senha:");
            } else {
                if(!confirm(`Enviar link de recuperação para: ${email}?`)) return;
            }

            if (email) {
                // Envia o e-mail de recuperação
                const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                    // Para onde o usuário volta depois de clicar no email?
                    // Por enquanto, mandamos ele para o login para ele definir a senha depois
                    redirectTo: window.location.origin + '/login.html', 
                });

                if (error) {
                    alert('Erro ao enviar: ' + error.message);
                } else {
                    alert('Verifique sua caixa de entrada (e spam)! Enviamos um link para: ' + email);
                }
            }
        });
    }

    // --- ANIMAÇÃO DOS FIOS (Mantida Original) ---
    const canvas = document.getElementById('organic-wires');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, lines = [];
    const config = { lineCount: 15, color: 'rgba(255, 255, 255, 0.3)', speedBase: 0.002 };

    class Wire {
        constructor() { this.init(); }
        init() {
            this.y = Math.random() * height;
            this.amplitude = Math.random() * 50 + 20; 
            this.frequency = Math.random() * 0.01 + 0.002;
            this.phase = Math.random() * Math.PI * 2;
            this.speed = config.speedBase + Math.random() * 0.002;
            this.lineWidth = Math.random() * 1.5 + 0.5; 
        }
        update() { this.phase += this.speed; }
        draw(ctx) {
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = config.color;
            for (let x = 0; x <= width; x += 5) {
                const y = this.y + 
                          Math.sin(x * this.frequency + this.phase) * this.amplitude +
                          Math.sin(x * this.frequency * 0.5 + this.phase * 0.5) * (this.amplitude * 0.5);
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        lines = [];
        for (let i = 0; i < config.lineCount; i++) lines.push(new Wire());
    }
    function animate() {
        ctx.clearRect(0, 0, width, height);
        lines.forEach(line => { line.update(); line.draw(ctx); });
        requestAnimationFrame(animate);
    }
    window.addEventListener('resize', resize);
    resize();
    animate();
})();