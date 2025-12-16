document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DATA ATUAL NO HEADER
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = new Date().toLocaleDateString('pt-BR', options);
        dateElement.textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
    }

    // 2. HIGHLIGHT DO MENU LATERAL
    const menuLinks = document.querySelectorAll('.menu-items a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if(this.getAttribute('href') === '#') {
                e.preventDefault();
            }

            menuLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 3. NOME DO USUÁRIO NA BARRA LATERAL
    const userDisplay = document.getElementById('sidebar-user');
    const savedUser = localStorage.getItem('fup_user_name'); 
    if (userDisplay && savedUser) {
        userDisplay.textContent = savedUser;
    }
});