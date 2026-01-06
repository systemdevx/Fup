document.addEventListener('DOMContentLoaded', () => {
    carregarPedidos();
    
    // Opcional: Se quiser que algum grupo comece fechado, configure aqui.
    // Atualmente todos começam abertos conforme HTML.
});

/* --- LÓGICA DO MENU LATERAL --- */

// Função para abrir/fechar os grupos (Accordion)
function toggleGroup(header) {
    const list = header.nextElementSibling; // Pega a lista <ul> logo abaixo
    const arrow = header.querySelector('.arrow-header');
    
    // Verifica se está visível
    if (list.style.display === 'none') {
        list.style.display = 'flex'; // Abre
        arrow.innerText = 'expand_less'; // Seta para cima
    } else {
        list.style.display = 'none'; // Fecha
        arrow.innerText = 'expand_more'; // Seta para baixo
    }
}

// Função para marcar item como Ativo
function ativarItem(element) {
    // 1. Remove active de todos os links da sidebar
    document.querySelectorAll('.sidebar-local a').forEach(link => {
        link.classList.remove('active');
        // Reseta ícone de pasta se necessário (opcional)
        const icon = link.querySelector('.menu-text-icon .material-icons-outlined');
        if(icon && icon.innerText === 'folder_open') icon.innerText = 'folder';
    });

    // 2. Adiciona active ao clicado
    element.classList.add('active');

    // 3. Efeito visual: muda pasta fechada para aberta se for pasta
    const icon = element.querySelector('.menu-text-icon .material-icons-outlined');
    if(icon && icon.innerText === 'folder') {
        icon.innerText = 'folder_open';
    }

    // 4. Atualiza Título da página (Simulação)
    const textoItem = element.querySelector('span:not(.material-icons-outlined)').innerText;
    const tituloPagina = document.getElementById('titulo-pagina');
    if(tituloPagina) tituloPagina.innerText = textoItem;
}

/* --- LÓGICA DA TABELA DE DADOS --- */

// Dados Fictícios
const dadosPedidos = [
    { id: '#REQ-001', tipo: 'Gases', detalhes: 'Oxigênio Industrial (G) - 2 un', data: '15/10/2023', status: 'aprovado' },
    { id: '#REQ-002', tipo: 'Gelo', detalhes: 'Gelo Seco - 10kg', data: '16/10/2023', status: 'pendente' },
    { id: '#REQ-003', tipo: 'Gases', detalhes: 'Nitrogênio - 1 un', data: '18/10/2023', status: 'aprovado' },
    { id: '#REQ-004', tipo: 'Gelo', detalhes: 'Cubo (5kg) - 5 un', data: '20/10/2023', status: 'cancelado' },
    { id: '#REQ-005', tipo: 'EPI', detalhes: 'Luva de Proteção - 50 un', data: '21/10/2023', status: 'pendente' },
];

function carregarPedidos() {
    const tbody = document.getElementById('lista-pedidos');
    if(!tbody) return;
    
    tbody.innerHTML = ''; // Limpa tabela

    dadosPedidos.forEach(pedido => {
        // Define classe da cor do status
        let statusClass = '';
        if(pedido.status === 'aprovado') statusClass = 'status-aprovado';
        else if(pedido.status === 'pendente') statusClass = 'status-pendente';
        else statusClass = 'status-cancelado';

        // Ícone baseado no tipo
        let icone = 'inventory_2';
        if(pedido.tipo === 'Gases') icone = 'science';
        if(pedido.tipo === 'Gelo') icone = 'ac_unit';
        if(pedido.tipo === 'EPI') icone = 'security';

        const row = `
            <tr>
                <td><strong>${pedido.id}</strong></td>
                <td>
                    <div style="display:flex; align-items:center; gap:5px;">
                        <span class="material-icons-outlined" style="font-size:16px; color:#666;">${icone}</span>
                        ${pedido.tipo}
                    </div>
                </td>
                <td>${pedido.detalhes}</td>
                <td>${pedido.data}</td>
                <td><span class="status-badge ${statusClass}">${pedido.status}</span></td>
                <td>
                    <button class="btn-icon" title="Ver Detalhes"><span class="material-icons-outlined">visibility</span></button>
                    <button class="btn-icon" title="Repetir Pedido"><span class="material-icons-outlined">replay</span></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}