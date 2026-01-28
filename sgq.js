// --- sgq.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    alert("Erro: Biblioteca Supabase não carregada.");
}

let inactivityTimer;
const TEMPO_LIMITE = 30 * 60 * 1000;

document.addEventListener('DOMContentLoaded', async () => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    await checkSession();
    configurarBuscaSidebar();
    carregarSgq(); 
});

async function checkSession() {
    if (!supabaseClient) return;
    const { data } = await supabaseClient.auth.getSession();
    if (!data || !data.session) {
        window.location.href = 'login.html';
        return;
    }
    iniciarMonitoramentoInatividade();
    
    // Atualiza Avatar
    if (data.session.user && data.session.user.email) {
        const avatar = document.querySelector('.avatar');
        if(avatar) avatar.innerText = data.session.user.email.substring(0, 2).toUpperCase();
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

// --- Funções da Tabela ---

async function carregarSgq() {
    const tbody = document.getElementById('lista-sgq');
    const loading = document.getElementById('loading-msg');
    const empty = document.getElementById('empty-state-msg');
    
    if(!tbody) return;
    tbody.innerHTML = '';
    if(loading) loading.style.display = 'block';

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
        console.error('Erro:', err);
        if (loading) loading.style.display = 'none';
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:red;">Erro ao carregar dados do Supabase.</td></tr>`;
    }
}

function renderizarTabela(lista) {
    const tbody = document.getElementById('lista-sgq');
    lista.forEach(item => {
        let dataFormatada = item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-';
        
        let statusClass = 'status-calibracao';
        const st = (item.status || '').toLowerCase();
        if (st.includes('aprovado') || st.includes('ok')) statusClass = 'status-conforme';
        else if (st.includes('rejeitado')) statusClass = 'status-nao-conforme';
        
        const row = `
            <tr>
                <td><strong>${item.codigo || '--'}</strong></td>
                <td>
                    <div style="display:flex; flex-direction:column;">
                        <span>${item.equipamento || 'Sem Nome'}</span>
                        ${item.arquivo_nome ? `<small style="color:orange;">${item.arquivo_nome}</small>` : ''}
                    </div>
                </td>
                <td>${item.requisicao || '-'}</td>
                <td>${item.nota_fiscal || '-'}</td>
                <td>${item.setor || '-'}</td>
                <td>${dataFormatada}</td>
                <td><span class="status-badge ${statusClass}">${item.status || 'Pendente'}</span></td>
                <td style="text-align: right;">
                    <button class="btn-icon" onclick="alert('ID: ${item.id}')"><span class="material-icons-outlined">visibility</span></button>
                </td>
            </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function filtrarTabela(texto) {
    const rows = document.querySelectorAll('#lista-sgq tr');
    const term = texto.toUpperCase();
    rows.forEach(row => {
        row.style.display = row.innerText.toUpperCase().includes(term) ? '' : 'none';
    });
}

// --- Funções de UI Sidebar ---

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