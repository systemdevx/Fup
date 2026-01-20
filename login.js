// --- CONFIGURAÇÃO DO SUPABASE ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

(() => {
    'use strict';

    // Elementos Login
    const toggleBtn = document.getElementById('togglePass');
    const passInput = document.getElementById('pass');
    const userInput = document.getElementById('user'); 
    const form = document.getElementById('loginForm');
    const btn = document.getElementById('btnSubmit');
    
    // Elementos Modal e Toast
    const forgotLink = document.getElementById('openForgotModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelResetBtn = document.getElementById('cancelReset');
    const resetForm = document.getElementById('resetForm');
    const resetEmailInput = document.getElementById('resetEmail');
    const btnReset = document.getElementById('btnReset');

    // 1. Mostrar Notificação (Toast)
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check_circle' : 'error_outline';
        
        toast.innerHTML = `
            <span class="material-icons-outlined">${icon}</span>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);

        // Remove após 4 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // 2. Lógica do Modal
    function openModal() {
        // Se o usuário já digitou e-mail no login, copia para o modal
        if (userInput.value) resetEmailInput.value = userInput.value;
        modalOverlay.classList.remove('hidden');
        resetEmailInput.focus();
    }
    function closeModal() {
        modalOverlay.classList.add('hidden');
    }

    if(forgotLink) forgotLink.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(cancelResetBtn) cancelResetBtn.addEventListener('click', closeModal);

    // Fecha modal clicando fora
    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) closeModal();
    });

    // 3. Alternar visualização da senha
    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', () => {
            const isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            toggleBtn.style.color = isPass ? '#2563EB' : '';
        });
    }

    // 4. Função de Login
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = userInput.value;
            const password = passInput.value;

            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = 'Acessando...';
            btn.style.opacity = '0.8';

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                showToast('Erro ao entrar: Credenciais inválidas', 'error');
                btn.disabled = false;
                btn.innerText = originalText;
                btn.style.opacity = '1';
            } else {
                showToast('Login realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = "dashboard.html"; 
                }, 1000);
            }
        });
    }

    // 5. Função Recuperar Senha (No Modal)
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = resetEmailInput.value;
            
            const originalText = btnReset.innerText;
            btnReset.innerText = 'Enviando...';
            btnReset.disabled = true;

            const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.href, 
            });

            if (error) {
                showToast('Erro: ' + error.message, 'error');
            } else {
                showToast(`Link enviado para: ${email}`, 'success');
                setTimeout(closeModal, 2000); // Fecha o modal após sucesso
            }

            btnReset.innerText = originalText;
            btnReset.disabled = false;
        });
    }

    // --- ANIMAÇÃO DOS FIOS (Mantida) ---
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