document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS ---
    const sidebar = document.getElementById('sidebarContainer');
    const resizeHandle = document.getElementById('resizeHandle');
    const btnConcluir = document.getElementById('btnConcluir');
    const accordionBtn = document.getElementById('accordionMainBtn');
    const accordionContent = document.getElementById('accordionContent');
    const accordionIcon = document.getElementById('accordionIcon');
    const totalHeader = document.getElementById('totalValorHeader');

    // --- 1. DADOS ---
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

    // --- 2. RENDERIZAR SIDEBAR (Leitura) ---
    function renderizarSidebar() {
        const container = document.getElementById('listaItensSidebar');
        if(!container) return;
        container.innerHTML = '';

        carrinho.forEach((item) => {
            const html = `
                <div class="item-mini-card">
                    <div class="badge-g">G</div>
                    <div class="item-info">
                        <span class="item-code">${item.codigo}</span>
                        <span class="item-desc">${item.descricao}</span>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    // --- 3. GRID PRINCIPAL ---
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

            const detailHtml = `
                <div class="item-detail-card" data-index="${index}">
                    
                    <div class="card-summary-row">
                        <div class="col-idx text-center">
                            <span class="material-icons-outlined orange-icon" style="font-size:14px; padding:2px;">expand_less</span>
                            ${index + 1}
                        </div>
                        <div class="col-erp"><span class="erp-code">${item.codigo}</span></div>
                        <div class="col-cli"><span class="material-icons check-icon">done</span> ${item.codigo}</div>
                        <div class="col-desc"><span class="badge-g">G</span> <strong>${item.descricao}</strong></div>
                        <div class="col-val">${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        <div class="col-act">
                            <button class="btn-delete-item" title="Excluir item" data-index="${index}">
                                <span class="material-icons">close</span>
                            </button>
                        </div>
                    </div>

                    <div class="card-inputs-grid">
                        <div class="field-group">
                            <label>Grupo / Catálogo</label>
                            <div class="ro-value">${item.grupo || 'ALMOXARIFADO'}</div>
                        </div>
                        <div class="field-group">
                            <label>Código Produto ERP</label>
                            <div class="ro-value">${item.codigo}</div>
                        </div>
                        <div class="field-group">
                            <label>Unidade</label>
                            <div class="ro-value">${item.un}</div>
                        </div>
                        <div class="field-group">
                            <label>Quantidade</label>
                            <input type="number" class="input-me mandatory-border input-qtd" value="${valQtd}" min="1">
                        </div>

                        <div class="field-group">
                            <label>Ultimo Preço Pago</label>
                            <div class="ro-value">${(item.preco * 1.1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
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
                                <option value="Normal">Normal</option>
                                <option value="Urgente">Urgente</option>
                            </select>
                        </div>
                        <div class="field-group">
                            <label>Data Estimada</label>
                            <input type="date" class="input-me mandatory-border input-data" value="${valData}">
                        </div>

                        <div class="field-group">
                            <label>Cat. Class. Contábil</label>
                            <select class="input-me mandatory-border input-classificacao">
                                <option value="" selected>Selecione</option>
                                <option value="Material de Consumo" ${valClass === 'Material de Consumo' ? 'selected' : ''}>Material de Consumo</option>
                                <option value="Ativo" ${valClass === 'Ativo' ? 'selected' : ''}>Ativo</option>
                            </select>
                        </div>
                        <div class="field-group">
                            <label>Complemento</label>
                            <textarea class="input-me input-complemento"></textarea>
                        </div>
                        <div class="field-group span-2">
                            <label>Observações</label>
                            <textarea class="input-me input-obs"></textarea>
                        </div>

                        <div class="field-group">
                            <label>Depósito</label>
                            <select class="input-me mandatory-border input-deposito">
                                <option value="" selected>Selecione</option>
                                <option value="DEP01">DEP01</option>
                            </select>
                        </div>
                        <div class="field-group">
                            <label>Orçado</label>
                            <select class="input-me mandatory-border input-orcado">
                                <option value="" selected>Selecione</option>
                                <option value="Sim" ${valOrcado === 'Sim' ? 'selected' : ''}>Sim</option>
                                <option value="Não" ${valOrcado === 'Não' ? 'selected' : ''}>Não</option>
                            </select>
                        </div>
                        <div></div> <div></div> </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', detailHtml);
        });

        // Listeners
        container.querySelectorAll('select, input, textarea').forEach(input => {
            input.addEventListener('change', (e) => {
                salvarDadosGridParaCarrinho();
                if(e.target.classList.contains('input-qtd')) {
                    renderizarTudo(); 
                }
            });
        });

        container.querySelectorAll('.btn-delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                if(confirm('Tem certeza que deseja remover este item?')) {
                    carrinho.splice(idx, 1);
                    sessionStorage.setItem('carrinho_temp', JSON.stringify(carrinho));
                    if(carrinho.length === 0) {
                        alert('Todos os itens removidos. Voltando ao catálogo.');
                        window.location.href = 'novo_pedido.html';
                    } else {
                        renderizarTudo();
                    }
                }
            });
        });
    }

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
                    tipoCompra: card.querySelector('.input-tipo').value
                };
            }
        });
        sessionStorage.setItem('carrinho_temp', JSON.stringify(carrinho));
    }


    // --- 4. ALÇA: CLIQUE (OCULTAR) e ARRASTE (AJUSTAR) ---
    
    let isResizing = false;
    let isDragging = false; 
    let startX = 0;
    let startWidth = 0;

    // A. CLIQUE PRESSIONADO (Início)
    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        isDragging = false; // Resetamos: por enquanto é um clique
        startX = e.clientX;
        startWidth = sidebar.getBoundingClientRect().width;

        // Se estiver fechado (0px), preparamos a largura inicial se for um arraste
        if (sidebar.classList.contains('closed')) {
            startWidth = 0;
            // Não removemos a classe 'closed' imediatamente para não piscar se for só um clique
        }

        sidebar.style.transition = 'none'; // Desliga animação para o arraste ser fluido
        resizeHandle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
    });

    // B. MOVIMENTO DO MOUSE (Window, para não perder o foco)
    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const dx = e.clientX - startX;

        // Se mover mais de 5 pixels, consideramos ARRASTE
        if (Math.abs(dx) > 5) {
            isDragging = true;
            
            // Se começou a arrastar e estava fechado, agora abrimos visualmente
            if (sidebar.classList.contains('closed')) {
                sidebar.classList.remove('closed');
                // Mas definimos a width inline para 0 para começar o calculo
                sidebar.style.width = '0px'; 
            }
        }

        // Se for arraste, atualiza a largura
        if (isDragging) {
            let newWidth = startWidth + dx;

            // Limites
            if (newWidth < 150) newWidth = 0; // Cola no zero se for muito pequeno
            if (newWidth > 600) newWidth = 600;

            sidebar.style.width = `${newWidth}px`;
        }
    });

    // C. SOLTAR O MOUSE
    window.addEventListener('mouseup', (e) => {
        if (!isResizing) return;
        
        isResizing = false;
        resizeHandle.classList.remove('dragging');
        document.body.style.cursor = '';
        sidebar.style.transition = 'width 0.3s ease'; // Religa animação

        if (!isDragging) {
            // --- FOI UM CLIQUE SIMPLES ---
            toggleSidebar();
        } else {
            // --- FOI UM ARRASTE ---
            const finalWidth = sidebar.getBoundingClientRect().width;
            
            // Se soltou muito pequeno, fecha de vez
            if (finalWidth < 100) {
                sidebar.classList.add('closed');
                sidebar.style.width = ''; // Limpa width inline
            } else {
                sidebar.classList.remove('closed');
                // Garante um mínimo visual se ficou aberto
                if(finalWidth < 200) sidebar.style.width = '200px';
            }
        }
    });

    function toggleSidebar() {
        if (sidebar.classList.contains('closed')) {
            // Abrir
            sidebar.classList.remove('closed');
            // Se não tem largura definida, usa padrão
            if (!sidebar.style.width || sidebar.style.width === '0px') {
                sidebar.style.width = '280px';
            }
        } else {
            // Fechar
            sidebar.classList.add('closed');
        }
    }

    // Accordion
    if(accordionBtn && accordionContent) {
        accordionBtn.addEventListener('click', () => {
            if (accordionContent.style.display === 'none') {
                accordionContent.style.display = 'block';
                accordionIcon.innerText = 'expand_less';
            } else {
                accordionContent.style.display = 'none';
                accordionIcon.innerText = 'expand_more';
            }
        });
    }

    // --- 5. AÇÃO AVANÇAR ---
    btnConcluir.addEventListener('click', () => {
        salvarDadosGridParaCarrinho();
        let erro = false;
        carrinho.forEach(item => {
            if(!item.detalhesItem?.dataEntrega) erro = true;
        });

        if (erro) {
            alert('Por favor, preencha a Data Estimada para todos os itens.');
            return;
        }

        btnConcluir.innerHTML = 'Processando...';
        setTimeout(() => {
            window.location.href = 'novo_pedido4.html';
        }, 300);
    });
});