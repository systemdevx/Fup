document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    carregarCatalogoProdutos();
});

// Dados Reais do Catálogo
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
                        <button onclick="verHistorico('${item.id_sistema}')">
                            <span class="material-icons-outlined">history</span> Histórico de Alteração
                        </button>
                        <div class="dropdown-divider"></div>
                        <button onclick="alterarStatusProduto('${item.id_sistema}', '${eAtivo ? 'bloqueado' : 'ativo'}')" class="${eAtivo ? 'danger-action' : ''}">
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

function alternarMenuDropdown(event, id) {
    event.stopPropagation();
    const todosMenus = document.querySelectorAll('.dropdown-content');
    todosMenus.forEach(menu => {
        if(menu.id !== `menu-${id}`) menu.classList.remove('show');
    });
    document.getElementById(`menu-${id}`).classList.toggle('show');
}

function alterarStatusProduto(id, novoStatus) {
    const produto = listaProdutos.find(p => p.id_sistema === id);
    if (produto) {
        produto.status_item = novoStatus;
        carregarCatalogoProdutos();
        const mensagem = novoStatus === 'ativo' ? 'Produto desbloqueado!' : 'Produto bloqueado com sucesso!';
        mostrarNotificacao(mensagem);
    }
}

function verHistorico(id) {
    mostrarNotificacao(`Carregando histórico do item ${id}...`);
    // Aqui seria implementada a abertura do modal de histórico real
}

function mostrarNotificacao(mensagem) {
    const toast = document.getElementById('toast');
    const toastMsg = toast.querySelector('.toast-message');
    toastMsg.textContent = mensagem;
    toast.classList.add('toast-visible');
    setTimeout(() => { toast.classList.remove('toast-visible'); }, 3000);
}

function editarProduto(id) {
    localStorage.setItem('controle_modo_edicao', 'true');
    window.location.href = 'formeprodut.html';
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
};