// Dados Mockados
const catalogo = [
    { id: 101, sku: 'INS150311', nome: 'Lâminas de Bisturi Aço', grupo: 'ALMOXARIFADO', categoria: 'Insumos', un: 'CX', preco: 0.590000 },
    { id: 102, sku: 'SER102030', nome: 'Seringa Descartável 10ml', grupo: 'ALMOXARIFADO', categoria: 'Insumos', un: 'UN', preco: 1.250000 },
    { id: 103, sku: 'LUV990022', nome: 'Luva Procedimento M', grupo: 'EPI', categoria: 'EPI', un: 'CX', preco: 25.900000 },
    { id: 104, sku: 'GAS500100', nome: 'Oxigênio Medicinal', grupo: 'GASES', categoria: 'Gases', un: 'M3', preco: 150.000000 },
    { id: 105, sku: 'CAP200300', nome: 'Capacete de Segurança', grupo: 'EPI', categoria: 'EPI', un: 'UN', preco: 45.500000 },
    { id: 106, sku: 'PAP400500', nome: 'Papel A4 Sulfite', grupo: 'ALMOXARIFADO', categoria: 'Insumos', un: 'RES', preco: 22.100000 },
];

let carrinho = [];
let filtroAtivo = 'todos';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa com o grupo 'todos' ou simula o 'Grupos' aberto
    document.getElementById('submenu-grupos').style.display = 'block';
    renderizarCatalogo(catalogo);
    atualizarCarrinhoUI();
});

// --- MENU LATERAL ---
function toggleMenu(id) {
    const el = document.getElementById(`submenu-${id}`);
    if(el) {
        el.style.display = el.style.display === 'block' ? 'none' : 'block';
    }
}

// --- CATÁLOGO ---
function renderizarCatalogo(lista) {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = '';

    if(lista.length === 0) {
        container.innerHTML = '<div style="padding:20px; color:#999; text-align:center">Nenhum item encontrado.</div>';
        return;
    }

    lista.forEach(item => {
        // Formatar preço com 6 casas decimais (Padrão ERP)
        const precoFmt = item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 6 });

        const row = `
            <div class="grid-row">
                <div class="col-main">
                    <span class="item-sku">${item.sku}</span>
                    <span class="item-name">${item.nome}</span>
                    <span class="item-tag">UN: ${item.un}</span>
                </div>
                <div class="col-price">
                    <span class="price-display">${precoFmt}</span>
                </div>
                <div class="col-add" style="text-align:right">
                    <button class="btn-cart-add" onclick="adicionarItem(${item.id})">
                        <span class="material-icons-outlined" style="font-size:20px">shopping_cart</span>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', row);
    });

    // Adiciona linhas "fantasmas" (skeleton) para preencher a tela como na imagem
    for(let i=0; i<5; i++) {
        container.insertAdjacentHTML('beforeend', '<div class="skeleton-row"></div>');
    }
}

function filtrarCatalogo() {
    const termo = document.getElementById('input-busca').value.toLowerCase();
    
    const filtrados = catalogo.filter(p => {
        const matchTermo = p.nome.toLowerCase().includes(termo) || p.sku.toLowerCase().includes(termo);
        const matchCat = filtroAtivo === 'todos' || p.categoria === filtroAtivo;
        return matchTermo && matchCat;
    });

    renderizarCatalogo(filtrados);
}

function filtrarCategoria(cat) {
    filtroAtivo = cat;
    filtrarCatalogo();
}

// --- CARRINHO ---
function adicionarItem(id) {
    const prod = catalogo.find(p => p.id === id);
    const exist = carrinho.find(c => c.id === id);

    if(exist) {
        exist.qtd++;
    } else {
        carrinho.push({ ...prod, qtd: 1 });
    }
    atualizarCarrinhoUI();
}

function alterarQtd(id, delta) {
    const item = carrinho.find(c => c.id === id);
    if(!item) return;

    item.qtd += delta;
    if(item.qtd <= 0) removerItem(id);
    else atualizarCarrinhoUI();
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
    const container = document.getElementById('cart-content');
    const totalEl = document.getElementById('cart-total-value');
    container.innerHTML = '';

    let totalGeral = 0;

    // Agrupar itens por 'grupo' (ex: ALMOXARIFADO)
    const grupos = {};
    carrinho.forEach(item => {
        if(!grupos[item.grupo]) grupos[item.grupo] = [];
        grupos[item.grupo].push(item);
    });

    // Renderizar por grupo
    for (const [nomeGrupo, itens] of Object.entries(grupos)) {
        let subtotalGrupo = 0;
        
        // Cabeçalho do Grupo
        const groupHeader = `
            <div class="cart-group-header">
                <span>GRUPO: ${nomeGrupo}</span>
                <span class="material-icons-outlined" style="font-size:14px; cursor:pointer" onclick="alert('Fechar grupo')">close</span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', groupHeader);

        // Itens do Grupo
        itens.forEach(item => {
            const subtotal = item.qtd * item.preco;
            subtotalGrupo += subtotal;
            totalGeral += subtotal;

            const card = `
                <div class="cart-item-card">
                    <div class="cart-item-top">
                        <div>
                            <div class="c-name">${item.nome}</div>
                            <div class="c-sku">(${item.sku})</div>
                        </div>
                        <button class="btn-remove-item" onclick="removerItem(${item.id})">&times;</button>
                    </div>
                    <div class="cart-item-controls">
                        <div class="qty-wrapper">
                            <button class="btn-qty-mini" onclick="alterarQtd(${item.id}, -1)">-</button>
                            <input type="text" class="qty-val" value="${item.qtd}" readonly>
                            <button class="btn-qty-mini" onclick="alterarQtd(${item.id}, 1)">+</button>
                        </div>
                        <span class="item-subtotal">BRL ${subtotal.toFixed(6).replace('.',',')}</span>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', card);
        });
    }

    if(carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; margin-top:30px;">Carrinho vazio</p>';
    }

    totalEl.innerText = totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 6 });
}

function finalizarPedido() {
    alert('Pedido enviado para processamento ERP.');
}
