/* --- dashboard.js --- */
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let inactivityTimer;
const TEMPO_LIMITE = 30 * 60 * 1000; 

(async function checkSession() {
    if (!supabaseClient) return;

    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (!session || error) {
        window.location.href = 'login.html';
        return; 
    }

    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    iniciarMonitoramentoInatividade();

    // --- POPULAR PERFIL NA SIDEBAR ---
    if (session.user) {
        const user = session.user;
        const email = user.email;
        
        // Nome
        const metadata = user.user_metadata || {};
        const nomeCompleto = metadata.full_name || email.split('@')[0];
        const nomeFormatado = nomeCompleto.charAt(0).toUpperCase() + nomeCompleto.slice(1);
        
        // Cargo
        const cargo = metadata.role || 'Administrador';

        // Iniciais
        const initials = email.substring(0, 2).toUpperCase();

        // Elementos Header
        const avatarSmall = document.querySelector('.avatar');
        if (avatarSmall) avatarSmall.innerText = initials;

        // Elementos Sidebar (Perfil)
        const greetingEl = document.getElementById('user-greeting');
        const roleEl = document.getElementById('user-role-display');
        const avatarLarge = document.getElementById('profile-avatar-large');

        if(greetingEl) greetingEl.innerText = nomeFormatado;
        if(roleEl) roleEl.innerText = cargo;
        if(avatarLarge) avatarLarge.innerText = initials;
    }
})();

// --- AÇÕES DO USUÁRIO ---

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('sidebar-closed');
    }
}

function verPerfil() {
    alert("Funcionalidade em desenvolvimento: Visualizar Perfil Completo.");
    // Futuro: window.location.href = 'profile.html';
}

async function mudarSenha() {
    const email = prompt("Confirme seu e-mail para receber o link de redefinição:");
    if (email) {
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html',
        });
        
        if (error) {
            alert("Erro ao enviar: " + error.message);
        } else {
            alert("Link enviado para " + email + ". Verifique sua caixa de entrada.");
        }
    }
}

// --- SEGURANÇA ---
function iniciarMonitoramentoInatividade() {
    function resetTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(async () => {
            alert("Sessão expirada por inatividade (30 min). Você será desconectado.");
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
            window.location.href = 'login.html';
        }, TEMPO_LIMITE);
    }
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;
    document.onscroll = resetTimer;
}