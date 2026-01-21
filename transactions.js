// --- transactions.js ---

// 1. Configuração do Supabase (Igual ao Dashboard)
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error('ERRO CRÍTICO: Supabase não carregado.');
}

// 2. Verificação de Sessão e Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    // Inicia com lista vazia (aguardando integração real com banco de dados)
    carregarPedidos([]); 
});

async function checkSession() {
    if (!supabaseClient) return;

    // Tenta pegar a sessão ativa
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    // Se não houver usuário logado, redireciona
    if (!session || error) {
        window.location.href = 'login.html';
        return; 
    }

    // Mostra a tela
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    // Personaliza Avatar
    if (session.user && session.user.email) {
        const initials = session.user.email.substring(0, 2).toUpperCase();
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = initials;
    }

    // Configura o Logout
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

/* --- LÓGICA DO MENU LATERAL --- */

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const label = document.getElementById('lbl-toggle-menu');
    const icon = document.getElementById('icon-toggle-menu');

    if (sidebar) {
        sidebar.classList.toggle('sidebar-closed');
        
        if (sidebar.classList.contains('sidebar-closed')) {
            if(label) label.innerText = 'Mostrar Menu';
            if(icon) icon.innerText = 'chevron_right'; 
        } else {
            if(label) label.innerText = 'Ocultar Menu';
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
    document.querySelectorAll('.sidebar-local a').forEach(link => {
        link.classList.remove('active');
        const icon = link.querySelector('.menu-text-icon .material-icons-outlined');
        if(icon && icon.innerText === 'folder_open') icon.innerText = 'folder';
    });

    element.classList.add('active');

    const icon = element.querySelector('.menu-text-icon .material-icons-outlined');
    if(icon && icon.innerText === 'folder') {
        icon.innerText = 'folder_open';
    }

    const textoItem = element.querySelector('span:not(.material-icons-outlined)').innerText;
    const tituloPagina = document.getElementById('titulo-pagina');
    if(tituloPagina) tituloPagina.innerText = textoItem;
}

/* --- LÓGICA DA TABELA DE DADOS --- */

// Função preparada para receber dados reais do Supabase futuramente
function carregarPedidos(listaDePedidos) {
    const tbody = document.getElementById('lista-pedidos');
    const emptyMsg = document.getElementById('empty-state-msg');
    
    if(!tbody) return;
    tbody.innerHTML = ''; 

    // Verifica se a lista está vazia
    if (!listaDePedidos || listaDePedidos.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
        return;
    }

    if(emptyMsg) emptyMsg.style.display = 'none';

    listaDePedidos.forEach(pedido => {
        let statusClass = '';
        if(pedido.status === 'aprovado') statusClass = 'status-aprovado';
        else if(pedido.status === 'pendente') statusClass = 'status-pendente';
        else statusClass = 'status-cancelado';

        let icone = 'inventory_2';
        // Lógica de ícones pode ser expandida aqui
        
        const row = `
            <tr>
                <td><strong>${pedido.id}</strong></td>
                <td>
                    <div style="display:flex; align-items:center; gap:5px;">
                        <span class="material-icons-outlined" style="font-size:16px; color:#666;">${icone}</span>
                        ${pedido.tipo || 'Geral'}
                    </div>
                </td>
                <td>${pedido.detalhes}</td>
                <td>${pedido.data}</td>
                <td><span class="status-badge ${statusClass}">${pedido.status}</span></td>
                <td>
                    <button class="btn-icon" title="Ver Detalhes"><span class="material-icons-outlined">visibility</span></button>
                    <button class="btn-icon" title="Repetir Pedido"><span class="material-icons-outlined">replay</span></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}