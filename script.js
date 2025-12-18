// Seleciona o container de animação de fundo (opcional para manter os quadrados azuis)
const container = document.getElementById('animation-bg');
// Cores atualizadas para a paleta azul e branca
const colors = ['#0284c7', '#38bdf8', '#0369a1', '#e0f2fe'];

function createSquare() {
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'square';
    // Define a cor da borda baseada na nova paleta azul
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

// Suporte para rolagem suave em links internos
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa quadrados flutuantes se o container existir
    if (container) {
        setInterval(createSquare, 600);
    }

    // Gerenciador de cliques para navegação interna
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});