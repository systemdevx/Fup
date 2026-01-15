import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// --- 1. CONFIGURAÇÃO DO SUPABASE ---
const supabaseUrl = 'https://qolqfidcvvinetdkxeim.supabase.co'
const supabaseKey = 'sb_publishable_rD7o5xhuNf1-rDBUK_4Wog_lCOzYCkS'
const supabase = createClient(supabaseUrl, supabaseKey)

// --- 2. FUNÇÕES GLOBAIS DE INTERFACE (Menu e Sidebar) ---

// Função chamada pelo botão "Novo Cadastro"
window.toggleNovoMenu = function(event) {
    if(event) event.stopPropagation(); // Impede que o clique feche o menu imediatamente
    
    const menu = document.getElementById("novo-cadastro-menu");
    if(menu) {
        menu.classList.toggle("show-menu");
    }
}

// Fecha o menu se clicar em qualquer outro lugar da tela
window.addEventListener('click', function(event) {
    const menu = document.getElementById("novo-cadastro-menu");
    const btn = document.getElementById("btn-novo-cadastro");
    
    // Se o menu está aberto E o clique NÃO foi no botão nem dentro do menu
    if (menu && menu.classList.contains('show-menu')) {
        if (!btn.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove('show-menu');
        }
    }
});

// Alternar Sidebar
window.toggleSidebar = function() {
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

// Expandir/Recolher grupos do menu lateral
window.toggleGroup = function(header) {
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

// --- 3. LÓGICA DE CARREGAMENTO (SUPABASE) ---

window.carregarLista = async function(nomeModulo, element) {
    // Atualiza visual do link ativo
    document.querySelectorAll('.sidebar-local a').forEach(link => link.classList.remove('active'));
    if(element) element.classList.add('active');

    const titulo = document.getElementById('titulo-pagina');
    if(titulo) titulo.innerText = nomeModulo;

    const tbody = document.getElementById('lista-dados');
    const msgVazio = document.getElementById('msg-vazio');
    
    // Mostra Carregando
    if(tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Carregando dados...</td></tr>';
    if(msgVazio) msgVazio.style.display = 'none';

    let tabelaSupabase = '';

    if (nomeModulo === 'Almoxarifado') tabelaSupabase = 'almoxarifado';
    else if (nomeModulo === 'Ativos') tabelaSupabase = 'ativos';
    else if (nomeModulo === 'Fornecedores') tabelaSupabase = 'fornecedores';
    else if (nomeModulo === 'Transportadoras') tabelaSupabase = 'transportadoras';
    else {
        tbody.innerHTML = '';
        msgVazio.style.display = 'block';
        msgVazio.innerText = 'Módulo ainda não conectado.';
        return; 
    }

    try {
        const { data, error } = await supabase
            .from(tabelaSupabase)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        tbody.innerHTML = '';

        if (!data || data.length === 0) {
            msgVazio.style.display = 'block';
            msgVazio.innerText = 'Nenhum registro encontrado.';
        } else {
            data.forEach(item => {
                let rowHtml = montarLinhaTabela(nomeModulo, item);
                tbody.insertAdjacentHTML('beforeend', rowHtml);
            });
        }

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Erro: ${err.message}</td></tr>`;
    }
}

function montarLinhaTabela(modulo, item) {
    let id = item.id;
    let descricao = '';
    let tipo = modulo; 
    let status = '<span style="color:#059669; background:#D1FAE5; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">ATIVO</span>';

    if (modulo === 'Almoxarifado') {
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
                <button class="btn-icon" onclick="window.deletarItem('${modulo}', ${id})" title="Excluir">
                    <span class="material-icons-outlined">delete</span>
                </button>
            </td>
        </tr>
    `;
}

window.deletarItem = async function(modulo, id) {
    if(!confirm("Deseja realmente excluir este registro?")) return;

    let tabela = '';
    if (modulo === 'Almoxarifado') tabela = 'almoxarifado';
    else if (modulo === 'Ativos') tabela = 'ativos';
    else if (modulo === 'Fornecedores') tabela = 'fornecedores';
    else if (modulo === 'Transportadoras') tabela = 'transportadoras';

    try {
        const { error } = await supabase.from(tabela).delete().eq('id', id);
        if (error) throw error;
        
        // Recarrega lista
        const activeLink = document.querySelector('.sidebar-local a.active');
        if(activeLink) {
            const nomeModulo = document.getElementById('titulo-pagina').innerText;
            window.carregarLista(nomeModulo, activeLink); 
        }
    } catch (err) {
        alert("Erro ao excluir: " + err.message);
    }
}