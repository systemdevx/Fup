<<<<<<< HEAD
// --- login.js ---
// Focado em performance e consistência visual com Intro.
// Sem mensagens de confirmação, sem toasts.
=======
// --- CONFIGURAÇÃO DO SUPABASE ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
>>>>>>> 79ed9248bdc063eb4bddfd21eb29b4c911644444

(() => {
    'use strict';

<<<<<<< HEAD
  const CONFIG = {
    bgSelector: '.bg-image',
    bgAttr: 'data-bg',
    minPasswordLength: 6,
    // Delay mínimo apenas para o spinner não piscar muito rápido, 
    // mas removida a espera da mensagem de "sucesso".
    networkDelay: 500 
  };

  const $ = (sel) => document.querySelector(sel);

  // Lazy load do background (mantido para performance)
  function lazyLoadBackground() {
    const bg = $(CONFIG.bgSelector);
    if (!bg) return;
    const src = bg.getAttribute(CONFIG.bgAttr);
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      bg.style.backgroundImage = `url("${src}")`;
      bg.style.opacity = '1'; 
    };
  }

  // Toggle de Senha
  function setupPasswordToggle() {
    const toggle = $('#togglePassword');
    const password = $('#password');
    if (!toggle || !password) return;

    toggle.addEventListener('click', () => {
      const isMasked = password.type === 'password';
      password.type = isMasked ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(isMasked));
      
      // Ícone simples ou troca de path se desejar, mas o foco é funcionalidade
      toggle.style.color = isMasked ? 'var(--primary)' : '#999';
    });
  }

  // Validação silenciosa (apenas impede envio e mostra erro no campo específico)
  function validateForm(username, password) {
    const errors = {};
    if (!username || username.trim().length === 0) {
      errors.username = 'Preencha o usuário.';
    }
    if (!password || password.length < CONFIG.minPasswordLength) {
      errors.password = 'Senha curta.';
    }
    return errors;
  }

  function setLoading(isLoading) {
    const btn = $('#btnLogin');
    if (!btn) return;
    
    if (isLoading) {
      btn.classList.add('loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  }

  // Simulação de Request
  function fakeSubmit(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Lógica simples de bloqueio apenas para exemplo de erro
        if (formData.get('username') === 'bloqueado') {
          resolve({ ok: false, field: 'username', msg: 'Usuário bloqueado.' });
        } else {
          resolve({ ok: true });
        }
      }, CONFIG.networkDelay);
    });
  }

  function setupForm() {
    const form = $('#loginForm');
    if (!form) return;

    const userIn = $('#username');
    const passIn = $('#password');
    const userErr = $('#username-error');
    const passErr = $('#password-error');

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      
      // Limpa erros anteriores
      if (userErr) userErr.textContent = '';
      if (passErr) passErr.textContent = '';

      const username = userIn.value;
      const password = passIn.value;

      // Validação local
      const errors = validateForm(username, password);
      if (errors.username) {
        if (userErr) userErr.textContent = errors.username;
        userIn.focus();
        return;
      }
      if (errors.password) {
        if (passErr) passErr.textContent = errors.password;
        passIn.focus();
        return;
      }

      setLoading(true);

      try {
        const formData = new FormData(form);
        const res = await fakeSubmit(formData);

        if (res.ok) {
          // SUCESSO: Redirecionamento IMEDIATO e SILENCIOSO.
          // Sem mensagens de "Autenticado".
          window.location.href = '/app'; 
        } else {
          // ERRO: Mostra erro discreto no campo correspondente, se possível
          setLoading(false);
          if (res.field === 'username' && userErr) {
            userErr.textContent = res.msg;
            userIn.focus();
          } else if (passErr) {
            passErr.textContent = res.msg || 'Erro ao entrar.';
          }
        }
      } catch (err) {
        setLoading(false);
        console.error(err); // Log apenas no console
      }
    });
  }

  function init() {
    lazyLoadBackground();
    setupPasswordToggle();
    setupForm();
    
    // Auto-focus sutil
    const u = $('#username');
    if (u) u.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
=======
    // Elementos DOM
    const toggleBtn = document.getElementById('togglePass');
    const passInput = document.getElementById('pass');
    const userInput = document.getElementById('user'); 
    const form = document.getElementById('loginForm');
    const btn = document.getElementById('btnSubmit');
    
    // Modal & Toast Elementos
    const forgotLink = document.getElementById('openForgotModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelResetBtn = document.getElementById('cancelReset');
    const resetForm = document.getElementById('resetForm');
    const resetEmailInput = document.getElementById('resetEmail');
    const btnReset = document.getElementById('btnReset');

    // 1. Função de Notificação (Toast)
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

        // Remove após 4 segundos (tempo para leitura)
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // 2. Lógica do Modal
    function openModal() {
        if (userInput.value) resetEmailInput.value = userInput.value;
        modalOverlay.classList.remove('hidden');
        setTimeout(() => resetEmailInput.focus(), 100); 
    }
    function closeModal() {
        modalOverlay.classList.add('hidden');
    }

    if(forgotLink) forgotLink.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(cancelResetBtn) cancelResetBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if(e.target === modalOverlay) closeModal(); });

    // 3. Toggle Senha
    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', () => {
            const isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            // Alterna ícone
            const iconSpan = toggleBtn.querySelector('span');
            if(iconSpan) iconSpan.innerText = isPass ? 'visibility_off' : 'visibility';
        });
    }

    // 4. Login Principal
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = userInput.value;
            const password = passInput.value;

            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span>Autenticando...</span>';
            btn.style.opacity = '0.8';

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                showToast('Falha no login: Verifique e-mail e senha.', 'error');
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
            } else {
                showToast('Login autorizado! Redirecionando...', 'success');
                setTimeout(() => {
                    window.location.href = "dashboard.html"; 
                }, 1000);
            }
        });
    }

    // 5. Reset de Senha
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
                btnReset.innerText = originalText;
                btnReset.disabled = false;
            } else {
                showToast(`Link enviado para: ${email}`, 'success');
                setTimeout(() => {
                    closeModal();
                    btnReset.innerText = originalText;
                    btnReset.disabled = false;
                }, 2000); 
            }
        });
    }

    // --- ANIMAÇÃO DE FUNDO (Visual Polish) ---
    const canvas = document.getElementById('organic-wires');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, lines = [];
    const config = { lineCount: 12, color: 'rgba(255, 255, 255, 0.15)', speedBase: 0.002 };

    class Wire {
        constructor() { this.init(); }
        init() {
            this.y = Math.random() * height;
            this.amplitude = Math.random() * 50 + 20; 
            this.frequency = Math.random() * 0.01 + 0.002;
            this.phase = Math.random() * Math.PI * 2;
            this.speed = config.speedBase + Math.random() * 0.002;
            this.lineWidth = Math.random() * 2 + 0.5; 
        }
        update() { this.phase += this.speed; }
        draw(ctx) {
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = config.color;
            for (let x = 0; x <= width; x += 5) {
                const y = this.y + 
                          Math.sin(x * this.frequency + this.phase) * this.amplitude;
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
>>>>>>> 79ed9248bdc063eb4bddfd21eb29b4c911644444
})();