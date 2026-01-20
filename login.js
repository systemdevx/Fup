// --- CONFIGURAÇÃO DO SUPABASE ---
// Seus dados reais já inseridos abaixo:
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

// Inicializa o cliente com nome 'supabaseClient' para não conflitar com a biblioteca global
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

            // Feedback visual no botão
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = 'Acessando...';
            btn.style.opacity = '0.8';

            // Tenta logar no Supabase usando 'supabaseClient'
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                alert('Erro ao entrar: ' + error.message); // Ex: "Invalid login credentials"
                btn.disabled = false;
                btn.innerText = originalText;
                btn.style.opacity = '1';
            } else {
                console.log('Login realizado:', data);
                // SUCESSO: Redireciona para o painel
                // Certifique-se de que o arquivo 'dashboard.html' existe na pasta
                window.location.href = "dashboard.html"; 
            }
        });
    }

    // 3. Função "Esqueci minha senha"
    if (forgotLink) {
        forgotLink.addEventListener('click', async (e) => {
            e.preventDefault();

            let email = userInput.value;
            if (!email) {
                email = prompt("Digite seu e-mail para recuperar a senha:");
            } else {
                if(!confirm(`Enviar link de recuperação para: ${email}?`)) return;
            }

            if (email) {
                const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.href, 
                });

                if (error) {
                    alert('Erro ao enviar: ' + error.message);
                } else {
                    alert('Verifique sua caixa de entrada! Enviamos um link para: ' + email);
                }
            }
        });
    }

    // --- ANIMAÇÃO DOS FIOS ---
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