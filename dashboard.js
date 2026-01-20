// --- dashboard.js ---

// 1. Configuração do Supabase
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error('ERRO CRÍTICO: Supabase não carregado.');
}

// 2. Verificação de Sessão (O "Guarda-Costas")
(async function checkSession() {
    if (!supabaseClient) return;

    // Tenta pegar a sessão ativa
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    // Se não houver usuário logado, chuta para o login
    if (!session || error) {
        window.location.href = 'login.html';
        return; 
    }

    // Se passou, mostra o dashboard
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    // Personaliza Avatar com iniciais do email
    if (session.user && session.user.email) {
        const email = session.user.email;
        const initials = email.substring(0, 2).toUpperCase();
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = initials;
    }

    // Configura o Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            if (confirm("Tem certeza que deseja sair?")) {
                await supabaseClient.auth.signOut();
                window.location.href = 'login.html';
            }
        };
    }
})();


// --- LÓGICA DO CATÁLOGO E DADOS ---

const catalogo = [
    { id: 807735, nome: 'Cabo Flexível 2.5mm', fornecedor: 'B A ELETRICA LTDA', preco: 65.90, un: 'RL', condicao: 'Prazo 30 Dias' },
    { id: 776596, nome: 'Disjuntor Bipolar 40A', fornecedor: 'B A ELETRICA LTDA', preco: 42.50, un: 'UN', condicao: 'Prazo 45 Dias' },
    { id: 102030, nome: 'Seringa Desc. 10ml', fornecedor: 'MEDIX BRASIL', preco: 1.25, un: 'UN', condicao: 'À Vista' },
    { id: 990022, nome: 'Luva Látex M', fornecedor: 'SAFEHAND', preco: 25.90, un: 'CX', condicao: 'Prazo 30 Dias' },
    { id: 500100, nome: 'Cilindro Oxigênio', fornecedor: 'AIRLIFE GASES', preco: 150.00, un: 'M3', condicao: '15 Dias' },
];

let carrinho = [];

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Renderiza o catálogo se o elemento existir (agora existe!)
    renderizarCatalogo(catalogo);
    atualizarCarrinhoUI();
});

function renderizarCatalogo(lista) {
    const container = document.getElementById('table-body');
    if (!container) return; // Se não achar o elemento, para aqui.

    container.innerHTML = '';

    if(lista.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center;">Nenhum item encontrado.</div>';
        return;
    }

    lista.forEach(item => {
        const precoFmt = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        const row = `
            <div class="grid-row">
                <div style="color:#888;">#${item.id}</div>
                <div style="font-weight:600; color:#333;">${item.nome}</div>
                <div>${item.fornecedor}</div>
                <div style="color:var(--primary-orange); font-weight:bold;">${precoFmt}</div>
                <div>${item.un}</div>
                <div style="font-size:11px; color:#666;">${item.condicao}</div>
                
                <div class="qty-control">
                    <button class="btn-qty" onclick="ajustarQtdInput(${item.id}, -1)">-</button>
                    <input type="text" id="qtd-input-${item.id}" class="input-qty" value="1" readonly>
                    <button class="btn-qty" onclick="ajustarQtdInput(${item.id}, 1)">+</button>
                </div>

                <div>
                    <button class="btn-add-cart" onclick="adicionarAoCarrinho(${item.id})" title="Adicionar">
                        <span class="material-icons-outlined" style="font-size:18px;">add_shopping_cart</span>
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

function ajustarQtdInput(id, delta) {
    const input = document.getElementById(`qtd-input-${id}`);
    if(!input) return;

    let valorAtual = parseInt(input.value);
    let novoValor = valorAtual + delta;

    if (novoValor < 1) novoValor = 1;
    input.value = novoValor;
}

function adicionarAoCarrinho(id) {
    const produto = catalogo.find(p => p.id === id);
    const inputQtd = document.getElementById(`qtd-input-${id}`);
    if(!inputQtd) return;
    
    const qtd = parseInt(inputQtd.value);
    const itemExistente = carrinho.find(c => c.id === id);

    if(itemExistente) {
        itemExistente.qtd += qtd;
    } else {
        carrinho.push({ ...produto, qtd: qtd });
    }

    // Feedback visual
    const btn = document.querySelector(`button[onclick="adicionarAoCarrinho(${id})"]`);
    if(btn) {
        const htmlOriginal = btn.innerHTML;
        btn.innerHTML = '<span class="material-icons-outlined">check</span>';
        btn.style.backgroundColor = '#27ae60';
        setTimeout(() => {
            btn.innerHTML = htmlOriginal;
            btn.style.backgroundColor = '';
        }, 1000);
    }

    inputQtd.value = "1";
    atualizarCarrinhoUI();
}

function removerItem(id) {
    carrinho = carrinho.filter(c => c.id !== id);
    atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-display');
    
    if(!container || !totalEl) return;

    container.innerHTML = '';
    let totalGeral = 0;

    if(carrinho.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#999; margin-top:20px;">Seu carrinho está vazio</div>';
        totalEl.innerText = 'R$ 0,00';
        return;
    }

    carrinho.forEach(item => {
        const subtotal = item.qtd * item.preco;
        totalGeral += subtotal;

        const cartItem = `
            <div class="cart-item">
                <div>
                    <div style="font-weight:600;">${item.nome}</div>
                    <div style="font-size:11px; color:#888;">${item.qtd}x ${item.preco.toLocaleString('pt-BR',{style:'currency', currency:'BRL'})}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:bold; color:var(--primary-orange);">${subtotal.toLocaleString('pt-BR',{style:'currency', currency:'BRL'})}</div>
                    <span class="material-icons-outlined" onclick="removerItem(${item.id})" style="font-size:16px; color:#999; cursor:pointer; margin-top:4px;">delete</span>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cartItem);
    });

    totalEl.innerText = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}