document.addEventListener('DOMContentLoaded', () => {
    
    // --- DADOS MOCKADOS ---
    const mockData = [
        { type: 'ativos', code: 'AT-042', desc: 'Dell Latitude 5420', sub: 'Equipamento de TI', cat: 'Ativos', date: '10/10/2025', status: 'Em Uso', stClass: 'st-ok' },
        { type: 'fornecedores', code: 'FN-109', desc: 'Tech Solutions Ltda', sub: 'CNPJ: 45.123.001/0001-99', cat: 'Fornecedores', date: '05/09/2025', status: 'Ativo', stClass: 'st-ok' },
        { type: 'itens', code: 'IT-882', desc: 'Cabo HDMI 3m', sub: 'Periféricos', cat: 'Itens', date: '12/08/2025', status: 'Disponível', stClass: 'st-ok' },
        { type: 'ativos', code: 'AT-055', desc: 'Cadeira Ergonômica', sub: 'Mobiliário', cat: 'Ativos', date: '20/11/2025', status: 'Em Uso', stClass: 'st-ok' }
    ];

    const gridBody = document.getElementById('grid-body');
    const tabs = document.querySelectorAll('.sub-pill');
    let currentType = 'todos';
    let activeFilters = {}; 
    let activeDropdown = null;
    const dropdownTemplate = document.getElementById('filter-dropdown-template');

    function init() {
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

        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFilterDropdown(btn, btn.getAttribute('data-col'));
            });
        });

        document.addEventListener('click', (e) => {
            if (activeDropdown && !activeDropdown.contains(e.target)) closeDropdown();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            if(confirm("Deseja sair?")) window.location.href = 'index.html';
        });

        renderGrid();
    }

    function getTabData() {
        if(currentType === 'todos') return mockData;
        return mockData.filter(item => item.type === currentType);
    }

    function renderGrid() {
        gridBody.innerHTML = '';
        let items = getTabData();

        items = items.filter(item => {
            for (const key in activeFilters) {
                if (!activeFilters[key] || activeFilters[key].length === 0) continue;
                let val = item[key];
                if(key === 'desc') val = item.desc; // Ajuste para descrição composta
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
                <td class="text-gray">${item.code}</td>
                <td>
                    <span class="doc-id">${item.desc}</span>
                    <span class="doc-desc">${item.sub}</span>
                </td>
                <td>${item.cat}</td>
                <td class="text-gray">${item.date}</td>
                <td><div class="status-indicator ${item.stClass}"><span class="dot-status"></span> ${item.status}</div></td>
                <td class="col-center"><button class="btn-link">Editar</button></td>
            `;
            gridBody.appendChild(tr);
        });
    }

    // Lógica Dropdown
    function toggleFilterDropdown(btn, colKey) {
        if (activeDropdown && activeDropdown.dataset.col === colKey) { closeDropdown(); return; }
        closeDropdown();

        const data = getTabData();
        // Lógica para pegar valores únicos, considerando a descrição composta
        const uniqueValues = Array.from(new Set(data.map(i => i[colKey] || (colKey==='desc'?i.desc:'')))).sort();

        const dropdown = dropdownTemplate.cloneNode(true);
        dropdown.id = ''; dropdown.dataset.col = colKey; dropdown.classList.remove('hidden');

        const list = dropdown.querySelector('.filter-options-list');
        const isAll = !activeFilters[colKey];

        list.innerHTML = `<label class="filter-option-item"><input type="checkbox" value="ALL" ${isAll?'checked':''}> (Selecionar Tudo)</label>`;
        uniqueValues.forEach(val => {
            const checked = isAll || activeFilters[colKey].includes(val);
            list.innerHTML += `<label class="filter-option-item"><input type="checkbox" value="${val}" ${checked?'checked':''}> ${val}</label>`;
        });

        const inputs = list.querySelectorAll('input');
        inputs[0].addEventListener('change', (e) => { inputs.forEach((inp, i) => { if(i>0) inp.checked = e.target.checked; }); });

        dropdown.querySelector('.btn-filter-apply').addEventListener('click', () => {
            const selected = []; let all = true;
            for(let i=1; i<inputs.length; i++) { if(inputs[i].checked) selected.push(inputs[i].value); else all = false; }
            if(all || selected.length===0) { delete activeFilters[colKey]; btn.classList.remove('active-filter'); }
            else { activeFilters[colKey] = selected; btn.classList.add('active-filter'); }
            renderGrid(); closeDropdown();
        });
        dropdown.querySelector('.btn-filter-clear').addEventListener('click', () => { delete activeFilters[colKey]; btn.classList.remove('active-filter'); renderGrid(); closeDropdown(); });

        document.body.appendChild(dropdown);
        const rect = btn.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + window.scrollY + 5) + 'px';
        dropdown.style.left = (rect.left + window.scrollX) + 'px';
        activeDropdown = dropdown;
    }

    function closeDropdown() { if(activeDropdown) { activeDropdown.remove(); activeDropdown = null; } }

    init();
});