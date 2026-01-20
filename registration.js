document.addEventListener('DOMContentLoaded', () => {
    // Fecha menus se clicar fora
    window.addEventListener('click', function(e) {
        if (!e.target.closest('.action-menu-container')) {
            fecharTodosMenus();
        }
    });
});

// --- DADOS SIMULADOS (PERSISTENTES) ---
const dbLocal = {
    'Almoxarifado': [
        { id: 1, grupo: 'Escritório', codigo: 'MAT-001', descricao: 'Papel A4 Chamex', unidade: 'CX', preco: '25.00', bloqueado: false },
        { id: 2, grupo: 'Escritório', codigo: 'MAT-002', descricao: 'Caneta Azul Bic', unidade: 'UN', preco: '1.50', bloqueado: false },
        { id: 3, grupo: 'EPI', codigo: 'EPI-055', descricao: 'Luva de Proteção Látex', unidade: 'PAR', preco: '12.00', bloqueado: true }
    ],
    'Ativos': [
        { id: 101, equipamento: 'Notebook Dell Latitude 5420', status: 'Ativo', bloqueado: false },
        { id: 102, equipamento: 'Monitor Samsung 24pol', status: 'Em Manutenção', bloqueado: false }
    ],
    'Fornecedores': [
        { id: 5, razao_social: 'Kalunga Comércio LTDA', cnpj: '00.000.000/0001-99', status: 'Homologado', bloqueado: false },
        { id: 6, razao_social: 'Amazon Servicos Varejo', cnpj: '11.222.333/0001-88', status: 'Pendente', bloqueado: false }
    ],
    'Transportadoras': [
        { id: 8, razao_social: 'Fedex Brasil Logistica', cnpj: '99.888.777/0001-00', status: 'Ativo', bloqueado: false }
    ],
    'Centro de Custo': [
        { id: 99, codigo: 'CC-01', descricao: 'Administrativo Sede', grupo: 'Geral', bloqueado: false },
        { id: 100, codigo: 'CC-02', descricao: 'Operacional Fábrica', grupo: 'Produção', bloqueado: false }
    ]
};

// --- FUNÇÕES DE MENU (UI) ---

function toggleNovoMenu(event) {
    if(event) event.stopPropagation();
    const menu = document.getElementById("novo-cadastro-menu");
    if(menu) menu.classList.toggle("show-menu");
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('icon-toggle-menu');
    if (sidebar) {
        sidebar.classList.toggle('sidebar-closed');
        if (sidebar.classList.contains('sidebar-closed')) {
            if(icon) icon.innerText = 'chevron_right'; 
        } else {
            if(icon) icon.innerText = 'chevron_left'; 
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

// --- CONTROLE DOS MENUS DE AÇÃO NA TABELA ---

function toggleActionMenu(id) {
    // 1. Fecha outros abertos primeiro
    const todosMenus = document.querySelectorAll('.action-dropdown-menu');
    const menuAlvo = document.getElementById(`menu-${id}`);
    
    todosMenus.forEach(menu => {
        if (menu !== menuAlvo) menu.classList.remove('show');
    });

    // 2. Alterna o atual
    if (menuAlvo) {
        menuAlvo.classList.toggle('show');
    }
}

function fecharTodosMenus() {
    const todosMenus = document.querySelectorAll('.action-dropdown-menu');
    todosMenus.forEach(menu => menu.classList.remove('show'));
}

// --- LÓGICA DE LISTAGEM ---

function carregarLista(nomeModulo, element) {
    if(element) {
        document.querySelectorAll('.sidebar-local a').forEach(link => link.classList.remove('active'));
        element.classList.add('active');
    }

    const titulo = document.getElementById('titulo-pagina');
    if(titulo) titulo.innerText = nomeModulo;

    atualizarCabecalhoTabela(nomeModulo);

    const dadosLocais = dbLocal[nomeModulo] || [];
    const tbody = document.getElementById('lista-dados');
    const msgVazio = document.getElementById('msg-vazio');
    
    let htmlFinal = '';

    if (!dadosLocais || dadosLocais.length === 0) {
        if(tbody) tbody.innerHTML = '';
        if(msgVazio) {
            msgVazio.style.display = 'block';
            msgVazio.innerText = 'Nenhum registro encontrado.';
        }
    } else {
        if(msgVazio) msgVazio.style.display = 'none';
        dadosLocais.forEach(item => {
            htmlFinal += montarLinhaTabela(nomeModulo, item);
        });
        if(tbody) tbody.innerHTML = htmlFinal;
    }
}

function atualizarCabecalhoTabela(modulo) {
    const theadRow = document.getElementById('tabela-head-row');
    if (!theadRow) return;

    let html = '';
    // Coluna ações pequena
    const thAcoes = '<th style="width: 60px; text-align: center;"></th>';

    if (modulo === 'Centro de Custo') {
        html = `<th style="width: 80px;">ID</th><th>Código</th><th>Descrição</th><th>Grupo</th>${thAcoes}`;
    } 
    else if (modulo === 'Almoxarifado') {
        html = `<th style="width: 80px;">ID</th><th>Grupo</th><th>Código</th><th style="width: 30%;">Descrição</th><th>Unidade / Preço</th>${thAcoes}`;
    } 
    else if (modulo === 'Ativos') {
        html = `<th style="width: 80px;">ID</th><th style="width: 50%;">Equipamento / Ativo</th><th>Status</th>${thAcoes}`;
    } 
    else if (modulo === 'Fornecedores' || modulo === 'Transportadoras') {
        html = `<th style="width: 80px;">ID</th><th>CNPJ</th><th style="width: 40%;">Razão Social</th><th>Status</th>${thAcoes}`;
    }
    theadRow.innerHTML = html;
}

function montarLinhaTabela(modulo, item) {
    const isBlocked = item.bloqueado === true;
    const rowClass = isBlocked ? 'row-blocked' : '';
    
    // Texto e ícone do bloqueio dinâmico
    const labelBloqueio = isBlocked ? 'Desbloquear' : 'Bloquear';
    const iconBloqueio = isBlocked ? 'lock_open' : 'lock';

    // HTML do Dropdown Menu
    const actionsHtml = `
        <div class="action-menu-container">
            <button class="btn-more-actions" onclick="toggleActionMenu(${item.id})">
                <span class="material-icons-outlined">more_horiz</span>
            </button>
            <div id="menu-${item.id}" class="action-dropdown-menu">
                <button class="action-item" onclick="editarItem('${modulo}', ${item.id})">
                    <span class="material-icons-outlined">edit</span> Editar
                </button>
                <button class="action-item" onclick="alternarBloqueio('${modulo}', ${item.id})">
                    <span class="material-icons-outlined">${iconBloqueio}</span> ${labelBloqueio}
                </button>
                <div style="height:1px; background:#f3f4f6; margin:4px 0;"></div>
                <button class="action-item danger-item" onclick="deletarItem('${modulo}', ${item.id})">
                    <span class="material-icons-outlined">delete</span> Excluir
                </button>
            </div>
        </div>
    `;

    let cols = '';
    // Montagem das colunas (igual anterior)
    if (modulo === 'Centro de Custo') {
        cols = `<td class="col-id">#${item.id}</td><td><strong>${item.codigo}</strong></td><td>${item.descricao}</td><td><span class="badge-grupo">${item.grupo}</span></td><td style="text-align: center;">${actionsHtml}</td>`;
    } 
    else if (modulo === 'Almoxarifado') {
        cols = `<td class="col-id">#${item.id}</td><td>${item.grupo}</td><td><strong>${item.codigo}</strong></td><td>${item.descricao}</td><td>${item.unidade} - R$ ${item.preco}</td><td style="text-align: center;">${actionsHtml}</td>`;
    } 
    else if (modulo === 'Ativos') {
        const colorStatus = item.status === 'Ativo' ? '#059669' : '#D97706';
        const bgStatus = item.status === 'Ativo' ? '#D1FAE5' : '#FEF3C7';
        cols = `<td class="col-id">#${item.id}</td><td><strong>${item.equipamento}</strong></td><td><span style="color:${colorStatus}; background:${bgStatus}; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${item.status}</span></td><td style="text-align: center;">${actionsHtml}</td>`;
    }
    else if (modulo === 'Fornecedores' || modulo === 'Transportadoras') {
        const colorStatus = item.status === 'Homologado' || item.status === 'Ativo' ? '#059669' : '#4B5563';
        const bgStatus = item.status === 'Homologado' || item.status === 'Ativo' ? '#D1FAE5' : '#F3F4F6';
        cols = `<td class="col-id">#${item.id}</td><td>${item.cnpj}</td><td><strong>${item.razao_social}</strong></td><td><span style="color:${colorStatus}; background:${bgStatus}; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${item.status}</span></td><td style="text-align: center;">${actionsHtml}</td>`;
    }

    return `<tr class="${rowClass}">${cols}</tr>`;
}

// --- LÓGICA DO MODAL PERSONALIZADO ---

function showModal(title, message, type, onConfirm) {
    const modal = document.getElementById('modal-global');
    const elTitle = document.getElementById('modal-title');
    const elMsg = document.getElementById('modal-message');
    const elIcon = document.getElementById('modal-icon');
    const btnConfirm = document.getElementById('btn-modal-confirm');
    const btnCancel = document.getElementById('btn-modal-cancel');

    if(!modal) return;

    elTitle.innerText = title;
    elMsg.innerText = message;
    
    // Configurar Estilo (Perigo ou Aviso)
    if (type === 'danger') {
        elIcon.style.color = '#EF4444'; // Vermelho
        elIcon.innerText = 'delete_forever';
        btnConfirm.className = 'btn-danger';
        btnConfirm.innerText = 'Sim, excluir';
    } else {
        elIcon.style.color = '#F59E0B'; // Laranja
        elIcon.innerText = 'warning_amber';
        btnConfirm.className = 'btn-primary'; 
        btnConfirm.style.backgroundColor = '#E67E22';
        btnConfirm.innerText = 'Confirmar';
    }

    // Limpa eventos anteriores (para não acumular clicks)
    const newBtnConfirm = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);
    
    const newBtnCancel = btnCancel.cloneNode(true);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

    // Eventos
    newBtnConfirm.addEventListener('click', () => {
        if(onConfirm) onConfirm();
        modal.classList.add('hidden');
    });

    newBtnCancel.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Exibir
    modal.classList.remove('hidden');
    fecharTodosMenus(); // Fecha o dropdown se estiver aberto
}

// --- AÇÕES DOS ITENS ---

function editarItem(modulo, id) {
    const mapaTipos = {
        'Almoxarifado': 'almoxarifado',
        'Ativos': 'ativos',
        'Fornecedores': 'fornecedores',
        'Transportadoras': 'transportadoras',
        'Centro de Custo': 'centro_custo'
    };
    const tipoUrl = mapaTipos[modulo];
    if (tipoUrl) {
        window.location.href = `productalm.html?type=${tipoUrl}&edit_id=${id}`;
    }
}

function alternarBloqueio(modulo, id) {
    const item = dbLocal[modulo].find(d => d.id === id);
    if (!item) return;

    const acao = item.bloqueado ? 'desbloquear' : 'bloquear';
    
    showModal(
        `Confirmar ${acao}?`,
        `Deseja realmente ${acao} o registro #${id}?`,
        'warning',
        () => {
            item.bloqueado = !item.bloqueado;
            carregarLista(modulo, null); // Recarrega para atualizar UI
        }
    );
}

function deletarItem(modulo, id) {
    showModal(
        'Excluir registro?',
        `Tem certeza que deseja remover o item #${id} permanentemente? Essa ação não pode ser desfeita.`,
        'danger',
        () => {
            dbLocal[modulo] = dbLocal[modulo].filter(item => item.id !== id);
            carregarLista(modulo, null);
        }
    );
}