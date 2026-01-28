document.addEventListener('DOMContentLoaded', () => {
    // Remove a invisibilidade do body agora que o script carregou
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    carregarCatalogoProdutos();
});

// Dados Mockados do Catálogo de Produtos
let listaProdutos = [
    { 
        id_sistema: 'PROD-1050', 
        data_cadastro: '27/01/2026', 
        codigo: 'MAT-1050', 
        descricao_produto: 'PAPEL A4 75G RECICLADO', 
        unidade_medida: 'CX', 
        grupo_material: 'AX', 
        referencia_erp: 'MERCADO ELETRÔNICO', 
        status_item: 'ativo' 
    },
    { 
        id_sistema: 'PROD-1051', 
        data_cadastro: '26/01/2026', 
        codigo: 'MAT-2000', 
        descricao_produto: 'CANETA ESFEROGRÁFICA AZUL (CX 50)', 
        unidade_medida: 'CX', 
        grupo_material: 'AX', 
        referencia_erp: 'MERCADO ELETRÔNICO', 
        status_item: 'bloqueado' 
    }
];

function carregarCatalogoProdutos() {
    const tabelaBody = document.getElementById('corpo-tabela-produtos');
    if(!tabelaBody) return;
    tabelaBody.innerHTML = '';
    
    listaProdutos.forEach(item => {
        const linha = document.createElement('tr');
        const eAtivo = item.status_item === 'ativo';
        const statusBadge = eAtivo 
            ? '<span class="status-badge status-ativo">Ativo</span>' 
            : '<span class="status-badge status-bloqueado">Bloqueado</span>';

        linha.innerHTML = `
            <td style="color:#666; font-size:11px;">${item.id_sistema}</td>
            <td style="font-size:12px;">${item.data_cadastro}</td>
            <td style="font-weight:600; color:#555;">${item.codigo}</td>
            <td>${item.descricao_produto}</td>
            <td>${item.unidade_medida}</td>
            <td>${item.grupo_material}</td>
            <td>${item.referencia_erp}</td>
            <td>${statusBadge}</td>
            <td class="action-col">
                <div class="dropdown-container">
                    <button class="btn-icon-more" onclick="alternarMenuDropdown(event, '${item.id_sistema}')">
                        <span class="material-icons-outlined">more_vert</span>
                    </button>
                    <div id="menu-${item.id_sistema}" class="dropdown-content">
                        <button onclick="editarProduto('${item.id_sistema}')">
                            <span class="material-icons-outlined">edit</span> Editar Cadastro
                        </button>
                        <button onclick="verHistoricoProduto('${item.id_sistema}')">
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

// --- Funções de Dropdown ---
function alternarMenuDropdown(event, id) {
    event.stopPropagation();
    const todosMenus = document.querySelectorAll('.dropdown-content');
    todosMenus.forEach(menu => {
        if(menu.id !== `menu-${id}`) menu.classList.remove('show');
    });
    
    const menuAlvo = document.getElementById(`menu-${id}`);
    if (menuAlvo) {
        menuAlvo.classList.toggle('show');
    }
}

// --- Funções de Edição ---
function editarProduto(id) {
    // Redireciona via URL Parameter para manter consistência com formequipt
    window.location.href = `formeprodut.html?id=${id}`;
}

// --- Funções de Histórico ---
function verHistoricoProduto(id) {
    const modalHistory = document.getElementById('modal-history');
    const tbody = document.getElementById('lista-historico');
    document.getElementById('hist-id-display').textContent = `(${id})`;
    
    if(tbody) tbody.innerHTML = ''; // Limpa tabela antiga

    // Dados Mockados (Simulação)
    const historicoMock = [
        { data: '27/01/2026 14:30', usuario: 'Admin', acao: 'Edição de Cadastro', tipo: 'edit' },
        { data: '25/01/2026 09:15', usuario: 'Almoxarife', acao: 'Desbloqueio de Item', tipo: 'create' },
        { data: '24/01/2026 18:00', usuario: 'Sistema', acao: 'Criação Automática', tipo: 'create' }
    ];

    historicoMock.forEach(log => {
        const tr = document.createElement('tr');
        
        let tagClass = 'hist-create';
        if(log.tipo === 'block') tagClass = 'hist-block';
        if(log.tipo === 'edit') tagClass = 'hist-edit';

        tr.innerHTML = `
            <td style="color:#555;">${log.data}</td>
            <td style="font-weight:600;">${log.usuario}</td>
            <td><span class="hist-tag ${tagClass}">${log.acao}</span></td>
        `;
        if(tbody) tbody.appendChild(tr);
    });

    if(modalHistory) modalHistory.style.display = 'flex';
}

function fecharModalHistorico() {
    const modal = document.getElementById('modal-history');
    if(modal) modal.style.display = 'none';
}

// --- Funções de Confirmação de Status ---
function solicitarConfirmacaoStatus(id, novoStatus) {
    const modal = document.getElementById('modal-confirm-action');
    const btnConfirm = document.getElementById('btn-confirm-execute');
    const txt = novoStatus === 'ativo' ? 'desbloquear' : 'bloquear';
    
    document.getElementById('modal-title').textContent = "Confirmar Alteração";
    document.getElementById('modal-text').textContent = `Deseja realmente ${txt} o produto ${id}?`;
    
    if(modal) modal.style.display = 'flex';
    
    if(btnConfirm) {
        btnConfirm.onclick = () => {
            executarAlteracaoStatus(id, novoStatus);
            fecharModalConfirmacao();
        };
    }
}

function fecharModalConfirmacao() {
    const modal = document.getElementById('modal-confirm-action');
    if(modal) modal.style.display = 'none';
}

function executarAlteracaoStatus(id, novoStatus) {
    const produto = listaProdutos.find(p => p.id_sistema === id);
    if (produto) {
        produto.status_item = novoStatus;
        carregarCatalogoProdutos();
        
        if (novoStatus === 'ativo') {
            mostrarNotificacao('Produto desbloqueado com sucesso!', 'success');
        } else {
            mostrarNotificacao('Produto bloqueado com sucesso!', 'danger');
        }
    }
}

// --- Utilitários ---
function mostrarNotificacao(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    if(!toast) return;

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

function toggleSidebar() { 
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.toggle('sidebar-closed'); 
}

function toggleGroup(header) {
    const lista = header.parentElement.querySelector('.group-list');
    lista.style.display = (lista.style.display === 'none' || lista.style.display === '') ? 'flex' : 'none';
}

window.onclick = function() {
    document.querySelectorAll('.dropdown-content').forEach(m => m.classList.remove('show'));
};