document.addEventListener('DOMContentLoaded', () => {
    carregarPedidos();
});

// Dados Fictícios para exemplo (depois virão do Banco de Dados/Local Storage)
const dadosPedidos = [
    { id: '#REQ-001', tipo: 'Gases', detalhes: 'Oxigênio Industrial (G) - 2 un', data: '15/10/2023', status: 'aprovado' },
    { id: '#REQ-002', tipo: 'Gelo', detalhes: 'Gelo Seco - 10kg', data: '16/10/2023', status: 'pendente' },
    { id: '#REQ-003', tipo: 'Gases', detalhes: 'Nitrogênio - 1 un', data: '18/10/2023', status: 'aprovado' },
    { id: '#REQ-004', tipo: 'Gelo', detalhes: 'Cubo (5kg) - 5 un', data: '20/10/2023', status: 'cancelado' },
];

function carregarPedidos() {
    const tbody = document.getElementById('lista-pedidos');
    tbody.innerHTML = ''; // Limpa tabela

    dadosPedidos.forEach(pedido => {
        // Define classe da cor do status
        let statusClass = '';
        if(pedido.status === 'aprovado') statusClass = 'status-aprovado';
        else if(pedido.status === 'pendente') statusClass = 'status-pendente';
        else statusClass = 'status-cancelado';

        // Ícone baseado no tipo
        const icone = pedido.tipo === 'Gases' ? 'science' : 'ac_unit';

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

function irParaNovoPedido() {
    // Redireciona para a página de criação de pedidos (que criaremos a seguir)
    window.location.href = 'novo_pedido.html';
}