// --- intro.js ---
document.body.addEventListener('click', () => {
    // Adiciona classe que inicia o fade-out no CSS
    document.body.classList.add('fade-out');

    // Espera a animação terminar (600ms) e redireciona
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 600);
});