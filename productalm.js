import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// --- 1. CONFIGURAÇÃO DO SUPABASE ---
const supabaseUrl = 'https://qolqfidcvvinetdkxeim.supabase.co'
const supabaseKey = 'sb_publishable_rD7o5xhuNf1-rDBUK_4Wog_lCOzYCkS' // Sua chave pública
const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener('DOMContentLoaded', () => {
    
    const pageTitle = document.getElementById('titulo-dinamico');
    const inputHidden = document.getElementById('input-tipo-oculto');
    const form = document.getElementById('form-cadastro');

    // Mapeamento de Títulos para a interface
    const titulos = {
        'almoxarifado': 'Novo Cadastro: Almoxarifado',
        'ativos': 'Novo Cadastro: Ativo / Equipamento',
        'fornecedores': 'Novo Cadastro: Fornecedor',
        'transportadoras': 'Novo Cadastro: Transportadora'
    };

    // Função que configura a tela com base na URL (?type=...)
    function configurarFormulario() {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');

        // Se não tiver tipo, volta para a lista
        if (!type || !titulos[type]) {
            alert('Tipo de cadastro não especificado. Retornando...');
            window.location.href = 'registration.html';
            return;
        }

        // Atualiza textos e input oculto
        pageTitle.innerText = titulos[type];
        inputHidden.value = type;

        // Mostra o grupo de campos correto
        const grupoAtivo = document.getElementById(`group-${type}`);
        if (grupoAtivo) {
            grupoAtivo.classList.remove('hidden');
        }
    }

    // --- 2. LÓGICA DE ENVIO (SUBMIT) ---
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Muda texto do botão para indicar carregamento
            const btnSalvar = document.querySelector('.btn-salvar-full');
            const textoOriginal = btnSalvar.innerHTML;
            btnSalvar.innerHTML = 'Salvando...';
            btnSalvar.disabled = true;

            const tipo = inputHidden.value;
            const formData = new FormData(form);
            
            let dadosParaSalvar = {};
            let tabelaDestino = '';

            // Prepara os dados conforme a tabela selecionada
            if (tipo === 'almoxarifado') {
                tabelaDestino = 'almoxarifado';
                dadosParaSalvar = {
                    grupo: formData.get('grupo'),
                    codigo: formData.get('codigo'),
                    descricao: formData.get('descricao'),
                    unidade: formData.get('unidade'),
                    preco: parseFloat(formData.get('preco')) || 0
                };
            } 
            else if (tipo === 'ativos') {
                tabelaDestino = 'ativos';
                dadosParaSalvar = {
                    equipamento: formData.get('equipamento')
                };
            }
            else if (tipo === 'fornecedores') {
                tabelaDestino = 'fornecedores';
                dadosParaSalvar = {
                    cnpj: formData.get('cnpj_fornecedor'),
                    razao_social: formData.get('razao_fornecedor')
                };
            }
            else if (tipo === 'transportadoras') {
                tabelaDestino = 'transportadoras';
                dadosParaSalvar = {
                    cnpj: formData.get('cnpj_transportadora'),
                    razao_social: formData.get('razao_transportadora')
                };
            }

            try {
                // Envia para o Supabase
                const { data, error } = await supabase
                    .from(tabelaDestino)
                    .insert([dadosParaSalvar])
                    .select();

                if (error) throw error;

                alert('Cadastro realizado com sucesso!');
                window.location.href = 'registration.html'; // Volta para a lista

            } catch (error) {
                console.error('Erro ao salvar:', error);
                alert('Erro ao salvar no banco de dados: ' + error.message);
                
                // Restaura o botão em caso de erro
                btnSalvar.innerHTML = textoOriginal;
                btnSalvar.disabled = false;
            }
        });
    }

    // Inicia a configuração ao carregar
    configurarFormulario();
});