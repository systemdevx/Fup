document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Menu Lateral (Toggle) - Código defensivo caso o menu exista em outras páginas
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const sidebar = document.getElementById('sidebarTransacoes');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar.classList.toggle('closed');
        });
    }

    // 2. Menu Lateral: Accordion
    const groupTitles = document.querySelectorAll('.group-title');
    groupTitles.forEach(title => {
        title.addEventListener('click', () => {
            const list = title.nextElementSibling;
            const arrow = title.querySelector('.arrow');
            if (list) {
                if (list.style.display !== 'none') {
                    list.style.display = 'none';
                    if (arrow) arrow.innerText = 'expand_more';
                } else {
                    list.style.display = 'block';
                    if (arrow) arrow.innerText = 'expand_less';
                }
            }
        });
    });

    // 3. Busca Menu Lateral
    const sidebarSearchInput = document.querySelector('.sidebar-inner-search input');
    if (sidebarSearchInput) {
        sidebarSearchInput.addEventListener('input', function() {
            const termo = this.value.toLowerCase();
            const itensMenu = document.querySelectorAll('.menu-group li');
            itensMenu.forEach(item => {
                const textoItem = item.innerText.toLowerCase();
                if (textoItem.includes(termo)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
            if (termo.length > 0) {
                document.querySelectorAll('.menu-group ul').forEach(ul => ul.style.display = 'block');
                document.querySelectorAll('.group-title .arrow').forEach(arrow => arrow.innerText = 'expand_less');
            }
        });
    }

    // 4. Carregar Tabela
    const tabelaBody = document.querySelector('.table-container-erp tbody');
    if (tabelaBody) {
        carregarTabela(tabelaBody);
    }

    // 5. Busca Principal
    const mainSearchInput = document.querySelector('.erp-input-search');
    if (mainSearchInput) {
        mainSearchInput.addEventListener('input', function() {
            const termo = this.value.toLowerCase();
            const linhas = document.querySelectorAll('.table-container-erp tbody tr');
            linhas.forEach(linha => {
                const textoLinha = linha.innerText.toLowerCase();
                if (textoLinha.includes(termo)) {
                    linha.style.display = '';
                } else {
                    linha.style.display = 'none';
                }
            });
        });
    }
});

function carregarTabela(tbody) {
    const pedidos = JSON.parse(localStorage.getItem('vivara_pedidos')) || [];
    pedidos.reverse();

    tbody.innerHTML = ''; 
    
    const criarLinha = (id, erp, titulo, status, data, autor) => {
        let corStatus = '#666';
        let corTextoStatus = status;

        if(status.includes('AGUARDANDO')) { corStatus = '#E67E22'; }
        else if(status.includes('CANCELADO') || status.includes('REPROVADO')) { corStatus = '#D32F2F'; }
        else if(status.includes('Concluído') || status.includes('Processado') || status.includes('APROVADO')) { corStatus = '#2E7D32'; }

        return `
            <tr style="background-color: #fff;">
                <td style="text-align:center;"><input type="checkbox"></td>
                <td class="text-orange-link" onclick="abrirDetalhes('${id}')">
                    <strong>${id}</strong>
                </td>
                <td class="text-orange-link" onclick="abrirDetalhes('${id}')">
                    ${erp || '-'}
                </td>
                <td onclick="abrirDetalhes('${id}')" style="cursor:pointer; color:#333; font-weight:500;">
                    ${titulo}
                </td>
                <td onclick="abrirDetalhes('${id}')" style="cursor:pointer;">
                    <div style="font-size:11px; color:${corStatus}; font-weight:700; text-transform:uppercase;">
                        ${corTextoStatus}
                    </div>
                </td>
                <td style="color:#555;">${data}</td>
                <td style="color:#555;">${autor}</td>
            </tr>
        `;
    };

    pedidos.forEach(p => {
        const id = p.id || 'N/A';
        const titulo = p.cabecalho ? p.cabecalho.titulo : 'Sem Título';
        const status = p.status || 'Aguardando';
        const data = p.dataCriacao || '-';
        const autor = p.requisitamte || 'Desconhecido';
        
        const html = criarLinha(id, p.erpId, titulo, status, data, autor);
        tbody.insertAdjacentHTML('beforeend', html);
    });
}

window.abrirDetalhes = function(id) {
    console.log('Visualização de detalhes desativada para: ' + id);
};