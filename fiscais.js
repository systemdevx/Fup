document.addEventListener('DOMContentLoaded', () => {
    
    // --- DADOS MOCKADOS ---
    const mockData = [
        { type: 'emitidas', doc: 'NF-e #000.293.112', desc: 'Dest: Cliente Beta S.A.', comp: 'Out/2025', value: 'R$ 22.400,00', valRaw: '22400', status: 'Emitida', stClass: 'st-ok' },
        { type: 'emitidas', doc: 'NF-e #000.293.113', desc: 'Dest: Consultoria XYZ', comp: 'Out/2025', value: 'R$ 5.000,00', valRaw: '5000', status: 'Cancelada', stClass: 'st-urgent' },
        { type: 'recebidas', doc: 'NF-e #550.111.002', desc: 'Forn: AWS Services', comp: 'Set/2025', value: 'R$ 1.200,00', valRaw: '1200', status: 'Escriturada', stClass: 'st-info' },
        { type: 'impostos', doc: 'DARF - PIS/COFINS', desc: 'Ref: Faturamento Set/25', comp: 'Out/2025', value: 'R$ 3.450,00', valRaw: '3450', status: 'Pendente', stClass: 'st-new' }
    ];

    const gridBody = document.getElementById('grid-body');
    const tabs = document.querySelectorAll('.sub-pill');
    let currentType = 'emitidas';
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
                activeFilters = {}; 
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

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            if(confirm("Deseja sair?")) window.location.href = 'index.html';
        });

        renderGrid();
    }

    function getTabData() {
        return mockData.filter(item => item.type === currentType);
    }

    function renderGrid() {
        gridBody.innerHTML = '';
        let items = getTabData();

        // Filtros de Coluna
        items = items.filter(item => {
            for (const key in activeFilters) {
                if (!activeFilters[key] || activeFilters[key].length === 0) continue;
                if(!activeFilters[key].includes(item[key])) return false;
            }
            return true;
        });

        if (items.length === 0) {
            gridBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color:#888;">Nenhum registro encontrado.</td></tr>';
            return;
        }

        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <span class="doc-id">${item.doc}</span>
                    <span class="doc-desc">${item.desc}</span>
                </td>
                <td class="text-gray">${item.comp}</td>
                <td class="val-main">${item.value}</td>
                <td><div class="status-indicator ${item.stClass}"><span class="dot-status"></span> ${item.status}</div></td>
                <td class="col-center"><button class="btn-link">Download</button></td>
            `;
            gridBody.appendChild(tr);
        });
    }

    // --- LÓGICA DO DROPDOWN (Excel Style) ---
    function toggleFilterDropdown(btn, colKey) {
        if (activeDropdown && activeDropdown.dataset.col === colKey) { closeDropdown(); return; }
        closeDropdown();

        const data = getTabData();
        const uniqueValues = Array.from(new Set(data.map(i => i[colKey]))).sort();

        const dropdown = dropdownTemplate.cloneNode(true);
        dropdown.id = ''; 
        dropdown.dataset.col = colKey;
        dropdown.classList.remove('hidden');

        const list = dropdown.querySelector('.filter-options-list');
        const isAll = !activeFilters[colKey];

        list.innerHTML = `<label class="filter-option-item"><input type="checkbox" value="ALL" ${isAll?'checked':''}> (Selecionar Tudo)</label>`;
        uniqueValues.forEach(val => {
            const checked = isAll || activeFilters[colKey].includes(val);
            list.innerHTML += `<label class="filter-option-item"><input type="checkbox" value="${val}" ${checked?'checked':''}> ${val}</label>`;
        });

        // Evento Select All
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