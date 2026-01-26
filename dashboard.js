/* --- dashboard.js --- */
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Variável para controlar o temporizador
let inactivityTimer;
const TEMPO_LIMITE = 30 * 60 * 1000; // 30 minutos em milissegundos

(async function checkSession() {
    if (!supabaseClient) return;

    const { data: { session }, error } = await supabaseClient.auth.getSession();

    // Se NÃO houver sessão, manda para o login
    if (!session || error) {
        window.location.href = 'login.html';
        return; 
    }

    // Se houver sessão, libera a visualização e inicia o monitoramento
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    // Inicia a contagem de segurança
    iniciarMonitoramentoInatividade();

    if (session.user && session.user.email) {
        const email = session.user.email;
        const initials = email.substring(0, 2).toUpperCase();
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = initials;
    }

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

// --- FUNÇÃO DE SEGURANÇA (30 Minutos) ---
function iniciarMonitoramentoInatividade() {
    function resetTimer() {
        clearTimeout(inactivityTimer);
        // Reinicia a contagem para 30 minutos
        inactivityTimer = setTimeout(async () => {
            alert("Sessão expirada por inatividade (30 min). Você será desconectado.");
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
            window.location.href = 'login.html';
        }, TEMPO_LIMITE);
    }

    // Eventos que consideram o usuário "ativo"
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;
    document.onscroll = resetTimer; // Adicionado scroll também
}