document.addEventListener('DOMContentLoaded', () => {
    
    // Fecha o dropdown se clicar fora dele
    window.onclick = function(event) {
        if (!event.target.matches('.btn-subheader-action') && !event.target.matches('.btn-subheader-action *')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show-menu')) {
                    openDropdown.classList.remove('show-menu');
                }
            }
        }
    }
});

/* --- LÓGICA DO DROPDOWN (NOVO CADASTRO) --- */

function toggleNovoMenu() {
    document.getElementById("novo-cadastro-menu").classList.toggle("show-menu");
}

function iniciarCadastro(tipo) {
    console.log(`Iniciando cadastro de: ${tipo}`);
    
    // Fecha o menu após selecionar
    document.getElementById("novo-cadastro-menu").classList.remove("show-menu");

    // Aqui você pode adicionar a lógica para abrir o modal ou redirecionar
    alert(`Abrir formulário para: ${tipo}`);
}

/* --- LÓGICA DO MENU LATERAL (Sidebar) --- */

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

/* --- LÓGICA DE NAVEGAÇÃO E LISTAGEM --- */

function carregarLista(nomeModulo, element) {
    // 1. Atualizar Menu Ativo
    document.querySelectorAll('.sidebar-local a').forEach(link => {
        link.classList.remove('active');
    });
    if(element) element.classList.add('active');

    // 2. Atualizar Título da Página
    const titulo = document.getElementById('titulo-pagina');
    if(titulo) {
        titulo.innerText = nomeModulo;
    }

    // 3. Limpar a Tabela (Preparar para DB futuro)
    const tbody = document.getElementById('lista-dados');
    const msgVazio = document.getElementById('msg-vazio');
    
    if(tbody) {
        tbody.innerHTML = ''; // Garante que está vazio conforme solicitado
        
        // Opcional: Mostrar mensagem "Nenhum registro"
        if(msgVazio) msgVazio.style.display = 'block';
    }

    console.log(`Módulo carregado: ${nomeModulo}`);
}