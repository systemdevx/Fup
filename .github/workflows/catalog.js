// --- catalog.js ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let categoriaAtual = 'materiais';
let inactivityTimer;
const TEMPO_LIMITE = 30 * 60 * 1000;

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    carregarDadosCatalogo();
});

// Verificação de Sessão e Segurança
async function checkSession() {
    if (!supabaseClient) return;
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (!session || error) {
        window.location.href = 'login.html';
        return;
    }

    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    iniciarMonitoramentoInatividade();

    if (session.user.email) {
        const initials = session.user.email.substring(0, 2).toUpperCase();
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = initials;
    }

    document.getElementById('btn-logout').onclick = async () => {
        if (confirm("Deseja realmente sair?")) {
            await supabaseClient.auth.signOut();
            window.location.href = 'login.html';
        }
    };
}

function iniciarMonitoramentoInatividade() {
    function resetTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(async () => {
            alert("Sessão expirada por inatividade.");
            if (supabaseClient) await supabaseClient.auth.signOut();
            window.location.href = 'login.html';
        }, TEMPO_LIMITE);
    }
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
}

// Controle de Interface
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('sidebar-closed');
}

function toggleGroup(header) {
    const list = header.nextElementSibling;
    const arrow = header.querySelector('.arrow-header');
    if (list.style.display === 'none') {
        list.style.display = 'flex';
        arrow.innerText = 'expand_less';
    } else {
        list.style.display = 'none';
        arrow.innerText = 'expand_more';
    }
}

function alterarCategoria(novaCat, element) {
    document.querySelectorAll('.group-list a').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    categoriaAtual = novaCat;
    
    const titulos = {
        'materiais': 'Itens / Materiais',
        'unidades': 'Unidades de Medida',
        'equipamentos': 'Equipamentos (Ativos)',
        'tipos_ativos': 'Tipos de Ativos'
    };
    document.getElementById('titulo-pagina').innerText = titulos[novaCat];
    carregarDadosCatalogo();
}

// Carregamento de Dados
async function carregarDadosCatalogo() {
    const tbody = document.getElementById('corpo-tabela');
    const head = document.getElementById('cabecalho-tabela');
    const loading = document.getElementById('loading-msg');
    const empty = document.getElementById('empty-state-msg');
    
    tbody.innerHTML = '';
    loading.style.display = 'block';
    empty.style.display = 'none';

    // Simulação de carregamento ou integração com Supabase
    if (categoriaAtual === 'materiais') {
        head.innerHTML = `<th>CÓDIGO</th><th>DESCRIÇÃO</th><th>CATEGORIA</th><th>UN</th><th style="text-align:right">AÇÕES</th>`;
        
        // Exemplo de dados (Pode ser substituído por busca real no Supabase)
        const mockMateriais = [
            { id: 1, cod: 'ALM-001', desc: 'Parafuso Sextavado 1/2', cat: 'Ferragens', un: 'UN' },
            { id: 2, cod: 'ALM-002', desc: 'Graxa Industrial Azul', cat: 'Químicos', un: 'KG' }
        ];
        
        loading.style.display = 'none';
        renderizar(mockMateriais, (item) => `
            <tr>
                <td><strong>${item.cod}</strong></td>
                <td>${item.desc}</td>
                <td>${item.cat}</td>
                <td>${item.un}</td>
                <td style="text-align:right">
                    <button class="btn-icon"><span class="material-icons-outlined">edit</span></button>
                    <button class="btn-icon"><span class="material-icons-outlined">delete</span></button>
                </td>
            </tr>
        `);
    } else if (categoriaAtual === 'equipamentos') {
        head.innerHTML = `<th>CÓDIGO</th><th>NOME EQUIPAMENTO</th><th>TIPO</th><th>STATUS</th><th style="text-align:right">AÇÕES</th>`;
        loading.style.display = 'none';
        empty.style.display = 'block'; // Mostra vazio por enquanto para equipamentos
    } else {
        loading.style.display = 'none';
        empty.style.display = 'block';
    }
}

function renderizar(lista, template) {
    const tbody = document.getElementById('corpo-tabela');
    tbody.innerHTML = lista.map(item => template(item)).join('');
}

function filtrarCatalogo(texto) {
    const rows = document.querySelectorAll('#corpo-tabela tr');
    const term = texto.toUpperCase();
    rows.forEach(row => {
        row.style.display = row.innerText.toUpperCase().includes(term) ? '' : 'none';
    });
}

function abrirModalNovo() {
    alert("Função para abrir formulário de cadastro de " + categoriaAtual);
}