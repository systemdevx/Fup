// --- intro.js ---

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const msg = document.querySelector('.status-message');
    const today = new Date();
    const month = today.getMonth() + 1; // 1 = Janeiro
    const day = today.getDate();

    // --- 1. MOTOR DE TEMAS (Sazonal) ---
    
    // Configuração de Teste (Descomente para testar)
    // const month = 12; const day = 25; 

    // NATAL (Dezembro)
    if (month === 12) {
        body.classList.add('theme-christmas');
        msg.innerText = "Boas Festas • Carregando...";
        criarNeve(); // Ativa efeito especial
    }
    // ANO NOVO (1 a 7 de Janeiro)
    else if (month === 1 && day <= 7) {
        body.classList.add('theme-gold');
        msg.innerText = "Feliz 2026 • Iniciando...";
    }
    // PADRÃO (Laranja FUP ALM)
    else {
        // Nenhuma classe extra, usa as cores raiz (root)
        msg.innerText = "Toque para acessar";
    }

    // --- 2. TRANSIÇÃO DE CLIQUE ---
    body.addEventListener('click', () => {
        // Feedback visual imediato
        msg.innerText = "Entrando...";
        document.querySelector('.progress').style.animation = 'none';
        document.querySelector('.progress').style.width = '100%';
        
        // Efeito de saída
        body.classList.add('fade-out');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 600);
    });

    // Redirecionamento automático após carregar (opcional)
    setTimeout(() => {
        // Se o usuário não clicar, sugere clique piscando a mensagem
        msg.style.opacity = 0.5;
        setInterval(() => {
            msg.style.opacity = msg.style.opacity === '0.5' ? '1' : '0.5';
        }, 800);
    }, 2500);
});

// --- FUNÇÃO AUXILIAR: EFEITO DE NEVE ---
function criarNeve() {
    const container = document.getElementById('particles');
    const quantidade = 50;

    for (let i = 0; i < quantidade; i++) {
        const p = document.createElement('div');
        p.classList.add('dot');
        
        // Tamanho aleatório
        const size = Math.random() * 4 + 2 + 'px';
        p.style.width = size; 
        p.style.height = size;
        
        // Posição horizontal
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = -10 + 'px';

        // Velocidade
        p.style.animationDuration = Math.random() * 3 + 2 + 's';
        p.style.animationDelay = Math.random() * 5 + 's';

        container.appendChild(p);
    }
}