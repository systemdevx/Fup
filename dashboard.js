/* ARQUIVO: dashboard.js
   DESCRIÇÃO: Controla a lógica visual e interatividade do Dashboard Corporativo.
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DATA ATUAL NO HEADER ---
    updateCurrentDate();

    // --- 2. NAVEGAÇÃO SIDEBAR (Highlight) ---
    setupSidebarNavigation();

    // --- 3. PERFIL DO USUÁRIO ---
    loadUserProfile();

    // --- 4. BOTÕES DE AÇÃO (TABELA) ---
    setupTableActions();

    // --- 5. BARRA DE PESQUISA ---
    setupSearchBar();
});

// Função para exibir a data formatada
function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        // Formata para português (ex: segunda-feira, 15 de dezembro de 2025)
        let dateString = now.toLocaleDateString('pt-BR', options);
        
        // Deixa a primeira letra maiúscula (estética)
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        
        dateElement.textContent = dateString;
    }
}

// Função para gerenciar o clique no menu lateral
function setupSidebarNavigation() {
    const menuLinks = document.querySelectorAll('.menu-items a');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Se o link for apenas visual (#), previne o scroll para o topo
            const href = this.getAttribute('href');
            if(href === '#' || href === '') {
                e.preventDefault();
            }

            // Remove a classe 'active' de todos os itens
            menuLinks.forEach(item => item.classList.remove('active'));

            // Adiciona a classe 'active' ao item clicado
            this.classList.add('active');
        });
    });
}

// Função para carregar o nome do usuário salvo no login
function loadUserProfile() {
    const userDisplay = document.getElementById('sidebar-user');
    
    // Recupera do localStorage (definido no auth.js)
    const savedUser = localStorage.getItem('fup_user_name'); 
    
    if (userDisplay && savedUser) {
        userDisplay.textContent = savedUser;
    }
}

// Função para dar vida aos botões "Ver" da tabela
function setupTableActions() {
    const actionButtons = document.querySelectorAll('.btn-action');

    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Apenas simulação visual para o usuário sentir que funciona
            const row = e.target.closest('tr');
            const idProcesso = row.querySelector('.font-mono').textContent;
            
            alert(`Abrindo detalhes do processo: ${idProcesso}\n\n(Esta funcionalidade será conectada ao banco de dados em breve)`);
        });
    });
}

// Função para interação na barra de pesquisa
function setupSearchBar() {
    const searchInput = document.querySelector('.search-bar input');
    
    if(searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const termo = searchInput.value;
                if(termo.length > 0) {
                    alert(`Pesquisando no sistema por: "${termo}"...`);
                    // Aqui entraria a lógica real de filtro
                }
            }
        });
    }
}