// --- CONFIGURAÇÃO E SEGURANÇA (SUPABASE) ---
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error('ERRO: Supabase não carregado. Verifique o HTML.');
}

// Lógica de Proteção e Inicialização do Usuário
(async function checkSession() {
    if (!supabaseClient) return;

    // 1. Verifica sessão
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (!session || error) {
        // Se não logado, expulsa para o login
        window.location.href = 'login.html';
        return; 
    }

    // 2. Personaliza Avatar com iniciais do e-mail
    if (session.user && session.user.email) {
        const userEmail = session.user.email;
        const initials = userEmail.substring(0, 2).toUpperCase();
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = initials;
    }

    // 3. Configura botão de Logout (três pontinhos)
    const logoutBtn = document.querySelector('.right-actions .icon-action');
    if (logoutBtn) {
        logoutBtn.title = "Sair do Sistema";
        logoutBtn.style.cursor = "pointer";
        
        // Remove event listeners antigos clonando o elemento (opcional, mas seguro)
        // Aqui vamos apenas sobrescrever o onclick
        logoutBtn.onclick = async () => {
            const confirmacao = confirm("Deseja sair do sistema?");
            if (confirmacao) {
                await supabaseClient.auth.signOut();
                window.location.href = 'login.html';
            }
        };
    }
})();

// --- CÓDIGO DO DASHBOARD (Original) ---

const catalogo = [
    { id: 807735, nome: 'NF 68400 - Material Elétrico', fornecedor: 'B A ELETRICA LTDA', preco: 65.90, un: 'UND', condicao: 'L030 - Prazo 30 DDD' },
    { id: 776596, nome: 'Material Elétrico Fab Life', fornecedor: 'B A ELETRICA LTDA', preco: 65.90, un: 'UND', condicao: 'L045 - Prazo 45 DDD' },
    { id: 102030, nome: 'Seringa Descartável 10ml', fornecedor: 'MEDIX BRASIL', preco: 1.25, un: 'UN', condicao: 'À Vista' },
    { id: 990022, nome: 'Luva Procedimento M', fornecedor: 'SAFEHAND PROTECTION', preco: 25.90, un: 'CX', condicao: 'L030 - Prazo 30 DDD' },
    { id: 500100, nome: 'Oxigênio Medicinal', fornecedor: 'AIRLIFE GASES', preco: 150.00, un: 'M3', condicao: 'Faturado 15 Dias' },
    { id: 200300, nome: 'Capacete de Segurança', fornecedor: 'PROT-TOTAL', preco: 45.50, un: 'UN', condicao: 'À Vista' },
];

let carrinho = [];

document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo(catalogo);
    atualizarCarrinhoUI();
});

// --- RENDERIZAR TABELA ---
function renderizarCatalogo(lista) {
    const container = document.getElementById('table-body');
    if (!container) return; // Segurança caso a tabela não esteja nesta tela

    container.innerHTML = '';

    if(lista.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center;">Nenhum item encontrado.</div>';
        return;
    }

    lista.forEach(item => {
        const precoFmt = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        const row = `
            <div class="grid-row">
                <div class="cell-id">${item.id}</div>
                <div class="cell-text">${item.nome}</div>
                <div class="cell-text">${item.fornecedor}</div>
                <div class="cell-text">${precoFmt}</div>
                <div class="cell-text">${item.un}</div>
                <div class="cell-secondary">${item.condicao}</div>
                
                <div class="qty-control">
                    <button class="btn-qty" onclick="ajustarQtdInput(${item.id}, -1)">–</button>
                    <input type="text" id="qtd-input-${item.id}" class="input-qty" value="1,000000" readonly>
                    <button class="btn-qty" onclick="ajustarQtdInput(${item.id}, 1)">+</button>
                </div>

                <div>
                    <button class="btn-add-cart" onclick="adicionarAoCarrinho(${item.id})">
                        <span class="material-icons-outlined">shopping_cart</span>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', row);
    });
}

function filtrarCatalogo() {
    const termo = document.getElementById('global-search');
    if (!termo) return;
    
    const valor = termo.value.toLowerCase();
    
    const filtrados = catalogo.filter(item => {
        return item.nome.toLowerCase().includes(valor) || 
               item.fornecedor.toLowerCase().includes(valor) ||
               item.id.toString().includes(valor);
    });

    renderizarCatalogo(filtrados);
}

// --- CONTROLE DE QUANTIDADE ---
function ajustarQtdInput(id, delta) {
    const input = document.getElementById(`qtd-input-${id}`);
    if(!input) return;

    let valorAtual = parseFloat(input.value.replace(',', '.'));
    let novoValor = valorAtual + delta;

    if (novoValor < 1) novoValor = 1;

    input.value = novoValor.toFixed(6).replace('.', ',');
}

// --- CARRINHO ---
function adicionarAoCarrinho(id) {
    const produto = catalogo.find(p => p.id === id);
    const inputQtd = document.getElementById(`qtd-input-${id}`);
    if(!inputQtd) return;
    
    const qtdSelecionada = parseFloat(inputQtd.value.replace(',', '.'));

    const itemExistente = carrinho.find(c => c.id === id);

    if(itemExistente) {
        itemExistente.qtd += qtdSelecionada;
    } else {
        carrinho.push({ ...produto, qtd: qtdSelecionada });
    }

    inputQtd.value = "1,000000";
    atualizarCarrinhoUI();
    
    // Feedback visual simples
    const btn = document.querySelector(`button[onclick="adicionarAoCarrinho(${id})"]`);
    if(btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<span class="material-icons-outlined" style="color:#27ae60">check</span>';
        setTimeout(() => btn.innerHTML = original, 1000);
    }
}

function removerItem(id) {
    carrinho = carrinho.filter(c => c.id !== id);
    atualizarCarrinhoUI();
}

function limparCarrinho() {
    carrinho = [];
    atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-display');
    
    if(!container || !totalEl) return;

    container.innerHTML = '';
    let totalGeral = 0;

    if(carrinho.length === 0) {
        container.innerHTML = '<div class="empty-msg">Seu carrinho está vazio</div>';
        totalEl.innerText = 'BRL 0,00';
        return;
    }

    carrinho.forEach(item => {
        const subtotal = item.qtd * item.preco;
        totalGeral += subtotal;

        const cartItem = `
            <div class="cart-item">
                <button class="cart-remove" onclick="removerItem(${item.id})">
                    <span class="material-icons-outlined">close</span>
                </button>
                <div class="cart-item-title">${item.nome}</div>
                <div class="cart-item-details">
                    <span>${item.qtd.toFixed(2).replace('.',',')}x ${item.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    <strong>${subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cartItem);
    });

    totalEl.innerText = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}