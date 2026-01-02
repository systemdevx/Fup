document.addEventListener('DOMContentLoaded', () => {

    // --- FUNÇÃO GENÉRICA PARA DROPDOWNS ---
    function setupDropdown(btnId, menuId) {
        const btn = document.getElementById(btnId);
        const menu = document.getElementById(menuId);

        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Fecha outros menus abertos
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m !== menu) m.classList.remove('show');
                });
                menu.classList.toggle('show');
            });
        }
    }

    setupDropdown('btnMaisOpcoes', 'menuMaisOpcoes');
    setupDropdown('btnOpcoesDireita', 'menuOpcoesDireita');

    // Fechar menus ao clicar fora
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });

    // --- LÓGICA DE DADOS (RECUPERAR PEDIDO) ---
    const params = new URLSearchParams(window.location.search);
    const pedidoId = params.get('id');

    if (!pedidoId) {
        alert('Pedido não encontrado.');
        window.location.href = 'transacoes.html'; 
        return;
    }

    const historico = JSON.parse(localStorage.getItem('vivara_pedidos')) || [];
    const pedido = historico.find(p => p.id == pedidoId);

    if (!pedido) {
        alert('Pedido ID ' + pedidoId + ' não encontrado no histórico.');
        return;
    }

    // --- PREENCHER A TELA ---

    // Header
    document.getElementById('viewId').innerText = `ME# ${pedido.id}`;

    // Remove "PEDIDO:" do título se existir para ficar mais limpo
    let tituloLimpo = pedido.cabecalho.titulo || '';
    tituloLimpo = tituloLimpo.replace(/^PEDIDO:\s*/i, ''); 
    document.getElementById('viewTitulo').innerText = tituloLimpo.toUpperCase();
    
    document.getElementById('viewDataCriacao').innerText = `Criado em: ${pedido.dataCriacao}`;
    
    // Status
    const elStatus = document.getElementById('viewStatus');
    elStatus.innerText = pedido.status.toUpperCase();
    if(pedido.status.toLowerCase().includes('aprovado')) {
        elStatus.style.color = '#00C853'; 
    } else {
        elStatus.style.color = '#1A56DB'; 
    }

    // Endereços
    const siglaMap = { 'CD-SP': 'CNP', 'LOJA-RJ': 'LJR', 'MATRIZ': 'MTZ', 'VIVARA-MATRIZ': 'ALM' };
    const enderecoMap = { 
        'CD-SP': 'RUA VERBO DIVINO, 1207 - SP', 
        'MATRIZ': 'AV. DAS AMÉRICAS, 400 - RJ',
        'VIVARA-MATRIZ': 'RUA VERBO DIVINO, 1207 - EDIFÍCIO SÃO JOSÉ' 
    };
    const siglaEntrega = siglaMap[pedido.cabecalho.localEntrega] || 'LOC';
    const siglaFat = siglaMap[pedido.cabecalho.localFaturamento] || 'FAT';

    document.getElementById('viewLocalEntrega').innerText = siglaEntrega;
    document.getElementById('viewEnderecoEntrega').innerText = enderecoMap[pedido.cabecalho.localEntrega] || 'Endereço padrão Vivara...';

    document.getElementById('viewLocalFat').innerText = siglaFat;
    document.getElementById('viewEnderecoFat').innerText = enderecoMap[pedido.cabecalho.localFaturamento] || 'Endereço Faturamento...';

    // Infos Gerais
    document.getElementById('infoTitulo').innerText = tituloLimpo; 
    document.getElementById('infoRequisitante').innerText = 'JOSE CLAUDIO CORTEZ DA SILVA'; 
    document.getElementById('infoMeId').innerText = pedido.id;
    document.getElementById('infoData').innerText = pedido.dataCriacao;
    document.getElementById('infoCC').innerText = pedido.cabecalho.centroCusto;
    document.getElementById('infoTotal').innerText = pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('histData').innerText = pedido.dataCriacao;

    // Tabela Itens
    const containerItens = document.getElementById('listaItensFinal');
    document.getElementById('cntItens').innerText = pedido.itens.length;
    
    containerItens.innerHTML = '';

    pedido.itens.forEach((item, index) => {
        const totalItem = item.preco * item.quantidade;

        const html = `
            <div class="item-row-final">
                <div style="width:40px; text-align:center;">${index + 1}</div>
                <div style="width:140px; font-weight:600; color:#E67E22;">${item.codigo}</div>
                <div style="flex:1;">
                    <span class="badge-g">G</span> <strong>${item.descricao}</strong>
                </div>
                <div style="width:80px;">${item.un}</div>
                <div style="width:100px;">${item.quantidade},000</div>
                <div style="width:140px; text-align:right;">${item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                <div style="width:140px; text-align:right; font-weight:600;">${totalItem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                <div style="width:60px; text-align:right;">...</div>
            </div>
        `;
        containerItens.insertAdjacentHTML('beforeend', html);
    });

    // --- LÓGICA DE EXPANDIR/RECOLHER (ACCORDION) ---
    // Seleciona todos os cabeçalhos das seções
    const headersAccordion = document.querySelectorAll('.section-title');

    headersAccordion.forEach(header => {
        // Adiciona cursor de clique para indicar interatividade
        header.style.cursor = 'pointer';

        header.addEventListener('click', () => {
            // O conteúdo é sempre o próximo elemento irmão da div do título
            const content = header.nextElementSibling;
            const icon = header.querySelector('.material-icons-outlined');

            if (content) {
                if (content.style.display === 'none') {
                    // SE ESTIVER OCULTO -> MOSTRAR
                    content.style.display = ''; // Remove o inline style, voltando ao padrão do CSS (block ou grid)
                    if(icon) icon.innerText = 'expand_less'; // Seta para cima
                } else {
                    // SE ESTIVER VISÍVEL -> OCULTAR
                    content.style.display = 'none';
                    if(icon) icon.innerText = 'expand_more'; // Seta para baixo
                }
            }
        });
    });

});