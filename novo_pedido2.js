document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DE UI ---
    const sidebar = document.getElementById('sidebarContainer');
    const resizeHandle = document.getElementById('resizeHandle');
    
    // --- DATA AUTOMÁTICA (HOJE) ---
    const inputData = document.getElementById('inputDataNecessidade');
    if (inputData) {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        inputData.value = `${ano}-${mes}-${dia}`;
    }

    // --- LÓGICA DE ALÇA SIDEBAR ---
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
        if (sidebar.classList.contains('closed')) {
            sidebar.classList.remove('closed');
            if (!sidebar.style.width || sidebar.style.width === '0px') sidebar.style.width = '280px';
        } else { sidebar.classList.add('closed'); }
    }

    // --- RECUPERAR DADOS DO CARRINHO ---
    const dadosSessao = sessionStorage.getItem('carrinho_temp');
    let carrinho = [];

    if (dadosSessao) {
        carrinho = JSON.parse(dadosSessao);
        renderizarSidebar(carrinho);
    }

    function renderizarSidebar(itens) {
        const container = document.getElementById('listaItensSidebar');
        const countLabel = document.getElementById('countSidebar');
        if(countLabel) countLabel.innerText = itens.length;
        if (!container) return;
        container.innerHTML = ''; 

        itens.forEach(item => {
            const html = `
                <div class="item-mini-card">
                    <span class="badge-g">G</span>
                    <div class="item-line-text">
                        ${item.codigo} - ${item.descricao}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        // Tenta preencher título automaticamente se estiver vazio
        const inputTitulo = document.getElementById('inputTitulo');
        const cabecalhoSalvo = JSON.parse(sessionStorage.getItem('cabecalho_temp'));

        if(cabecalhoSalvo && cabecalhoSalvo.titulo) {
            inputTitulo.value = cabecalhoSalvo.titulo;
            document.getElementById('selectEntrega').value = cabecalhoSalvo.localEntrega || "";
            document.getElementById('selectFaturamento').value = cabecalhoSalvo.localFaturamento || "";
            document.getElementById('inputComentarios').value = cabecalhoSalvo.comentarios || "";
        } else if(inputTitulo && itens.length > 0 && !inputTitulo.value) {
            // CORREÇÃO: "Pedido:" para "Requisição:"
            inputTitulo.value = `Requisição: ${itens[0].descricao.substring(0, 20)}...`;
        }
    }

    // --- LISTENERS PARA REMOVER ERRO VISUAL ---
    document.querySelectorAll('.mandatory-field').forEach(input => {
        input.addEventListener('input', () => input.classList.remove('input-error'));
        input.addEventListener('change', () => input.classList.remove('input-error'));
    });

    // --- BOTÃO AVANÇAR ---
    const btnAvancar = document.getElementById('btnAvancarEtapa2');
    if(btnAvancar) {
        btnAvancar.addEventListener('click', (e) => {
            e.preventDefault();

            // Referências
            const elTitulo = document.getElementById('inputTitulo');
            const elEntrega = document.getElementById('selectEntrega');
            const elCC = document.getElementById('inputCC');
            const elFat = document.getElementById('selectFaturamento');
            const elData = document.getElementById('inputDataNecessidade');
            const elObs = document.getElementById('inputComentarios');

            // Validação
            let temErro = false;
            
            const camposObrigatorios = [elTitulo, elEntrega, elFat, elCC, elData];
            
            camposObrigatorios.forEach(campo => {
                if(!campo.value || campo.value.trim() === "") {
                    campo.classList.add('input-error');
                    temErro = true;
                } else {
                    campo.classList.remove('input-error');
                }
            });

            if(temErro) return;

            // Salvar
            const cabecalhoPedido = { 
                titulo: elTitulo.value, 
                centroCusto: elCC.value, 
                localEntrega: elEntrega.value, 
                localFaturamento: elFat.value, 
                comentarios: elObs.value,
                dataNecessidade: elData.value 
            };
            
            sessionStorage.setItem('cabecalho_temp', JSON.stringify(cabecalhoPedido));
            
            btnAvancar.innerHTML = `<span>Processando...</span>`;
            setTimeout(() => { window.location.href = 'novo_pedido3.html'; }, 300);
        });
    }
});