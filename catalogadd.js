// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'COLOQUE_SUA_URL_AQUI';
const SUPABASE_KEY = 'COLOQUE_SUA_ANON_KEY_AQUI';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// -----------------------------

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    carregarCatalogoEquipamentos();
});

// Helpers de formatação
const formatData = (dataISO) => {
    if (!dataISO) return '-';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
};

const formatDataHora = (isoString) => {
    const data = new Date(isoString);
    return data.toLocaleString('pt-BR');
};

async function carregarCatalogoEquipamentos() {
    const tabelaBody = document.getElementById('corpo-tabela-equipamentos');
    if(!tabelaBody) return;
    
    tabelaBody.innerHTML = '<tr><td colspan="9" style="text-align:center">Carregando dados...</td></tr>';

    // SELECT no Supabase
    const { data: listaEquipamentos, error } = await supabase
        .from('equipamentos')
        .select('*')
        .order('created_at', { ascending: false });

    tabelaBody.innerHTML = '';

    if (error) {
        console.error('Erro Supabase:', error);
        mostrarNotificacao('Erro ao conectar com banco de dados', 'danger');
        return;
    }

    if (!listaEquipamentos || listaEquipamentos.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="9" style="text-align:center">Nenhum equipamento cadastrado.</td></tr>';
        return;
    }

    listaEquipamentos.forEach(item => {
        const linha = document.createElement('tr');
        const eAtivo = item.status_item === 'ativo';
        const statusBadge = eAtivo 
            ? '<span class="status-badge status-ativo">Ativo</span>' 
            : '<span class="status-badge status-bloqueado">Bloqueado</span>';

        linha.innerHTML = `
            <td style="color:#666; font-size:11px;">${item.id_sistema}</td>
            <td style="font-size:12px;">${formatData(item.data_cadastro)}</td>
            <td style="font-weight:600; color:#555;">${item.codigo}</td>
            <td>${item.descricao}</td>
            <td>${item.unidade}</td>
            <td>${item.grupo || ''}</td>
            <td>${item.ref_erp || ''}</td>
            <td>${statusBadge}</td>
            <td class="action-col">
                <div class="dropdown-container">
                    <button class="btn-icon-more" onclick="alternarMenuDropdown(event, '${item.id_sistema}')">
                        <span class="material-icons-outlined">more_vert</span>
                    </button>
                    <div id="menu-${item.id_sistema}" class="dropdown-content">
                        <button onclick="editarEquipamento('${item.id_sistema}')">
                            <span class="material-icons-outlined">edit</span> Editar Cadastro
                        </button>
                        <button onclick="verHistoricoEquipamento('${item.id_sistema}')">
                            <span class="material-icons-outlined">history</span> Histórico de Alteração
                        </button>
                        <div class="dropdown-divider"></div>
                        <button onclick="solicitarConfirmacaoStatus('${item.id_sistema}', '${eAtivo ? 'bloqueado' : 'ativo'}')" class="${eAtivo ? 'danger-action' : ''}">
                            <span class="material-icons-outlined">${eAtivo ? 'block' : 'check_circle'}</span>
                            ${eAtivo ? 'Bloquear Item' : 'Desbloquear Item'}
                        </button>
                    </div>
                </div>
            </td>
        `;
        tabelaBody.appendChild(linha);
    });
}

// --- Funções de Histórico ---
async function verHistoricoEquipamento(id) {
    const modalHistory = document.getElementById('modal-history');
    const tbody = document.getElementById('lista-historico');
    document.getElementById('hist-id-display').textContent = `(${id})`;
    
    tbody.innerHTML = '<tr><td colspan="3">Carregando histórico...</td></tr>';
    modalHistory.style.display = 'flex';

    // SELECT no Histórico
    const { data: historico, error } = await supabase
        .from('historico_equipamentos')
        .select('*')
        .eq('equipamento_id', id)
        .order('data_hora', { ascending: false });

    tbody.innerHTML = '';

    if (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="3">Erro ao carregar.</td></tr>';
        return;
    }

    if (!historico || historico.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhum histórico encontrado.</td></tr>';
        return;
    }

    historico.forEach(log => {
        const tr = document.createElement('tr');
        
        let tagClass = 'hist-create';
        if(log.tipo_badge === 'block') tagClass = 'hist-block';
        if(log.tipo_badge === 'edit') tagClass = 'hist-edit';

        tr.innerHTML = `
            <td style="color:#555;">${formatDataHora(log.data_hora)}</td>
            <td style="font-weight:600;">${log.usuario || 'Sistema'}</td>
            <td><span class="hist-tag ${tagClass}">${log.acao}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function fecharModalHistorico() {
    document.getElementById('modal-history').style.display = 'none';
}

// --- Funções de Confirmação ---
function solicitarConfirmacaoStatus(id, novoStatus) {
    const modal = document.getElementById('modal-confirm-action');
    const btnConfirm = document.getElementById('btn-confirm-execute');
    const txt = novoStatus === 'ativo' ? 'desbloquear' : 'bloquear';
    
    document.getElementById('modal-title').textContent = "Confirmar Alteração";
    document.getElementById('modal-text').textContent = `Deseja realmente ${txt} o equipamento ${id}?`;
    
    modal.style.display = 'flex';
    
    btnConfirm.onclick = () => {
        executarAlteracaoStatus(id, novoStatus);
        fecharModalConfirmacao();
    };
}

function fecharModalConfirmacao() {
    document.getElementById('modal-confirm-action').style.display = 'none';
}

async function executarAlteracaoStatus(id, novoStatus) {
    // 1. Atualiza Status
    const { error } = await supabase
        .from('equipamentos')
        .update({ status_item: novoStatus })
        .eq('id_sistema', id);

    if (error) {
        mostrarNotificacao('Erro ao atualizar status', 'danger');
        return;
    }

    // 2. Grava Log
    const acaoTexto = novoStatus === 'ativo' ? 'Desbloqueio de Item' : 'Bloqueio de Item';
    const tipoBadge = novoStatus === 'ativo' ? 'create' : 'block';
    
    await supabase.from('historico_equipamentos').insert([{
        equipamento_id: id,
        usuario: 'Admin',
        acao: acaoTexto,
        tipo_badge: tipoBadge
    }]);

    carregarCatalogoEquipamentos();
    
    if (novoStatus === 'ativo') {
        mostrarNotificacao('Item desbloqueado com sucesso!', 'success');
    } else {
        mostrarNotificacao('Item bloqueado com sucesso!', 'danger');
    }
}

function editarEquipamento(id) {
    window.location.href = `formequipt.html?id=${id}`;
}

function mostrarNotificacao(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toastMsg.textContent = mensagem;
    toastIcon.className = 'material-icons-outlined toast-icon';
    
    if (tipo === 'danger') {
        toastIcon.textContent = 'block';
        toastIcon.classList.add('type-danger');
    } else if (tipo === 'info') {
        toastIcon.textContent = 'info';
        toastIcon.classList.add('type-info');
    } else {
        toastIcon.textContent = 'check_circle';
        toastIcon.classList.add('type-success');
    }

    toast.classList.add('toast-visible');
    setTimeout(() => { toast.classList.remove('toast-visible'); }, 3000);
}

function alternarMenuDropdown(event, id) {
    event.stopPropagation();
    const todosMenus = document.querySelectorAll('.dropdown-content');
    todosMenus.forEach(menu => {
        if(menu.id !== `menu-${id}`) menu.classList.remove('show');
    });
    const menuAlvo = document.getElementById(`menu-${id}`);
    if(menuAlvo) menuAlvo.classList.toggle('show');
}

function toggleSidebar() { 
    document.getElementById('sidebar').classList.toggle('sidebar-closed'); 
}

function toggleGroup(header) {
    const lista = header.parentElement.querySelector('.group-list');
    lista.style.display = (lista.style.display === 'none' || lista.style.display === '') ? 'flex' : 'none';
}

window.onclick = function() {
    document.querySelectorAll('.dropdown-content').forEach(m => m.classList.remove('show'));
    const modals = document.querySelectorAll('.modal-overlay');
};