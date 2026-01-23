// --- fvy.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

document.addEventListener('DOMContentLoaded', async () => {
    // Inicialização
    const form = document.getElementById('form-ativo');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            abrirModalPreview();
        });
    }
});

/* --- Lógica de Cancelamento --- */
function solicitarCancelamento() {
    document.getElementById('modal-cancel-confirm').style.display = 'flex';
}

function fecharModalCancel() {
    document.getElementById('modal-cancel-confirm').style.display = 'none';
}

function confirmarSaida() {
    // Redireciona para o módulo principal
    window.location.href = 'sgq.html';
}

/* --- Lógica de Envio e Preview --- */
function abrirModalPreview() {
    // 1. Captura valores
    const codigo = document.getElementById('codigo').value;
    const equipamento = document.getElementById('equipamento').value;
    const req = document.getElementById('req_compra').value;
    const nf = document.getElementById('nota_fiscal').value;
    const local = document.getElementById('local_ai').value;

    // 2. Preenche o Modal
    document.getElementById('preview-codigo').innerText = codigo;
    document.getElementById('preview-equipamento').innerText = equipamento;
    document.getElementById('preview-req').innerText = req;
    document.getElementById('preview-req-table').innerText = req;
    document.getElementById('preview-nf').innerText = nf;
    document.getElementById('preview-local').innerText = local;

    // 3. Exibe Modal
    document.getElementById('email-modal').style.display = 'flex';
}

function fecharModalEmail() {
    document.getElementById('email-modal').style.display = 'none';
}

function limparFormulario() {
    if(confirm('Limpar todos os campos?')) {
        document.getElementById('form-ativo').reset();
    }
}

async function enviarNotificacaoReal() {
    const btn = document.querySelector('.modal-footer-actions .btn-primary');
    const originalText = btn.innerHTML;
    
    // Feedback visual
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons-outlined" style="font-size:16px;">hourglass_empty</span> Enviando...';

    // Simulação de envio
    setTimeout(() => {
        alert('Notificação enviada com sucesso ao SGQ!');
        // Redireciona após sucesso
        window.location.href = 'sgq.html';
    }, 1500);
}