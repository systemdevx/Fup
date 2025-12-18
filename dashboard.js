document.addEventListener('DOMContentLoaded', async () => {
    if (typeof sb === 'undefined') {
        console.error("Erro: Supabase não inicializado.");
        return;
    }

    // Conexão de Segurança: Verifica se o usuário está logado 
    const { data: { user } } = await sb.auth.getUser();
    
    if (!user) {
        // Se não estiver conectado, volta para o login 
        window.location.href = "login.html";
        return;
    }

    // Exibe o e-mail do usuário logado 
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) userDisplay.innerText = user.email;

    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        dateEl.textContent = new Date().toLocaleDateString('pt-BR', options);
    }
});