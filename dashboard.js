// --- DADOS DO CATÁLOGO ---
const catalogo = [
    { id: 807735, nome: 'NF 68400 - Material Elétrico', fornecedor: 'B A ELETRICA LTDA', preco: 65.90, un: 'UND', condicao: 'L030 - Prazo 30 DDD' },
    { id: 776596, nome: 'Material Elétrico Fab Life', fornecedor: 'B A ELETRICA LTDA', preco: 65.90, un: 'UND', condicao: 'L045 - Prazo 45 DDD' },
    { id: 102030, nome: 'Seringa Descartável 10ml', fornecedor: 'MEDIX BRASIL', preco: 1.25, un: 'UN', condicao: 'À Vista' },
    { id: 990022, nome: 'Luva Procedimento M', fornecedor: 'SAFEHAND PROTECTION', preco: 25.90, un: 'CX', condicao: 'L030 - Prazo 30 DDD' },
    { id: 500100, nome: 'Oxigênio Medicinal', fornecedor: 'AIRLIFE GASES', preco: 150.00, un: 'M3', condicao: 'Faturado 15 Dias' },
    { id: 200300, nome: 'Capacete de Segurança', fornecedor: 'PROT-TOTAL', preco: 45.50, un: 'UN', condicao: 'À Vista' },
];

let carrinho = [];

document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo(catalogo);
    atualizarCarrinhoUI();
});

// --- RENDERIZAR TABELA ---
function renderizarCatalogo(lista) {
    const container = document.getElementById('table-body');
    if (!container) return; // Segurança caso a tabela não exista na view atual

    container.innerHTML = '';

    if(lista.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center;">Nenhum item encontrado.</div>';
        return;
    }

    lista.forEach(item => {
        // Formatações
        const precoFmt = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        // Grid Row (Sem negritos forçados no HTML)
        const row = `
            <div class="grid-row">
                <div class="cell-id">${item.id}</div>
                <div class="cell-text">${item.nome}</div>
                <div class="cell-text">${item.fornecedor}</div>
                <div class="cell-text">${precoFmt}</div>
                <div class="cell-text">${item.un}</div>
                <div class="cell-secondary">${item.condicao}</div>
                
                <div class="qty-control">
                    <button class="btn-qty" onclick="ajustarQtdInput(${item.id}, -1)">–</button>
                    <input type="text" id="qtd-input-${item.id}" class="input-qty" value="1,000000" readonly>
                    <button class="btn-qty" onclick="ajustarQtdInput(${item.id}, 1)">+</button>
                </div>

                <div>
                    <button class="btn-add-cart" onclick="adicionarAoCarrinho(${item.id})">
                        <span class="material-icons-outlined">shopping_cart</span>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', row);
    });
}

function filtrarCatalogo() {
    const termo = document.getElementById('global-search').value.toLowerCase();
    
    const filtrados = catalogo.filter(item => {
        return item.nome.toLowerCase().includes(termo) || 
               item.fornecedor.toLowerCase().includes(termo) ||
               item.id.toString().includes(termo);
    });

    renderizarCatalogo(filtrados);
}

// --- CONTROLE DE QUANTIDADE ---
function ajustarQtdInput(id, delta) {
    const input = document.getElementById(`qtd-input-${id}`);
    // Converte de "1,000000" para número JS (1.0)
    let valorAtual = parseFloat(input.value.replace(',', '.'));
    let novoValor = valorAtual + delta;

    if (novoValor < 1) novoValor = 1;

    // Formata de volta para 6 casas decimais com vírgula
    input.value = novoValor.toFixed(6).replace('.', ',');
}

// --- CARRINHO ---
function adicionarAoCarrinho(id) {
    const produto = catalogo.find(p => p.id === id);
    const inputQtd = document.getElementById(`qtd-input-${id}`);
    const qtdSelecionada = parseFloat(inputQtd.value.replace(',', '.'));

    const itemExistente = carrinho.find(c => c.id === id);

    if(itemExistente) {
        itemExistente.qtd += qtdSelecionada;
    } else {
        carrinho.push({ ...produto, qtd: qtdSelecionada });
    }

    // Reseta o input para 1
    inputQtd.value = "1,000000";

    atualizarCarrinhoUI();
}

function removerItem(id) {
    carrinho = carrinho.filter(c => c.id !== id);
    atualizarCarrinhoUI();
}

function limparCarrinho() {
    carrinho = [];
    atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-display');
    
    if(!container || !totalEl) return;

    container.innerHTML = '';
    let totalGeral = 0;

    if(carrinho.length === 0) {
        container.innerHTML = '<div class="empty-msg">Seu carrinho está vazio</div>';
        totalEl.innerText = 'BRL 0,00';
        return;
    }

    carrinho.forEach(item => {
        const subtotal = item.qtd * item.preco;
        totalGeral += subtotal;

        const cartItem = `
            <div class="cart-item">
                <button class="cart-remove" onclick="removerItem(${item.id})">
                    <span class="material-icons-outlined">close</span>
                </button>
                <div class="cart-item-title">${item.nome}</div>
                <div class="cart-item-details">
                    <span>${item.qtd.toFixed(2).replace('.',',')}x ${item.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    <strong>${subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cartItem);
    });

    totalEl.innerText = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}