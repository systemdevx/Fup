// --- supplier.js ---
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
    carregarFornecedores([]); 
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
        let statusClass = item.status === 'Ativo' ? 'status-ativo' : (item.status === 'Em Análise' ? 'status-analise' : 'status-inativo');
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
                <td style="text-align: right;">
                    <button class="btn-icon" title="Editar"><span class="material-icons-outlined">edit</span></button>
                </td>
            </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}