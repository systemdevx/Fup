// --- supplier.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let inactivityTimer;
const TEMPO_LIMITE = 30 * 60 * 1000;

// Array vazio para iniciar sem dados fictícios
let fornecedoresData = [];

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    configurarBusca();
    carregarFornecedores(fornecedoresData); 
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

// --- FUNÇÕES DE BUSCA E FILTRO ---

function configurarBusca() {
    // Busca Global
    const globalInput = document.getElementById('global-search');
    if (globalInput) {
        globalInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const filtrados = fornecedoresData.filter(item => 
                item.razao.toLowerCase().includes(termo) || 
                item.cnpj.includes(termo) ||
                item.localidade.toLowerCase().includes(termo)
            );
            carregarFornecedores(filtrados);
        });
    }

    // Busca Lateral
    const sidebarInput = document.getElementById('sidebar-search');
    if (sidebarInput) {
        sidebarInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const menuItems = document.querySelectorAll('.sidebar-link span:last-child');
            menuItems.forEach(span => {
                const li = span.closest('li');
                if (span.innerText.toLowerCase().includes(termo)) {
                    li.style.display = 'flex';
                } else {
                    li.style.display = 'none';
                }
            });
        });
    }

    // Filtros de Status (Sidebar)
    const filterLinks = document.querySelectorAll('.sidebar-link[data-filter]');
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const status = link.getAttribute('data-filter');
            if(status === 'todos') {
                carregarFornecedores(fornecedoresData);
            } else {
                const filtrados = fornecedoresData.filter(item => item.status === status);
                carregarFornecedores(filtrados);
            }
        });
    });
}

function carregarFornecedores(lista) {
    const tbody = document.getElementById('lista-fornecedores');
    const emptyMsg = document.getElementById('empty-state-msg');
    
    if(!tbody) return;
    tbody.innerHTML = ''; 

    if (!lista || lista.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
        return;
    }
    if(emptyMsg) emptyMsg.style.display = 'none';

    lista.forEach(item => {
        const row = `
            <tr>
                <td style="text-align:center; cursor:pointer;"><span class="material-icons-outlined" style="font-size:18px; color:#1a73e8;">chevron_right</span></td>
                <td>${item.localidade}</td>
                <td>${item.cnpj}</td>
                <td><a class="link-blue">${item.razao}</a></td>
            </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}