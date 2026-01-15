document.addEventListener('DOMContentLoaded', () => {
    
    const pageTitle = document.getElementById('titulo-dinamico');
    const inputHidden = document.getElementById('input-tipo-oculto');

    // Mapeamento de Títulos
    const titulos = {
        'almoxarifado': 'Novo Cadastro: Almoxarifado',
        'ativos': 'Novo Cadastro: Ativo / Equipamento',
        'fornecedores': 'Novo Cadastro: Fornecedor',
        'transportadoras': 'Novo Cadastro: Transportadora'
    };

    /**
     * Função Principal: Configura a tela baseada na URL
     */
    function configurarFormulario() {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');

        // Se o usuário tentar acessar a página sem tipo, volta para o menu principal
        if (!type || !titulos[type]) {
            alert('Tipo de cadastro não especificado. Retornando...');
            window.location.href = 'registration.html';
            return;
        }

        // 1. Atualiza o Título e o Input Oculto
        pageTitle.innerText = titulos[type];
        inputHidden.value = type;

        // 2. Mostra apenas o grupo de campos correto
        const grupoAtivo = document.getElementById(`group-${type}`);
        if (grupoAtivo) {
            grupoAtivo.classList.remove('hidden');
        }
    }

    // --- EVENTOS ---

    // Intercepta o envio do formulário
    document.getElementById('form-cadastro').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const tipo = inputHidden.value;
        const form = e.target;
        
        // Aqui você coletaria os dados. Exemplo simples:
        console.log(`Enviando dados para o tipo: ${tipo}`);
        
        alert('Cadastro realizado com sucesso! (Simulação)');
        
        // Redireciona de volta para a listagem após salvar
        window.location.href = 'registration.html';
    });

    // Inicia a configuração
    configurarFormulario();
});