let modoEdicao = false;

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    // Verifica se estamos editando ou criando (Lógica idêntica ao formequipt)
    verificarModoAbertura();
    ativarMaiusculasAutomaticas(); 
});

function verificarModoAbertura() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        modoEdicao = true;
        prepararModoEdicao(id);
    } else {
        modoEdicao = false;
        inicializarCamposNovos();
    }
}

function inicializarCamposNovos() {
    // 1. Gerar ID Automático
    const randomId = Math.floor(Math.random() * 9000) + 1000;
    document.getElementById('id_cadastro').value = "PROD-" + randomId;

    // 2. Data Atual
    const hoje = new Date();
    document.getElementById('data_cadastro').value = hoje.toLocaleDateString('pt-BR');
}

function prepararModoEdicao(id) {
    // 1. Ajustar Textos da Interface
    document.getElementById('page-title').textContent = "Edição de Produto";
    document.getElementById('form-title').textContent = "Editar Dados do Produto";
    
    // 2. Ajustar Botão de Salvar
    const btnSave = document.getElementById('btn-salvar-main');
    btnSave.innerHTML = `<span class="material-icons-outlined">save</span> Salvar Alterações`;

    // 3. Simular carregamento de dados (Mock)
    document.getElementById('id_cadastro').value = id;
    document.getElementById('codigo').value = "MAT-1050";
    document.getElementById('descricao').value = "PAPEL A4 75G RECICLADO"; 
    document.getElementById('unidade').value = "CX";
    document.getElementById('grupo').value = "AX";
    document.getElementById('data_cadastro').value = "27/01/2026";
}

function ativarMaiusculasAutomaticas() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(campo => {
        if (!campo.readOnly) {
            campo.addEventListener('input', function() {
                this.value = this.value.toUpperCase();
            });
        }
    });
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

function salvarProduto(event) {
    event.preventDefault(); 
    
    const codigo = document.getElementById('codigo').value;
    const btn = document.querySelector('.btn-save');
    const textoOriginal = modoEdicao ? "Salvar Alterações" : "Salvar Produto";
    
    btn.innerHTML = `<span class="material-icons-outlined input-spin">sync</span> Salvando...`;
    btn.disabled = true;

    setTimeout(() => {
        const mensagemSucesso = modoEdicao 
            ? "Produto alterado com sucesso!" 
            : `Produto ${codigo} cadastrado com sucesso!`;

        mostrarNotificacao(mensagemSucesso);

        // Se for novo cadastro, limpa. Se for edição, mantém.
        if (!modoEdicao) {
            document.getElementById('form-produto').reset();
            inicializarCamposNovos();
            document.getElementById('codigo').focus();
        }

        btn.innerHTML = `<span class="material-icons-outlined">save</span> ${textoOriginal}`;
        btn.disabled = false;
        
        // Redirecionamento após edição (Opcional, igual ao catalogadd)
        if (modoEdicao) {
            setTimeout(() => { window.location.href = 'catalog.html'; }, 1500);
        }

    }, 800);
}

function mostrarNotificacao(mensagem) {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = mensagem;
    toast.querySelector('.toast-icon').textContent = 'check_circle';
    toast.querySelector('.toast-icon').style.color = '#10B981'; 
    
    toast.classList.add('toast-visible');
    
    setTimeout(() => {
        toast.classList.remove('toast-visible');
    }, 3000); 
}