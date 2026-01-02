document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS ---
    const sidebar = document.getElementById('sidebarContainer');
    const resizeHandle = document.getElementById('resizeHandle');
    
    // --- LÓGICA DE INTERAÇÃO NA ALÇA ---
    let isResizing = false;
    let startX = 0;
    let currentWidth = 280;

    // 1. DUPLO CLIQUE (TOGGLE)
    // "Se clicar duas vezes a alça é desoculta/oculta sem precisar pressionar"
    resizeHandle.addEventListener('dblclick', (e) => {
        toggleSidebar();
    });

    // 2. PRESSIONAR (INÍCIO DO ARRASTE)
    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        startX = e.clientX;
        currentWidth = sidebar.getBoundingClientRect().width;
        
        // Se estiver fechado e começar a arrastar, abre imediatamente para redimensionar
        if (sidebar.classList.contains('closed')) {
            currentWidth = 0;
            sidebar.classList.remove('closed'); 
            sidebar.style.width = '0px';
        }

        // Desativa transição para arraste fluído
        sidebar.style.transition = 'none';
        resizeHandle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
    });

    // 3. MOVER MOUSE (ARRASTAR)
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const dx = e.clientX - startX;
        let newWidth = currentWidth + dx;

        // Limites de tamanho
        if (newWidth < 200) newWidth = 200; 
        if (newWidth > 600) newWidth = 600;

        // Se arrastar muito para a esquerda, visualmente fecha
        if (newWidth < 150) {
            sidebar.style.width = '0px'; 
        } else {
            sidebar.style.width = `${newWidth}px`;
        }
    });

    // 4. SOLTAR MOUSE (FIM DO ARRASTE)
    document.addEventListener('mouseup', (e) => {
        if (!isResizing) return;
        
        isResizing = false;
        resizeHandle.classList.remove('dragging');
        document.body.style.cursor = '';
        
        // Reativa a animação suave
        sidebar.style.transition = 'width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';

        // Verifica se soltou com largura muito pequena (intensão de fechar)
        const finalWidth = sidebar.getBoundingClientRect().width;
        if (finalWidth < 150) {
            sidebar.classList.add('closed');
            sidebar.style.width = ''; // Limpa width inline
        } else {
            sidebar.classList.remove('closed');
        }
    });

    function toggleSidebar() {
        if (sidebar.classList.contains('closed')) {
            // ABRIR (DESOCULTAR)
            sidebar.classList.remove('closed');
            if (sidebar.style.width === '0px' || !sidebar.style.width) {
                sidebar.style.width = '280px';
            }
        } else {
            // FECHAR (OCULTAR)
            sidebar.classList.add('closed');
        }
    }


    // --- LÓGICA PADRÃO (DADOS) ---
    const dadosSessao = sessionStorage.getItem('carrinho_temp');
    let carrinho = [];

    if (dadosSessao) {
        carrinho = JSON.parse(dadosSessao);
        if(carrinho.length > 0) {
            renderizarSidebar(carrinho);
        } else {
            alert('Carrinho vazio.');
            window.location.href = 'novo_pedido.html';
        }
    } else {
        alert('Sessão inválida.');
        window.location.href = 'novo_pedido.html';
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
                    <div class="badge-g">G</div>
                    <div class="item-info">
                        <span class="item-code">${item.codigo}</span>
                        <span class="item-desc">${item.descricao}</span>
                        <span class="item-qty">Qtd: ${item.quantidade} | ${item.un}</span>
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