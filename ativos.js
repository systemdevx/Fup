document.addEventListener('DOMContentLoaded', () => {
    // Lógica de Abas
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active de todas
            tabs.forEach(t => t.classList.remove('active'));
            // Adiciona na clicada
            tab.classList.add('active');
            
            console.log(`Filtrando grid por: ${tab.innerText}`);
        });
    });
});