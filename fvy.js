// --- fvy.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

// --- CONFIGURAÇÕES DE E-MAIL ---
const APP_EMAIL = "iaeclaudiox@gmail.com"; 
const RECIPIENT_EMAIL = "001827@conipaind.com.br";
// ⚠️ SEU NOVO TEMPLATE AQUI:
const TEMPLATE_ID_EMAILJS = "template_fqpktv3"; 
const SERVICE_ID_EMAILJS = "service_23msfhl";
const PUBLIC_KEY_EMAILJS = "-DKjfP3rVtClUmmEE";

const SETORES = ["ALMOXARIFADO CENTRAL", "PRODUÇÃO", "QUALIDADE", "TI", "MANUTENÇÃO", "EXPEDIÇÃO", "CONSUMO"];

let supabaseClient;
let currentUserEmail = 'usuario.anonimo@fup.com';

// Inicializa Supabase
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Variável para controlar o temporizador
let inactivityTimer;
const TEMPO_LIMITE = 30 * 60 * 1000; // 30 minutos em milissegundos

let items = [{ id: Date.now(), codigo: '', equipamento: '', req_me: '', nf: '', qtd: '', setor: '', arquivoNome: '', expanded: true }];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verifica segurança antes de qualquer coisa
    await checkSession();
    
    // 2. Renderiza a interface
    renderItems();
});

// --- FUNÇÕES DE SEGURANÇA ---

async function checkSession() {
    if (!supabaseClient) return;

    // Tenta pegar a sessão ativa
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    // Se não houver sessão, redireciona para login imediatamente
    if (!session || error) {
        window.location.href = 'login.html';
        return; 
    }

    // Atualiza o e-mail do usuário atual com o da sessão real
    if (session.user && session.user.email) {
        currentUserEmail = session.user.email;
    }

    // Inicia o monitoramento de inatividade
    iniciarMonitoramentoInatividade();
}

function iniciarMonitoramentoInatividade() {
    function resetTimer() {
        clearTimeout(inactivityTimer);
        // Reinicia a contagem para 30 minutos
        inactivityTimer = setTimeout(async () => {
            alert("Sessão expirada por inatividade (30 min). Você será desconectado.");
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
            window.location.href = 'login.html';
        }, TEMPO_LIMITE);
    }

    // Eventos que consideram o usuário "ativo"
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;
    document.onscroll = resetTimer;
}

// --- FUNÇÕES DE INTERFACE ---
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

// --- PREENCHIMENTO DO PREVIEW (AGORA COM E-MAILS REAIS) ---
function abrirModalPreview() { 
    // Atualiza o visual da janela para mostrar os e-mails reais
    const elFrom = document.getElementById('preview-from');
    const elTo = document.getElementById('preview-to');

    // Mostra: FUP ALM (iaeclaudiox@gmail.com)
    if(elFrom) elFrom.textContent = `FUP ALM (${APP_EMAIL})`;
    
    // Mostra: SGQ (001827@conipaind.com.br)
    if(elTo) elTo.textContent = `SGQ (${RECIPIENT_EMAIL})`;

    // Preenche a tabela
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

// --- ENVIO ---
async function confirmarEnvio() {
    if (!supabaseClient) { alert('Erro Crítico: Banco de Dados desconectado.'); return; }
    
    const btn = document.querySelector('.modal-bottom-bar .btn-me-solid');
    const originalText = btn.innerHTML;
    btn.disabled = true; 
    btn.innerHTML = '<span class="material-icons-outlined spin">sync</span> SALVANDO...';

    const dadosParaInserir = items.map(item => ({
        codigo: item.codigo,
        equipamento: item.equipamento,
        requisicao: item.req_me,
        nota_fiscal: item.nf,
        quantidade: item.qtd,
        setor: item.setor,
        arquivo_nome: item.arquivoNome || null,
        user_email: currentUserEmail,
        status: 'Pendente'
    }));

    try {
        // 1. Supabase
        const { error } = await supabaseClient.from('ativos_fvy').insert(dadosParaInserir);
        if (error) throw new Error("Erro Supabase: " + error.message);

        // 2. EmailJS (Usando as constantes definidas no topo)
        const promisesEmail = items.map(item => {
            const params = {
                codigo: item.codigo,
                equipamento: item.equipamento,
                req_me: item.req_me,
                nota_fiscal: item.nf,
                setor: item.setor,
                user_email: currentUserEmail,
                to_email: RECIPIENT_EMAIL
            };
            return emailjs.send(SERVICE_ID_EMAILJS, TEMPLATE_ID_EMAILJS, params, PUBLIC_KEY_EMAILJS);
        });

        await Promise.all(promisesEmail);

        btn.innerHTML = '<span class="material-icons-outlined">check</span> SUCESSO!';
        btn.style.backgroundColor = '#27AE60';
        
        setTimeout(() => { 
            window.location.href = 'sgq.html'; 
        }, 2000);

    } catch (err) {
        console.error("Erro Completo:", err);
        btn.innerHTML = 'ERRO NO ENVIO';
        btn.style.backgroundColor = '#E74C3C';
        
        const mensagemErro = err.text || err.message || JSON.stringify(err);
        alert("Ops! O banco salvou, mas o e-mail falhou.\n\nERRO: " + mensagemErro);
        
        setTimeout(() => { 
            btn.disabled = false; 
            btn.innerHTML = originalText; 
            btn.style.backgroundColor = '#E67E22'; 
        }, 5000);
    }
}