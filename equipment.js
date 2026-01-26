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
    carregarEquipamentos();
});

async function checkSession() {
    if (!supabaseClient) return;
    const { data } = await supabaseClient.auth.getSession();
    if (!data || !data.session) {
        window.location.href = 'login.html';
        return;
    }
    iniciarMonitoramentoInatividade();
    if (data.session.user) {
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
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
}

async function carregarEquipamentos() {
    const tbody = document.getElementById('lista-equipamentos');
    const loading = document.getElementById('loading-msg');
    const empty = document.getElementById('empty-state-msg');

    if(!tbody) return;
    tbody.innerHTML = '';
    if(loading) loading.style.display = 'block';
    if(empty) empty.style.display = 'none';

    try {
        const { data, error } = await supabaseClient
            .from('equipamentos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        if(loading) loading.style.display = 'none';

        if (!data || data.length === 0) {
            if(empty) empty.style.display = 'block';
            return;
        }
        renderizarTabela(data);
    } catch (err) {
        console.error(err);
        if(loading) loading.style.display = 'none';
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#999;">Sem dados ou erro de conexão.</td></tr>`;
    }
}

function renderizarTabela(lista) {
    const tbody = document.getElementById('lista-equipamentos');
    lista.forEach(item => {
        let statusClass = 'status-ativo';
        if(item.status === 'MANUTENCAO') statusClass = 'status-manutencao';
        if(item.status === 'INATIVO') statusClass = 'status-inativo';

        const row = `
            <tr>
                <td><strong>${item.codigo}</strong></td>
                <td>${item.nome}</td>
                <td style="color:#666;">${item.tipo}</td>
                <td>${item.modelo || '-'}</td>
                <td><span class="${statusClass}">${item.status}</span></td>
                <td style="text-align: right;">
                    <button class="btn-icon" title="Excluir" onclick="excluirEquipamento(${item.id})"><span class="material-icons-outlined">delete</span></button>
                </td>
            </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

async function salvarEquipamento() {
    const codigo = document.getElementById('eq-codigo').value.toUpperCase();
    const nome = document.getElementById('eq-nome').value.toUpperCase();
    const tipo = document.getElementById('eq-tipo').value;
    const modelo = document.getElementById('eq-modelo').value.toUpperCase();
    const status = document.getElementById('eq-status').value;

    if(!codigo || !nome) { alert("Preencha Código e Nome!"); return; }

    try {
        const { error } = await supabaseClient
            .from('equipamentos')
            .insert([{ codigo, nome, tipo, modelo, status }]);
        if (error) throw error;
        fecharModalEquipamento();
        carregarEquipamentos();
        alert("Equipamento salvo!");
    } catch (err) {
        alert("Erro ao salvar: " + err.message);
    }
}

async function excluirEquipamento(id) {
    if(!confirm("Deseja excluir?")) return;
    try {
        const { error } = await supabaseClient.from('equipamentos').delete().eq('id', id);
        if (error) throw error;
        carregarEquipamentos();
    } catch (err) { alert("Erro ao excluir: " + err.message); }
}

function filtrarTabela(texto) {
    const rows = document.querySelectorAll('#lista-equipamentos tr');
    const term = texto.toUpperCase();
    rows.forEach(row => {
        row.style.display = row.innerText.toUpperCase().includes(term) ? '' : 'none';
    });
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('sidebar-closed'); }
function toggleGroup(header) {
    const list = header.nextElementSibling;
    if(list) list.style.display = (list.style.display === 'none') ? 'flex' : 'none';
}
function abrirModalEquipamento() { document.getElementById('modal-equipamento').style.display = 'flex'; }
function fecharModalEquipamento() { 
    document.getElementById('modal-equipamento').style.display = 'none'; 
    document.getElementById('form-equipamento').reset();
}