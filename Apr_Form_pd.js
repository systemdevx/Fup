document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Recuperar ID da URL
    const params = new URLSearchParams(window.location.search);
    const pedidoId = params.get('id');

    if (!pedidoId) {
        alert('ID do pedido não fornecido.');
        window.location.href = 'aprovacoes.html';
        return;
    }

    // 2. Buscar Dados no LocalStorage
    const historico = JSON.parse(localStorage.getItem('vivara_pedidos')) || [];
    const pedido = historico.find(p => p.id == pedidoId);

    if (!pedido) {
        alert('Pedido não encontrado.');
        window.location.href = 'aprovacoes.html';
        return;
    }

    // 3. Renderizar Informações Iniciais
    renderizarDetalhes(pedido);
    gerenciarEstado(pedido);

    // --- EVENT LISTENERS ---

    // Botão: Confirmar Envio de Email
    const btnEmail = document.getElementById('btnConfirmarEnvioEmail');
    if (btnEmail) {
        btnEmail.addEventListener('click', () => {
            if (confirm('Confirma que o e-mail com a requisição foi enviado para o setor de compras?')) {
                // Atualiza Status
                pedido.status = "AGUARDANDO ENVIO"; // Visualmente é "Aguardando SAP" na verdade
                // Vamos usar um status interno específico se quiser, mas vou manter o texto do prompt
                
                // Salvar estado intermediário (opcional, ou apenas mudança visual)
                // Para simplificar, mudamos o status visualmente para o usuário:
                pedido.formalizacaoStarted = true; // Flag para saber que já passou da etapa 1
                
                atualizarPedidoNoStorage(pedido);
                gerenciarEstado(pedido);
                
                alert('Envio confirmado! Agora aguarde o retorno com o número do Pedido SAP.');
            }
        });
    }

    // Botão: Finalizar (Vincular SAP)
    const btnFinalizar = document.getElementById('btnFinalizarFormalizacao');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            const inputSap = document.getElementById('inputSapId');
            const sapValue = inputSap.value.trim();

            if (!sapValue) {
                alert('Por favor, insira o Número do Pedido SAP.');
                inputSap.focus();
                return;
            }

            if (confirm(`Confirma vincular o Pedido SAP #${sapValue} a esta requisição?`)) {
                // ATUALIZAÇÃO FINAL
                pedido.erpId = sapValue;
                pedido.status = "AGUARDANDO ENTREGA"; // Status final que vai para a lista de Pedidos
                
                atualizarPedidoNoStorage(pedido);
                
                alert('Pedido formalizado com sucesso! Redirecionando para a lista de Pedidos.');
                window.location.href = 'transacoes.html';
            }
        });
    }

    // --- FUNÇÕES AUXILIARES ---

    function atualizarPedidoNoStorage(pedidoAtualizado) {
        const index = historico.findIndex(p => p.id == pedidoAtualizado.id);
        if (index !== -1) {
            historico[index] = pedidoAtualizado;
            localStorage.setItem('vivara_pedidos', JSON.stringify(historico));
        }
    }

    function renderizarDetalhes(p) {
        document.getElementById('txtIdReq').innerText = p.id;
        document.getElementById('txtRequisitante').innerText = p.requisitamte || '-';
        document.getElementById('txtTitulo').innerText = p.cabecalho ? p.cabecalho.titulo : '-';
        document.getElementById('txtCC').innerText = p.cabecalho ? p.cabecalho.centroCusto : '-';
        
        const valor = p.total ? parseFloat(p.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';
        document.getElementById('txtTotal').innerText = valor;

        // Lista de Itens
        const lista = document.getElementById('listaItensSimples');
        if (p.itens && p.itens.length > 0) {
            lista.innerHTML = '';
            p.itens.forEach(item => {
                const html = `
                    <div class="mini-item">
                        <span><strong>${item.quantidade}x</strong> ${item.descricao}</span>
                    </div>
                `;
                lista.insertAdjacentHTML('beforeend', html);
            });
        }
    }

    function gerenciarEstado(p) {
        const cardEmail = document.getElementById('cardEnvioEmail');
        const cardSap = document.getElementById('cardRegistroSAP');
        const lblStatus = document.getElementById('lblStatusTopo');
        
        const stepEnvio = document.getElementById('stepEnvio');
        const lineSap = document.getElementById('lineSap');
        const stepSap = document.getElementById('stepSap');

        // Verifica flag ou status
        // Se status for "APROVADO", estamos na etapa 1 (Envio Email)
        if (p.status === 'APROVADO' && !p.formalizacaoStarted) {
            lblStatus.innerText = "AGUARDANDO ENVIO";
            cardEmail.classList.remove('hidden');
            cardSap.classList.add('hidden');
        } 
        // Se já enviou email (formalizacaoStarted true)
        else if (p.formalizacaoStarted || p.status === 'AGUARDANDO ENVIO') {
            lblStatus.innerText = "AGUARDANDO SAP";
            lblStatus.style.background = "#E8F5E9";
            lblStatus.style.color = "#2E7D32";
            lblStatus.style.borderColor = "#C8E6C9";

            cardEmail.classList.add('hidden');
            cardSap.classList.remove('hidden');

            // Atualiza Workflow Visual
            stepEnvio.classList.add('completed');
            stepEnvio.querySelector('.step-circle').innerHTML = '<span class="material-icons">check</span>';
            lineSap.classList.add('active-line');
            stepSap.classList.add('active');
        }
    }
});