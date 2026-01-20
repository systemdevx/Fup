// --- login.js ---
// Focado em performance e consistência visual com Intro.
// Sem mensagens de confirmação, sem toasts.

(() => {
  'use strict';

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
})();