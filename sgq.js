// --- sgq.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;

// Verifica se a biblioteca foi carregada
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    alert("Erro: Biblioteca Supabase não carregada. Verifique sua conexão.");
}

// Variável para controlar o temporizador
let inactivityTimer;
const TEMPO_LIMITE = 30 * 60 * 1000; // 30 minutos em milissegundos

document.addEventListener('DOMContentLoaded', async () => {
    // Animação suave de entrada
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    await checkSession();
    carregarSgq(); // Inicia o carregamento da lista
});

async function checkSession() {
    if (!supabaseClient) return;
    
    // Verifica sessão 
    const { data } = await supabaseClient.auth.getSession();
    
    // Se não tiver sessão, manda para o login (igual aos outros módulos)
    if (!data || !data.session) {
        window.location.href = 'login.html';
        return;
    }

    // Inicia a contagem de segurança
    iniciarMonitoramentoInatividade();

    if (data.session.user) {
        const avatar = document.querySelector('.avatar');
        if(avatar) avatar.innerText = data.session.user.email.substring(0, 2).toUpperCase();
    }
    
    // Configura botão de sair
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            if (confirm("Deseja desconectar?")) {
                await supabaseClient.auth.signOut();
                window.location.href = 'login.html';
            }
        };
    }
}

// --- FUNÇÃO DE SEGURANÇA (30 Minutos) ---
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

// --- FUNÇÃO PRINCIPAL: CARREGAR DADOS ---
async function carregarSgq() {
    const tbody = document.getElementById('lista-sgq');
    const loading = document.getElementById('loading-msg');
    const empty = document.getElementById('empty-state-msg');
    
    if(!tbody) return;
    
    // Limpa tela e mostra loading
    tbody.innerHTML = '';
    if(loading) loading.style.display = 'block';
    if(empty) empty.style.display = 'none';

    try {
        if (!supabaseClient) throw new Error("Cliente Supabase não iniciado.");

        // Busca dados na tabela 'ativos_fvy'
        const { data, error } = await supabaseClient
            .from('ativos_fvy')
            .select('*')
            .order('created_at', { ascending: false }); // Do mais novo para o mais antigo

        if (error) throw error;

        // Esconde loading
        if (loading) loading.style.display = 'none';

        // Verifica se veio vazio
        if (!data || data.length === 0) {
            if(empty) empty.style.display = 'block';
            return;
        }

        renderizarTabela(data);

    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        if (loading) loading.style.display = 'none';
        
        // Mostra erro na tabela para o usuário ver
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding: 20px; color: #E74C3C;">
                    <span class="material-icons-outlined" style="font-size: 20px; vertical-align: middle;">error</span>
                    Erro ao carregar: ${err.message || 'Falha na conexão'}. <br>
                    <small>Tente recarregar a página.</small>
                </td>
            </tr>
        `;
    }
}

function renderizarTabela(lista) {
    const tbody = document.getElementById('lista-sgq');
    
    lista.forEach(item => {
        // Formata data (DD/MM/AAAA HH:MM)
        let dataFormatada = '-';
        if(item.created_at) {
            try {
                const dateObj = new Date(item.created_at);
                dataFormatada = dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            } catch (e) { dataFormatada = item.created_at; }
        }
        
        // Define cor do status
        let statusClass = 'status-calibracao'; // Cor amarela (Pendente) padrão
        const st = (item.status || '').toLowerCase();
        
        if (st.includes('aprovado') || st.includes('conforme') || st.includes('ok')) {
            statusClass = 'status-conforme'; // Verde
        } else if (st.includes('rejeitado') || st.includes('não') || st.includes('cancelado')) {
            statusClass = 'status-nao-conforme'; // Vermelho
        }
        
        // Monta a linha HTML
        const row = `
            <tr>
                <td><strong>${item.codigo || '<span style="color:#ccc">--</span>'}</strong></td>
                <td>
                    <div style="display:flex; flex-direction:column;">
                        <span style="font-weight:600; color:#333;">${item.equipamento || 'Sem Nome'}</span>
                        ${item.arquivo_nome ? `
                            <span style="font-size:11px; color:#E67E22; display:flex; align-items:center; gap:3px; margin-top:2px;">
                                <span class="material-icons-outlined" style="font-size:12px;">attach_file</span> ${item.arquivo_nome}
                            </span>` : ''}
                    </div>
                </td>
                <td>${item.requisicao || '-'}</td>
                <td>${item.nota_fiscal || '-'}</td>
                <td><span style="background:#F3F4F6; padding:2px 6px; border-radius:4px; font-size:11px;">${item.setor || '-'}</span></td>
                <td style="font-size:12px; color:#666;">${dataFormatada}</td>
                <td><span class="status-badge ${statusClass}">${item.status || 'Pendente'}</span></td>
                <td style="text-align: right;">
                    <button class="btn-icon" title="Ver Detalhes" onclick="alert('Detalhes: ${item.equipamento}')">
                        <span class="material-icons-outlined">visibility</span>
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function filtrarTabela(texto) {
    const rows = document.querySelectorAll('#lista-sgq tr');
    if(!rows) return;
    
    const term = texto.toUpperCase();
    rows.forEach(row => {
        // Pega todo o texto da linha para buscar
        const txt = row.innerText.toUpperCase();
        row.style.display = txt.includes(term) ? '' : 'none';
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('sidebar-closed');
}

function toggleGroup(header) {
    const list = header.nextElementSibling; 
    if(list) {
        // Alterna entre mostrar e esconder
        list.style.display = (list.style.display === 'none') ? 'flex' : 'none';
        
        // Gira a setinha
        const arrow = header.querySelector('.arrow-header');
        if(arrow) {
            arrow.textContent = (list.style.display === 'none') ? 'expand_more' : 'expand_less';
        }
    }
}