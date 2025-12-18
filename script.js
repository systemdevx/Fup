// Aguarda o carregamento completo da página
window.onload = function() {
    const logo = document.getElementById('main-logo');

    // Após 4 segundos (tempo da animação), fazemos a transição de saída
    setTimeout(() => {
        // Adiciona um efeito de fade out suave na tela toda
        document.body.style.transition = "opacity 1.5s ease";
        document.body.style.opacity = "0";

        // Após o fade out, redireciona para a sua página principal
        setTimeout(() => {
            // Substitua 'home.html' pelo nome da sua página de entrada
            console.log("Transição concluída. Redirecionando...");
            // window.location.href = "home.html"; 
        }, 1500);

    }, 4000);
};