document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS ---
    const sidebar = document.getElementById('sidebarContainer');
    const resizeHandle = document.getElementById('resizeHandle');
    
    // --- LÓGICA DE ALÇA (CLIQUE vs ARRASTE) ---
    let isResizing = false;
    let isDragging = false; 
    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        isDragging = false; 
        startX = e.clientX;
        startWidth = sidebar.getBoundingClientRect().width;
        if (sidebar.classList.contains('closed')) startWidth = 0;
        
        sidebar.style.transition = 'none'; 
        resizeHandle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) {
            isDragging = true;
            if (sidebar.classList.contains('closed')) {
                sidebar.classList.remove('closed');
                sidebar.style.width = '0px'; 
            }
        }
        if (isDragging) {
            let newWidth = startWidth + dx;
            if (newWidth < 150) newWidth = 0; 
            if (newWidth > 600) newWidth = 600;
            if (newWidth > 0) sidebar.style.width = `${newWidth}px`; 
            else sidebar.style.width = '0px';
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (!isResizing) return;
        isResizing = false;
        resizeHandle.classList.remove('dragging');
        document.body.style.cursor = '';
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
        } else {
            sidebar.classList.add('closed');
        }
    }


    // --- DADOS E FORMULÁRIO ---
    const dadosSessao = sessionStorage.getItem('carrinho_temp');
    let carrinho = [];

    if (dadosSessao) {
        carrinho = JSON.parse(dadosSessao);
        renderizarSidebar(carrinho);
    } else {
        alert('Carrinho vazio.');
        window.location.href = 'novo_pedido.html';
    }

    function renderizarSidebar(itens) {
        const container = document.getElementById('listaItensSidebar');
        const countLabel = document.getElementById('countSidebar');
        if(countLabel) countLabel.innerText = itens.length;
        if (!container) return;
        container.innerHTML = ''; 

        itens.forEach(item => {
            // FORMATO: G CÓDIGO - DESCRIÇÃO (Sem quantidade, sem negrito extra)
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

        const inputTitulo = document.getElementById('inputTitulo');
        if(inputTitulo && itens.length > 0) {
            inputTitulo.value = `Pedido: ${itens[0].descricao.substring(0, 20)}...`;
        }
    }

    const btnAvancar = document.getElementById('btnAvancarEtapa2');
    if(btnAvancar) {
        btnAvancar.addEventListener('click', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('inputTitulo').value;
            const localEntrega = document.getElementById('selectEntrega').value;
            const cc = document.getElementById('inputCC').value;
            const localFat = document.getElementById('selectFaturamento').value;
            const comentarios = document.getElementById('inputComentarios').value;

            if(!titulo || !localEntrega || !localFat || !cc) {
                alert('Preencha os campos obrigatórios.');
                return;
            }

            const cabecalhoPedido = { titulo, centroCusto: cc, localEntrega, localFaturamento: localFat, comentarios };
            sessionStorage.setItem('cabecalho_temp', JSON.stringify(cabecalhoPedido));
            
            btnAvancar.innerHTML = `<span>Processando...</span>`;
            setTimeout(() => { window.location.href = 'novo_pedido3.html'; }, 300);
        });
    }
});