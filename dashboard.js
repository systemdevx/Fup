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
    configurarMenuPerfil();

    if (session.user) {
        const metadata = session.user.user_metadata || {};
        const nomeCompleto = metadata.full_name || session.user.email.split('@')[0];
        const nomeFormatado = nomeCompleto.charAt(0).toUpperCase() + nomeCompleto.slice(1);
        
        document.getElementById('tooltip-name').innerText = nomeFormatado;
        document.getElementById('tooltip-role').innerText = metadata.role || 'System Admin';

        const iniciais = extrairIniciais(nomeFormatado);
        document.getElementById('avatar-trigger').innerText = iniciais;
        document.getElementById('menu-avatar-iniciais').innerText = iniciais;
    }
})();

function extrairIniciais(nome) {
    const partes = nome.trim().split(' ');
    return partes.length >= 2 ? (partes[0][0] + partes[1][0]).toUpperCase() : partes[0].substring(0, 2).toUpperCase();
}

function configurarMenuPerfil() {
    const trigger = document.getElementById('avatar-trigger');
    const menu = document.getElementById('profile-menu');
    const wrapper = document.querySelector('.header-profile-wrapper');

    if (trigger && menu) {
        trigger.onclick = (e) => {
            e.stopPropagation();
            menu.classList.add('show');
            wrapper.classList.add('active'); 
        };

        document.onclick = (e) => {
            if (!menu.contains(e.target)) {
                menu.classList.remove('show');
                wrapper.classList.remove('active');
            }
        };
    }

    document.getElementById('btn-logout').onclick = async () => {
        if (confirm("Deseja realmente sair?")) {
            await supabaseClient.auth.signOut();
            window.location.href = 'login.html';
        }
    };
}

function iniciarMonitoramentoInatividade() {
    function resetTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(async () => {
            if (supabaseClient) await supabaseClient.auth.signOut();
            window.location.href = 'login.html';
        }, TEMPO_LIMITE);
    }
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
}