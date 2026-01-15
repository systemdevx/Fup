document.addEventListener('DOMContentLoaded', () => {
    
    const pageTitle = document.getElementById('titulo-dinamico');
    const inputHidden = document.getElementById('input-tipo-oculto');
    const form = document.getElementById('form-cadastro');

    // Mapeamento de Títulos
    const titulos = {
        'almoxarifado': 'Novo Cadastro: Almoxarifado',
        'ativos': 'Novo Cadastro: Ativo / Equipamento',
        'fornecedores': 'Novo Cadastro: Fornecedor',
        'transportadoras': 'Novo Cadastro: Transportadora'
    };

    function configurarFormulario() {
        // Tenta pegar o tipo da URL (ex: productalm.html?type=ativos)
        const params = new URLSearchParams(window.location.search);
        let type = params.get('type');

        // PROTEÇÃO: Se não tiver tipo na URL, assume 'almoxarifado' para não ficar em branco
        if (!type || !titulos[type]) {
            console.warn('Nenhum tipo especificado na URL. Usando padrão: almoxarifado');
            type = 'almoxarifado'; 
        }

        // Atualiza textos e input oculto
        if(pageTitle) pageTitle.innerText = titulos[type];
        if(inputHidden) inputHidden.value = type;

        // Esconde todos primeiro (garantia)
        document.querySelectorAll('.field-group').forEach(el => el.classList.add('hidden'));

        // Mostra APENAS o grupo selecionado
        const grupoAtivo = document.getElementById(`group-${type}`);
        if (grupoAtivo) {
            grupoAtivo.classList.remove('hidden');
        } else {
            alert(`Erro: Grupo de campos para '${type}' não encontrado no HTML.`);
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
            
            // Simula coleta de dados
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