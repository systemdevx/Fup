// --- login.js ---
// Melhorias:
// - Lazy load do background (melhora LCP/paint)
// - Mostrar/ocultar senha com acessibilidade
// - Simulação de submissão assíncrona com feedback (spinner, status)
// - Validação mínima com mensagens de erro
// - Efeito parallax leve (requestAnimationFrame) respeitando prefers-reduced-motion
// - Graceful fallback: se JS desativado, formulário age normalmente

(() => {
  'use strict';

  const CONFIG = {
    bgSelector: '.bg-image',
    bgAttr: 'data-bg',
    minPasswordLength: 6,
    fakeLoginDelay: 900, // ms - simulação de requisição
    parallaxMax: 12 // px
  };

  // Utilitários
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReducedMotion = () => {
    try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  };

  // Lazy load da imagem de fundo
  function lazyLoadBackground() {
    const bg = document.querySelector(CONFIG.bgSelector);
    if (!bg) return;
    const src = bg.getAttribute(CONFIG.bgAttr);
    if (!src) return;

    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    img.onload = () => {
      bg.style.backgroundImage = `url("${src}")`;
      bg.classList.add('loaded');
    };
    img.onerror = () => {
      // se falhar, mantém cor de fundo neutra
      bg.classList.add('loaded');
    };
  }

  // Mostrar/ocultar senha
  function setupPasswordToggle() {
    const toggle = $('#togglePassword');
    const password = $('#password');
    if (!toggle || !password) return;

    toggle.addEventListener('click', () => {
      const isMasked = password.type === 'password';
      password.type = isMasked ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(isMasked));
      toggle.setAttribute('aria-label', isMasked ? 'Ocultar senha' : 'Mostrar senha');
    });

    // Acessibilidade: permitir teclado visual com Enter / Space
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  }

  // Validação simples com mensagens
  function validateForm(username, password) {
    const errors = {};
    if (!username || username.trim().length === 0) {
      errors.username = 'Informe seu usuário ou e‑mail.';
    }
    if (!password || password.length < CONFIG.minPasswordLength) {
      errors.password = `Senha inválida — mínimo ${CONFIG.minPasswordLength} caracteres.`;
    }
    return errors;
  }

  // Simulação de envio (para demonstrar feedback). Substituir por fetch()/XHR real.
  function fakeSubmit(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula sucesso se username !== 'bloqueado'
        if (formData.get('username') === 'bloqueado') {
          resolve({ ok: false, message: 'Conta bloqueada. Contate o suporte.' });
        } else {
          resolve({ ok: true });
        }
      }, CONFIG.fakeLoginDelay);
    });
  }

  // Gerenciar estado de UI enquanto "carregando"
  function setLoading(loading) {
    const btn = $('#btnLogin');
    if (!btn) return;
    if (loading) {
      btn.classList.add('loading');
      btn.setAttribute('disabled', 'disabled');
      btn.querySelector('.btn-text')?.setAttribute('aria-hidden', 'true');
    } else {
      btn.classList.remove('loading');
      btn.removeAttribute('disabled');
      btn.querySelector('.btn-text')?.removeAttribute('aria-hidden');
    }
  }

  // Setup do formulário
  function setupForm() {
    const form = $('#loginForm');
    if (!form) return;
    const usernameEl = $('#username');
    const passwordEl = $('#password');
    const statusEl = $('#status');
    const usernameErr = $('#username-error');
    const passwordErr = $('#password-error');

    form.addEventListener('submit', async (ev) => {
      // Evita envio real; se quiser submeter sem JS, remova o preventDefault
      ev.preventDefault();

      // Reset mensagens
      if (statusEl) statusEl.textContent = '';
      if (usernameErr) usernameErr.textContent = '';
      if (passwordErr) passwordErr.textContent = '';

      const username = usernameEl?.value ?? '';
      const password = passwordEl?.value ?? '';

      const errors = validateForm(username, password);
      if (errors.username) {
        if (usernameErr) usernameErr.textContent = errors.username;
        usernameEl?.focus();
        return;
      }
      if (errors.password) {
        if (passwordErr) passwordErr.textContent = errors.password;
        passwordEl?.focus();
        return;
      }

      // Ativa estado de loading
      setLoading(true);
      if (statusEl) statusEl.textContent = 'Entrando…';

      try {
        const formData = new FormData();
        formData.set('username', username);
        formData.set('password', password);
        formData.set('remember', $('#remember')?.checked ? '1' : '0');

        // Aqui substitua por fetch('/api/login', { method:'POST', body: formData, ... })
        const res = await fakeSubmit(formData);

        if (res.ok) {
          if (statusEl) statusEl.textContent = 'Autenticado. Redirecionando…';
          // Simula redirecionamento real
          setTimeout(() => {
            window.location.href = '/app'; // ajustar conforme rota real
          }, 600);
        } else {
          if (statusEl) statusEl.textContent = res.message || 'Falha ao autenticar.';
          // foco no status para leitores de tela
          statusEl?.focus?.();
        }
      } catch (err) {
        if (statusEl) statusEl.textContent = 'Erro de rede. Tente novamente.';
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
  }

  // Parallax leve (usando requestAnimationFrame, respeitando prefers-reduced-motion)
  function setupParallax() {
    if (prefersReducedMotion()) return;
    // cria alguns blobs ao fundo se quisermos efeito visual (opcional).
    // Para simplicidade: aplica leve deslocamento na .bg-image com base no mouse.
    const bg = document.querySelector('.bg-image');
    if (!bg) return;

    let raf = null;
    let lastX = 0, lastY = 0;

    function onMove(e) {
      // normaliza posição (-0.5..0.5)
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      lastX = nx;
      lastY = ny;
      if (!raf) raf = requestAnimationFrame(render);
    }

    function render() {
      // transforma suavemente em px
      const tx = (lastX * CONFIG.parallaxMax).toFixed(2);
      const ty = (lastY * CONFIG.parallaxMax).toFixed(2);
      bg.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.06)`;
      raf = null;
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    // reduzir efeito em touch para evitar overhead
    window.addEventListener('deviceorientation', () => {}, { passive: true });
  }

  // Inicialização
  function init() {
    lazyLoadBackground();
    setupPasswordToggle();
    setupForm();
    setupParallax();

    // Pequeno ajuste de foco para fluxo de teclado
    const username = $('#username');
    if (username) username.focus();
  }

  // Aguarda DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();