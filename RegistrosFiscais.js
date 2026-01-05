document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sidebar Toggle (apenas se existir na página)
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const sidebar = document.getElementById('sidebarRegistros');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar.classList.toggle('closed');
        });
    }

    // 2. Sidebar Accordion
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

    // 3. Inicializar Tabela (apenas na página de listagem)
    const tabelaBody = document.getElementById('tabelaFiscalBody');
    if (tabelaBody) {
        mudarListagem('nf');
    }
});

// --- FUNÇÕES DA TABELA DE ITENS (NovoRegistroFiscal) ---
function adicionarItem() {
    const tbody = document.getElementById('tbodyItens');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" placeholder="Cód."></td>
        <td><input type="text" placeholder="Descrição detalhada..."></td>
        <td><input type="number" placeholder="0"></td>
        <td style="text-align: center;">
            <button type="button" class="btn-remove-item" onclick="removerItem(this)">
                <span class="material-icons-outlined">delete</span>
            </button>
        </td>
    `;
    tbody.appendChild(row);
}

function removerItem(btn) {
    const row = btn.closest('tr');
    // Evitar remover a última linha se quiser manter pelo menos uma (opcional)
    row.remove();
}

// --- LÓGICA DE NAVEGAÇÃO ENTRE LISTAS (RegistrosFiscais.html) ---
const registrosDB = [
    { cat: 'nf', doc: 'NF-001982', tipo: 'NF-e', entidade: 'DELL COMPUTADORES', valor: 'R$ 15.450,00', data: '03/01/2026', sefaz: 'Autorizada', erp: 'Integrado' },
    { cat: 'nf', doc: 'NF-005120', tipo: 'NFS-e', entidade: 'CONSULTORIA FINANCEIRA', valor: 'R$ 3.200,00', data: '28/12/2025', sefaz: 'Autorizada', erp: 'Aprovado' },
    { cat: 'di', doc: 'DI-22/00541', tipo: 'Importação', entidade: 'SHENZHEN ELECTRONICS', valor: 'USD 5,200.00', data: '02/01/2026', sefaz: 'Verde', erp: 'Pendente' },
    { cat: 'correios', doc: 'AA123456BR', tipo: 'Sedex', entidade: 'REMETENTE EXTERNO', valor: 'R$ 45,90', data: '02/01/2026', sefaz: 'N/A', erp: 'Recebido' },
];

function mudarListagem(categoria) {
    // Atualiza Menu Visual
    document.querySelectorAll('.menu-group li').forEach(li => {
        li.classList.remove('active-item');
        const arrow = li.querySelector('.arrow-right');
        if(arrow) arrow.style.color = '#CCC';
    });
    
    const activeLi = document.getElementById(`menu-${categoria}`);
    if(activeLi) {
        activeLi.classList.add('active-item');
        activeLi.querySelector('.arrow-right').style.color = '#E67E22';
    }

    // Atualiza Título
    const titles = { 'nf': 'NOTAS FISCAIS', 'di': 'DI IMPORTAÇÃO', 'correios': 'DOC CORREIOS' };
    const titleEl = document.getElementById('listTitle');
    if(titleEl) titleEl.innerText = titles[categoria] || 'LISTAGEM';

    // Renderiza
    const tbody = document.getElementById('tabelaFiscalBody');
    if(!tbody) return;
    tbody.innerHTML = '';

    const filtrados = registrosDB.filter(r => r.cat === categoria);
    
    if(filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:#999;">Nenhum registro encontrado.</td></tr>';
        return;
    }

    filtrados.forEach(reg => {
        const html = `
            <tr style="background-color: #fff;">
                <td style="text-align:center;"><input type="checkbox"></td>
                <td class="text-orange-link"><strong>${reg.doc}</strong></td>
                <td>${reg.tipo}</td>
                <td style="font-weight:500;">${reg.entidade}</td>
                <td>${reg.valor}</td>
                <td style="color:#555;">${reg.data}</td>
                <td><div style="font-size:11px; color:#2E7D32; font-weight:700;">${reg.sefaz}</div></td>
                <td><div style="font-size:11px; color:#E67E22; font-weight:700;">${reg.erp}</div></td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', html);
    });
}

// Dropdown Toggle
function toggleDropdown() {
    const d = document.getElementById('newRecordDropdown');
    if(d) d.classList.toggle('show');
}
window.onclick = function(e) {
    if (!e.target.matches('.btn-primary-erp') && !e.target.matches('.btn-primary-erp-arrow') && !e.target.matches('.material-icons-outlined')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) dropdowns[i].classList.remove('show');
        }
    }
}