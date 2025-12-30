document.addEventListener('DOMContentLoaded', () => {
    
    // --- DADOS MOCKADOS ---
    const mockData = [
        { type: 'hardware', id: '#AST-001', desc: 'MacBook Pro M3', cat: 'Hardware', user: 'Ana Dev', value: 'R$ 18.000', valRaw:'18000', status: 'Em uso', stClass: 'st-ok' },
        { type: 'hardware', id: '#AST-088', desc: 'Servidor Dell', cat: 'Hardware', user: 'Rack A2', value: 'R$ 45.000', valRaw:'45000', status: 'Manutenção', stClass: 'st-urgent' },
        { type: 'hardware', id: '#AST-042', desc: 'iPhone 15 Corp', cat: 'Hardware', user: 'Estoque', value: 'R$ 7.500', valRaw:'7500', status: 'Disponível', stClass: 'st-info' },
        { type: 'software', id: '#SFT-100', desc: 'Office 365', cat: 'Software', user: 'Global', value: 'Mensal', valRaw:'0', status: 'Ativo', stClass: 'st-ok' }
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
                if(!activeFilters[key].includes(item[key])) return false;
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
                <td>
                    <span class="doc-id">${item.desc}</span>
                    <span class="doc-desc">${item.id}</span>
                </td>
                <td>${item.cat}</td>
                <td>${item.user}</td>
                <td class="val-main">${item.value}</td>
                <td><div class="status-indicator ${item.stClass}"><span class="dot-status"></span> ${item.status}</div></td>
                <td class="col-center"><button class="btn-link">Editar</button></td>
            `;
            gridBody.appendChild(tr);
        });
    }

    // Lógica Dropdown (Idêntica à Fiscais)
    function toggleFilterDropdown(btn, colKey) {
        if (activeDropdown && activeDropdown.dataset.col === colKey) { closeDropdown(); return; }
        closeDropdown();

        const data = getTabData();
        const uniqueValues = Array.from(new Set(data.map(i => i[colKey]))).sort();

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