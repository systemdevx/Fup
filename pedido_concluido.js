document.addEventListener('DOMContentLoaded', () => {
    // Simula a geração de um ID de pedido único
    const orderIdElement = document.querySelector('.order-id strong');
    if (orderIdElement) {
        const randomId = Math.floor(1000 + Math.random() * 9000);
        const year = new Date().getFullYear();
        orderIdElement.textContent = `#REQ-${year}-${randomId}`;
    }

    // Você pode adicionar aqui lógica para limpar o carrinho do localStorage
    // se estiver usando isso no novo_pedido.js
    if(localStorage.getItem('carrinho')) {
        localStorage.removeItem('carrinho');
        console.log("Carrinho limpo após sucesso.");
    }
});