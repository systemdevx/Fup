// --- transactions.js ---

const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let inactivityTimer;
const TEMPO_LIMITE = 30 * 60 * 1000;

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    configurarBusca();
    carregarPedidos([]); 
});

async function checkSession() {
    if (!supabaseClient) return;

    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (!session || error) {
        window.location.href = 'login.html';
        return; 
    }

    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    iniciarMonitoramentoInatividade();

    if (session.user && session.user.email) {
        const initials = session.user.email.substring(0, 2).toUpperCase();
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = initials;
    }
}

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
}

/* --- LÓGICA DO MENU LATERAL --- */

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

function ativarItem(element) {
    // Remove active de todos
    document.querySelectorAll('.group-list li a').forEach(link => {
        link.classList.remove('active');
        // Reseta ícone de pasta se houver
        const icon = link.querySelector('.menu-text-icon .material-icons-outlined');
        if(icon && icon.innerText === 'folder_open') icon.innerText = 'folder';
    });

    // Ativa o clicado
    element.classList.add('active');

    // Troca ícone se for pasta
    const icon = element.querySelector('.menu-text-icon .material-icons-outlined');
    if(icon && icon.innerText === 'folder') {
        icon.innerText = 'folder_open';
    }
}

// --- FUNÇÕES DE BUSCA ---

function configurarBusca() {
    // Busca Lateral (Filtra o menu)
    const sidebarInput = document.getElementById('sidebar-search');
    if (sidebarInput) {
        sidebarInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const menuTexts = document.querySelectorAll('.group-list li a .menu-text-icon span:last-child');
            
            menuTexts.forEach(span => {
                const li = span.closest('li');
                if (span.innerText.toLowerCase().includes(termo)) {
                    li.style.display = 'flex';
                } else {
                    li.style.display = 'none';
                }
            });
        });
    }

    // Busca Global
    const globalInput = document.getElementById('global-search');
    if(globalInput) {
        globalInput.addEventListener('input', (e) => {
            console.log("Buscando transação:", e.target.value);
            // Implementar filtro real quando houver lista de pedidos
        });
    }
}

/* --- LÓGICA DA TABELA DE DADOS --- */

function carregarPedidos(listaDePedidos) {
    const tbody = document.getElementById('lista-pedidos');
    const emptyMsg = document.getElementById('empty-state-msg');
    
    if(!tbody) return;
    tbody.innerHTML = ''; 

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
                <td style="text-align: right;">
                    <button class="btn-icon" title="Ver Detalhes"><span class="material-icons-outlined">visibility</span></button>
                    <button class="btn-icon" title="Repetir Pedido"><span class="material-icons-outlined">replay</span></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}