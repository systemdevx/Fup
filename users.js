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
        // Se estivermos em modo convite, marcamos visualmente como pendente
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

function carregarConvites() {
    marcarLinkAtivo(event.currentTarget);
    // Filtra usuários sem UID (que ainda não aceitaram o convite) ou com status pendente
    const convites = allUsers.filter(u => !u.id || u.status === 'Pendente');
    renderTable(convites, true);
}

function filterByStatus(status) {
    marcarLinkAtivo(event.currentTarget);
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