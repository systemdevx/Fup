document.addEventListener('DOMContentLoaded', () => {

    // 1. SETUP DROPDOWNS
    function setupDropdown(btnId, menuId) {
        const btn = document.getElementById(btnId);
        const menu = document.getElementById(menuId);
        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.dropdown-menu').forEach(m => { if (m !== menu) m.classList.remove('show'); });
                menu.classList.toggle('show');
            });
        }
    }
    setupDropdown('btnMaisOpcoes', 'menuMaisOpcoes');
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('show'));
    });

    // 2. RECUPERAR ID
    const params = new URLSearchParams(window.location.search);
    const pedidoId = params.get('id');
    const isNew = params.get('new');

    // Banner
    if (isNew === 'true') {
        const banner = document.getElementById('successBanner');
        const bannerId = document.getElementById('bannerId');
        if(banner) banner.style.display = 'flex';
        if(bannerId) bannerId.innerText = `ME# ${pedidoId}`;
        const newUrl = window.location.pathname + `?id=${pedidoId}`;
        window.history.replaceState({}, document.title, newUrl);
    }

    // 3. BUSCAR DADOS
    const historico = JSON.parse(localStorage.getItem('vivara_pedidos')) || [];
    const pedido = historico.find(p => p.id == pedidoId);

    if (!pedido) {
        alert('Erro: Requisição não encontrada no histórico.');
        window.location.href = 'transacoes.html'; 
        return;
    }

    // 4. RENDERIZAR
    renderizarPedido(pedido);

    function renderizarPedido(p) {
        document.getElementById('viewId').innerText = `ME# ${p.id}`;
        
        const cab = p.cabecalho || {};
        const titulo = cab.titulo || 'SEM TÍTULO';
        
        document.getElementById('viewTitulo').innerText = titulo.toUpperCase();
        document.getElementById('infoTitulo').innerText = titulo;
        
        document.getElementById('viewDataCriacao').innerText = `Criado em: ${p.dataCriacao}`;
        
        const elStatus = document.getElementById('viewStatus');
        elStatus.innerText = p.status;
        
        if (p.status.includes('CANCELADO')) {
            elStatus.style.color = '#D32F2F'; 
            // CORREÇÃO: "Requisição" em vez de "Pedido"
            document.getElementById('txtHistoricoCriacao').innerHTML = `Requisição <strong>CANCELADA</strong>. <br><span style="font-size:12px; font-weight:400; color:#555;">Motivo: ${p.justificativaCancelamento || 'Não informado'}</span>`;
            
            const iconHist = document.getElementById('txtHistoricoCriacao').previousElementSibling;
            if(iconHist) {
                iconHist.style.color = '#D32F2F';
                iconHist.innerText = 'cancel'; 
            }

            const elHistStatus = document.getElementById('historicoStatusAtual');
            if(elHistStatus) elHistStatus.style.display = 'none';
            
            const btnMais = document.getElementById('btnMaisOpcoes');
            const btnCancel = document.getElementById('btnCancelarPedidoTrigger');
            if(btnMais) btnMais.disabled = true;
            if(btnCancel) {
                btnCancel.disabled = true;
                btnCancel.style.opacity = '0.5';
                btnCancel.style.cursor = 'not-allowed';
            }
        } else {
            elStatus.style.color = p.status.includes('AGUARDANDO') ? '#1A56DB' : '#00C853';
        }

        document.getElementById('viewRequisitante').innerText = p.requisitamte;
        document.getElementById('infoRequisitante').innerText = p.requisitamte;
        document.getElementById('infoMeId').innerText = p.id;
        document.getElementById('infoCC').innerText = cab.centroCusto || '-';

        const mapaLocais = { 'CD-SP': 'CNP', 'LOJA-RJ': 'LJR', 'MATRIZ': 'MTZ', 'VIVARA-MATRIZ': 'ALM', 'VIVARA-FILIAL': 'FL1' };
        const mapaEnderecos = {
            'CD-SP': 'RODOVIA VICE-PREFEITO HERMENEGILDO TONOLLI, 1500',
            'LOJA-RJ': 'AV. DAS AMÉRICAS, 4666 - BARRA DA TIJUCA',
            'MATRIZ': 'RUA VERBO DIVINO, 1207 - SÃO PAULO',
            'VIVARA-MATRIZ': 'RUA VERBO DIVINO, 1207 - ED. SÃO JOSÉ',
            'VIVARA-FILIAL': 'AV. DO TURISMO, 2000 - MANAUS'
        };

        const localEnt = cab.localEntrega;
        const localFat = cab.localFaturamento;

        document.getElementById('viewLocalEntrega').innerText = mapaLocais[localEnt] || 'LOC';
        document.getElementById('viewEnderecoEntrega').innerText = mapaEnderecos[localEnt] || 'Endereço não cadastrado';
        document.getElementById('viewLocalFat').innerText = mapaLocais[localFat] || 'FAT';
        document.getElementById('viewEnderecoFat').innerText = mapaEnderecos[localFat] || 'Endereço não cadastrado';

        const txtAnexo = document.getElementById('txtAnexoView');
        const iconAnexo = document.getElementById('iconAnexoView');
        
        if (p.nomeAnexo && p.nomeAnexo !== "") {
            txtAnexo.innerText = p.nomeAnexo;
            txtAnexo.style.color = '#2E7D32';
            txtAnexo.style.fontWeight = '600';
            iconAnexo.innerText = 'description';
            iconAnexo.style.color = '#2E7D32';
        } else {
            txtAnexo.innerText = 'Nenhum anexo existente.';
            txtAnexo.style.color = '#555';
            txtAnexo.style.fontWeight = '400';
            iconAnexo.innerText = 'attach_file';
            iconAnexo.style.color = '#555';
        }

        const listaFinal = document.getElementById('listaItensFinal');
        if(listaFinal) {
            listaFinal.innerHTML = '';
            const itens = p.itens || [];
            const totalGeral = itens.reduce((acc, i) => acc + (parseFloat(i.preco) * parseInt(i.quantidade)), 0);
            
            document.getElementById('infoTotal').innerText = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.getElementById('cntItens').innerText = itens.length;

            itens.forEach((item, index) => {
                const preco = parseFloat(item.preco);
                const qtd = parseInt(item.quantidade);
                const totalItem = preco * qtd;
                
                const html = `
                    <div class="item-row-final">
                        <div class="t-col-idx">${index + 1}</div>
                        <div style="font-weight:600; color:#E67E22;">${item.codigo}</div>
                        <div><span class="badge-g">G</span> ${item.descricao}</div>
                        <div class="t-col-un" style="text-align:center;">${item.un}</div>
                        <div class="t-col-qtd" style="text-align:center;">${qtd}</div>
                        <div class="t-col-price">${preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        <div class="t-col-total" style="font-weight:600;">${totalItem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        <div class="t-col-actions" style="font-size:12px; color:${p.status.includes('CANCELADO') ? '#D32F2F' : '#2E7D32'};">
                            ${p.status.includes('CANCELADO') ? 'Cancelado' : 'Disponível'}
                        </div>
                    </div>
                `;
                listaFinal.insertAdjacentHTML('beforeend', html);
            });
        }
    }

    function carregarDadosNaSessao(p) {
        sessionStorage.setItem('cabecalho_temp', JSON.stringify(p.cabecalho));
        sessionStorage.setItem('carrinho_temp', JSON.stringify(p.itens));
        if(p.nomeAnexo) sessionStorage.setItem('temp_anexo_name', p.nomeAnexo);
    }

    const btnEdit = document.getElementById('btnActionEditar');
    if(btnEdit) {
        btnEdit.addEventListener('click', () => {
            carregarDadosNaSessao(pedido);
            window.location.href = 'novo_pedido.html'; 
        });
    }

    const btnCancelItems = document.getElementById('btnActionCancelarItens');
    if(btnCancelItems) {
        btnCancelItems.addEventListener('click', () => {
            carregarDadosNaSessao(pedido);
            window.location.href = 'novo_pedido3.html';
        });
    }

    const modalCancel = document.getElementById('modalCancelOrder');
    const btnTriggerCancel = document.getElementById('btnCancelarPedidoTrigger');
    const btnCloseModal = document.getElementById('btnModalCloseOrder');
    const btnConfirmCancel = document.getElementById('btnModalConfirmOrder');
    const txtJustificativa = document.getElementById('txtJustificativa');

    if(btnTriggerCancel) {
        btnTriggerCancel.addEventListener('click', () => {
            if(!btnTriggerCancel.disabled) {
                modalCancel.style.display = 'flex';
                txtJustificativa.value = '';
            }
        });
    }

    if(btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            modalCancel.style.display = 'none';
        });
    }

    if(btnConfirmCancel) {
        btnConfirmCancel.addEventListener('click', () => {
            const justificativa = txtJustificativa.value.trim();
            if(!justificativa) {
                alert('Por favor, informe a justificativa do cancelamento.');
                txtJustificativa.focus();
                return;
            }

            pedido.status = "CANCELADO";
            pedido.justificativaCancelamento = justificativa;

            const index = historico.findIndex(p => p.id == pedidoId);
            if(index !== -1) {
                historico[index] = pedido;
                localStorage.setItem('vivara_pedidos', JSON.stringify(historico));
            }

            modalCancel.style.display = 'none';
            alert('Requisição cancelada com sucesso.');
            renderizarPedido(pedido);
        });
    }

    window.toggleSection = function(headerElement) {
        const content = headerElement.nextElementSibling;
        const icon = headerElement.querySelector('.toggle-orange');
        if (content) {
            if (content.style.display === 'none') {
                content.style.display = content.classList.contains('info-grid') ? 'grid' : 'block';
                if(icon) icon.innerText = 'expand_less';
            } else {
                content.style.display = 'none';
                if(icon) icon.innerText = 'expand_more';
            }
        }
    };
});