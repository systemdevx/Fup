const container = document.getElementById('animation-bg');

// Cores metálicas
const colors = [
    '#d4af37', // Ouro Clássico
    '#aa771c', // Ouro Escuro
    '#a8a9ad', // Prata
    '#e0e0e0'  // Platina
];

function createSquare() {
    const el = document.createElement('div');
    el.className = 'square';

    // Sorteia a cor da borda
    el.style.borderColor = colors[Math.floor(Math.random() * colors.length)];

    // Tamanho aleatório (quadrados finos e elegantes)
    const size = Math.random() * 40 + 15;
    el.style.width = size + 'px';
    el.style.height = size + 'px';

    // Posição
    el.style.left = Math.random() * 100 + 'vw';

    // Duração lenta (Elegância)
    const duration = Math.random() * 10 + 15; // 15s a 25s
    el.style.animationDuration = duration + 's';
    
    container.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, duration * 1000);
}

// Cria shapes constantemente
setInterval(createSquare, 500);