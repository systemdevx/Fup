// --- intro.js ---

document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('scene');
    const blobs = document.querySelectorAll('.blob');

    // 1. Efeito Parallax (Reação ao Mouse)
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        blobs.forEach(blob => {
            const speed = blob.getAttribute('data-speed');
            
            // Calcula a nova posição baseada na velocidade do elemento
            const xPos = (window.innerWidth - x * speed) / 100;
            const yPos = (window.innerHeight - y * speed) / 100;

            // Aplica a transformação suave
            blob.style.transform = `translateX(${xPos}px) translateY(${yPos}px)`;
        });
    });

    // 2. Transição para o Login
    document.body.addEventListener('click', () => {
        document.body.classList.add('fade-out');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 800); // Tempo igual à transição do CSS
    });
});