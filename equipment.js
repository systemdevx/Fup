// --- equipment.js ---
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
    carregarEquipamentos();
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

    // Personaliza Avatar
    if (session.user && session.user.email) {
        const initials = session.user.email.substring(0, 2).toUpperCase();
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = initials;
    }

    // Configura Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            if (confirm("Deseja realmente sair?")) {
                await supabaseClient.auth.signOut();
                window.location.href = 'login.html';
            }
        };
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
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
}

async function carregarEquipamentos() {
    const { data, error } = await supabaseClient
        .from('equipamentos')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) return console.error(error);
    renderizarTabela(data);
}

function renderizarTabela(lista) {
    const tbody = document.getElementById('lista-equipamentos');
    if (!tbody) return;
    
    tbody.innerHTML = lista.map(item => `
        <tr>
            <td><strong>${item.codigo || '--'}</strong></td>
            <td>${item.nome || 'N/A'}</td>
            <td>${item.tipo || 'Geral'}</td>
            <td><span class="status-ativo">${item.status || 'Ativo'}</span></td>
            <td style="text-align: right;">
                <button class="btn-icon" title="Excluir" onclick="excluirEquipamento(${item.id})">
                    <span class="material-icons-outlined">delete</span>
                </button>
            </td>
        </tr>
    `).join('');
}

function filtrarTabela(texto) {
    const rows = document.querySelectorAll('#lista-equipamentos tr');
    const term = texto.toUpperCase();
    rows.forEach(row => {
        row.style.display = row.innerText.toUpperCase().includes(term) ? '' : 'none';
    });
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('sidebar-closed');
}

function toggleGroup(header) {
    const list = header.nextElementSibling;
    if(list) list.style.display = (list.style.display === 'none') ? 'flex' : 'none';
}