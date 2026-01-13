// --- DADOS DO CATÁLOGO ---
const catalogo = [
    { id: 807735, nome: 'Material Elétrico - Cabo Flexível 2.5mm', fornecedor: 'B A ELETRICA LTDA', grupo: 'Elétrica', preco: 65.90, un: 'RL' },
    { id: 776596, nome: 'Lâmpada LED 9W Branca Bivolt', fornecedor: 'B A ELETRICA LTDA', grupo: 'Iluminação', preco: 12.50, un: 'UN' },
    { id: 102030, nome: 'Seringa Descartável 10ml s/ Agulha', fornecedor: 'MEDIX BRASIL', grupo: 'Hospitalar', preco: 1.25, un: 'CX' },
    { id: 990022, nome: 'Luva Procedimento M Látex', fornecedor: 'SAFEHAND', grupo: 'EPI', preco: 25.90, un: 'CX' },
    { id: 500100, nome: 'Oxigênio Medicinal Cilindro', fornecedor: 'AIRLIFE GASES', grupo: 'Gases', preco: 150.00, un: 'M3' },
    { id: 200300, nome: 'Capacete de Segurança Aba Frontal', fornecedor: 'PROT-TOTAL', grupo: 'EPI', preco: 45.50, un: 'UN' },
    { id: 885522, nome: 'Parafuso Sextavado 1/4 x 2', fornecedor: 'FERRAGENS SUL', grupo: 'Fixação', preco: 0.45, un: 'UN' },
];

let carrinho = [];

document.addEventListener('DOMContentLoaded', () => {
    // Ao iniciar, NÃO renderiza o catálogo completo. Deixa a mensagem de busca.
    atualizarCarrinhoUI();
});

function filtrarCatalogo() {
    const termo = document.getElementById('global-search').value.toLowerCase();
    const container = document.getElementById('table-body');

    // Só busca se tiver pelo menos 2 caracteres
    if (termo.length < 2) {
        container.innerHTML = `
            <div class="start-search-state">
                <span class="material-icons-outlined">manage_search</span>
                <p>Digite o nome do produto ou código para iniciar a busca.</p>
            </div>`;
        return;
    }

    const filtrados = catalogo.filter(item => {
        return item.nome.toLowerCase().includes(termo) || 
               item.fornecedor.toLowerCase().includes(termo) ||
               item.grupo.toLowerCase().includes(termo) ||
               item.id.toString().includes(termo);
    });
    
    renderizarLista(filtrados);
}

function renderizarLista(lista) {
    const container = document.getElementById('table-body');
    container.innerHTML = '';

    if(lista.length === 0) {
        container.innerHTML = '<div style="padding:40px; text-align:center; color:#999;">Nenhum item encontrado.</div>';
        return;
    }

    lista.forEach(item => {
        const precoFmt = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        const row = `
            <div class="grid-row">
                <div class="cell-id">${item.id}</div>
                <div class="cell-text" style="font-weight:600;">${item.id}</div>
                <div class="cell-text">${item.nome}</div>
                <div class="cell-secondary">${item.grupo}</div>
                <div class="cell-text">${item.un}</div>
                <div class="cell-text" style="font-weight:600;">${precoFmt}</div>
                
                <div style="display:flex; justify-content:center;">
                    <button class="btn-add-minimal" onclick="adicionarAoCarrinho(${item.id})" title="Adicionar">
                        <span class="material-icons-outlined">add</span>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', row);
    });
}

// --- CARRINHO E NAVEGAÇÃO ---

function adicionarAoCarrinho(id) {
    const produto = catalogo.find(p => p.id === id);
    const itemExistente = carrinho.find(c => c.id === id);

    if(itemExistente) {
        itemExistente.qtd += 1;
    } else {
        carrinho.push({ ...produto, qtd: 1 });
    }
    atualizarCarrinhoUI();
}

function alterarQtdCarrinho(id, delta) {
    const item = carrinho.find(c => c.id === id);
    if (!item) return;

    item.qtd += delta;
    if (item.qtd < 1) item.qtd = 1;

    atualizarCarrinhoUI();
}

function removerItem(id) {
    carrinho = carrinho.filter(c => c.id !== id);
    atualizarCarrinhoUI();
}

function limparCarrinho() {
    if(carrinho.length > 0 && confirm("Limpar todo o carrinho?")) {
        carrinho = [];
        atualizarCarrinhoUI();
    }
}

function atualizarCarrinhoUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-display');
    
    container.innerHTML = '';
    let totalGeral = 0;

    if(carrinho.length === 0) {
        container.innerHTML = `
            <div class="empty-msg">
                <span class="material-icons-outlined" style="font-size: 32px; opacity: 0.2;">shopping_cart</span>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        totalEl.innerText = 'BRL 0,00';
        return;
    }

    carrinho.forEach(item => {
        const subtotal = item.qtd * item.preco;
        totalGeral += subtotal;
        const qtdDisplay = item.qtd.toFixed(4).replace('.', ',');

        const cartItem = `
            <div class="cart-item">
                <button class="cart-remove" onclick="removerItem(${item.id})">
                    <span class="material-icons-outlined" style="font-size:14px;">close</span>
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

// INTEGRAÇÃO: Salva e Avança
function avancarParaDetalhes() {
    if (carrinho.length === 0) {
        alert("Por favor, adicione itens ao carrinho antes de avançar.");
        return;
    }
    
    // SALVA O CARRINHO PARA A PRÓXIMA PÁGINA USAR
    localStorage.setItem('cartData', JSON.stringify(carrinho));
    
    // Redireciona
    window.location.href = 'detalhes_item.html';
}