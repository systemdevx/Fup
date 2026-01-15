document.addEventListener('DOMContentLoaded', () => {
    // Inicialização se necessário
});

// --- FUNÇÕES DE MENU (UI) ---

function toggleNovoMenu(event) {
    if(event) event.stopPropagation();
    const menu = document.getElementById("novo-cadastro-menu");
    if(menu) menu.classList.toggle("show-menu");
}

window.onclick = function(event) {
    const menu = document.getElementById("novo-cadastro-menu");
    const btn = document.getElementById("btn-novo-cadastro");
    if (menu && menu.classList.contains('show-menu')) {
        if (!btn.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove('show-menu');
        }
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('icon-toggle-menu');
    if (sidebar) {
        sidebar.classList.toggle('sidebar-closed');
        if (sidebar.classList.contains('sidebar-closed')) {
            if(icon) icon.innerText = 'chevron_right'; 
        } else {
            if(icon) icon.innerText = 'chevron_left'; 
        }
    }
}

function toggleGroup(header) {
    const list = header.nextElementSibling; 
    const arrow = header.querySelector('.arrow-header');
    if (list.style.display === 'none') {
        list.style.display = 'flex'; 
        arrow.innerText = 'expand_less'; 
    } else {
        list.style.display = 'none'; 
        arrow.innerText = 'expand_more'; 
    }
}

// --- LÓGICA DE DADOS + VISUAL (Unificado com estilo Transações) ---

function carregarLista(nomeModulo, element) {
    // 1. Atualização Visual (Estilo Transações)
    document.querySelectorAll('.sidebar-local a').forEach(link => {
        link.classList.remove('active');
        // Reseta ícone da direita se houver lógica específica, aqui mantemos padrão
    });

    if(element) {
        element.classList.add('active');
        // Se quiséssemos mudar o ícone ao ativar, faríamos aqui, igual em Transações
    }

    const titulo = document.getElementById('titulo-pagina');
    if(titulo) titulo.innerText = nomeModulo;

    // 2. Carregamento de Dados (Simulação)
    const tbody = document.getElementById('lista-dados');
    const msgVazio = document.getElementById('msg-vazio');
    
    if(tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: #666;">Carregando...</td></tr>';
    if(msgVazio) msgVazio.style.display = 'none';

    setTimeout(() => {
        let dadosLocais = [];

        // Mocks de dados
        if (nomeModulo === 'Almoxarifado') {
            dadosLocais = [
                { id: 1, descricao: 'Papel A4 Chamex', codigo: 'MAT-001', grupo: 'Escritório' },
                { id: 2, descricao: 'Caneta Azul Bic', codigo: 'MAT-002', grupo: 'Escritório' },
                { id: 3, descricao: 'Luva de Proteção', codigo: 'EPI-055', grupo: 'EPI' }
            ];
        } 
        else if (nomeModulo === 'Ativos') {
            dadosLocais = [
                { id: 101, equipamento: 'Notebook Dell Latitude' },
                { id: 102, equipamento: 'Monitor Samsung 24pol' }
            ];
        }
        else if (nomeModulo === 'Fornecedores') {
            dadosLocais = [
                { id: 5, razao_social: 'Kalunga Comércio LTDA', cnpj: '00.000.000/0001-99' },
                { id: 6, razao_social: 'Amazon Servicos', cnpj: '11.222.333/0001-88' }
            ];
        }
        else if (nomeModulo === 'Transportadoras') {
            dadosLocais = [
                { id: 8, razao_social: 'Fedex Brasil', cnpj: '99.888.777/0001-00' }
            ];
        } else if (nomeModulo === 'Centro de Custo') {
             dadosLocais = [
                { id: 99, descricao: 'Administrativo', codigo: 'CC-01', grupo: 'Geral' }
            ];
        }

        tbody.innerHTML = '';

        if (!dadosLocais || dadosLocais.length === 0) {
            msgVazio.style.display = 'block';
            msgVazio.innerText = 'Nenhum registro encontrado.';
        } else {
            dadosLocais.forEach(item => {
                let rowHtml = montarLinhaTabela(nomeModulo, item);
                tbody.insertAdjacentHTML('beforeend', rowHtml);
            });
        }
    }, 200);
}

function montarLinhaTabela(modulo, item) {
    let id = item.id;
    let descricao = '';
    let tipo = modulo; 
    let status = '<span style="color:#059669; background:#D1FAE5; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">ATIVO</span>';

    if (modulo === 'Almoxarifado' || modulo === 'Centro de Custo') {
        descricao = `<strong style="font-weight:500; color:#111;">${item.descricao}</strong> <br> <span style="font-size:12px; color:#666;">Cód: ${item.codigo}</span>`;
        tipo = item.grupo || 'Geral';
    } 
    else if (modulo === 'Ativos') {
        descricao = `<strong style="font-weight:500; color:#111;">${item.equipamento}</strong>`;
        tipo = 'Ativo Fixo';
    }
    else if (modulo === 'Fornecedores' || modulo === 'Transportadoras') {
        descricao = `<strong style="font-weight:500; color:#111;">${item.razao_social}</strong> <br> <span style="font-size:12px; color:#666;">CNPJ: ${item.cnpj}</span>`;
        tipo = 'Pessoa Jurídica';
    }

    return `
        <tr>
            <td style="color:#666;">#${id}</td>
            <td>${descricao}</td>
            <td>${tipo}</td>
            <td>${status}</td>
            <td>
                <button class="btn-icon" onclick="deletarItem('${modulo}', ${id})" title="Excluir">
                    <span class="material-icons-outlined">delete</span>
                </button>
            </td>
        </tr>
    `;
}

function deletarItem(modulo, id) {
    if(!confirm("Deseja realmente excluir este registro? (Simulação Local)")) return;
    alert(`Item #${id} removido visualmente.`);
}