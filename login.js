(() => {
  'use strict';

  // Configurações
  const CONFIG = {
    bgImage: 'bloom.png', // Verifique se essa imagem existe no GitHub!
    redirectUrl: '/app'   // Para onde vai depois de logar
  };

  const $ = (s) => document.querySelector(s);

  // Carregar imagem de fundo
  function loadBackground() {
    const bg = $('.bg-image');
    if (bg) {
      const img = new Image();
      img.src = CONFIG.bgImage;
      img.onload = () => {
        bg.style.backgroundImage = `url('${CONFIG.bgImage}')`;
      };
      // Se não achar a imagem, o CSS já garante uma cor de fundo cinza
    }
  }

  // Alternar senha (olho)
  function setupPasswordToggle() {
    const btn = $('#togglePassword');
    const input = $('#password');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      // Troca o ícone: visibility ou visibility_off
      btn.querySelector('.material-icons').textContent = isPass ? 'visibility_off' : 'visibility';
    });
  }

  // Lógica do Login
  function setupForm() {
    const form = $('#loginForm');
    const userErr = $('#username-error');
    const passErr = $('#password-error');
    const btn = $('#btnLogin');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Limpa erros
      userErr.textContent = '';
      passErr.textContent = '';
      
      const user = $('#username').value.trim();
      const pass = $('#password').value;

      // Validação Simples
      let hasError = false;
      if (!user) {
        userErr.textContent = 'Digite seu usuário.';
        hasError = true;
      }
      if (!pass || pass.length < 6) {
        passErr.textContent = 'Senha inválida.';
        hasError = true;
      }
      if (hasError) return;

      // Simula carregamento
      btn.classList.add('loading');
      btn.disabled = true;

      // Simula requisição ao servidor
      setTimeout(() => {
        // SUCESSO: Redireciona direto sem mensagem
        window.location.href = CONFIG.redirectUrl;
      }, 800);
    });
  }

  // Iniciar
  document.addEventListener('DOMContentLoaded', () => {
    loadBackground();
    setupPasswordToggle();
    setupForm();
  });
})();