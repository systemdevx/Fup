document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS ---
    const dadosCarrinho = sessionStorage.getItem('carrinho_temp');
    const dadosCabecalho = sessionStorage.getItem('cabecalho_temp');
    
    let carrinho = [];
    let cabecalho = {};

    if (dadosCarrinho) carrinho = JSON.parse(dadosCarrinho);
    if (dadosCabecalho) cabecalho = JSON.parse(dadosCabecalho);

    // Variáveis do Modal
    const modalOverlay = document.getElementById('modalOverlay');
    const btnModalCancel = document.getElementById('btnModalCancel');
    const btnModalConfirm = document.getElementById('btnModalConfirm');
    let itemToDeleteIndex = null;

    renderizarTudo();

    function renderizarTudo() {
        // --- Renderiza Cabeçalho ---
        document.getElementById('lblTitulo').innerText = cabecalho.titulo || '-';
        document.getElementById('lblCentroCusto').innerText = cabecalho.centroCusto || '-';

        const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        document.getElementById('lblValorTotal').innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const mapaLocais = { 'CD-SP': 'CNP', 'LOJA-RJ': 'LJR', 'MATRIZ': 'MTZ', 'VIVARA-MATRIZ': 'ALM', 'VIVARA-FILIAL': 'FL1' };
        document.getElementById('lblLocalEntrega').innerText = mapaLocais[cabecalho.localEntrega] || 'LOC';
        document.getElementById('lblLocalFat').innerText = mapaLocais[cabecalho.localFaturamento] || 'FAT';

        // --- Renderiza Lista de Itens ---
        const mainList = document.getElementById('listaItensResumo');
        const countItens = document.getElementById('countItens');
        
        if(countItens) countItens.innerText = carrinho.length;
        if(mainList) mainList.innerHTML = '';

        carrinho.forEach((item, index) => {
            const valorTotal = item.preco * item.quantidade;
            const ultimoPreco = item.preco * 1.1; 
            const grupo = item.grupo || 'ALMOXARIFADO';
            const det = item.detalhesItem || {};
            
            const html = `
                <div class="item-card-wrapper">
                    <div class="card-summary-row">
                        <div class="col-idx text-center">${index + 1}</div>
                        <div class="col-grp">${grupo}</div>
                        
                        <div class="col-code" onclick="toggleItemRow(${index})" title="Ver detalhes">
                            <span class="material-icons-outlined orange-icon toggle-icon-${index}" style="font-size:16px; padding:2px; margin-right:5px;">expand_more</span>
                            ${item.codigo}
                        </div>
                        
                        <div class="col-desc">
                            <span class="badge-g">G</span>${item.descricao}
                        </div>
                        
                        <div class="col-un text-center">${item.un}</div>
                        <div class="col-price">${ultimoPreco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        <div class="col-val">${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        
                        <div class="col-act">
                            <button class="btn-icon-only btn-delete-trigger" data-index="${index}" title="Remover item">
                                <span class="material-icons" style="font-size:18px;">close</span>
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
                            <select class="input-me" disabled><option selected>${det.aplicacao || 'Industrialização'}</option></select>
                        </div>
                        <div class="field-group">
                            <label>Tipo De Compra</label>
                            <select class="input-me" disabled><option selected>${det.tipoCompra || 'Normal'}</option></select>
                        </div>
                        <div class="field-group">
                            <label>Data Estimada</label>
                            <input type="date" class="input-me" value="${det.dataEntrega || ''}" disabled>
                        </div>
                        <div class="field-group">
                            <label>Cat. Class. Contábil</label>
                            <select class="input-me" disabled><option selected>${det.classificacao || 'Material de Consumo'}</option></select>
                        </div>
                        <div class="field-group">
                            <label>Depósito</label>
                            <select class="input-me" disabled><option selected>${det.deposito || 'DEP01'}</option></select>
                        </div>
                        <div class="field-group">
                            <label>Orçado</label>
                            <select class="input-me" disabled><option selected>${det.orcado || 'Sim'}</option></select>
                        </div>
                        <div></div>
                        <div class="field-group span-2">
                            <label>Observações</label>
                            <textarea class="input-me" disabled>${det.observacoes || ''}</textarea>
                        </div>
                        <div></div><div></div>
                    </div>
                </div>
            `;
            mainList.insertAdjacentHTML('beforeend', html);
        });

        // Re-attach listeners aos botões de delete
        document.querySelectorAll('.btn-delete-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                itemToDeleteIndex = parseInt(e.currentTarget.dataset.index);
                abrirModal();
            });
        });
    }

    // --- LÓGICA DE ANEXO ---
    const fileInput = document.getElementById('fileUploadInput');
    const txtAnexo = document.getElementById('txtAnexo');
    const iconAnexo = document.getElementById('iconAnexo');
    const btnRemove = document.getElementById('btnRemoveAnexo');
    const lblAnexoBtn = document.getElementById('lblAnexoBtn');

    if(fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files.length > 0) {
                const fileName = this.files[0].name;
                txtAnexo.innerText = fileName;
                txtAnexo.style.color = '#2E7D32'; 
                txtAnexo.style.fontWeight = '600';
                
                iconAnexo.innerText = 'check_circle';
                iconAnexo.style.color = '#2E7D32';
                
                lblAnexoBtn.style.borderColor = '#2E7D32';
                lblAnexoBtn.style.backgroundColor = '#E8F5E9';
                
                btnRemove.classList.remove('hidden');
                
                // Salva nome do anexo na sessão para passar para pg5
                sessionStorage.setItem('temp_anexo_name', fileName);
            }
        });
    }

    if(btnRemove) {
        btnRemove.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.value = ''; 
            
            txtAnexo.innerText = 'Nenhum anexo existente. Clique para adicionar.';
            txtAnexo.style.color = '#666';
            txtAnexo.style.fontWeight = '400';
            
            iconAnexo.innerText = 'attach_file';
            iconAnexo.style.color = '#666';
            
            lblAnexoBtn.style.borderColor = '#CCC';
            lblAnexoBtn.style.backgroundColor = '#FAFAFA';
            
            this.classList.add('hidden');
            sessionStorage.removeItem('temp_anexo_name');
        });
    }

    // --- TOGGLES GLOBAIS ---
    window.toggleItemRow = function(index) {
        const grid = document.getElementById(`inputGrid-${index}`);
        const icon = document.querySelector(`.toggle-icon-${index}`);
        
        if (grid.style.display === 'none' || grid.style.display === '') {
            grid.style.display = 'grid'; icon.innerText = 'expand_less';
        } else {
            grid.style.display = 'none'; icon.innerText = 'expand_more';
        }
    };

    window.toggleSection = function(containerId, iconId) {
        const container = document.getElementById(containerId);
        const icon = document.getElementById(iconId);
        if (container.classList.contains('hidden')) {
            container.classList.remove('hidden'); icon.innerText = 'expand_less';
        } else {
            container.classList.add('hidden'); icon.innerText = 'expand_more';
        }
    };

    window.expandItems = function() {
        const container = document.getElementById('itemsListContainer');
        const icon = document.getElementById('iconItems');
        container.classList.remove('hidden');
        icon.innerText = 'expand_less';
    };

    // --- MODAL ---
    function abrirModal() { modalOverlay.style.display = 'flex'; }
    function fecharModal() { modalOverlay.style.display = 'none'; itemToDeleteIndex = null; }

    if(btnModalCancel) btnModalCancel.addEventListener('click', fecharModal);

    if(btnModalConfirm) {
        btnModalConfirm.addEventListener('click', () => {
            if (itemToDeleteIndex !== null) {
                carrinho.splice(itemToDeleteIndex, 1);
                sessionStorage.setItem('carrinho_temp', JSON.stringify(carrinho));
                fecharModal();
                
                if (carrinho.length === 0) {
                    alert('Todos os itens removidos. Voltando ao início.');
                    window.location.href = 'novo_pedido.html';
                } else {
                    renderizarTudo();
                }
            }
        });
    }

    // --- FINALIZAR (Lógica Principal Ajustada) ---
    const btnFinalizar = document.getElementById('btnFinalizar');
    if(btnFinalizar) {
        btnFinalizar.addEventListener('click', (e) => {
            e.preventDefault();
            btnFinalizar.innerHTML = 'Processando...';
            btnFinalizar.disabled = true;
            
            setTimeout(() => {
                // 1. Gerar ID Único
                const meId = Math.floor(69000000 + Math.random() * 100000); 
                const nomeAnexo = sessionStorage.getItem('temp_anexo_name') || "";

                // IMPORTANTE: Converter strings para número para garantir cálculos futuros
                const itensLimpos = carrinho.map(item => ({
                    ...item,
                    preco: parseFloat(item.preco),
                    quantidade: parseInt(item.quantidade)
                }));
                
                const totalCalculado = itensLimpos.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);

                // 2. Montar objeto do pedido
                const novoPedido = {
                    id: meId,
                    cabecalho: cabecalho,
                    itens: itensLimpos,
                    total: totalCalculado,
                    status: "AGUARDANDO APROVAÇÃO",
                    dataCriacao: new Date().toLocaleDateString('pt-BR'),
                    requisitamte: "JOSE CLAUDIO CORTEZ DA SILVA",
                    nomeAnexo: nomeAnexo
                };

                // 3. Salvar no LocalStorage (Histórico Persistente)
                const historico = JSON.parse(localStorage.getItem('vivara_pedidos')) || [];
                historico.push(novoPedido);
                localStorage.setItem('vivara_pedidos', JSON.stringify(historico));

                // 4. Limpar Sessão Temporária
                sessionStorage.removeItem('carrinho_temp');
                sessionStorage.removeItem('cabecalho_temp');
                sessionStorage.removeItem('temp_anexo_name');

                // 5. Redirecionar com flag de novo pedido
                window.location.href = `novo_pedido5.html?id=${meId}&new=true`;
                
            }, 800);
        });
    }

});