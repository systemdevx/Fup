// --- sgq.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    carregarSgq(); // Chama o carregamento da lista
});

async function checkSession() {
    if (!supabaseClient) return;
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    if (session && session.user && session.user.email) {
        const avatar = document.querySelector('.avatar');
        if(avatar) avatar.innerText = session.user.email.substring(0, 2).toUpperCase();
    }
    
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            if (confirm("Deseja sair?")) {
                await supabaseClient.auth.signOut();
                window.location.reload();
            }
        };
    }
}

// --- BUSCA DADOS DO HISTÓRICO ---
async function carregarSgq() {
    const tbody = document.getElementById('lista-sgq');
    const loading = document.getElementById('loading-msg');
    const empty = document.getElementById('empty-state-msg');
    
    if(!tbody) return;
    
    tbody.innerHTML = '';
    if(loading) loading.style.display = 'block';
    if(empty) empty.style.display = 'none';

    try {
        // Busca na tabela 'ativos_fvy'
        const { data, error } = await supabaseClient
            .from('ativos_fvy')
            .select('*')
            .order('created_at', { ascending: false }); // Mais recentes primeiro

        if (error) throw error;

        if (loading) loading.style.display = 'none';

        if (!data || data.length === 0) {
            if(empty) empty.style.display = 'block';
            return;
        }

        renderizarTabela(data);

    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        if (loading) loading.style.display = 'none';
        
        // Se der erro, mostra alerta, mas não trava a tela inteira
        alert('Erro ao carregar lista: ' + err.message);
    }
}

function renderizarTabela(lista) {
    const tbody = document.getElementById('lista-sgq');
    
    lista.forEach(item => {
        // Formata data
        let dataFormatada = '-';
        if(item.created_at) {
            const dateObj = new Date(item.created_at);
            dataFormatada = dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
        }
        
        // Define classe CSS do status
        let statusClass = 'status-calibracao'; // Pendente
        const st = (item.status || '').toLowerCase();
        if (st.includes('aprovado') || st.includes('conforme')) statusClass = 'status-conforme';
        if (st.includes('rejeitado') || st.includes('não') || st.includes('cancelado')) statusClass = 'status-nao-conforme';
        
        const row = `
            <tr>
                <td><strong>${item.codigo || 'Novo'}</strong></td>
                <td>
                    <div style="display:flex; flex-direction:column;">
                        <span style="font-weight:600; color:#333;">${item.equipamento}</span>
                        ${item.arquivo_nome ? `<span style="font-size:10px; color:#E67E22; display:flex; align-items:center; gap:2px;"><span class="material-icons-outlined" style="font-size:10px;">attach_file</span> ${item.arquivo_nome}</span>` : ''}
                    </div>
                </td>
                <td>${item.requisicao || '-'}</td>
                <td>${item.nota_fiscal || '-'}</td>
                <td>${item.setor || '-'}</td>
                <td style="font-size:11px;">${dataFormatada}</td>
                <td><span class="status-badge ${statusClass}">${item.status || 'Pendente'}</span></td>
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
    if (sidebar) sidebar.classList.toggle('sidebar-closed');
}
function toggleGroup(header) {
    const list = header.nextElementSibling; 
    if(list) list.style.display = list.style.display === 'none' ? 'flex' : 'none';
}