/* =========================================
   CONTROLE DE NAVEGAÇÃO
========================================= */

function goToForm(type) {
    const screenSelection = document.getElementById('screen-selection');
    const screenForm = document.getElementById('screen-form');
    const formContent = document.querySelector('.form-content-wrapper');

    screenSelection.classList.add('hidden');
    screenForm.classList.remove('hidden');
    
    // Animação simples
    formContent.classList.add('slide-up');
    setTimeout(() => { formContent.classList.remove('slide-up'); }, 500);

    setupFormForType(type);
    
    // Função nova para preencher Data e Usuário
    preencherDadosAutomaticos();
}

function goBackToSelection() {
    document.getElementById('screen-form').classList.add('hidden');
    document.getElementById('screen-selection').classList.remove('hidden');
}

/* =========================================
   CONFIGURAÇÃO DO FORMULÁRIO
========================================= */

function setupFormForType(type) {
    // 1. Esconde todos os campos
    document.querySelectorAll('.form-group').forEach(group => group.classList.add('hidden'));

    // 2. Mostra o grupo correto
    const target = document.getElementById(`fields-${type}`);
    if (target) target.classList.remove('hidden');

    // 3. Atualiza input hidden
    document.getElementById('selectedType').value = type;

    // 4. Textos dinâmicos
    const titles = {
        'ativo': 'Novo Ativo',
        'item': 'Novo Item',
        'fornecedor': 'Novo Fornecedor'
    };
    const subtitles = {
        'ativo': 'Preencha ID e Nome do Equipamento.',
        'item': 'Preencha Grupo, Código e detalhes do Item.',
        'fornecedor': 'Preencha Razão Social e CNPJ.'
    };

    document.getElementById('dynamic-title').innerText = titles[type];
    document.getElementById('dynamic-subtitle').innerText = subtitles[type];
}

// Função para simular o preenchimento automático do sistema
function preencherDadosAutomaticos() {
    // Pega a data de hoje no formato YYYY-MM-DD para o input type="date"
    const hoje = new Date().toISOString().split('T')[0];
    
    // Usuário simulado (futuramente virá do login)
    const usuarioAtual = "Admin (Você)";

    // Preenche todos os campos com a classe .auto-date
    document.querySelectorAll('.auto-date').forEach(input => {
        input.value = hoje;
    });

    // Preenche todos os campos com a classe .auto-user
    document.querySelectorAll('.auto-user').forEach(input => {
        input.value = usuarioAtual;
    });
}

/* =========================================
   ENVIO (SUBMIT)
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const mainForm = document.getElementById('mainForm');

    if (mainForm) {
        mainForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const type = document.getElementById('selectedType').value;
            const btnSave = mainForm.querySelector('.btn-save');
            
            btnSave.innerText = 'Salvando...';
            btnSave.disabled = true;

            setTimeout(() => {
                alert(`Sucesso! Cadastro de ${type.toUpperCase()} realizado.`);
                window.location.href = 'cadastros.html';
            }, 1000);
        });
    }
});