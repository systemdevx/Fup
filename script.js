const container = document.getElementById('animation-bg');

const colors = ['#d4af37', '#aa771c', '#a8a9ad', '#e0e0e0'];

function createSquare() {
    // Verificação de segurança: Se o container não existir, para a função.
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'square';
    el.style.borderColor = colors[Math.floor(Math.random() * colors.length)];

    const size = Math.random() * 40 + 15;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = Math.random() * 100 + 'vw';

    const duration = Math.random() * 10 + 15; 
    el.style.animationDuration = duration + 's';
    
    container.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, duration * 1000);
}

// Inicia apenas se o container existir
if (container) {
    setInterval(createSquare, 500);
}