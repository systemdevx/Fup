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

// --- LÓGICA DINÂMICA DE CABEÇALHOS E DADOS (OTIMIZADA) ---

function carregarLista(nomeModulo, element) {
    // 1. Atualização Visual do Menu (Instantânea)
    document.querySelectorAll('.sidebar-local a').forEach(link => {
        link.classList.remove('active');
    });

    if(element) {
        element.classList.add('active');
    }

    const titulo = document.getElementById('titulo-pagina');
    if(titulo) titulo.innerText = nomeModulo;

    // 2. Definir Cabeçalhos Dinâmicos
    atualizarCabecalhoTabela(nomeModulo);

    // 3. Carregamento de Dados (Síncrono e Rápido)
    const tbody = document.getElementById('lista-dados');
    const msgVazio = document.getElementById('msg-vazio');
    
    // Removemos o 'Carregando...' visual para evitar "flicker" (piscar da tela),
    // já que o carregamento agora é instantâneo.
    
    // Obtém dados
    let dadosLocais = obterDadosSimulados(nomeModulo);
    
    // Performance: Constrói uma única string HTML grande em vez de manipular o DOM repetidamente
    let htmlFinal = '';

    if (!dadosLocais || dadosLocais.length === 0) {
        if(tbody) tbody.innerHTML = ''; // Limpa tabela
        if(msgVazio) {
            msgVazio.style.display = 'block';
            msgVazio.innerText = 'Nenhum registro encontrado.';
        }
    } else {
        if(msgVazio) msgVazio.style.display = 'none';
        
        // Loop apenas na memória (JavaScript), muito mais rápido que mexer no HTML
        dadosLocais.forEach(item => {
            htmlFinal += montarLinhaTabela(nomeModulo, item);
        });

        // Única inserção no DOM
        if(tbody) tbody.innerHTML = htmlFinal;
    }
}

// Define as colunas do THEAD baseado no módulo
function atualizarCabecalhoTabela(modulo) {
    const theadRow = document.getElementById('tabela-head-row');
    if (!theadRow) return;

    let html = '';

    if (modulo === 'Centro de Custo') {
        html = `
            <th style="width: 80px;">ID</th>
            <th>Código</th>
            <th>Descrição</th>
            <th>Grupo</th>
            <th style="width: 100px; text-align: center;">Ações</th>
        `;
    } 
    else if (modulo === 'Almoxarifado') {
        html = `
            <th style="width: 80px;">ID</th>
            <th>Grupo</th>
            <th>Código</th>
            <th style="width: 30%;">Descrição</th>
            <th>Unidade / Preço</th>
            <th style="width: 100px; text-align: center;">Ações</th>
        `;
    } 
    else if (modulo === 'Ativos') {
        html = `
            <th style="width: 80px;">ID</th>
            <th style="width: 50%;">Equipamento / Ativo</th>
            <th>Status</th>
            <th style="width: 100px; text-align: center;">Ações</th>
        `;
    } 
    else if (modulo === 'Fornecedores' || modulo === 'Transportadoras') {
        html = `
            <th style="width: 80px;">ID</th>
            <th>CNPJ</th>
            <th style="width: 40%;">Razão Social</th>
            <th>Status</th>
            <th style="width: 100px; text-align: center;">Ações</th>
        `;
    }

    theadRow.innerHTML = html;
}

// Simula banco de dados
function obterDadosSimulados(modulo) {
    if (modulo === 'Almoxarifado') {
        return [
            { id: 1, grupo: 'Escritório', codigo: 'MAT-001', descricao: 'Papel A4 Chamex', unidade: 'CX', preco: '25.00' },
            { id: 2, grupo: 'Escritório', codigo: 'MAT-002', descricao: 'Caneta Azul Bic', unidade: 'UN', preco: '1.50' },
            { id: 3, grupo: 'EPI', codigo: 'EPI-055', descricao: 'Luva de Proteção Látex', unidade: 'PAR', preco: '12.00' }
        ];
    } 
    else if (modulo === 'Ativos') {
        return [
            { id: 101, equipamento: 'Notebook Dell Latitude 5420', status: 'Ativo' },
            { id: 102, equipamento: 'Monitor Samsung 24pol', status: 'Em Manutenção' }
        ];
    }
    else if (modulo === 'Fornecedores') {
        return [
            { id: 5, razao_social: 'Kalunga Comércio LTDA', cnpj: '00.000.000/0001-99', status: 'Homologado' },
            { id: 6, razao_social: 'Amazon Servicos Varejo', cnpj: '11.222.333/0001-88', status: 'Pendente' }
        ];
    }
    else if (modulo === 'Transportadoras') {
        return [
            { id: 8, razao_social: 'Fedex Brasil Logistica', cnpj: '99.888.777/0001-00', status: 'Ativo' }
        ];
    } else if (modulo === 'Centro de Custo') {
        return [
            { id: 99, codigo: 'CC-01', descricao: 'Administrativo Sede', grupo: 'Geral' },
            { id: 100, codigo: 'CC-02', descricao: 'Operacional Fábrica', grupo: 'Produção' }
        ];
    }
    return [];
}

// Monta a linha da tabela (TR) combinando com os cabeçalhos
function montarLinhaTabela(modulo, item) {
    let cols = '';
    const btnDelete = `
        <button class="btn-icon" onclick="deletarItem('${modulo}', ${item.id})" title="Excluir">
            <span class="material-icons-outlined">delete</span>
        </button>
    `;

    if (modulo === 'Centro de Custo') {
        cols = `
            <td style="color:#666;">#${item.id}</td>
            <td><strong>${item.codigo}</strong></td>
            <td>${item.descricao}</td>
            <td><span class="badge-grupo">${item.grupo}</span></td>
            <td style="text-align: center;">${btnDelete}</td>
        `;
    } 
    else if (modulo === 'Almoxarifado') {
        cols = `
            <td style="color:#666;">#${item.id}</td>
            <td>${item.grupo}</td>
            <td><strong>${item.codigo}</strong></td>
            <td>${item.descricao}</td>
            <td>${item.unidade} - R$ ${item.preco}</td>
            <td style="text-align: center;">${btnDelete}</td>
        `;
    } 
    else if (modulo === 'Ativos') {
        const colorStatus = item.status === 'Ativo' ? '#059669' : '#D97706';
        const bgStatus = item.status === 'Ativo' ? '#D1FAE5' : '#FEF3C7';
        
        cols = `
            <td style="color:#666;">#${item.id}</td>
            <td><strong>${item.equipamento}</strong></td>
            <td><span style="color:${colorStatus}; background:${bgStatus}; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${item.status}</span></td>
            <td style="text-align: center;">${btnDelete}</td>
        `;
    }
    else if (modulo === 'Fornecedores' || modulo === 'Transportadoras') {
        const colorStatus = item.status === 'Homologado' || item.status === 'Ativo' ? '#059669' : '#4B5563';
        const bgStatus = item.status === 'Homologado' || item.status === 'Ativo' ? '#D1FAE5' : '#F3F4F6';

        cols = `
            <td style="color:#666;">#${item.id}</td>
            <td>${item.cnpj}</td>
            <td><strong>${item.razao_social}</strong></td>
            <td><span style="color:${colorStatus}; background:${bgStatus}; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${item.status}</span></td>
            <td style="text-align: center;">${btnDelete}</td>
        `;
    }

    return `<tr>${cols}</tr>`;
}

function deletarItem(modulo, id) {
    if(!confirm("Deseja realmente excluir este registro? (Simulação Local)")) return;
    // Aqui você pode adicionar lógica para remover do array se quiser, 
    // ou apenas recarregar a lista para simular.
    alert(`Item #${id} do módulo ${modulo} removido.`);
}