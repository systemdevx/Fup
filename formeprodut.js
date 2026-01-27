document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    inicializarConfiguracoesFormulario();
    ativarMaiusculasAutomaticas(); 
    aplicarRestricoesEdicao();
});

function inicializarConfiguracoesFormulario() {
    // Só gera novo ID se não estiver editando
    if (localStorage.getItem('controle_modo_edicao') !== 'true') {
        const numeroAleatorio = Math.floor(Math.random() * 90000) + 10000;
        const idCadastro = document.getElementById('id_cadastro');
        if (idCadastro) idCadastro.value = "PROD-" + numeroAleatorio;
    }

    // Inicializar Calendário
    flatpickr("#data_cadastro", {
        locale: "pt",
        dateFormat: "d/m/Y",
        defaultDate: "today",
        allowInput: true,
        disableMobile: "true"
    });
}

function aplicarRestricoesEdicao() {
    const modoEdicaoAtivo = localStorage.getItem('controle_modo_edicao');
    if (modoEdicaoAtivo === 'true') {
        const campoData = document.getElementById('data_cadastro');
        if (campoData) {
            // Regra: DATA de cadastros não podem ser editadas
            campoData.readOnly = true; 
            campoData.classList.add('input-readonly'); 
            
            // Desativa interação do Flatpickr
            if (campoData._flatpickr) {
                campoData._flatpickr.set('clickOpens', false);
            }
        }
        // Limpa flag após aplicação das regras
        localStorage.removeItem('controle_modo_edicao');
    }
}

function ativarMaiusculasAutomaticas() {
    const camposTexto = document.querySelectorAll('input[type="text"]');
    camposTexto.forEach(campo => {
        // Ignora campos bloqueados (como data na edição)
        if (!campo.readOnly && campo.id !== 'data_cadastro') {
            campo.addEventListener('input', function() {
                this.value = this.value.toUpperCase();
            });
        }
    });
}

function salvarProduto(event) {
    event.preventDefault(); 
    const btn = document.querySelector('.btn-save');
    btn.innerHTML = `<span class="material-icons-outlined input-spin">sync</span> Salvando...`;
    btn.disabled = true;

    setTimeout(() => {
        mostrarToastSucesso();
        document.getElementById('form-produto').reset();
        inicializarConfiguracoesFormulario();
        btn.innerHTML = `<span class="material-icons-outlined">save</span> Salvar Produto`;
        btn.disabled = false;
        document.getElementById('codigo').focus();
    }, 800);
}

function mostrarToastSucesso() {
    const toast = document.getElementById('toast');
    toast.classList.add('toast-visible');
    setTimeout(() => { toast.classList.remove('toast-visible'); }, 3000); 
}

function verificarCancelamento() {
    document.getElementById('modal-cancel').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-cancel').style.display = 'none';
}

function confirmarSaida() {
    window.location.href = 'catalog.html';
}