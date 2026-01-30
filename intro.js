document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const bg = document.getElementById('bg-image');

    // Simula o carregamento rápido do background
    setTimeout(() => {
        bg.classList.add('loaded');
    }, 100);

    // Reduzido para 800ms (quase instantâneo, mas mantém a identidade visual)
    setTimeout(() => {
        body.classList.add('fade-out');
        
        // Pequeno atraso para a transição de opacidade completar antes de mudar a página
        setTimeout(() => {
            window.location.href = "login.html";
        }, 200);
        
    }, 800); 
});