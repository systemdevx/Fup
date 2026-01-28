// --- supplieradd.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    
    // Força maiúsculas nos inputs de texto (Padrão formeprodut)
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    });
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

// --- CONTROLE DE MODAIS ---

function verificarCancelamento() {
    // Abre modal de cancelamento
    document.getElementById('modal-cancel').style.display = 'flex';
}

function solicitarValidacao() {
    // Validação básica
    const pais = document.getElementById('select-pais').value;
    const doc = document.getElementById('input-doc-number').value;
    const razao = document.getElementById('input-razao-social').value;

    if (!pais || !doc || !razao) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    // Abre modal de confirmação de cadastro
    document.getElementById('modal-confirm').style.display = 'flex';
}

function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function confirmarSaida() {
    // Ação do botão "Sim, Cancelar"
    window.location.href = 'supplier.html';
}

function executarCadastro() {
    // Fecha modal
    fecharModal('modal-confirm');

    // Botão loading state
    const btn = document.querySelector('.btn-save');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="material-icons-outlined input-spin">sync</span> Processando...`;
    btn.disabled = true;

    // Simula envio e validação
    setTimeout(() => {
        mostrarNotificacao('Cadastro enviado! Status: Aguardando Liberação');
        
        // Limpa o formulário para permitir novo cadastro imediato
        document.getElementById('form-fornecedor').reset();
        
        // Restaura botão
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