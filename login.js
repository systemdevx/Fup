// --- login.js v2 ---
(() => {
  'use strict';

  // Configs
  const REDIRECT_URL = '/app';
  const MIN_PASS = 6;

  const $ = (s) => document.querySelector(s);

  // Toggle Senha
  function initPasswordToggle() {
    const btn = $('#btnToggle');
    const input = $('#password');
    if (!btn || !input) return;

    btn.addEventListener('click', (e) => {
      // Evita submeter form se clicar sem querer
      e.preventDefault(); 
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      // Troca ícone: visibility -> visibility_off
      btn.querySelector('.material-icons').textContent = isPass ? 'visibility_off' : 'visibility';
    });
  }

  // Validação e Envio
  function initForm() {
    const form = $('#loginForm');
    const btn = $('#btnSubmit');
    const errUser = $('#error-username');
    const errPass = $('#error-password');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset Erros
      errUser.textContent = '';
      errPass.textContent = '';
      
      const userVal = $('#username').value.trim();
      const passVal = $('#password').value;
      let valid = true;

      // Validação visual
      if (!userVal) {
        errUser.textContent = 'Campo obrigatório.';
        valid = false;
      }
      if (!passVal || passVal.length < MIN_PASS) {
        errPass.textContent = `Mínimo de ${MIN_PASS} caracteres.`;
        valid = false;
      }

      if (!valid) return;

      // Estado de Carregamento
      btn.classList.add('loading');
      btn.disabled = true;

      // Simulação de Request (substitua por fetch real)
      // O delay aqui é puramente estético (800ms) para mostrar o spinner
      setTimeout(() => {
        // Lógica de sucesso - Redirecionar direto
        window.location.href = REDIRECT_URL;
        
        // Se houver erro de API, você faria:
        // btn.classList.remove('loading');
        // btn.disabled = false;
        // errUser.textContent = 'Usuário ou senha inválidos.';
      }, 800);
    });
  }

  // Inicializar
  document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggle();
    initForm();
  });
})();