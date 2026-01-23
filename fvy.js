// --- fvy.js ---

// Lista de Setores para o Select (Local AI)
const SETORES = [
    "Almoxarifado Central", "Produção", "Qualidade", "TI", "Manutenção", "Expedição", "Consumo"
];

// Estado Inicial (1 Item Vazio)
let items = [
    {
        id: Date.now(),
        codigo: '',
        equipamento: '',
        req: '',
        nf: '',
        local: '',
        expanded: true
    }
];

document.addEventListener('DOMContentLoaded', () => {
    renderItems();
});

// Renderiza a lista na tela
function renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';

    items.forEach((item, index) => {
        // Gera opções do select para Local AI
        const options = SETORES.map(s => `<option value="${s}" ${item.local === s ? 'selected' : ''}>${s}</option>`).join('');

        const html = `
            <div class="item-row ${item.expanded ? 'expanded' : ''}" id="row-${item.id}">
                <div class="item-summary" onclick="toggleExpand(${item.id})">
                    <div class="col-idx">
                        <span class="material-icons-outlined arrow-toggle">expand_more</span>
                        ${index + 1}
                    </div>
                    <div class="col-code">${item.codigo || '<span style="color:#ccc">Novo</span>'}</div>
                    <div class="col-desc">
                        ${item.equipamento ? `<span class="icon-g">G</span> ${item.equipamento}` : '<span style="color:#ccc">Preencha os detalhes</span>'}
                    </div>
                    <div class="col-req">${item.req || '-'}</div>
                    <div class="col-actions">
                        <button class="btn-remove" onclick="event.stopPropagation(); removerItem(${item.id})">
                            <span class="material-icons-outlined">delete</span>
                        </button>
                    </div>
                </div>

                <div class="item-details">
                    <div class="form-grid">
                        
                        <div class="form-group">
                            <label>Código do Ativo</label>
                            <input type="text" class="input-me required-field" 
                                value="${item.codigo}" 
                                placeholder="Ex: A001"
                                oninput="updateItem(${item.id}, 'codigo', this.value)">
                        </div>

                        <div class="form-group full-width">
                            <label>Equipamento / Descrição</label>
                            <input type="text" class="input-me required-field" 
                                value="${item.equipamento}" 
                                placeholder="Ex: Servidor Dell..."
                                oninput="updateItem(${item.id}, 'equipamento', this.value)">
                        </div>

                         <div class="form-group">
                            <label>Local AI (Setor)</label>
                            <select class="input-me required-field" onchange="updateItem(${item.id}, 'local', this.value)">
                                <option value="">Selecione...</option>
                                ${options}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Requisição de Compra</label>
                            <input type="text" class="input-me" 
                                value="${item.req}" 
                                oninput="updateItem(${item.id}, 'req', this.value)">
                        </div>

                        <div class="form-group">
                            <label>Nota Fiscal</label>
                            <input type="text" class="input-me" 
                                value="${item.nf}" 
                                oninput="updateItem(${item.id}, 'nf', this.value)">
                        </div>

                        <div class="form-group">
                            <label>Unidade</label>
                            <input type="text" class="input-me" value="UN" disabled style="background:#F9F9F9">
                        </div>
                         <div class="form-group">
                            <label>Data Entrada</label>
                            <input type="date" class="input-me" disabled style="background:#F9F9F9">
                        </div>

                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// Atualiza o estado
function updateItem(id, field, value) {
    const item = items.find(i => i.id === id);
    if (item) {
        item[field] = value;
        // Atualiza cabeçalho em tempo real se for código ou equipamento
        if (field === 'codigo' || field === 'equipamento') {
            // Pequeno delay para não quebrar a digitação com re-render total
            // Em app real usaríamos VirtualDOM, aqui manipulamos o DOM direto se necessário
            // Por simplicidade, faremos re-render no blur ou mantemos o binding visual simples:
            // Vamos apenas atualizar o DOM específico para performance
            const row = document.getElementById(`row-${id}`);
            if (field === 'codigo') {
                row.querySelector('.col-code').innerHTML = value || '<span style="color:#ccc">Novo</span>';
            }
            if (field === 'equipamento') {
                row.querySelector('.col-desc').innerHTML = value ? `<span class="icon-g">G</span> ${value}` : '<span style="color:#ccc">Preencha os detalhes</span>';
            }
        }
    }
}

// Expande/Colapsa item
function toggleExpand(id) {
    const item = items.find(i => i.id === id);
    if (item) {
        // Fecha outros se quiser comportamento de acordeão exclusivo
        // items.forEach(i => i.expanded = false); 
        item.expanded = !item.expanded;
        renderItems();
    }
}

// Adiciona novo item
function adicionarNovoItem() {
    items.forEach(i => i.expanded = false); // Fecha anteriores
    items.push({
        id: Date.now(),
        codigo: '', equipamento: '', req: '', nf: '', local: '', expanded: true
    });
    renderItems();
    // Scroll para o fim
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
}

// Remove item
function removerItem(id) {
    if (items.length <= 1) {
        alert("A lista deve conter pelo menos um item.");
        return;
    }
    if (confirm("Deseja remover este item?")) {
        items = items.filter(i => i.id !== id);
        renderItems();
    }
}

// --- MODAL & ENVIO ---

function abrirModalPreview() {
    // Validação simples
    const invalid = items.some(i => !i.codigo || !i.equipamento || !i.local);
    if(invalid) {
        alert("Por favor, preencha os campos obrigatórios (Código, Equipamento, Local AI) de todos os itens.");
        return;
    }

    const tbody = document.getElementById('email-tbody');
    tbody.innerHTML = '';

    items.forEach(item => {
        const row = `
            <tr>
                <td>${item.codigo}</td>
                <td>${item.equipamento}</td>
                <td>${item.req || '-'}</td>
                <td>${item.nf || '-'}</td>
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

function confirmarEnvio() {
    const btn = document.querySelector('.modal-bottom-bar .btn-me-solid');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = 'Enviando...';

    setTimeout(() => {
        // Redireciona para SGQ
        window.location.href = 'sgq.html';
    }, 1500);
}