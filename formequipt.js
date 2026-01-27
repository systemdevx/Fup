let modoEdicao = false;

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    // Verifica se estamos editando ou criando
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
    document.getElementById('id_cadastro').value = "EQ-" + randomId;

    // 2. Data Atual
    const hoje = new Date();
    document.getElementById('data_cadastro').value = hoje.toLocaleDateString('pt-BR');
}

function prepararModoEdicao(id) {
    // 1. Ajustar Textos da Interface
    document.getElementById('page-title').textContent = "Edição de Equipamento";
    document.getElementById('form-title').textContent = "Editar Dados";
    
    // 2. Ajustar Botão de Salvar
    const btnSave = document.getElementById('btn-salvar-main');
    btnSave.innerHTML = `<span class="material-icons-outlined">save</span> Salvar Alterações`;

    // 3. Simular carregamento de dados (Mock)
    // Num cenário real, você faria um fetch() aqui com o ID
    document.getElementById('id_cadastro').value = id;
    document.getElementById('codigo').value = "EQ-001";
    document.getElementById('descricao').value = "COMPRESSOR DE AR INDUSTRIAL 10HP"; // Dado de exemplo
    document.getElementById('unidade').value = "UN";
    document.getElementById('data_cadastro').value = "27/01/2026"; // Mantém a data original
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
    window.location.href = 'catalogadd.html';
}

function salvarEquipamento(event) {
    event.preventDefault(); 
    
    const codigo = document.getElementById('codigo').value;
    const btn = document.querySelector('.btn-save');
    const textoOriginal = modoEdicao ? "Salvar Alterações" : "Salvar Cadastro";
    
    btn.innerHTML = `<span class="material-icons-outlined input-spin">sync</span> Salvando...`;
    btn.disabled = true;

    setTimeout(() => {
        // Define a mensagem baseada no modo (Edição vs Novo)
        const mensagemSucesso = modoEdicao 
            ? "Equipamento Alterado com sucesso!" 
            : `Equipamento ${codigo} cadastrado com sucesso!`;

        mostrarNotificacao(mensagemSucesso);

        // Se for novo cadastro, limpa. Se for edição, mantém (ou redireciona, conforme regra de negócio)
        if (!modoEdicao) {
            document.getElementById('form-equipamento').reset();
            inicializarCamposNovos();
            document.getElementById('codigo').focus();
        }

        btn.innerHTML = `<span class="material-icons-outlined">save</span> ${textoOriginal}`;
        btn.disabled = false;
        
        // Opcional: Redirecionar após editar
        if (modoEdicao) {
            setTimeout(() => { window.location.href = 'catalogadd.html'; }, 1500);
        }

    }, 800);
}

function mostrarNotificacao(mensagem) {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = mensagem;
    toast.querySelector('.toast-icon').textContent = 'check_circle';
    toast.querySelector('.toast-icon').style.color = '#10B981'; // Verde sucesso
    
    toast.classList.add('toast-visible');
    
    setTimeout(() => {
        toast.classList.remove('toast-visible');
    }, 3000); 
}