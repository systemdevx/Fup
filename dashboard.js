document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificar se o Supabase (sb) existe (carregado via auth.js)
    if (typeof sb === 'undefined') {
        console.error("Erro: Supabase não inicializado. Verifique o auth.js");
        return;
    }

    // 2. Proteção de Rota: Só entra se estiver logado
    const { data: { user } } = await sb.auth.getUser(); [cite: 1]
    
    if (!user) {
        window.location.href = "login.html"; [cite: 1]
        return;
    }

    // 3. Exibir dados do usuário
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) userDisplay.innerText = user.email;

    // 4. Atualizar Data Atual
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        dateEl.textContent = new Date().toLocaleDateString('pt-BR', options);
    }
});