document.addEventListener('DOMContentLoaded', () => {
    console.log("Página de Detalhes Carregada");
});

function finalizar() {
    if(confirm("Deseja confirmar os detalhes do item?")) {
        window.location.href = 'pedido_concluido.html';
    }
}