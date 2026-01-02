document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS ---
    const dadosCarrinho = sessionStorage.getItem('carrinho_temp');
    const dadosCabecalho = sessionStorage.getItem('cabecalho_temp');
    
    let carrinho = [];
    let cabecalho = {};

    if (dadosCarrinho) carrinho = JSON.parse(dadosCarrinho);
    if (dadosCabecalho) cabecalho = JSON.parse(dadosCabecalho);

    if (carrinho.length === 0) {
        alert('Sessão expirada. Redirecionando...');
        window.location.href = 'novo_pedido.html';
        return;
    }

    // --- RENDERIZAR INFO GERAL ---
    document.getElementById('lblTitulo').innerText = cabecalho.titulo || '-';
    document.getElementById('lblCentroCusto').innerText = cabecalho.centroCusto || '-';

    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    document.getElementById('lblValorTotal').innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const mapaLocais = { 'CD-SP': 'CNP', 'LOJA-RJ': 'LJR', 'MATRIZ': 'MTZ', 'VIVARA-MATRIZ': 'ALM', 'VIVARA-FILIAL': 'FL1' };
    document.getElementById('lblLocalEntrega').innerText = mapaLocais[cabecalho.localEntrega] || 'LOC';
    document.getElementById('lblLocalFat').innerText = mapaLocais[cabecalho.localFaturamento] || 'FAT';

    // --- RENDERIZAR TABELA DE ITENS (COMPLEXA) ---
    const mainList = document.getElementById('listaItensResumo');
    const countItens = document.getElementById('countItens');
    if(countItens) countItens.innerText = carrinho.length;
    if(mainList) mainList.innerHTML = '';

    carrinho.forEach((item, index) => {
        const valorTotal = item.preco * item.quantidade;
        const ultimoPreco = item.preco * 1.1; // Simulação
        const grupo = item.grupo || 'ALMOXARIFADO';
        
        // Detalhes recuperados (Inputs)
        const det = item.detalhesItem || {};
        
        // HTML COMPLEXO (Igual novo_pedido3)
        const html = `
            <div class="item-card-wrapper">
                
                <div class="card-summary-row">
                    <div class="col-idx text-center">${index + 1}</div>
                    <div class="col-grp">${grupo}</div>
                    
                    <div class="col-code" onclick="toggleItemRow(${index})" title="Ver detalhes">
                        <span class="material-icons-outlined orange-icon toggle-icon-${index}" style="font-size:14px; padding:2px; margin-right:5px;">expand_more</span>
                        ${item.codigo}
                    </div>
                    
                    <div class="col-desc">
                        <span class="badge-g">G</span>${item.descricao}
                    </div>
                    
                    <div class="col-un text-center">${item.un}</div>
                    <div class="col-price">${ultimoPreco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    <div class="col-val">${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    
                    <div class="col-act">
                        <button class="btn-icon-only" title="Remover item">
                            <span class="material-icons" style="font-size:16px;">close</span>
                        </button>
                    </div>
                </div>

                <div class="card-inputs-grid" id="inputGrid-${index}">
                    
                    <div class="field-group">
                        <label>Quantidade</label>
                        <input type="number" class="input-me" value="${item.quantidade}" disabled>
                    </div>
                    <div class="field-group">
                        <label>Aplicação</label>
                        <select class="input-me" disabled>
                            <option selected>${det.aplicacao || 'Industrialização'}</option>
                        </select>
                    </div>
                    <div class="field-group">
                        <label>Tipo De Compra</label>
                        <select class="input-me" disabled>
                            <option selected>${det.tipoCompra || 'Normal'}</option>
                        </select>
                    </div>
                    <div class="field-group">
                        <label>Data Estimada</label>
                        <input type="date" class="input-me" value="${det.dataEntrega || ''}" disabled>
                    </div>

                    <div class="field-group">
                        <label>Cat. Class. Contábil</label>
                        <select class="input-me" disabled>
                            <option selected>${det.classificacao || 'Material de Consumo'}</option>
                        </select>
                    </div>
                    <div class="field-group">
                        <label>Depósito</label>
                        <select class="input-me" disabled>
                            <option selected>${det.deposito || 'DEP01'}</option>
                        </select>
                    </div>
                    <div class="field-group">
                        <label>Orçado</label>
                        <select class="input-me" disabled>
                            <option selected>${det.orcado || 'Sim'}</option>
                        </select>
                    </div>
                    <div></div>

                    <div class="field-group span-2">
                        <label>Observações</label>
                        <textarea class="input-me" disabled>${det.observacoes || ''}</textarea>
                    </div>
                    <div></div>
                    <div></div>

                </div>
            </div>
        `;
        mainList.insertAdjacentHTML('beforeend', html);
    });

    // --- TOGGLE DO ITEM (Expandir Código) ---
    window.toggleItemRow = function(index) {
        const grid = document.getElementById(`inputGrid-${index}`);
        const icon = document.querySelector(`.toggle-icon-${index}`);
        
        if (grid.style.display === 'none' || grid.style.display === '') {
            grid.style.display = 'grid'; 
            icon.innerText = 'expand_less';
        } else {
            grid.style.display = 'none'; 
            icon.innerText = 'expand_more';
        }
    };

    // --- TOGGLE SEÇÕES GERAIS ---
    window.toggleSection = function(containerId, iconId) {
        const container = document.getElementById(containerId);
        const icon = document.getElementById(iconId);
        
        if (container.classList.contains('hidden')) {
            container.classList.remove('hidden');
            icon.innerText = 'expand_less';
        } else {
            container.classList.add('hidden');
            icon.innerText = 'expand_more';
        }
    };

    window.expandItems = function() {
        const container = document.getElementById('itemsListContainer');
        const icon = document.getElementById('iconItems');
        container.classList.remove('hidden');
        icon.innerText = 'expand_less';
    };

    // --- FINALIZAR ---
    document.getElementById('btnFinalizar').addEventListener('click', (e) => {
        e.preventDefault();
        const btn = e.currentTarget;
        btn.innerHTML = 'Processando...';
        btn.disabled = true;
        
        setTimeout(() => {
            const meId = Math.floor(69000000 + Math.random() * 100000); 
            sessionStorage.removeItem('carrinho_temp');
            sessionStorage.removeItem('cabecalho_temp');
            alert(`Pedido #${meId} enviado com sucesso!`);
            window.location.href = 'novo_pedido.html';
        }, 800);
    });

});