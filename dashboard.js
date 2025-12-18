document.addEventListener('DOMContentLoaded', () => {
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', day: 'numeric', month: 'long' 
        });
    }
});