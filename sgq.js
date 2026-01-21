// --- sgq.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    carregarSgq([]); 
});

async function checkSession() {
    if (!supabaseClient) return;
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (!session || error) { window.location.href = 'login.html'; return; }

    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    if (session.user && session.user.email) {
        document.querySelector('.avatar').innerText = session.user.email.substring(0, 2).toUpperCase();
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
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('icon-toggle-menu');
    if (sidebar) {
        sidebar.classList.toggle('sidebar-closed');
        if (icon) icon.innerText = sidebar.classList.contains('sidebar-closed') ? 'chevron_right' : 'chevron_left'; 
    }
}

function toggleGroup(header) {
    const list = header.nextElementSibling; 
    const arrow = header.querySelector('.arrow-header');
    list.style.display = list.style.display === 'none' ? 'flex' : 'none';
    arrow.innerText = list.style.display === 'none' ? 'expand_more' : 'expand_less'; 
}

function ativarItem(element) {
    document.querySelectorAll('.sidebar-local a').forEach(link => link.classList.remove('active'));
    element.classList.add('active');
}

function carregarSgq(lista) {
    const tbody = document.getElementById('lista-sgq');
    const emptyMsg = document.getElementById('empty-state-msg');
    if(!tbody) return;
    tbody.innerHTML = ''; 

    if (!lista || lista.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
        return;
    }
    if(emptyMsg) emptyMsg.style.display = 'none';
}