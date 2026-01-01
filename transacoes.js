document.addEventListener('DOMContentLoaded', () => {
    // Toggle do Menu Lateral Estilo ERP
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const sidebar = document.getElementById('sidebarTransacoes');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar.classList.toggle('closed');
        });
    }

    // (O restante do código de checkbox e busca permanece igual)
});