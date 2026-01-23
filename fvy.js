// --- fvy.js ---

// Estado inicial: 1 item vazio
let items = [
    {
        id: 1,
        code: 'INS150311', // Exemplo da imagem
        cliCode: 'INS150311',
        desc: 'LÂMINAS DE BISTURI Nº11',
        req: 'AX - ALMOXARIFADO', // Campo "Grupo/Catálogo" na imagem
        nf: '', // Campo "Código Produto ERP" na imagem
        unit: 'UN',
        qty: '1,000000',
        local: 'Consumo', // Campo "Aplicação" na imagem
        expanded: true
    }
];

document.addEventListener('DOMContentLoaded', () => {
    renderItems();
});

// Renderiza a lista de itens
function renderItems() {
    const listContainer = document.getElementById('items-list');
    listContainer.innerHTML = '';

    items.forEach((item, index) => {
        const itemHTML = `
            <div class="item-row ${item.expanded ? 'expanded' : ''}" id="row-${item.id}">
                <div class="item-summary" onclick="toggleExpand(${item.id})">
                    <div class="col-id">
                        <span class="material-icons-outlined arrow-icon">expand_less</span>
                        ${index + 1}
                    </div>
                    <div class="col-code"><span class="code-text">${item.code || 'Novo Item'}</span></div>
                    <div class="col-code-cli"><span class="cli-text">${item.cliCode || '-'}</span></div>
                    <div class="col-desc">
                        <div class="desc-wrapper">
                            <div><span class="icon-g">G</span></div>
                            <span class="desc-text">${item.desc || 'SEM DESCRIÇÃO'}</span>
                        </div>
                    </div>
                    <div class="col-total"><span class="total-text">BRL 0,0000</span></div>
                    <div class="col-actions">
                        <div class="action-icons">
                            <span class="material-icons-outlined" onclick="event.stopPropagation(); alert('Duplicar indisponível')">content_copy</span>
                            <span class="material-icons-outlined" onclick="event.stopPropagation(); removerItem(${item.id})">highlight_off</span>
                        </div>
                    </div>
                </div>

                <div class="item-details">
                    <div class="form-grid">
                        
                        <div class="field-group">
                            <label>Grupo / Requisição Compra</label>
                            <input type="text" class="input-styled" value="${item.req}" oninput="updateItem(${item.id}, 'req', this.value)">
                        </div>
                        <div class="field-group">
                            <label>Código Produto (ERP) / NF</label>
                            <input type="text" class="input-styled" value="${item.nf}" oninput="updateItem(${item.id}, 'nf', this.value)">
                        </div>
                        <div class="field-group">
                            <label>Prazo Estimado</label>
                            <input type="text" class="input-styled" disabled style="background:#f9f9f9">
                        </div>
                        <div class="field-group">
                            <label>Quantidade</label>
                            <input type="text" class="input-styled required-border" value="${item.qty}" oninput="updateItem(${item.id}, 'qty', this.value)">
                        </div>

                        <div class="field-group">
                            <label>Ultimo Preço Pago</label>
                            <input type="text" class="input-styled" value="BRL 0,00">
                        </div>
                        <div class="field-group">
                            <label>Unidade</label>
                            <input type="text" class="input-styled" value="${item.unit}" disabled style="background:#f9f9f9">
                        </div>
                        <div class="field-group">
                            <label>Aplicação / Local AI</label>
                            <div style="position:relative">
                                <input type="text" class="input-styled required-border" value="${item.local}" oninput="updateItem(${item.id}, 'local', this.value)">
                                <span style="position:absolute; right:5px; top:5px; font-size:10px; color:#999">▼</span>
                            </div>
                        </div>
                        <div class="field-group">
                            <label>Data Estimada</label>
                            <input type="date" class="input-styled required-border">
                        </div>

                        <div class="field-group">
                            <label>Código Produto (Ativo)</label>
                            <input type="text" class="input-styled required-border" value="${item.code}" oninput="updateItem(${item.id}, 'code', this.value)">
                        </div>
                        <div class="field-group full-width">
                            <label>Descrição do Equipamento</label>
                            <textarea class="input-styled" oninput="updateItem(${item.id}, 'desc', this.value)">${item.desc}</textarea>
                        </div>

                    </div>
                </div>
            </div>
        `;
        listContainer.insertAdjacentHTML('beforeend', itemHTML);
    });
}

// Atualiza dados no array e na UI (Resumo)
function updateItem(id, field, value) {
    const item = items.find(i => i.id === id);
    if (item) {
        item[field] = value;
        // Se alterar código ou descrição, atualiza o cabeçalho imediatamente
        if (field === 'code' || field === 'desc') {
            const row = document.getElementById(`row-${id}`);
            if (field === 'code') row.querySelector('.code-text').innerText = value || 'Novo';
            if (field === 'desc') row.querySelector('.desc-text').innerText = value || 'SEM DESCRIÇÃO';
        }
    }
}

function toggleExpand(id) {
    const item = items.find(i => i.id === id);
    if (item) {
        item.expanded = !item.expanded;
        renderItems(); // Re-renderiza para atualizar classes (poderia ser feito só com classList toggle para performance)
    }
}

function adicionarNovoItem() {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    items.forEach(i => i.expanded = false); // Fecha os outros
    items.push({
        id: newId,
        code: '', cliCode: '', desc: '', req: '', nf: '', unit: 'UN', qty: '1,000000', local: '', expanded: true
    });
    renderItems();
}

function removerItem(id) {
    if (confirm('Deseja excluir este item?')) {
        items = items.filter(i => i.id !== id);
        renderItems();
    }
}

// --- MODAL ---
function abrirModalPreview() {
    const tbody = document.getElementById('preview-tbody');
    tbody.innerHTML = '';

    items.forEach(item => {
        const row = `
            <tr>
                <td>${item.code}</td>
                <td>${item.desc}</td>
                <td>${item.req}</td>
                <td>${item.nf}</td>
                <td>${item.local}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });

    document.getElementById('email-modal').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('email-modal').style.display = 'none';
}

function enviarReal() {
    const btn = document.querySelector('.modal-bottom .btn-me-orange');
    btn.innerHTML = 'Enviando...';
    setTimeout(() => {
        window.location.href = 'sgq.html';
    }, 1000);
}