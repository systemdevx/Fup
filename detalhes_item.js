document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema de Detalhes Inicializado");
});

// --- FUNÇÃO DE RECOLHER/EXPANDIR ---
function toggleDetalhes(formId, iconId) {
    const formContainer = document.getElementById(formId);
    const icon = document.getElementById(iconId);

    if (formContainer.classList.contains('hidden-content')) {
        // Expandir
        formContainer.classList.remove('hidden-content');
        formContainer.style.display = 'grid'; // Restaura o grid
        icon.classList.remove('rotate-right');
        icon.classList.add('rotate-down');
    } else {
        // Recolher
        formContainer.classList.add('hidden-content');
        formContainer.style.display = 'none'; // Some completamente
        icon.classList.remove('rotate-down');
        icon.classList.add('rotate-right');
    }
}

// --- FUNÇÕES DE AÇÃO NA LINHA ---
function salvarItemLocal() {
    // Simula salvamento
    alert("Alterações salvas com sucesso no rascunho!");
}

function resetarItem(formId) {
    if(confirm("Deseja limpar todos os campos deste item?")) {
        const inputs = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);
        inputs.forEach(input => {
            input.value = "";
        });
    }
}

function removerItem(rowId) {
    if(confirm("Tem certeza que deseja remover este item do pedido?")) {
        const row = document.getElementById(rowId);
        if(row) {
            row.remove();
            // Verifica se ainda tem itens, se não, mostra aviso
            const remaining = document.querySelectorAll('.item-wrapper');
            if(remaining.length === 0) {
                document.querySelector('.content-area').innerHTML += '<div style="text-align:center; margin-top:50px; color:#999;">Nenhum item no pedido.</div>';
            }
        }
    }
}

// --- FUNÇÃO PRINCIPAL (BOTÃO AVANÇAR) ---
function avancarPedido() {
    // Validação simples
    const qtd = document.getElementById('qtd-1');
    const aplicacao = document.getElementById('aplicacao-1');
    const cat = document.getElementById('cat-1');

    // Se o elemento existe (não foi excluído) e está vazio
    if (qtd && (qtd.value == "" || aplicacao.value == "" || cat.value == "")) {
        alert("Por favor, preencha todos os campos obrigatórios (marcados com vermelho) antes de avançar.");
        return;
    }

    // Se passou na validação
    // Redireciona para a página de sucesso que criamos antes
    window.location.href = 'pedido_concluido.html';
}