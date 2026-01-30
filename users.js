// --- users.js ---
let allUsers = []; 
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'SUA_CHAVE_AQUI'; 

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

document.addEventListener('DOMContentLoaded', async () => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    await fetchUsersData();
    setupFilters();
});

async function fetchUsersData() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from('profiles') 
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;
        allUsers = data;
        renderTable(allUsers);
    } catch (err) {
        console.error("Erro ao carregar usuários:", err);
    }
}

function renderTable(data, isInviteMode = false) {
    const tbody = document.getElementById('users-tbody');
    if(!tbody) return;
    tbody.innerHTML = '';

    data.forEach(user => {
        const tr = document.createElement('tr');
        const statusText = isInviteMode ? 'Enviado' : (user.status || 'Ativo');
        const statusClass = isInviteMode ? 'pendente' : (statusText === 'Bloqueado' ? 'bloqueado' : 'status-aprovado');
        
        tr.innerHTML = `
            <td class="user-name-bold">${user.full_name || '---'}</td>
            <td>${user.profile_type || 'Padrão'}</td>
            <td>${user.role || '---'}</td>
            <td>GERAL</td>
            <td><small style="color:#888">${user.id ? user.id.substring(0,8) : '---'}</small></td>
            <td>${user.email}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function carregarConvites(el) {
    if(el) marcarLinkAtivo(el);
    const convites = allUsers.filter(u => !u.id || u.status === 'Pendente');
    renderTable(convites, true);
}

function filterByStatus(status, el) {
    if(el) marcarLinkAtivo(el);
    renderTable(allUsers);
}

function marcarLinkAtivo(elemento) {
    document.querySelectorAll('.group-list a').forEach(a => a.classList.remove('active'));
    elemento.classList.add('active');
}

function setupFilters() {
    const mainSearch = document.getElementById('main-user-search');
    if(mainSearch) {
        mainSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allUsers.filter(u => 
                (u.full_name && u.full_name.toLowerCase().includes(term)) || 
                (u.email && u.email.toLowerCase().includes(term))
            );
            renderTable(filtered);
        });
    }
}

// Funções de UI (Menu Lateral)
function toggleGroup(headerElement) {
    const list = headerElement.nextElementSibling;
    const arrow = headerElement.querySelector('.arrow-header');
    
    if (list.style.display === 'none') {
        list.style.display = 'block';
        if(arrow) arrow.textContent = 'expand_less';
    } else {
        list.style.display = 'none';
        if(arrow) arrow.textContent = 'expand_more';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('icon-toggle-menu');
    
    sidebar.classList.toggle('sidebar-closed');

    if (sidebar.classList.contains('sidebar-closed')) {
        sidebar.style.width = '0';
        sidebar.style.padding = '0';
        sidebar.style.overflow = 'hidden';
        icon.textContent = 'chevron_right';
    } else {
        sidebar.style.width = ''; 
        sidebar.style.padding = '';
        sidebar.style.overflow = '';
        icon.textContent = 'chevron_left';
    }
}