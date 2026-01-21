// --- supplier.js ---

// 1. Configuração do Supabase (Mesma chave dos outros módulos)
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error('ERRO CRÍTICO: Supabase não carregado.');
}

// 2. Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    // Inicializa sem fornecedores fictícios, conforme solicitado.
    carregarFornecedores([]); 
});

// 3. Verificação de Sessão (Guard)
async function checkSession() {
    if (!supabaseClient) return;

    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (!session || error) {
        window.location.href = 'login.html';
        return; 
    }

    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    if (session.user && session.user.email) {
        const initials = session.user.email.substring(0, 2).toUpperCase();
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
}

/* --- LÓGICA DO MENU LATERAL (Sidebar) --- */

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('icon-toggle-menu');

    if (sidebar) {
        sidebar.classList.toggle('sidebar-closed');
        
        if (sidebar.classList.contains('sidebar-closed')) {
            if(icon) icon.innerText = 'chevron_right'; 
        } else {
            if(icon) icon.innerText = 'chevron_left'; 
        }
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

function ativarItem(element) {
    // Remove classe active de todos os links
    document.querySelectorAll('.sidebar-local a').forEach(link => {
        link.classList.remove('active');
    });

    // Adiciona ao clicado
    element.classList.add('active');
}

/* --- LÓGICA DA TABELA DE FORNECEDORES --- */

function carregarFornecedores(lista) {
    const tbody = document.getElementById('lista-fornecedores');
    const emptyMsg = document.getElementById('empty-state-msg');
    
    if(!tbody) return;
    tbody.innerHTML = ''; 

    // Verifica se a lista está vazia
    if (!lista || lista.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
        return;
    }

    if(emptyMsg) emptyMsg.style.display = 'none';

    lista.forEach(item => {
        let statusClass = '';
        if(item.status === 'Ativo') statusClass = 'status-ativo';
        else if(item.status === 'Em Análise') statusClass = 'status-analise';
        else statusClass = 'status-inativo';
        
        const row = `
            <tr>
                <td><strong>${item.id}</strong></td>
                <td>
                    <div style="font-weight:600; color:#333;">${item.razao_social}</div>
                    <div style="font-size:11px; color:#888;">${item.nome_fantasia || ''}</div>
                </td>
                <td>${item.cnpj}</td>
                <td>${item.categoria}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td>
                    <button class="btn-icon" title="Editar"><span class="material-icons-outlined">edit</span></button>
                    <button class="btn-icon" title="Histórico"><span class="material-icons-outlined">history</span></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}