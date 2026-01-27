// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'COLOQUE_SUA_URL_AQUI';
const SUPABASE_KEY = 'COLOQUE_SUA_ANON_KEY_AQUI';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// -----------------------------

let modoEdicao = false;

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
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
    // Exibe formato BR
    document.getElementById('data_cadastro').value = hoje.toLocaleDateString('pt-BR');
    // Salva data ISO num atributo customizado para usar no banco
    document.getElementById('data_cadastro').dataset.iso = hoje.toISOString().split('T')[0];
}

async function prepararModoEdicao(id) {
    // 1. Ajustar Textos
    document.getElementById('page-title').textContent = "Edição de Equipamento";
    document.getElementById('form-title').textContent = "Editar Dados";
    
    // 2. Ajustar Botão
    const btnSave = document.getElementById('btn-salvar-main');
    btnSave.innerHTML = `<span class="material-icons-outlined">save</span> Salvar Alterações`;
    btnSave.disabled = true;

    // 3. Buscar Dados no Supabase
    const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('id_sistema', id)
        .single();

    if (error || !data) {
        alert("Erro ao carregar equipamento ou não encontrado.");
        window.location.href = 'catalogadd.html';
        return;
    }

    // Preencher campos
    document.getElementById('id_cadastro').value = data.id_sistema;
    document.getElementById('codigo').value = data.codigo;
    document.getElementById('descricao').value = data.descricao;
    document.getElementById('unidade').value = data.unidade;
    document.getElementById('grupo').value = data.grupo || 'AI';
    document.getElementById('ref_erp').value = data.ref_erp || 'ME';

    // Tratar data (Banco: YYYY-MM-DD -> Tela: DD/MM/YYYY)
    if(data.data_cadastro) {
        const [ano, mes, dia] = data.data_cadastro.split('-');
        document.getElementById('data_cadastro').value = `${dia}/${mes}/${ano}`;
        document.getElementById('data_cadastro').dataset.iso = data.data_cadastro;
    }

    btnSave.disabled = false;
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

async function salvarEquipamento(event) {
    event.preventDefault(); 
    
    // Coleta dos dados
    const idSistema = document.getElementById('id_cadastro').value;
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;
    const unidade = document.getElementById('unidade').value;
    const grupo = document.getElementById('grupo').value;
    const refErp = document.getElementById('ref_erp').value;
    // Pega a data ISO salva no dataset
    const dataCadastroIso = document.getElementById('data_cadastro').dataset.iso;

    const btn = document.querySelector('.btn-save');
    const textoOriginal = modoEdicao ? "Salvar Alterações" : "Salvar Cadastro";
    
    btn.innerHTML = `<span class="material-icons-outlined input-spin">sync</span> Salvando...`;
    btn.disabled = true;

    const payload = {
        id_sistema: idSistema,
        codigo: codigo,
        descricao: descricao,
        unidade: unidade,
        grupo: grupo,
        ref_erp: refErp,
        data_cadastro: dataCadastroIso
    };

    let error = null;

    if (modoEdicao) {
        // UPDATE
        const response = await supabase
            .from('equipamentos')
            .update(payload)
            .eq('id_sistema', idSistema);
        
        error = response.error;
        
        if (!error) {
            // Log histórico de edição
            await supabase.from('historico_equipamentos').insert([{
                equipamento_id: idSistema,
                usuario: 'Admin',
                acao: 'Edição de Cadastro',
                tipo_badge: 'edit'
            }]);
        }

    } else {
        // INSERT
        const response = await supabase
            .from('equipamentos')
            .insert([payload]);

        error = response.error;

        if (!error) {
            // Log histórico de criação
            await supabase.from('historico_equipamentos').insert([{
                equipamento_id: idSistema,
                usuario: 'Admin',
                acao: 'Criação do Item',
                tipo_badge: 'create'
            }]);
        }
    }

    if (error) {
        console.error(error);
        mostrarNotificacao("Erro ao salvar no banco de dados!", "error");
        btn.innerHTML = `<span class="material-icons-outlined">save</span> ${textoOriginal}`;
        btn.disabled = false;
        return;
    }

    // Sucesso
    const mensagemSucesso = modoEdicao 
        ? "Equipamento Alterado com sucesso!" 
        : `Equipamento ${codigo} cadastrado com sucesso!`;

    mostrarNotificacao(mensagemSucesso, "success");

    setTimeout(() => {
        if (!modoEdicao) {
            document.getElementById('form-equipamento').reset();
            inicializarCamposNovos();
            document.getElementById('codigo').focus();
            btn.innerHTML = `<span class="material-icons-outlined">save</span> ${textoOriginal}`;
            btn.disabled = false;
        } else {
            // Se editou, volta pra lista
            window.location.href = 'catalogadd.html';
        }
    }, 1200);
}

function mostrarNotificacao(mensagem, tipo) {
    const toast = document.getElementById('toast');
    const toastMsg = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    toastMsg.textContent = mensagem;
    
    if (tipo === "error") {
        toastIcon.textContent = 'error';
        toastIcon.style.color = '#EF4444';
    } else {
        toastIcon.textContent = 'check_circle';
        toastIcon.style.color = '#10B981';
    }
    
    toast.classList.add('toast-visible');
    
    setTimeout(() => {
        toast.classList.remove('toast-visible');
    }, 3000); 
}