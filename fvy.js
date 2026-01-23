// --- fvy.js ---

const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

const SETORES = [
    "ALMOXARIFADO CENTRAL", "PRODUÇÃO", "QUALIDADE", "TI", "MANUTENÇÃO", "EXPEDIÇÃO", "CONSUMO"
];

let supabaseClient;
let currentUserEmail = 'anonimo';

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let items = [
    {
        id: Date.now(),
        codigo: '',
        equipamento: '',
        req_me: '',
        nf: '',
        qtd: '',
        setor: '',
        arquivoNome: '',
        expanded: true
    }
];

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    renderItems();
});

async function checkSession() {
    if (!supabaseClient) return;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
        currentUserEmail = session.user.email;
    }
}

function renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';

    items.forEach((item, index) => {
        const optionsSetor = SETORES.map(s => `<option value="${s}" ${item.setor === s ? 'selected' : ''}>${s}</option>`).join('');
        const arquivoTexto = item.arquivoNome || 'ANEXAR DOCUMENTO';
        const arquivoIcone = item.arquivoNome ? 'description' : 'attach_file';
        const arquivoClass = item.arquivoNome ? 'color: #E67E22; font-weight:bold;' : '';

        const html = `
            <div class="item-row ${item.expanded ? 'expanded' : ''}" id="row-${item.id}">
                <div class="item-summary" onclick="toggleExpand(${item.id})">
                    <div class="col-idx">
                        <span class="material-icons-outlined arrow-toggle">expand_more</span>
                        ${index + 1}
                    </div>
                    <div class="col-code">${item.codigo || '<span style="color:#ccc">NOVO</span>'}</div>
                    <div class="col-equip">${item.equipamento || '<span style="color:#ccc">PREENCHA OS DETALHES</span>'}</div>
                    <div class="col-req">${item.req_me || '-'}</div>
                    <div class="col-nf">${item.nf || '-'}</div>
                    <div class="col-actions">
                        <button class="btn-remove-icon" onclick="event.stopPropagation(); removerItem(${item.id})" title="Remover item">
                            <span class="material-icons-outlined" style="font-size:18px;">close</span>
                        </button>
                    </div>
                </div>

                <div class="item-details">
                    <div class="form-grid">
                        <div class="input-wrapper">
                            <label>CÓDIGO</label>
                            <input type="text" class="input-me" value="${item.codigo}" oninput="handleInput(this, ${item.id}, 'codigo')" onblur="validateField(this)">
                            <span class="error-msg">OBRIGATÓRIO</span>
                        </div>
                        <div class="input-wrapper" style="grid-column: span 2;">
                            <label>EQUIPAMENTO</label>
                            <input type="text" class="input-me" value="${item.equipamento}" oninput="handleInput(this, ${item.id}, 'equipamento')" onblur="validateField(this)">
                            <span class="error-msg">OBRIGATÓRIO</span>
                        </div>
                        <div class="input-wrapper">
                            <label>REQUISIÇÃO ME</label>
                            <input type="text" class="input-me" value="${item.req_me}" oninput="handleInput(this, ${item.id}, 'req_me')" onblur="validateField(this)">
                            <span class="error-msg">OBRIGATÓRIO</span>
                        </div>
                        <div class="input-wrapper">
                            <label>NOTA FISCAL</label>
                            <input type="text" class="input-me" value="${item.nf}" oninput="handleInput(this, ${item.id}, 'nf')" onblur="validateField(this)">
                            <span class="error-msg">OBRIGATÓRIO</span>
                        </div>
                        <div class="input-wrapper">
                            <label>QUANTIDADE</label>
                            <input type="text" class="input-me" value="${item.qtd}" oninput="handleInput(this, ${item.id}, 'qtd')" onblur="validateField(this)">
                            <span class="error-msg">OBRIGATÓRIO</span>
                        </div>
                        <div class="input-wrapper">
                            <label>SETOR</label>
                            <select class="input-me" onchange="handleInput(this, ${item.id}, 'setor')" onblur="validateField(this)">
                                <option value="">SELECIONE...</option>
                                ${optionsSetor}
                            </select>
                            <span class="error-msg">OBRIGATÓRIO</span>
                        </div>
                        <div class="input-wrapper">
                            <label>DOCUMENTOS</label>
                            <div class="file-upload-wrapper" onclick="document.getElementById('file-${item.id}').click()">
                                <span class="file-upload-text" id="filename-${item.id}" style="${arquivoClass}">${arquivoTexto}</span>
                                <span class="material-icons-outlined file-icon">${arquivoIcone}</span>
                            </div>
                            <input type="file" id="file-${item.id}" style="display:none" onchange="handleFileSelect(${item.id}, this)">
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function handleInput(input, id, field) {
    input.value = input.value.toUpperCase();
    updateItem(id, field, input.value);
    if(input.value.trim() !== "") {
        input.classList.remove('error');
        if(input.parentElement) input.parentElement.classList.remove('has-error');
    }
}

function updateItem(id, field, value) {
    const item = items.find(i => i.id === id);
    if (item) {
        item[field] = value;
        const row = document.getElementById(`row-${id}`);
        if(row) {
            if (field === 'codigo') row.querySelector('.col-code').innerHTML = value || '<span style="color:#ccc">NOVO</span>';
            if (field === 'equipamento') row.querySelector('.col-equip').innerHTML = value || '<span style="color:#ccc">PREENCHA OS DETALHES</span>';
            if (field === 'req_me') row.querySelector('.col-req').innerText = value || '-';
            if (field === 'nf') row.querySelector('.col-nf').innerText = value || '-';
        }
    }
}

function handleFileSelect(id, input) {
    if (input.files && input.files[0]) {
        const fileName = input.files[0].name.toUpperCase();
        const item = items.find(i => i.id === id);
        if(item) item.arquivoNome = fileName;
        const textEl = document.getElementById(`filename-${id}`);
        textEl.innerText = fileName;
        textEl.style.color = '#E67E22';
        textEl.style.fontWeight = 'bold';
    }
}

function toggleExpand(id) {
    const item = items.find(i => i.id === id);
    if (item) {
        item.expanded = !item.expanded;
        renderItems();
    }
}

function adicionarNovoItem() {
    items.forEach(i => i.expanded = false);
    items.push({
        id: Date.now(),
        codigo: '', equipamento: '', req_me: '', nf: '', qtd: '', setor: '', arquivoNome: '', expanded: true
    });
    renderItems();
    setTimeout(() => {
        const els = document.querySelectorAll('.item-row');
        els[els.length - 1].scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function removerItem(id) {
    if (items.length <= 1) return;
    items = items.filter(i => i.id !== id);
    renderItems();
}

function validateField(input) {
    const wrapper = input.parentElement;
    if (!input.value || input.value.trim() === "") {
        input.classList.add('error');
        wrapper.classList.add('has-error');
    } else {
        input.classList.remove('error');
        wrapper.classList.remove('has-error');
    }
}

function validarEAvançar() {
    let isValid = true;
    items.forEach(item => {
        const fields = ['codigo', 'equipamento', 'req_me', 'nf', 'qtd', 'setor'];
        let itemValid = true;
        fields.forEach(key => {
            if(!item[key] || item[key].trim() === "") {
                itemValid = false;
                isValid = false;
            }
        });
        if(!itemValid) item.expanded = true;
    });

    renderItems();
    setTimeout(() => {
        const inputs = document.querySelectorAll('.input-me, select.input-me');
        inputs.forEach(input => {
            if(!input.value) {
                input.classList.add('error');
                input.parentElement.classList.add('has-error');
            }
        });
    }, 50);

    if(isValid) abrirModalPreview();
}

function solicitarCancelamento() { document.getElementById('modal-cancel-confirm').style.display = 'flex'; }
function fecharModalCancel() { document.getElementById('modal-cancel-confirm').style.display = 'none'; }
function confirmarSaida() { window.location.href = 'sgq.html'; }

function abrirModalPreview() {
    const tbody = document.getElementById('email-tbody');
    const attachmentArea = document.getElementById('attachment-area');
    const attachmentList = document.getElementById('attachment-list-content');
    
    tbody.innerHTML = '';
    attachmentList.innerHTML = '';
    let hasAttachments = false;

    items.forEach(item => {
        const row = `
            <tr>
                <td>${item.codigo}</td>
                <td>${item.equipamento}</td>
                <td>${item.req_me}</td>
                <td>${item.nf}</td>
                <td>${item.qtd}</td>
                <td>${item.setor}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);

        if(item.arquivoNome) {
            hasAttachments = true;
            const chip = `
                <div class="attach-chip">
                    <span class="material-icons-outlined" style="font-size:14px; color:#E67E22;">description</span>
                    ${item.arquivoNome}
                </div>
            `;
            attachmentList.insertAdjacentHTML('beforeend', chip);
        }
    });

    if(hasAttachments) attachmentArea.style.display = 'flex';
    else attachmentArea.style.display = 'none';

    document.getElementById('email-modal').style.display = 'flex';
}

function fecharModalEmail() { document.getElementById('email-modal').style.display = 'none'; }

async function confirmarEnvio() {
    if (!supabaseClient) { alert('Erro: Supabase não conectado.'); return; }

    const btn = document.querySelector('.modal-bottom-bar .btn-me-solid');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons-outlined spin">sync</span> ENVIANDO...';

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
        const { error } = await supabaseClient.from('ativos_fvy').insert(dadosParaInserir);
        if (error) throw error;

        btn.innerHTML = '<span class="material-icons-outlined">check</span> SUCESSO!';
        setTimeout(() => { window.location.href = 'sgq.html'; }, 1000);

    } catch (err) {
        console.error("Erro:", err);
        btn.innerHTML = 'ERRO';
        btn.style.backgroundColor = '#E74C3C';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '#E67E22';
            alert("Erro ao salvar dados.");
        }, 2000);
    }
}