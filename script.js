const container = document.getElementById('animation-bg');
const colors = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#e0f2fe'];

function createSquare() {
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'square';
    el.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 40 + 20;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = Math.random() * 100 + 'vw';
    const duration = Math.random() * 15 + 10;
    el.style.animationDuration = duration + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
}

if (container) setInterval(createSquare, 600);