function logout() {
    [cite_start]// Mantém a mesma lógica de confirmação [cite: 2]
    if(confirm("Deseja realmente sair do sistema FUP?")) {
        // Redireciona para login (assumindo que existe login.html)
        window.location.href = "login.html";
    }
}

// Lógica para alternar o link ativo na nova sidebar
const sideLinks = document.querySelectorAll('.side-link');

sideLinks.forEach(item => {
    item.addEventListener('click', (e) => {
        // Remove a classe 'active' de todos os links
        document.querySelectorAll('.side-link.active').forEach(activeItem => {
            activeItem.classList.remove('active');
        });
        
        // Adiciona a classe 'active' ao link clicado
        item.classList.add('active');
    });
});

// Os alertas inline no HTML (onclick="alert(...)") continuarão funcionando
// nas linhas da tabela, simulando a navegação anterior dos cards.