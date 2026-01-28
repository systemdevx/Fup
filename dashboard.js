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

    // --- POPULAR TOOLTIP DO PERFIL ---
    if (session.user) {
        const user = session.user;
        const metadata = user.user_metadata || {};
        
        const nomeCompleto = metadata.full_name || user.email.split('@')[0];
        const nomeFormatado = nomeCompleto.charAt(0).toUpperCase() + nomeCompleto.slice(1);
        const cargo = metadata.role || 'System Admin';

        // Preenche o tooltip oculto
        const tooltipName = document.getElementById('tooltip-name');
        const tooltipRole = document.getElementById('tooltip-role');
        
        if(tooltipName) tooltipName.innerText = nomeFormatado;
        if(tooltipRole) tooltipRole.innerText = cargo;
    }
})();

function iniciarMonitoramentoInatividade() {
    function resetTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(async () => {
            alert("Sessão expirada por inatividade.");
            if (supabaseClient) await supabaseClient.auth.signOut();
            window.location.href = 'login.html';
        }, TEMPO_LIMITE);
    }
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;
}