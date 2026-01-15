document.addEventListener('DOMContentLoaded', () => {
    
    const pageTitle = document.getElementById('titulo-dinamico');
    const inputHidden = document.getElementById('input-tipo-oculto');

    const titulos = {
        'almoxarifado': 'Novo Cadastro: Almoxarifado',
        'ativos': 'Novo Cadastro: Ativo / Equipamento',
        'fornecedores': 'Novo Cadastro: Fornecedor',
        'transportadoras': 'Novo Cadastro: Transportadora'
    };

    function configurarFormulario() {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');

        if (!type || !titulos[type]) {
            alert('Tipo de cadastro não especificado. Retornando...');
            window.location.href = 'registration.html';
            return;
        }

        pageTitle.innerText = titulos[type];
        inputHidden.value = type;

        const grupoAtivo = document.getElementById(`group-${type}`);
        if (grupoAtivo) {
            grupoAtivo.classList.remove('hidden');
        }
    }

    document.getElementById('form-cadastro').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'registration.html';
    });

    configurarFormulario();
});