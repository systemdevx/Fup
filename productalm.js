document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos do Form
    const pageTitle = document.getElementById('titulo-dinamico');
    const inputHidden = document.getElementById('input-tipo-oculto');
    const form = document.getElementById('form-cadastro');
    const btnVoltar = document.getElementById('btn-voltar'); 

    // Elementos do Modal Personalizado
    const modalOverlay = document.getElementById('modal-confirmacao');
    const btnModalFicar = document.getElementById('btn-modal-cancelar');
    const btnModalSair = document.getElementById('btn-modal-confirmar');

    // Mapeamento de Títulos
    const titulos = {
        'almoxarifado': 'Novo Cadastro: Almoxarifado',
        'ativos': 'Novo Cadastro: Ativo / Equipamento',
        'fornecedores': 'Novo Cadastro: Fornecedor',
        'transportadoras': 'Novo Cadastro: Transportadora'
    };

    // --- NOVA LÓGICA: Modal Personalizado ---
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function(e) {
            e.preventDefault(); // Impede a navegação imediata
            
            // Mostra o modal personalizado (remove a classe hidden)
            if (modalOverlay) {
                modalOverlay.classList.remove('hidden');
            }
        });
    }

    // Botão "Não, continuar" (dentro do modal)
    if (btnModalFicar) {
        btnModalFicar.addEventListener('click', function() {
            // Apenas esconde o modal novamente
            modalOverlay.classList.add('hidden');
        });
    }

    // Botão "Sim, sair" (dentro do modal)
    if (btnModalSair) {
        btnModalSair.addEventListener('click', function() {
            // Executa a navegação de volta para registration.html
            window.location.href = 'registration.html';
        });
    }
    
    // Fechar modal se clicar fora da caixa (opcional, mas bom para UX)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.add('hidden');
            }
        });
    }

    // --- CONFIGURAÇÃO INICIAL DO FORM ---
    function configurarFormulario() {
        const params = new URLSearchParams(window.location.search);
        let type = params.get('type');

        if (!type || !titulos[type]) {
            console.warn('Nenhum tipo especificado na URL. Usando padrão: almoxarifado');
            type = 'almoxarifado'; 
        }

        if(pageTitle) pageTitle.innerText = titulos[type];
        if(inputHidden) inputHidden.value = type;

        document.querySelectorAll('.field-group').forEach(el => el.classList.add('hidden'));

        const grupoAtivo = document.getElementById(`group-${type}`);
        if (grupoAtivo) {
            grupoAtivo.classList.remove('hidden');
        }
    }

    // --- LÓGICA DE ENVIO (SIMULAÇÃO) ---
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSalvar = document.querySelector('.btn-salvar-full');
            btnSalvar.innerHTML = 'Salvando...';
            btnSalvar.disabled = true;

            const tipo = inputHidden.value;
            const formData = new FormData(form);
            
            console.log(`Salvando dados do tipo: ${tipo}`);
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            setTimeout(() => {
                alert('Cadastro salvo com sucesso! (Simulação Offline)');
                window.location.href = 'registration.html';
            }, 500);
        });
    }

    configurarFormulario();
});