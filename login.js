// --- login.js (Conectado ao Supabase) ---
(() => {
  'use strict';

  // 1. Configuração do Supabase (Suas credenciais)
  const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

  // Verifica carregamento da lib
  if (typeof supabase === 'undefined') {
    console.error('ERRO: Supabase SDK não encontrado. Verifique se o script foi incluído no HTML.');
  }

  // Inicializa Cliente
  const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const $ = (sel) => document.querySelector(sel);

  // --- Funções de UI ---

  function lazyLoadBackground() {
    const bg = $('.bg-image');
    if (!bg) return;
    const src = bg.getAttribute('data-bg');
    if (!src) return;
    
    const img = new Image();
    img.src = src;
    img.onload = () => {
      bg.style.backgroundImage = `url("${src}")`;
      bg.classList.add('loaded');
    };
  }

  function setupPasswordToggle() {
    const btn = $('#togglePassword');
    const input = $('#password');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      // Muda a cor para indicar ativo/inativo
      btn.style.color = type === 'text' ? 'var(--accent)' : '';
    });
  }

  function setLoading(isLoading) {
    const btn = $('#btnLogin');
    if (!btn) return;
    
    if (isLoading) {
      btn.classList.add('loading');
      btn.setAttribute('disabled', 'true');
    } else {
      btn.classList.remove('loading');
      btn.removeAttribute('disabled');
    }
  }

  // --- Lógica de Auth ---

  function setupForm() {
    const form = $('#loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Limpa estados anteriores
      $('#username-error').textContent = '';
      $('#password-error').textContent = '';
      const statusEl = $('#status');
      statusEl.textContent = '';
      statusEl.style.color = 'var(--text-muted)';

      const email = $('#username').value.trim();
      const password = $('#password').value;

      // Validação local
      if (!email) {
        $('#username-error').textContent = 'O e-mail é obrigatório.';
        $('#username').focus();
        return;
      }
      if (!password) {
        $('#password-error').textContent = 'A senha é obrigatória.';
        $('#password').focus();
        return;
      }

      setLoading(true);

      try {
        // --- Chamada Real ao Supabase ---
        const { data, error } = await _supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;

        // Sucesso
        statusEl.textContent = 'Login realizado com sucesso!';
        statusEl.style.color = 'var(--accent)';
        
        // Redirecionamento
        setTimeout(() => {
          // Ajuste aqui para a rota do seu painel
          window.location.href = '/dashboard.html'; 
        }, 1000);

      } catch (err) {
        console.error('Login Error:', err);
        let msg = 'Falha ao autenticar.';

        // Tratamento de mensagens comuns
        if (err.message.includes('Invalid login')) {
          msg = 'E-mail ou senha incorretos.';
        } else if (err.message.includes('Email not confirmed')) {
          msg = 'Confirme seu e-mail antes de entrar.';
        }

        statusEl.textContent = msg;
        statusEl.style.color = 'var(--danger)';

        // Efeito Shake no erro
        const card = $('.glass-card');
        card.style.animation = 'none';
        void card.offsetWidth; // trigger reflow
        card.style.animation = 'shake 0.4s ease';
      } finally {
        setLoading(false);
      }
    });
  }

  // Inicialização
  function init() {
    lazyLoadBackground();
    setupPasswordToggle();
    setupForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();