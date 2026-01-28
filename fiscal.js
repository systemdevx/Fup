// --- fiscal.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error('ERRO: Supabase não carregado.');
}

// Variável para controlar o temporizador
let inactivityTimer;
const TEMPO_LIMITE = 30 * 60 * 1000; // 30 minutos em milissegundos

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    configurarBuscaSidebar();
    // Inicia com lista vazia aguardando integração
    carregarFiscal([]); 
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

    // Inicia a contagem de segurança
    iniciarMonitoramentoInatividade();

    if (session.user && session.user.email) {
        const initials = session.user.email.substring(0, 2).toUpperCase();
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = initials;
    }
}

// --- FUNÇÃO DE SEGURANÇA (30 Minutos) ---
function iniciarMonitoramentoInatividade() {
    function resetTimer() {
        clearTimeout(inactivityTimer);
        // Reinicia a contagem para 30 minutos
        inactivityTimer = setTimeout(async () => {
            alert("Sessão expirada por inatividade (30 min). Você será desconectado.");
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
            window.location.href = 'login.html';
        }, TEMPO_LIMITE);
    }

    // Eventos que consideram o usuário "ativo"
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;
    document.onscroll = resetTimer;
}

// Lógica do Menu Lateral
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('icon-toggle-menu');

    if (sidebar) {
        sidebar.classList.toggle('sidebar-closed');
        if (icon) {
            icon.innerText = sidebar.classList.contains('sidebar-closed') ? 'chevron_right' : 'chevron_left'; 
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
    });
    element.classList.add('active');
}

function configurarBuscaSidebar() {
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
}

// Lógica da Tabela
function carregarFiscal(lista) {
    const tbody = document.getElementById('lista-fiscal');
    const emptyMsg = document.getElementById('empty-state-msg');
    
    if(!tbody) return;
    tbody.innerHTML = ''; 

    if (!lista || lista.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
        return;
    }
    if(emptyMsg) emptyMsg.style.display = 'none';

    // Aqui entrará o loop de dados futuramente
}