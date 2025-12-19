// --- Função de Logout ---
function logout() {
    if(confirm("Deseja realmente encerrar sua sessão no FUP?")) {
        // Redireciona para login
        window.location.href = "login.html";
    }
}

// --- Lógica das Abas (Alternar estilo) ---
const tabs = document.querySelectorAll('.tab-item');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove a classe 'active' de todas as abas
        tabs.forEach(t => t.classList.remove('active'));

        // Adiciona a classe 'active' na aba clicada
        tab.classList.add('active');
        
        console.log(`Aba selecionada: ${tab.innerText}`);
    });
});

// --- Feedback Visual nos Botões de Filtro ---
const filters = document.querySelectorAll('.filter-pill');

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        console.log(`Filtro clicado: ${filter.innerText}`);
        // Aqui você pode adicionar lógica futura de abrir menus suspensos
    });
});

// --- Feedback Visual nos Ícones ---
const actionButtons = document.querySelectorAll('.icon-action');

actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const title = btn.getAttribute('title');
        if(title) {
            console.log(`Ação acionada: ${title}`);
        }
    });
});