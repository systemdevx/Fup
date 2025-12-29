document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÕES ---
    const columnConfigs = {
        ativo: `<tr><th width="10%">Nº Ordem</th><th>Descrição / Justificativa</th><th>Data Criação</th><th>Solicitante</th><th width="60px" style="text-align: right;">Ações</th></tr>`,
        fornecedor: `<tr><th width="10%">Nº Ordem</th><th>Razão Social</th><th>CNPJ</th><th>Nacionalidade</th><th>Data Criação</th><th>Solicitante</th><th width="60px" style="text-align: right;">Ações</th></tr>`,
        itens: `<tr><th width="10%">Nº Ordem</th><th width="8%">Grupo</th><th>Código</th><th>Descrição do Item</th><th width="8%">Unidade</th><th>Solicitante</th><th width="60px" style="text-align: right;">Ações</th></tr>`
    };

    const menus = {
        cadastros: [ { id: 'ativo', label: 'Cadastro Ativos' }, { id: 'fornecedor', label: 'Cadastro Fornecedores' }, { id: 'itens', label: 'Cadastro Itens' } ],
        bloqueio: [ { id: 'ativo', label: 'Bloqueio Ativos' }, { id: 'fornecedor', label: 'Bloqueio Fornecedores' }, { id: 'itens', label: 'Bloqueio Itens' } ],
        alteracoes: [ { id: 'ativo', label: 'Alterações Ativos' }, { id: 'fornecedor', label: 'Alterações Fornecedores' }, { id: 'itens', label: 'Alterações Itens' } ]
    };

    // Referências DOM
    const mainTabs = document.querySelectorAll('.tab-btn');
    const subContainer = document.getElementById('sub-filter-container');
    const theadContainer = document.getElementById('dynamic-thead');
    const tableBody = document.getElementById('tabela-aprovacoes');

    // Filtros DOM
    const filterSelect = document.getElementById('filter-type');
    const inputMonth = document.getElementById('input-month');
    const inputYear = document.getElementById('input-year');
    const inputSingle = document.getElementById('input-single-date');
    const inputRange = document.getElementById('input-range-date');
    const btnApplyFilter = document.getElementById('btn-apply-filter');

    // Modal DOM
    const modal = document.getElementById('modal-acao');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalInputArea = document.getElementById('modal-input-area');
    const modalTextArea = document.getElementById('modal-reason');
    const btnConfirm = document.getElementById('btn-modal-confirm');
    const btnCancel = document.getElementById('btn-modal-cancel');
    const btnClose = document.getElementById('btn-modal-close');

    let currentMain = 'cadastros';
    let currentSub = 'ativo';
    let counts = {};
    let currentRow = null;
    let currentActionType = null;

    // --- FILTROS DE DATA ---
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            // 1. Oculta Todos
            inputMonth.classList.add('hidden');
            inputYear.classList.add('hidden');
            inputSingle.classList.add('hidden');
            inputRange.classList.add('hidden');
            btnApplyFilter.classList.add('hidden');

            // 2. Mostra Específico
            if (val === 'month') {
                inputMonth.classList.remove('hidden');
                btnApplyFilter.classList.remove('hidden');
            } else if (val === 'year') {
                inputYear.classList.remove('hidden');
                btnApplyFilter.classList.remove('hidden');
            } else if (val === 'date') {
                inputSingle.classList.remove('hidden');
                btnApplyFilter.classList.remove('hidden');
            } else if (val === 'range') {
                inputRange.classList.remove('hidden');
                btnApplyFilter.classList.remove('hidden');
            }
        });
    }

    // --- FUNÇÕES DE TABELA ---
    function updateTableHeaders(subType) {
        theadContainer.innerHTML = columnConfigs[subType] || columnConfigs['ativo'];
    }

    function renderTableRows() {
        tableBody.innerHTML = '';
        let items = [];
        
        // Dados de Exemplo
        if (currentMain === 'cadastros' && currentSub === 'ativo') {
            items = [
                { id: 'P-010', desc: 'Notebook Dell Latitude 5420', date: '12/12/2025', user: 'João Silva' },
                { id: 'P-011', desc: 'Monitor Samsung 24"', date: '13/12/2025', user: 'Ana RH' }
            ];
        } else if (currentMain === 'cadastros' && currentSub === 'fornecedor') {
            items = [{ id: 'P-012', desc: 'Tech Solutions Ltda', date: '10/12/2025', user: 'Maria Compras' }];
        } else if (currentMain === 'cadastros' && currentSub === 'itens') {
            items = [{ id: 'P-013', desc: 'Cabo HDMI 2.0', date: '11/12/2025', user: 'Almoxarifado' }];
        } else if (currentMain === 'bloqueio') {
            items = [{ id: 'P-014', desc: 'Monitor LG (Avaria)', date: '20/12/2025', user: 'Suporte TI' }];
        }

        // Renderiza
        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="ordem-id">${item.id}</span></td>
                <td><strong>${item.desc}</strong></td>
                <td>${item.date}</td>
                <td>${item.user}</td>
                <td class="actions-cell">
                    <div class="action-dropdown">
                        <button class="btn-more" title="Ações">⋮</button>
                        <div class="dropdown-menu hidden">
                            <button class="menu-item item-forward">Reencaminhar</button>
                            <button class="menu-item item-reject">Recusar</button>
                            <div class="dropdown-divider"></div>
                            <button class="menu-item item-approve">Aprovar</button>
                        </div>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
        calculateCounts();
    }

    function calculateCounts() {
        const total = tableBody.children.length;
        mainTabs.forEach(t => {
            const m = t.getAttribute('data-main');
            const b = t.querySelector('.counter-badge');
            if(m === currentMain && b) b.innerText = total;
            else if(b) b.innerText = 0;
        });
        document.querySelectorAll('.pill').forEach(p => {
            const s = p.getAttribute('data-sub');
            const b = p.querySelector('.counter-badge');
            if(s === currentSub && b) b.innerText = total;
            else if(b) b.innerText = 0;
        });
    }

    function renderSubFilters(mainKey) {
        subContainer.innerHTML = '';
        menus[mainKey].forEach((item, i) => {
            const btn = document.createElement('button');
            btn.className = 'pill';
            btn.innerHTML = `${item.label} <span class="counter-badge">0</span>`;
            btn.setAttribute('data-sub', item.id);
            if(i===0) { btn.classList.add('active'); currentSub = item.id; }
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
                btn.classList.add('active');
                currentSub = item.id;
                updateTableHeaders(currentSub);
                renderTableRows();
            });
            subContainer.appendChild(btn);
        });
        updateTableHeaders(currentSub);
        renderTableRows();
    }

    // --- DROPDOWN & MODAL ---
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(el => el.classList.add('hidden'));
        }
    });

    tableBody.addEventListener('click', (e) => {
        const btnMore = e.target.closest('.btn-more');
        if (btnMore) {
            e.stopPropagation();
            const dropdown = btnMore.nextElementSibling;
            document.querySelectorAll('.dropdown-menu').forEach(el => {
                if(el !== dropdown) el.classList.add('hidden');
            });
            dropdown.classList.toggle('hidden');
            return;
        }
        const btnAction = e.target.closest('.menu-item');
        if (btnAction) {
            const row = btnAction.closest('tr');
            btnAction.closest('.dropdown-menu').classList.add('hidden');
            if(btnAction.classList.contains('item-approve')) openModal('approve', row);
            if(btnAction.classList.contains('item-forward')) openModal('forward', row);
            if(btnAction.classList.contains('item-reject')) openModal('reject', row);
        }
    });

    function openModal(actionType, row) {
        currentRow = row;
        currentActionType = actionType;
        modal.classList.remove('hidden');
        modalTextArea.value = '';
        modalInputArea.classList.add('hidden');
        btnConfirm.className = 'btn-primary-modal';

        const descText = row.querySelectorAll('td')[1].innerText;

        if (actionType === 'approve') {
            modalTitle.innerText = "Confirmar Aprovação";
            modalDesc.innerHTML = `Deseja aprovar <strong>${descText}</strong>?`;
            btnConfirm.innerText = "Sim, Aprovar";
            btnConfirm.classList.add('type-approve');
        } else if (actionType === 'forward') {
            modalTitle.innerText = "Reencaminhar";
            modalDesc.innerText = "Justifique o reencaminhamento:";
            modalInputArea.classList.remove('hidden');
            btnConfirm.innerText = "Confirmar";
            btnConfirm.classList.add('type-forward');
        } else if (actionType === 'reject') {
            modalTitle.innerText = "Recusar";
            modalDesc.innerText = "Motivo da recusa:";
            modalInputArea.classList.remove('hidden');
            btnConfirm.innerText = "Recusar";
            btnConfirm.classList.add('type-reject');
        }
    }

    function confirmAction() {
        if(!currentRow) return;
        if (currentActionType !== 'approve' && modalTextArea.value.trim() === "") {
            alert("Preencha o campo de texto.");
            return;
        }
        modal.classList.add('hidden');
        currentRow.style.backgroundColor = currentActionType === 'approve' ? '#ecfdf5' : '#fef2f2';
        setTimeout(() => { currentRow.remove(); calculateCounts(); }, 300);
    }

    mainTabs.forEach(t => t.addEventListener('click', () => {
        mainTabs.forEach(tab => tab.classList.remove('active'));
        t.classList.add('active');
        currentMain = t.getAttribute('data-main');
        renderSubFilters(currentMain);
    }));

    btnConfirm.onclick = confirmAction;
    btnCancel.onclick = () => modal.classList.add('hidden');
    btnClose.onclick = () => modal.classList.add('hidden');

    renderSubFilters('cadastros');
});