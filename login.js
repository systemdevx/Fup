// --- login.js ---
// Lógica simplificada: sem mensagens de sucesso, redirecionamento direto.

(() => {
  'use strict';

  const CONFIG = {
    bgSelector: '.bg-image',
    bgAttr: 'data-bg',
    minPassLen: 6,
    // Delay simulado apenas para UX do botão não piscar instantaneamente
    mockDelay: 600 
  };

  const $ = (sel) => document.querySelector(sel);

  // Carregamento imagem fundo
  function initBackground() {
    const bg = $(CONFIG.bgSelector);
    if (!bg) return;
    const src = bg.getAttribute(CONFIG.bgAttr);
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      bg.style.backgroundImage = `url("${src}")`;
      bg.style.opacity = '0.6'; // Leve transparência para destacar o card
    };
  }

  // Alternar visualização senha
  function initPasswordToggle() {
    const btn = $('#togglePassword');
    const input = $('#password');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.setAttribute('aria-pressed', !isPass);
      btn.style.color = isPass ? 'var(--primary)' : '';
    });
  }

  // Validação básica
  function validate(user, pass) {
    const errs = {};
    if (!user.trim()) errs.user = 'Informe o usuário.';
    if (!pass || pass.length < CONFIG.minPassLen) errs.pass = 'Senha inválida.';
    return errs;
  }

  // Controle botão loading
  function toggleLoading(isLoading) {
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
  function mockLoginRequest(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Exemplo de erro para teste: usuário "erro"
        if (data.get('username') === 'erro') {
          resolve({ ok: false, field: 'user', msg: 'Usuário não encontrado.' });
        } else {
          resolve({ ok: true });
        }
      }, CONFIG.mockDelay);
    });
  }

  function initForm() {
    const form = $('#loginForm');
    if (!form) return;

    const userIn = $('#username');
    const passIn = $('#password');
    const userErr = $('#username-error');
    const passErr = $('#password-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Limpa erros visuais
      if (userErr) userErr.textContent = '';
      if (passErr) passErr.textContent = '';

      const userVal = userIn.value;
      const passVal = passIn.value;

      // Validação local
      const errors = validate(userVal, passVal);
      if (errors.user) {
        if (userErr) userErr.textContent = errors.user;
        userIn.focus();
        return;
      }
      if (errors.pass) {
        if (passErr) passErr.textContent = errors.pass;
        passIn.focus();
        return;
      }

      // Inicia processo
      toggleLoading(true);

      try {
        const formData = new FormData(form);
        const res = await mockLoginRequest(formData);

        if (res.ok) {
          // SUCESSO: Redireciona IMEDIATAMENTE. Sem mensagens.
          window.location.href = '/app'; 
        } else {
          // ERRO: Libera botão e mostra erro discreto
          toggleLoading(false);
          if (res.field === 'user' && userErr) {
            userErr.textContent = res.msg;
            userIn.focus();
          } else if (passErr) {
            passErr.textContent = res.msg || 'Falha ao entrar.';
            passIn.focus();
          }
        }
      } catch (err) {
        toggleLoading(false);
        console.error(err);
      }
    });
  }

  // Inicialização
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initBackground();
        initPasswordToggle();
        initForm();
    });
  } else {
    initBackground();
    initPasswordToggle();
    initForm();
  }
})();