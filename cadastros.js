// Função do Botão Solicitar Cadastro
function novaSolicitacao() {
    const confirmar = confirm("Deseja iniciar uma nova solicitação de cadastro?");
    
    if (confirmar) {
        alert("Solicitação enviada para o setor responsável!");
    }
}

// Lógica das Abas (Carrega quando a página está pronta)
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active de todas
            tabs.forEach(t => t.classList.remove('active'));
            // Adiciona na clicada
            tab.classList.add('active');
            
            console.log(`Filtro selecionado: ${tab.innerText}`);
            // Aqui você poderá adicionar a lógica para filtrar a tabela no futuro
        });
    });
});