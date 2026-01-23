// --- sgq.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    carregarSgq(); 
});

async function checkSession() {
    if (!supabaseClient) return;
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (!session || error) { window.location.href = 'login.html'; return; }

    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    if (session.user && session.user.email) {
        const avatar = document.querySelector('.avatar');
        if(avatar) avatar.innerText = session.user.email.substring(0, 2).toUpperCase();
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

// --- BUSCA DADOS NO SUPABASE ---
async function carregarSgq() {
    const tbody = document.getElementById('lista-sgq');
    const loading = document.getElementById('loading-msg');
    const empty = document.getElementById('empty-state-msg');
    
    if(!tbody) return;
    
    tbody.innerHTML = '';
    if(loading) loading.style.display = 'block';
    if(empty) empty.style.display = 'none';

    try {
        const { data, error } = await supabaseClient
            .from('ativos_fvy')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (loading) loading.style.display = 'none';

        if (!data || data.length === 0) {
            if(empty) empty.style.display = 'block';
            return;
        }

        renderizarTabela(data);

    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        if (loading) {
            loading.style.display = 'none';
            alert('Erro ao carregar dados do banco.');
        }
    }
}

function renderizarTabela(lista) {
    const tbody = document.getElementById('lista-sgq');
    
    lista.forEach(item => {
        const dataCriacao = new Date(item.created_at).toLocaleDateString('pt-BR');
        
        let statusClass = 'status-calibracao'; 
        if (item.status === 'Aprovado') statusClass = 'status-conforme';
        
        const row = `
            <tr>
                <td><strong>${item.codigo || '-'}</strong></td>
                <td>
                    <div style="display:flex; flex-direction:column;">
                        <span style="font-weight:600; color:#333;">${item.equipamento}</span>
                        ${item.arquivo_nome ? `<span style="font-size:10px; color:#E67E22; display:flex; align-items:center; gap:2px;"><span class="material-icons-outlined" style="font-size:10px;">attach_file</span> ${item.arquivo_nome}</span>` : ''}
                    </div>
                </td>
                <td>${item.requisicao || '-'}</td>
                <td>${item.nota_fiscal || '-'}</td>
                <td>${item.setor || '-'}</td>
                <td>${dataCriacao}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td style="text-align: right;">
                    <button class="btn-icon" title="Ver Detalhes"><span class="material-icons-outlined">visibility</span></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function filtrarTabela(texto) {
    const rows = document.querySelectorAll('#lista-sgq tr');
    const term = texto.toUpperCase();
    
    rows.forEach(row => {
        const txt = row.innerText.toUpperCase();
        row.style.display = txt.includes(term) ? '' : 'none';
    });
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