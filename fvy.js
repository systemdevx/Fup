// --- fvy.js ---
// Configuração do Supabase
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

const SETORES = ["ALMOXARIFADO CENTRAL", "PRODUÇÃO", "QUALIDADE", "TI", "MANUTENÇÃO", "EXPEDIÇÃO", "CONSUMO"];
let supabaseClient;
let currentUserEmail = 'usuario.anonimo@fup.com';

// Inicializa o Cliente Supabase
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error("ERRO: Biblioteca Supabase não carregada no HTML.");
}

let items = [{ id: Date.now(), codigo: '', equipamento: '', req_me: '', nf: '', qtd: '', setor: '', arquivoNome: '', expanded: true }];

document.addEventListener('DOMContentLoaded', async () => {
    // Tenta pegar o usuário logado, se houver
    if (supabaseClient) {
        const { data } = await supabaseClient.auth.getSession();
        if (data && data.session && data.session.user) {
            currentUserEmail = data.session.user.email;
        }
    }
    renderItems();
});

// --- FUNÇÕES DE INTERFACE (UI) ---
function renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const optionsSetor = SETORES.map(s => `<option value="${s}" ${item.setor === s ? 'selected' : ''}>${s}</option>`).join('');
        const arquivoTexto = item.arquivoNome || 'ANEXAR DOCUMENTO';
        const arquivoStyle = item.arquivoNome ? 'color: #E67E22; font-weight:bold;' : '';
        
        const html = `
            <div class="item-row ${item.expanded ? 'expanded' : ''}" id="row-${item.id}">
                <div class="item-summary" onclick="toggleExpand(${item.id})">
                    <div class="col-idx"><span class="material-icons-outlined arrow-toggle">expand_more</span>${index + 1}</div>
                    <div class="col-code">${item.codigo || '<span style="color:#ccc">NOVO</span>'}</div>
                    <div class="col-equip">${item.equipamento || '<span style="color:#ccc">PREENCHA OS DETALHES</span>'}</div>
                    <div class="col-req">${item.req_me || '-'}</div>
                    <div class="col-nf">${item.nf || '-'}</div>
                    <div class="col-actions">
                         <button class="btn-remove-icon" onclick="event.stopPropagation(); removerItem(${item.id})">
                            <span class="material-icons-outlined" style="font-size:18px;">close</span>
                        </button>
                    </div>
                </div>
                <div class="item-details"><div class="form-grid">
                    <div class="input-wrapper"><label>CÓDIGO</label><input type="text" class="input-me" value="${item.codigo}" oninput="handleInput(this, ${item.id}, 'codigo')" onblur="validateField(this)"><span class="error-msg">OBRIGATÓRIO</span></div>
                    <div class="input-wrapper" style="grid-column: span 2;"><label>EQUIPAMENTO</label><input type="text" class="input-me" value="${item.equipamento}" oninput="handleInput(this, ${item.id}, 'equipamento')" onblur="validateField(this)"><span class="error-msg">OBRIGATÓRIO</span></div>
                    <div class="input-wrapper"><label>REQUISIÇÃO ME</label><input type="text" class="input-me" value="${item.req_me}" oninput="handleInput(this, ${item.id}, 'req_me')" onblur="validateField(this)"><span class="error-msg">OBRIGATÓRIO</span></div>
                    <div class="input-wrapper"><label>NOTA FISCAL</label><input type="text" class="input-me" value="${item.nf}" oninput="handleInput(this, ${item.id}, 'nf')" onblur="validateField(this)"><span class="error-msg">OBRIGATÓRIO</span></div>
                    <div class="input-wrapper"><label>QUANTIDADE</label><input type="text" class="input-me" value="${item.qtd}" oninput="handleInput(this, ${item.id}, 'qtd')" onblur="validateField(this)"><span class="error-msg">OBRIGATÓRIO</span></div>
                    <div class="input-wrapper"><label>SETOR</label><select class="input-me" onchange="handleInput(this, ${item.id}, 'setor')" onblur="validateField(this)"><option value="">SELECIONE...</option>${optionsSetor}</select><span class="error-msg">OBRIGATÓRIO</span></div>
                    <div class="input-wrapper"><label>DOCUMENTOS</label><div class="file-upload-wrapper" onclick="document.getElementById('file-${item.id}').click()"><span class="file-upload-text" id="filename-${item.id}" style="${arquivoStyle}">${arquivoTexto}</span><span class="material-icons-outlined file-icon">description</span></div><input type="file" id="file-${item.id}" style="display:none" onchange="handleFileSelect(${item.id}, this)"></div>
                </div></div>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// Funções Auxiliares de UI (Mantidas iguais ao seu original para funcionamento do layout)
function handleInput(input, id, field) { input.value = input.value.toUpperCase(); updateItem(id, field, input.value); if(input.value.trim() !== "") { input.classList.remove('error'); if(input.parentElement) input.parentElement.classList.remove('has-error'); } }
function updateItem(id, field, value) { const item = items.find(i => i.id === id); if (item) { item[field] = value; renderSummary(id); } }
function renderSummary(id) { const item = items.find(i => i.id === id); const row = document.getElementById(`row-${id}`); if(row && item) { row.querySelector('.col-code').innerHTML = item.codigo || '<span style="color:#ccc">NOVO</span>'; row.querySelector('.col-equip').innerHTML = item.equipamento || '<span style="color:#ccc">PREENCHA OS DETALHES</span>'; row.querySelector('.col-req').innerText = item.req_me || '-'; row.querySelector('.col-nf').innerText = item.nf || '-'; } }
function handleFileSelect(id, input) { if (input.files && input.files[0]) { const fileName = input.files[0].name.toUpperCase(); const item = items.find(i => i.id === id); if(item) item.arquivoNome = fileName; renderItems(); } }
function toggleExpand(id) { const item = items.find(i => i.id === id); if (item) { item.expanded = !item.expanded; renderItems(); } }
function adicionarNovoItem() { items.forEach(i => i.expanded = false); items.push({ id: Date.now(), codigo: '', equipamento: '', req_me: '', nf: '', qtd: '', setor: '', arquivoNome: '', expanded: true }); renderItems(); setTimeout(() => { const rows = document.querySelectorAll('.item-row'); rows[rows.length-1].scrollIntoView({ behavior: 'smooth' }); }, 100); }
function removerItem(id) { if (items.length <= 1) return; items = items.filter(i => i.id !== id); renderItems(); }
function validateField(input) { if (!input.value || input.value.trim() === "") { input.classList.add('error'); input.parentElement.classList.add('has-error'); } else { input.classList.remove('error'); input.parentElement.classList.remove('has-error'); } }
function validarEAvançar() { let isValid = true; items.forEach(item => { ['codigo', 'equipamento', 'req_me', 'nf', 'qtd', 'setor'].forEach(key => { if(!item[key] || item[key].trim() === "") isValid = false; }); if(!isValid) item.expanded = true; }); renderItems(); setTimeout(() => { document.querySelectorAll('.input-me, select.input-me').forEach(input => { if(!input.value) { input.classList.add('error'); input.parentElement.classList.add('has-error'); } }); }, 50); if(isValid) abrirModalPreview(); }
function solicitarCancelamento() { document.getElementById('modal-cancel-confirm').style.display = 'flex'; }
function fecharModalCancel() { document.getElementById('modal-cancel-confirm').style.display = 'none'; }
function confirmarSaida() { window.location.href = 'sgq.html'; }

function abrirModalPreview() { 
    const tbody = document.getElementById('email-tbody'); 
    const attachmentArea = document.getElementById('attachment-area'); 
    const attachmentList = document.getElementById('attachment-list-content'); 
    tbody.innerHTML = ''; attachmentList.innerHTML = ''; let hasAttachments = false; 
    items.forEach(item => { 
        tbody.insertAdjacentHTML('beforeend', `<tr><td>${item.codigo}</td><td>${item.equipamento}</td><td>${item.req_me}</td><td>${item.nf}</td><td>${item.qtd}</td><td>${item.setor}</td></tr>`); 
        if(item.arquivoNome) { hasAttachments = true; attachmentList.insertAdjacentHTML('beforeend', `<div class="attach-chip"><span class="material-icons-outlined" style="font-size:14px; color:#E67E22;">description</span>${item.arquivoNome}</div>`); } 
    }); 
    attachmentArea.style.display = hasAttachments ? 'flex' : 'none'; 
    document.getElementById('email-modal').style.display = 'flex'; 
}
function fecharModalEmail() { document.getElementById('email-modal').style.display = 'none'; }

// --- LÓGICA PRINCIPAL: SALVAR NO BANCO E ENVIAR E-MAIL ---
async function confirmarEnvio() {
    if (!supabaseClient) { alert('Erro Crítico: Banco de Dados desconectado.'); return; }
    
    const btn = document.querySelector('.modal-bottom-bar .btn-me-solid');
    const originalText = btn.innerHTML;
    btn.disabled = true; 
    btn.innerHTML = '<span class="material-icons-outlined spin">sync</span> SALVANDO DADOS...';

    // Preparar dados para o formato do Banco de Dados
    const dadosParaInserir = items.map(item => ({
        codigo: item.codigo,
        equipamento: item.equipamento,
        requisicao: item.req_me,
        nota_fiscal: item.nf,
        quantidade: item.qtd,
        setor: item.setor,
        arquivo_nome: item.arquivoNome || null,
        user_email: currentUserEmail,
        status: 'Pendente' // Status inicial
    }));

    try {
        // 1. Inserir no Banco de Dados (Tabela ativos_fvy)
        const { error } = await supabaseClient.from('ativos_fvy').insert(dadosParaInserir);
        if (error) throw error;

        // 2. Disparo de E-mail via Edge Function
        // Se a função não estiver criada no Supabase, isso vai gerar um erro no console,
        // mas o dado já estará salvo no banco.
        btn.innerHTML = '<span class="material-icons-outlined spin">mail</span> ENVIANDO NOTIFICAÇÃO...';
        
        try {
            const { error: funcError } = await supabaseClient.functions.invoke('enviar-notificacao', {
                body: { 
                    items: items, 
                    destinatario: '001827@conipaind.com.br', 
                    remetente_user: currentUserEmail 
                }
            });
            if (funcError) console.warn("Aviso: Falha ao invocar função de e-mail (verifique se ela foi feito o Deploy).", funcError);
        } catch (e) {
            console.warn("Função de e-mail não configurada ou erro de rede.", e);
        }

        // 3. Sucesso Final
        btn.innerHTML = '<span class="material-icons-outlined">check</span> SUCESSO!';
        btn.style.backgroundColor = '#27AE60';
        
        setTimeout(() => { 
            window.location.href = 'sgq.html'; // Redireciona para o Histórico
        }, 1500);

    } catch (err) {
        console.error("Erro ao salvar:", err);
        btn.innerHTML = 'ERRO AO SALVAR';
        btn.style.backgroundColor = '#E74C3C';
        alert("Erro ao salvar no banco: " + err.message);
        
        setTimeout(() => { 
            btn.disabled = false; 
            btn.innerHTML = originalText; 
            btn.style.backgroundColor = '#E67E22'; 
        }, 3000);
    }
}