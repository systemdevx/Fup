// --- supplieradd.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    configurarInputs();
});

// --- AUTENTICAÇÃO ---
async function checkSession() {
    if (!supabaseClient) return;

    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (!session || error) {
        window.location.href = 'login.html';
        return; 
    }

    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    if (session.user && session.user.email) {
        const initials = session.user.email.substring(0, 2).toUpperCase();
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = initials;
    }
}

// --- CONFIGURAÇÃO DE INPUTS ---
function configurarInputs() {
    
    // Todos os inputs de texto viram Maiúsculos ao digitar
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Garante que o valor digitado fique em maiúsculo
            const start = this.selectionStart;
            this.value = this.value.toUpperCase();
            this.setSelectionRange(start, start);
            
            // Remove estado de erro ao digitar e restaura placeholder original
            if(this.classList.contains('input-error')) {
                this.classList.remove('input-error');
                this.placeholder = this.getAttribute('data-original-placeholder') || 'Digitar';
            }
        });
        // Salva placeholder original
        input.setAttribute('data-original-placeholder', input.placeholder);
    });

    // MÁSCARA CNPJ (xx.xxx.xxx/xxxx-xx)
    const cnpjInput = document.getElementById('input-cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
            
            // Aplica a máscara progressivamente
            if (v.length > 14) v = v.substring(0, 14);
            
            v = v.replace(/^(\d{2})(\d)/, "$1.$2");
            v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
            v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
            v = v.replace(/(\d{4})(\d)/, "$1-$2");
            
            e.target.value = v;
        });
    }

    // Select - remove erro ao mudar
    const selectLocal = document.getElementById('select-localidade');
    if(selectLocal) {
        selectLocal.addEventListener('change', function() {
            if(this.classList.contains('input-error')) {
                this.classList.remove('input-error');
            }
        });
    }
}

// --- VALIDAÇÃO ---
function solicitarValidacao() {
    const localidade = document.getElementById('select-localidade');
    const cnpj = document.getElementById('input-cnpj');
    const razao = document.getElementById('input-razao-social');
    
    let temErro = false;

    // Valida Localidade
    if (!localidade.value) {
        localidade.classList.add('input-error');
        temErro = true;
    }

    // Valida CNPJ
    if (!cnpj.value.trim()) {
        cnpj.classList.add('input-error');
        cnpj.placeholder = "Campo Obrigatório"; // Texto normal
        temErro = true;
    }

    // Valida Razão Social
    if (!razao.value.trim()) {
        razao.classList.add('input-error');
        razao.placeholder = "Campo Obrigatório"; // Texto normal
        temErro = true;
    }

    if (temErro) {
        return; // Para se houver erro
    }

    // Se tudo certo, abre modal
    document.getElementById('modal-confirm').style.display = 'flex';
}

// --- CONTROLE DE MODAIS ---

function verificarCancelamento() {
    document.getElementById('modal-cancel').style.display = 'flex';
}

function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function confirmarSaida() {
    window.location.href = 'supplier.html';
}

function executarCadastro() {
    fecharModal('modal-confirm');

    const btn = document.querySelector('.btn-save');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="material-icons-outlined input-spin">sync</span> Processando...`;
    btn.disabled = true;

    setTimeout(() => {
        mostrarNotificacao('Cadastro enviado! Status: Aguardando Liberação');
        
        // Limpa formulário
        document.getElementById('form-fornecedor').reset();
        
        // Restaura placeholders originais e remove erros
        document.querySelectorAll('input').forEach(i => {
            i.placeholder = i.getAttribute('data-original-placeholder') || 'Digitar';
            i.classList.remove('input-error');
        });
        document.querySelectorAll('select').forEach(s => s.classList.remove('input-error'));

        btn.innerHTML = originalText;
        btn.disabled = false;

    }, 1000);
}

// --- UTILITÁRIOS ---
function mostrarNotificacao(mensagem) {
    const toast = document.getElementById('toast');
    if(!toast) return;

    const toastMsg = toast.querySelector('.toast-message');
    toastMsg.textContent = mensagem;

    toast.classList.add('toast-visible');
    setTimeout(() => { toast.classList.remove('toast-visible'); }, 3500);
}