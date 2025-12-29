document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DATA ATUAL NO HEADER
    const dateDisplay = document.getElementById('date-display');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        // Capitaliza a primeira letra do dia
        let dateString = today.toLocaleDateString('pt-BR', options);
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        dateDisplay.textContent = dateString;
    }

    // 2. ANIMAÇÃO DE CONTAGEM (KPIs)
    const counters = document.querySelectorAll('.card-value');
    const speed = 150; // Ajuste para mais rápido ou devagar

    counters.forEach(counter => {
        // Verifica se o texto original contém "R$" para formatar como moeda
        const isCurrency = counter.innerText.includes('R$');
        // Pega o alvo (target) dos dados HTML
        const target = +counter.getAttribute('data-target');
        
        const updateCount = () => {
            // Pega valor atual animado (ou 0)
            const currentVal = +counter.getAttribute('data-current') || 0;
            
            // Define o incremento
            const inc = target / speed;

            if (currentVal < target) {
                const newVal = Math.ceil(currentVal + inc);
                counter.setAttribute('data-current', newVal);
                
                // Formatação Visual
                if (isCurrency) {
                    counter.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newVal);
                } else {
                    counter.innerText = newVal;
                }
                
                // Chama a função novamente (loop de animação)
                setTimeout(updateCount, 10);
            } else {
                // Finaliza com o valor exato limpo
                if (isCurrency) {
                    counter.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(target);
                } else {
                    counter.innerText = target;
                }
            }
        };

        updateCount();
    });

    // 3. MENU ATIVO (Visual)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); 
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // 4. LOGOUT
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});