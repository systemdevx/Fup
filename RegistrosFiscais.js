document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sidebar: Toggle
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const sidebar = document.getElementById('sidebarRegistros');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar.classList.toggle('closed');
        });
    }

    // 2. Sidebar: Dropdowns (Accordion)
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

    // 3. Carregar Tabela (Apenas na página principal)
    const tabelaBody = document.getElementById('tabelaFiscalBody');
    if (tabelaBody) {
        carregarTabelaFiscal(tabelaBody);
    }
});

// Dropdown do Botão Novo Registro
function toggleDropdown() {
    const dropdown = document.getElementById('newRecordDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Fecha o dropdown se clicar fora
window.onclick = function(event) {
    if (!event.target.matches('.btn-primary-erp') && !event.target.matches('.btn-primary-erp-arrow') && !event.target.matches('.material-icons-outlined')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Dados Mockados para a Tabela
function carregarTabelaFiscal(tbody) {
    tbody.innerHTML = ''; 
    const registros = [
        { doc: 'NF-001982', tipo: 'Nota Fiscal (NF-e)', fornecedor: 'DELL COMPUTADORES LTDA', valor: 'R$ 15.450,00', data: '03/01/2026', sefaz: 'Autorizada', erp: 'Integrado' },
        { doc: 'DI-22/00541', tipo: 'DI Importação', fornecedor: 'SHENZHEN ELECTRONICS', valor: 'USD 5,200.00', data: '02/01/2026', sefaz: 'Desembaraçada', erp: 'Pendente' },
        { doc: 'COR-BR9988', tipo: 'Doc Correios', fornecedor: 'CORREIOS SEDEX', valor: 'R$ 45,90', data: '02/01/2026', sefaz: 'N/A', erp: 'Integrado' },
        { doc: 'NF-005120', tipo: 'Nota Fiscal (NFS-e)', fornecedor: 'CONSULTORIA FINANCEIRA ABC', valor: 'R$ 3.200,00', data: '28/12/2025', sefaz: 'Autorizada', erp: 'Aprovado' },
        { doc: 'NF-001981', tipo: 'Nota Fiscal (NF-e)', fornecedor: 'KALUNGA COMERCIO', valor: 'R$ 890,50', data: '20/12/2025', sefaz: 'Cancelada', erp: 'Cancelado' },
    ];

    registros.forEach(reg => {
        let corSefaz = reg.sefaz === 'Cancelada' ? '#D32F2F' : (reg.sefaz === 'N/A' ? '#999' : '#2E7D32');
        let corErp = reg.erp === 'Pendente' ? '#E67E22' : (reg.erp === 'Cancelado' ? '#D32F2F' : '#2E7D32');

        const html = `
            <tr style="background-color: #fff;">
                <td style="text-align:center;"><input type="checkbox"></td>
                <td class="text-orange-link"><strong>${reg.doc}</strong></td>
                <td>${reg.tipo}</td>
                <td style="font-weight:500;">${reg.fornecedor}</td>
                <td>${reg.valor}</td>
                <td style="color:#555;">${reg.data}</td>
                <td><div style="font-size:11px; color:${corSefaz}; font-weight:700; text-transform:uppercase;">${reg.sefaz}</div></td>
                <td><div style="font-size:11px; color:${corErp}; font-weight:700; text-transform:uppercase;">${reg.erp}</div></td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', html);
    });
}