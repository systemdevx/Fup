document.addEventListener('DOMContentLoaded', () => {

    const sidebar = document.getElementById('sidebarContainer');
    const resizeHandle = document.getElementById('resizeHandle');
    const btnConcluir = document.getElementById('btnConcluir');
    const accordionBtn = document.getElementById('accordionMainBtn');
    const accordionContent = document.getElementById('accordionContent');
    const accordionIcon = document.getElementById('accordionIcon');
    const totalHeader = document.getElementById('totalValorHeader');

    const modalOverlay = document.getElementById('modalOverlay');
    const btnModalCancel = document.getElementById('btnModalCancel');
    const btnModalConfirm = document.getElementById('btnModalConfirm');
    let itemToDeleteIndex = null;

    const dadosCarrinho = sessionStorage.getItem('carrinho_temp');
    let carrinho = [];
    if (dadosCarrinho) carrinho = JSON.parse(dadosCarrinho);

    if (carrinho.length === 0) {
        alert('Sessão expirada. Reinicie o processo.');
        window.location.href = 'novo_pedido.html';
    }

    renderizarTudo();

    function renderizarTudo() {
        renderizarSidebar();
        renderizarGridDetalhes();
        atualizarTotais();
    }

    function atualizarTotais() {
        const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        if(totalHeader) totalHeader.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const countLabel = document.getElementById('countSidebar');
        if(countLabel) countLabel.innerText = carrinho.length;
    }

    function renderizarSidebar() {
        const container = document.getElementById('listaItensSidebar');
        if(!container) return;
        container.innerHTML = '';

        carrinho.forEach((item) => {
            const html = `
                <div class="item-mini-card">
                    <span class="badge-g">G</span>
                    <div class="item-line-text">
                        <span>${item.codigo}</span> - ${item.descricao}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    function renderizarGridDetalhes() {
        const container = document.getElementById('itemsDetailContainer');
        if(!container) return;
        container.innerHTML = '';

        carrinho.forEach((item, index) => {
            const valorTotal = item.preco * item.quantidade;
            const detalhes = item.detalhesItem || {}; 
            
            const valQtd = item.quantidade;
            const valAplic = detalhes.aplicacao || "Industrialização";
            const valData = detalhes.dataEntrega || "";
            const valClass = detalhes.classificacao || "";
            const valDep = detalhes.deposito || "";
            const valOrcado = detalhes.orcado || "S";
            const valTipo = detalhes.tipoCompra || "";
            const valObs = detalhes.observacoes || "";
            const grupo = item.grupo || 'ALMOXARIFADO';
            const ultimoPreco = item.preco * 1.1;

            const detailHtml = `
                <div class="item-detail-card" data-index="${index}">
                    
                    <div class="card-summary-row">
                        <div class="col-idx text-center">${index + 1}</div>
                        <div class="col-grp">${grupo}</div>
                        
                        <div class="col-code" onclick="toggleItemRow(${index})" title="Ver detalhes">
                            <span class="material-icons-outlined toggle-icon-clean toggle-icon-${index}">expand_more</span>
                            ${item.codigo}
                        </div>
                        
                        <div class="col-desc">
                            <span class="badge-g" style="margin-right:5px;">G</span>${item.descricao}
                        </div>
                        
                        <div class="col-un text-center">${item.un}</div>
                        <div class="col-price">${ultimoPreco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        <div class="col-val">${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        
                        <div class="col-act">
                            <button class="btn-delete-item" title="Excluir item" data-index="${index}">
                                <span class="material-icons">close</span>
                            </button>
                        </div>
                    </div>

                    <div class="card-inputs-grid" id="inputGrid-${index}">
                        <div class="field-group">
                            <label>Quantidade</label>
                            <input type="number" class="input-me mandatory-border input-qtd" value="${valQtd}" min="1">
                        </div>
                        <div class="field-group">
                            <label>Aplicação</label>
                            <select class="input-me mandatory-border input-aplicacao">
                                <option value="Industrialização" ${valAplic === 'Industrialização' ? 'selected' : ''}>Industrialização</option>
                                <option value="Uso e Consumo" ${valAplic === 'Uso e Consumo' ? 'selected' : ''}>Uso e Consumo</option>
                            </select>
                        </div>
                        <div class="field-group">
                            <label>Tipo De Compra</label>
                            <select class="input-me input-tipo">
                                <option value="Normal" ${valTipo === 'Normal' ? 'selected' : ''}>Normal</option>
                                <option value="Urgente" ${valTipo === 'Urgente' ? 'selected' : ''}>Urgente</option>
                            </select>
                        </div>
                        <div class="field-group">
                            <label>Data Estimada</label>
                            <input type="date" class="input-me mandatory-border input-data" value="${valData}">
                        </div>

                        <div class="field-group">
                            <label>Cat. Class. Contábil</label>
                            <select class="input-me mandatory-border input-classificacao">
                                <option value="" disabled selected>Selecione</option>
                                <option value="Material de Consumo" ${valClass === 'Material de Consumo' ? 'selected' : ''}>Material de Consumo</option>
                                <option value="Ativo" ${valClass === 'Ativo' ? 'selected' : ''}>Ativo</option>
                            </select>
                        </div>
                        <div class="field-group">
                            <label>Depósito</label>
                            <select class="input-me mandatory-border input-deposito">
                                <option value="" disabled selected>Selecione</option>
                                <option value="DEP01" ${valDep === 'DEP01' ? 'selected' : ''}>DEP01</option>
                            </select>
                        </div>
                        <div class="field-group">
                            <label>Orçado</label>
                            <select class="input-me mandatory-border input-orcado">
                                <option value="" disabled selected>Selecione</option>
                                <option value="Sim" ${valOrcado === 'Sim' ? 'selected' : ''}>Sim</option>
                                <option value="Não" ${valOrcado === 'Não' ? 'selected' : ''}>Não</option>
                            </select>
                        </div>
                        <div></div>

                        <div class="field-group span-2">
                            <label>Observações</label>
                            <textarea class="input-me input-obs">${valObs}</textarea>
                        </div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', detailHtml);
        });

        // Listeners
        container.querySelectorAll('select, input, textarea').forEach(input => {
            input.addEventListener('change', (e) => {
                salvarDadosGridParaCarrinho();
                if(e.target.classList.contains('input-qtd')) renderizarTudo();
            });
        });

        container.querySelectorAll('.btn-delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                itemToDeleteIndex = parseInt(e.currentTarget.dataset.index);
                abrirModal();
            });
        });
    }

    // Toggle
    window.toggleItemRow = function(index) {
        const grid = document.getElementById(`inputGrid-${index}`);
        const icon = document.querySelector(`.toggle-icon-${index}`);
        if (grid.style.display === 'none' || grid.style.display === '') {
            grid.style.display = 'grid'; icon.innerText = 'expand_less';
        } else {
            grid.style.display = 'none'; icon.innerText = 'expand_more';
        }
    };

    function salvarDadosGridParaCarrinho() {
        const cards = document.querySelectorAll('.item-detail-card');
        cards.forEach((card, index) => {
            if (carrinho[index]) {
                const qtd = parseInt(card.querySelector('.input-qtd').value) || 1;
                carrinho[index].quantidade = qtd;
                carrinho[index].detalhesItem = {
                    dataEntrega: card.querySelector('.input-data').value,
                    aplicacao: card.querySelector('.input-aplicacao').value,
                    classificacao: card.querySelector('.input-classificacao').value,
                    deposito: card.querySelector('.input-deposito').value,
                    orcado: card.querySelector('.input-orcado').value,
                    tipoCompra: card.querySelector('.input-tipo').value,
                    observacoes: card.querySelector('.input-obs').value
                };
            }
        });
        sessionStorage.setItem('carrinho_temp', JSON.stringify(carrinho));
    }

    // Alça logic
    let isResizing = false, isDragging = false, startX = 0, startWidth = 0;
    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault(); isResizing = true; isDragging = false; 
        startX = e.clientX; startWidth = sidebar.getBoundingClientRect().width;
        if (sidebar.classList.contains('closed')) startWidth = 0;
        sidebar.style.transition = 'none'; resizeHandle.classList.add('dragging'); document.body.style.cursor = 'col-resize';
    });
    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) isDragging = true;
        if (isDragging) {
            let newWidth = startWidth + dx;
            if (newWidth < 150) newWidth = 0; if (newWidth > 600) newWidth = 600;
            if (newWidth > 0) sidebar.style.width = `${newWidth}px`; else sidebar.style.width = '0px';
        }
    });
    window.addEventListener('mouseup', (e) => {
        if (!isResizing) return;
        isResizing = false; resizeHandle.classList.remove('dragging'); document.body.style.cursor = '';
        sidebar.style.transition = 'width 0.3s ease';
        if (!isDragging) toggleSidebar(); 
        else {
            const finalWidth = sidebar.getBoundingClientRect().width;
            if (finalWidth < 100) { sidebar.classList.add('closed'); sidebar.style.width = ''; } 
            else { sidebar.classList.remove('closed'); if(finalWidth < 200) sidebar.style.width = '200px'; }
        }
    });
    function toggleSidebar() {
        if (sidebar.classList.contains('closed')) { sidebar.classList.remove('closed'); if (!sidebar.style.width || sidebar.style.width === '0px') sidebar.style.width = '280px'; } 
        else { sidebar.classList.add('closed'); }
    }

    if(accordionBtn && accordionContent) {
        accordionBtn.addEventListener('click', () => {
            if (accordionContent.style.display === 'none') { accordionContent.style.display = 'block'; accordionIcon.innerText = 'expand_less'; } 
            else { accordionContent.style.display = 'none'; accordionIcon.innerText = 'expand_more'; }
        });
    }

    btnConcluir.addEventListener('click', () => {
        salvarDadosGridParaCarrinho();
        let erro = false;
        carrinho.forEach(item => { if(!item.detalhesItem?.dataEntrega) erro = true; });
        if (erro) { alert('Por favor, preencha a Data Estimada para todos os itens.'); return; }
        btnConcluir.innerHTML = 'Processando...';
        setTimeout(() => { window.location.href = 'novo_pedido4.html'; }, 300);
    });

    // Modal
    function abrirModal() { modalOverlay.style.display = 'flex'; }
    function fecharModal() { modalOverlay.style.display = 'none'; itemToDeleteIndex = null; }
    btnModalCancel.addEventListener('click', fecharModal);
    btnModalConfirm.addEventListener('click', () => {
        if (itemToDeleteIndex !== null) {
            carrinho.splice(itemToDeleteIndex, 1);
            sessionStorage.setItem('carrinho_temp', JSON.stringify(carrinho));
            fecharModal();
            if(carrinho.length === 0) {
                alert('Todos os itens removidos.');
                window.location.href = 'novo_pedido.html';
            } else {
                renderizarTudo();
            }
        }
    });
});