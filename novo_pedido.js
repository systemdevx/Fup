// --- DADOS ---
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

// --- RENDERIZAR TABELA (Sem input de quantidade) ---
function renderizarCatalogo(lista) {
    const container = document.getElementById('table-body');
    container.innerHTML = '';

    if(lista.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center;">Nenhum item encontrado.</div>';
        return;
    }

    lista.forEach(item => {
        const precoFmt = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        // Grid Row (7 colunas)
        const row = `
            <div class="grid-row">
                <div class="cell-id">${item.id}</div>
                <div class="cell-text">${item.nome}</div>
                <div class="cell-text">${item.fornecedor}</div>
                <div class="cell-text">${precoFmt}</div>
                <div class="cell-text">${item.un}</div>
                <div class="cell-secondary">${item.condicao}</div>
                
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

// --- LÓGICA DO CARRINHO ---

// Adiciona 1 unidade por padrão
function adicionarAoCarrinho(id) {
    const produto = catalogo.find(p => p.id === id);
    const itemExistente = carrinho.find(c => c.id === id);

    if(itemExistente) {
        itemExistente.qtd += 1; // Se já existe, soma +1
    } else {
        carrinho.push({ ...produto, qtd: 1 }); // Novo item começa com 1
    }

    atualizarCarrinhoUI();
}

// Altera quantidade DENTRO do carrinho (+ ou -)
function alterarQtdCarrinho(id, delta) {
    const item = carrinho.find(c => c.id === id);
    if (!item) return;

    item.qtd += delta;

    // Se chegar a zero ou menos, removemos do carrinho?
    // Geralmente sim, ou travamos em 1. Vou travar em 1.
    // Se quiser remover, use: if (item.qtd <= 0) removerItem(id);
    if (item.qtd < 1) item.qtd = 1;

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

        // Formatação com 6 casas decimais e vírgula
        const qtdDisplay = item.qtd.toFixed(6).replace('.', ',');

        const cartItem = `
            <div class="cart-item">
                <button class="cart-remove" onclick="removerItem(${item.id})">
                    <span class="material-icons-outlined">close</span>
                </button>
                
                <div class="cart-item-title">${item.nome}</div>
                
                <div class="cart-item-bottom">
                    <div class="cart-qty-wrapper">
                        <button class="btn-cart-qty" onclick="alterarQtdCarrinho(${item.id}, -1)">-</button>
                        <input type="text" class="input-cart-qty" value="${qtdDisplay}" readonly>
                        <button class="btn-cart-qty" onclick="alterarQtdCarrinho(${item.id}, 1)">+</button>
                    </div>

                    <div class="cart-price-total">
                        ${subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cartItem);
    });

    totalEl.innerText = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}