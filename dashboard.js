// --- dashboard.js ---

// 1. Configuração do Supabase
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error('ERRO CRÍTICO: Supabase não carregado.');
}

// 2. Verificação de Sessão (O "Guarda-Costas")
(async function checkSession() {
    if (!supabaseClient) return;

    // Tenta pegar a sessão ativa
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    // Se não houver usuário logado, redireciona para o login
    if (!session || error) {
        window.location.href = 'login.html';
        return; 
    }

    // Se passou, mostra o dashboard
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    // Personaliza Avatar com iniciais do email
    if (session.user && session.user.email) {
        const email = session.user.email;
        const initials = email.substring(0, 2).toUpperCase();
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = initials;
    }

    // Configura o Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            if (confirm("Tem certeza que deseja sair?")) {
                await supabaseClient.auth.signOut();
                window.location.href = 'login.html';
            }
        };
    }
})();

// Futuramente: Funções para carregar KPIs reais do Supabase virão aqui.