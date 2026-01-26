// --- catalog.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let categoriaAtual = 'materiais';

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    carregarCatalogo(); 
});

async function checkSession() {
    if (!supabaseClient) return;
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error || !session) {
        window.location.href = 'login.html';
        return;
    }

    // Libera visibilidade
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    if (session.user && session.user.email) {
        const initials = session.user.email.substring(0, 2).toUpperCase();
        const avatar = document.getElementById('user-avatar');
        if (avatar) avatar.innerText = initials;
    }

    // Configuração Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.onclick = async () => {
            if (confirm("Deseja sair do sistema?")) {
                await supabaseClient.auth.signOut();
                window.location.href = 'login.html';
            }
        };
    }
}

function carregarCatalogo() {
    const tbody = document.getElementById('corpo-tabela');
    const head = document.getElementById('cabecalho-tabela');
    const empty = document.getElementById('empty-state-msg');
    
    tbody.innerHTML = '';
    empty.style.display = 'none';

    if (categoriaAtual === 'materiais') {
        head.innerHTML = `<th width="120">CÓDIGO</th><th>DESCRIÇÃO DO MATERIAL</th><th width="150">CATEGORIA</th><th width="80">UN</th><th width="80" style="text-align:right">AÇÕES</th>`;
        
        // Mock de dados (Simulação)
        const mock = [{cod: 'ALM-001', desc: 'Lâmpada LED 10W', cat: 'Elétrica', un: 'UN'}];
        
        tbody.innerHTML = mock.map(i => `
            <tr>
                <td><strong>${i.cod}</strong></td>
                <td>${i.desc}</td>
                <td>${i.cat}</td>
                <td>${i.un}</td>
                <td style="text-align:right">
                    <button class="btn-icon" title="Editar"><span class="material-icons-outlined">edit</span></button>
                </td>
            </tr>
        `).join('');
    } else {
        empty.style.display = 'block';
    }
}

// Funções de UI
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
    if (list.style.display === 'none') {
        list.style.display = 'flex';
        arrow.innerText = 'expand_less';
    } else {
        list.style.display = 'none';
        arrow.innerText = 'expand_more';
    }
}

function alterarCategoria(novaCat, element) {
    document.querySelectorAll('.sidebar-local a').forEach(link => link.classList.remove('active'));
    element.classList.add('active');
    categoriaAtual = novaCat;
    carregarCatalogo();
}