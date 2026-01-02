document.addEventListener('DOMContentLoaded', () => {
    
    // --- ESTADO ---
    let carrinho = [];
    
    // Contexto (Edição)
    const cabecalhoSalvo = JSON.parse(sessionStorage.getItem('cabecalho_temp'));
    if(cabecalhoSalvo) {
        if(cabecalhoSalvo.centroCusto) document.getElementById('displayCC').innerText = cabecalhoSalvo.centroCusto;
    }

    // --- MOCK DE DADOS ---
    const dbProdutos = [
        { codigo: "INS150124", descricao: "SACO ZIP TRANSP 12X17CM c/100", grupo: "ALMOXARIFADO", un: "PCT", preco: 8.75 },
        { codigo: "INS99999", descricao: "CANETA ESFEROGRÁFICA AZUL", grupo: "ESCRITÓRIO", un: "UN", preco: 1.50 },
        { codigo: "INS200300", descricao: "PAPEL A4 SULFITE 75G", grupo: "ESCRITÓRIO", un: "PCT", preco: 25.90 },
        { codigo: "INS554422", descricao: "CAIXA DE PAPELÃO P", grupo: "EMBALAGEM", un: "UN", preco: 3.20 },
        { codigo: "INS112233", descricao: "FITA ADESIVA TRANSPARENTE", grupo: "ALMOXARIFADO", un: "RL", preco: 4.50 },
        { codigo: "INS887766", descricao: "ETIQUETA TÉRMICA 100x50", grupo: "EMBALAGEM", un: "RL", preco: 15.00 },
        { codigo: "INS303030", descricao: "CANETA MARCA TEXTO AMARELA", grupo: "ESCRITÓRIO", un: "UN", preco: 2.10 },
        { codigo: "INS404040", descricao: "COPO DESCARTÁVEL 200ML", grupo: "COPA", un: "PCT", preco: 5.00 },
        { codigo: "Z9900", descricao: "ZEBRA IMPRESSORA TÉRMICA", grupo: "INFORMATICA", un: "UN", preco: 1200.00 }
    ];

    // --- ELEMENTOS ---
    const btnAvancar = document.getElementById('btnAvancar');
    const containerCarrinho = document.getElementById('cartContainer'); // ID atualizado
    const displayTotal = document.querySelector('.total-value');
    const btnLimpar = document.getElementById('btnLimparCarrinho');
    
    // Toggle Carrinho
    const btnToggleCart = document.getElementById('btnToggleCart');
    
    const searchInput = document.getElementById('searchInput');
    const btnPesquisar = document.getElementById('btnPesquisar');
    const tbody = document.getElementById('tabelaProdutos');
    const infoResultados = document.getElementById('infoResultados');

    const btnAlterarContexto = document.getElementById('btnAlterarContexto');
    const displayCC = document.getElementById('displayCC');
    const displayEmpresa = document.getElementById('displayEmpresa');

    // Inicializa
    mostrarEstadoInicial();

    // --- BUSCA ---
    function realizarBusca() {
        const termo = searchInput.value.trim().toLowerCase();
        
        if (termo === "") {
            mostrarEstadoInicial();
            return;
        }

        const resultados = dbProdutos.filter(p => 
            p.codigo.toLowerCase().includes(termo) || 
            p.descricao.toLowerCase().includes(termo)
        );

        renderizarTabela(resultados);
    }

    function mostrarEstadoInicial() {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="state-message">
                    <span class="material-icons-outlined" style="font-size: 32px; color: #DDD; margin-bottom: 5px;">search</span>
                    <p>Digite o código ou descrição para pesquisar...</p>
                </td>
            </tr>
        `;
        infoResultados.innerText = "-";
    }

    function renderizarTabela(lista) {
        tbody.innerHTML = '';

        if (lista.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="state-message">
                        <p style="color: #E67E22;">Nenhum produto encontrado.</p>
                    </td>
                </tr>
            `;
            infoResultados.innerText = "0 itens encontrados";
            return;
        }

        infoResultados.innerText = `${lista.length} itens encontrados`;

        lista.forEach(prod => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${prod.codigo}</strong></td>
                <td><a class="link-prod">${prod.descricao}</a></td>
                <td>${prod.grupo}</td>
                <td>${prod.un}</td>
                <td>R$ ${prod.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td class="text-center">
                    <button type="button" class="btn-add-cart" title="Adicionar ao carrinho">
                        <span class="material-icons-outlined">add_shopping_cart</span>
                    </button>
                </td>
            `;

            const btnAdd = tr.querySelector('.btn-add-cart');
            btnAdd.addEventListener('click', () => {
                adicionarAoCarrinho({ ...prod, quantidade: 1 });
            });

            tbody.appendChild(tr);
        });
    }

    searchInput.addEventListener('input', realizarBusca);
    btnPesquisar.addEventListener('click', realizarBusca);

    // --- CONTEXTO ---
    btnAlterarContexto.addEventListener('click', () => {
        const novoCC = prompt("Informe o novo Centro de Custo:", displayCC.innerText);
        if(novoCC) displayCC.innerText = novoCC.toUpperCase();

        const novaEmpresa = prompt("Informe a nova Empresa:", displayEmpresa.innerText);
        if(novaEmpresa) displayEmpresa.innerText = novaEmpresa.toUpperCase();
    });

    // --- LÓGICA DO TOGGLE CARRINHO ---
    btnToggleCart.addEventListener('click', () => {
        const icon = btnToggleCart.querySelector('.material-icons');
        
        if (containerCarrinho.classList.contains('hidden')) {
            containerCarrinho.classList.remove('hidden');
            icon.innerText = 'expand_less';
        } else {
            containerCarrinho.classList.add('hidden');
            icon.innerText = 'expand_more';
        }
    });

    function abrirCarrinhoSeFechado() {
        if (containerCarrinho.classList.contains('hidden')) {
            containerCarrinho.classList.remove('hidden');
            btnToggleCart.querySelector('.material-icons').innerText = 'expand_less';
        }
    }

    // --- CARRINHO ---
    function atualizarCarrinho() {
        containerCarrinho.innerHTML = ''; 
        let totalGeral = 0;

        if (carrinho.length === 0) {
            containerCarrinho.innerHTML = `
                <div class="empty-cart-state">
                    <span class="material-icons-outlined">remove_shopping_cart</span>
                    <p>Seu carrinho está vazio</p>
                </div>`;
            displayTotal.innerText = 'R$ 0,00';
            return;
        }

        carrinho.forEach((item, index) => {
            const subtotal = item.preco * item.quantidade;
            totalGeral += subtotal;

            const itemHTML = `
                <div class="item-card" data-index="${index}">
                    <div class="item-card-header">
                        <span class="material-icons-outlined remove-btn" title="Remover item">remove_circle_outline</span>
                        
                        <div class="item-meta">
                            <div class="meta-line">GRUPO: <strong>${item.grupo}</strong></div>
                            <div class="meta-line">SUB: <strong>${formatarMoeda(subtotal)}</strong></div>
                        </div>
                    </div>
                    
                    <div class="item-title">
                        ${item.descricao} (${item.codigo})
                    </div>

                    <div class="item-actions">
                        <div class="stepper-group">
                            <button class="btn-menos">-</button>
                            <input type="number" class="input-qty" value="${item.quantidade}" min="1">
                            <button class="btn-mais">+</button>
                        </div>
                        <div class="unit-info">
                            ${item.un}. <strong>${formatarMoeda(item.preco)}</strong>
                            <span class="badge-gold">G</span>
                        </div>
                    </div>
                </div>
            `;
            containerCarrinho.insertAdjacentHTML('beforeend', itemHTML);
        });

        displayTotal.innerText = formatarMoeda(totalGeral);
        conectarEventosCarrinho();
    }

    function conectarEventosCarrinho() {
        const cartItems = containerCarrinho.querySelectorAll('.item-card');
        cartItems.forEach(card => {
            const index = parseInt(card.dataset.index);

            card.querySelector('.remove-btn').addEventListener('click', () => removerItem(index));
            card.querySelector('.btn-mais').addEventListener('click', () => {
                carrinho[index].quantidade++;
                atualizarCarrinho();
            });
            card.querySelector('.btn-menos').addEventListener('click', () => {
                if (carrinho[index].quantidade > 1) {
                    carrinho[index].quantidade--;
                    atualizarCarrinho();
                }
            });
            
            const input = card.querySelector('.input-qty');
            input.addEventListener('change', (e) => {
                let qtd = parseInt(e.target.value);
                if(isNaN(qtd) || qtd < 1) qtd = 1;
                carrinho[index].quantidade = qtd;
                atualizarCarrinho();
            });
        });
    }

    function adicionarAoCarrinho(produto) {
        const existente = carrinho.find(item => item.codigo === produto.codigo);
        if (existente) {
            alert('Item já está no carrinho. Ajuste a quantidade no painel lateral.');
        } else {
            carrinho.unshift(produto);
            atualizarCarrinho();
            abrirCarrinhoSeFechado(); // Auto-open ao adicionar
        }
    }

    function removerItem(index) {
        carrinho.splice(index, 1);
        atualizarCarrinho();
    }

    function limparCarrinho() {
        if (carrinho.length > 0 && confirm('Remover todos os itens?')) {
            carrinho = [];
            atualizarCarrinho();
        }
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    if (btnLimpar) {
        btnLimpar.addEventListener('click', (e) => {
            e.preventDefault();
            limparCarrinho();
        });
    }

    if (btnAvancar) {
        btnAvancar.addEventListener('click', () => {
            if (carrinho.length === 0) {
                alert('Adicione itens ao carrinho para avançar.');
                return;
            }
            
            sessionStorage.setItem('carrinho_temp', JSON.stringify(carrinho));
            const cabecalho = {
                centroCusto: displayCC.innerText,
                empresa: displayEmpresa.innerText
            };
            sessionStorage.setItem('cabecalho_temp', JSON.stringify(cabecalho));

            btnAvancar.innerHTML = '<span>Processando...</span>';
            setTimeout(() => {
                window.location.href = 'novo_pedido2.html';
            }, 300);
        });
    }
});