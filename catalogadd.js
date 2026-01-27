document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    carregarCatalogoEquipamentos();
});

let listaEquipamentos = [
    { id_sistema: 'EQ-8550', data_cadastro: '27/01/2026', codigo: 'EQ-001', descricao_equipamento: 'COMPRESSOR DE AR INDUSTRIAL 10HP', unidade_medida: 'UN', grupo_equipamento: 'AI', referencia_erp: 'MERCADO ELETRÔNICO', status_item: 'ativo' }
];

function carregarCatalogoEquipamentos() {
    const tabelaBody = document.getElementById('corpo-tabela-equipamentos');
    if(!tabelaBody) return;
    tabelaBody.innerHTML = '';

    listaEquipamentos.forEach(item => {
        const linha = document.createElement('tr');
        const eAtivo = item.status_item === 'ativo';
        const statusBadge = eAtivo 
            ? '<span class="status-badge status-ativo">Ativo</span>' 
            : '<span class="status-badge status-bloqueado">Bloqueado</span>';

        linha.innerHTML = `
            <td style="color:#666; font-size:11px;">${item.id_sistema}</td>
            <td style="font-size:12px;">${item.data_cadastro}</td>
            <td style="font-weight:600; color:#555;">${item.codigo}</td>
            <td>${item.descricao_equipamento}</td>
            <td>${item.unidade_medida}</td>
            <td>${item.grupo_equipamento}</td>
            <td>${item.referencia_erp}</td>
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
function verHistoricoEquipamento(id) {
    const modalHistory = document.getElementById('modal-history');
    const tbody = document.getElementById('lista-historico');
    document.getElementById('hist-id-display').textContent = `(${id})`;
    
    tbody.innerHTML = ''; // Limpa tabela antiga

    // Dados Mockados (Simulação de Backend)
    const historicoMock = [
        { data: '27/01/2026 14:30', usuario: 'Admin', acao: 'Edição de Cadastro', tipo: 'edit' },
        { data: '25/01/2026 09:15', usuario: 'Sup. Almox', acao: 'Desbloqueio de Item', tipo: 'create' },
        { data: '24/01/2026 18:00', usuario: 'Sistema', acao: 'Bloqueio Automático', tipo: 'block' },
        { data: '20/01/2026 10:00', usuario: 'Admin', acao: 'Criação do Item', tipo: 'create' }
    ];

    historicoMock.forEach(log => {
        const tr = document.createElement('tr');
        
        // Define a classe da tag baseada no tipo
        let tagClass = 'hist-create';
        if(log.tipo === 'block') tagClass = 'hist-block';
        if(log.tipo === 'edit') tagClass = 'hist-edit';

        tr.innerHTML = `
            <td style="color:#555;">${log.data}</td>
            <td style="font-weight:600;">${log.usuario}</td>
            <td><span class="hist-tag ${tagClass}">${log.acao}</span></td>
        `;
        tbody.appendChild(tr);
    });

    modalHistory.style.display = 'flex';
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

function executarAlteracaoStatus(id, novoStatus) {
    const equipamento = listaEquipamentos.find(e => e.id_sistema === id);
    if (equipamento) {
        equipamento.status_item = novoStatus;
        carregarCatalogoEquipamentos();
        
        if (novoStatus === 'ativo') {
            mostrarNotificacao('Item desbloqueado com sucesso!', 'success');
        } else {
            mostrarNotificacao('Item bloqueado com sucesso!', 'danger');
        }
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
    document.getElementById(`menu-${id}`).classList.toggle('show');
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
    // Fecha o modal se clicar fora (no overlay escuro)
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(m => {
        // Isso requer cuidado para não fechar ao clicar dentro da caixa, 
        // mas por segurança, deixei o fechar apenas no botão X.
    });
};