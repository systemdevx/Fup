document.addEventListener('DOMContentLoaded', () => {
    
    // DADOS MOCKADOS
    const mockData = [
        { id: 1, type: 'contratos', date: '28/10/2025', desc: 'Licença Google Workspace', sub: 'Software • Mensal', method: 'Cartão Corp.', value: '- R$ 1.250,00', valRaw: '-1250', valClass: 'text-red', status: 'Pago', stClass: 'st-new' },
        { id: 2, type: 'pedidos', date: '27/10/2025', desc: 'Pagamento Cliente: Alpha Ltda', sub: 'Nota Fiscal #9920', method: 'PIX', value: '+ R$ 15.000,00', valRaw: '15000', valClass: 'text-green', status: 'Recebido', stClass: 'st-new' },
        { id: 3, type: 'pedidos', date: '26/10/2025', desc: 'Compra Periféricos', sub: 'Kabum', method: 'Boleto', value: '- R$ 450,00', valRaw: '-450', valClass: 'text-red', status: 'Pendente', stClass: 'st-urgent' }
    ];

    const gridBody = document.getElementById('grid-body');
    const tabs = document.querySelectorAll('.sub-pill');
    let currentType = 'todas';
    
    // Filtros Excel
    let activeFilters = {}; 
    let activeDropdown = null;
    const dropdownTemplate = document.getElementById('filter-dropdown-template');

    function init() {
        // Setup Abas
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentType = tab.getAttribute('data-target');
                activeFilters = {}; // Reseta filtros ao trocar aba
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active-filter'));
                renderGrid();
            });
        });

        // Setup Filtros Coluna
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFilterDropdown(btn, btn.getAttribute('data-col'));
            });
        });

        document.addEventListener('click', (e) => {
            if (activeDropdown && !activeDropdown.contains(e.target)) closeDropdown();
        });

        renderGrid();
    }

    function getTabData() {
        if(currentType === 'todas') return mockData;
        return mockData.filter(item => item.type === currentType);
    }

    function renderGrid() {
        gridBody.innerHTML = '';
        let items = getTabData();

        // Aplicar filtros de coluna
        items = items.filter(item => {
            for (const key in activeFilters) {
                if (!activeFilters[key] || activeFilters[key].length === 0) continue;
                // Busca valor. Se for composto (ex: desc + sub), simplifica para desc
                let val = item[key];
                if(key === 'desc') val = item.desc; 
                if(!activeFilters[key].includes(val)) return false;
            }
            return true;
        });

        if (items.length === 0) {
            gridBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color:#888;">Nenhum registro encontrado.</td></tr>';
            return;
        }

        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-gray">${item.date}</td>
                <td>
                    <span class="doc-id">${item.desc}</span>
                    <span class="doc-desc">${item.sub}</span>
                </td>
                <td>${item.method}</td>
                <td class="val-main ${item.valClass}">${item.value}</td>
                <td><div class="status-indicator ${item.stClass}"><span class="dot-status"></span> ${item.status}</div></td>
                <td class="col-center"><button class="btn-link">Ver</button></td>
            `;
            gridBody.appendChild(tr);
        });
    }

    // --- LÓGICA DO DROPDOWN (Reutilizável) ---
    function toggleFilterDropdown(btn, colKey) {
        if (activeDropdown && activeDropdown.dataset.col === colKey) {
            closeDropdown(); return;
        }
        closeDropdown();

        const data = getTabData();
        const uniqueValues = Array.from(new Set(data.map(i => i[colKey]))).sort();

        const dropdown = dropdownTemplate.cloneNode(true);
        dropdown.id = ''; 
        dropdown.dataset.col = colKey;
        dropdown.classList.remove('hidden');

        const list = dropdown.querySelector('.filter-options-list');
        const isAll = !activeFilters[colKey];

        // Opção All
        list.innerHTML = `<label class="filter-option-item"><input type="checkbox" value="ALL" ${isAll?'checked':''}> (Selecionar Tudo)</label>`;
        
        uniqueValues.forEach(val => {
            const checked = isAll || activeFilters[colKey].includes(val);
            list.innerHTML += `<label class="filter-option-item"><input type="checkbox" value="${val}" ${checked?'checked':''}> ${val}</label>`;
        });

        // Eventos
        const inputs = list.querySelectorAll('input');
        inputs[0].addEventListener('change', (e) => {
            inputs.forEach((inp, idx) => { if(idx>0) inp.checked = e.target.checked; });
        });

        dropdown.querySelector('.btn-filter-apply').addEventListener('click', () => {
            const selected = [];
            let all = true;
            for(let i=1; i<inputs.length; i++) {
                if(inputs[i].checked) selected.push(inputs[i].value);
                else all = false;
            }
            if(all || selected.length === 0) {
                delete activeFilters[colKey];
                btn.classList.remove('active-filter');
            } else {
                activeFilters[colKey] = selected;
                btn.classList.add('active-filter');
            }
            renderGrid();
            closeDropdown();
        });

        dropdown.querySelector('.btn-filter-clear').addEventListener('click', () => {
            delete activeFilters[colKey];
            btn.classList.remove('active-filter');
            renderGrid();
            closeDropdown();
        });

        document.body.appendChild(dropdown);
        const rect = btn.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + window.scrollY + 5) + 'px';
        dropdown.style.left = (rect.left + window.scrollX) + 'px';
        activeDropdown = dropdown;
    }

    function closeDropdown() {
        if(activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
    }

    init();
});

function novaTransacao() { alert("Nova Transação"); }