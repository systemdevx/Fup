const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let listaItens = [];

document.addEventListener('DOMContentLoaded', () => {
    adicionarNovaLinha();
});

function adicionarNovaLinha() {
    const novoItem = { id: Date.now(), marca: '', modelo: '', capacidade: '', serie: '', nf: '' };
    listaItens.push(novoItem);
    renderizarItens();
}

function renderizarItens() {
    const container = document.getElementById('unidades-container'); // Corrigido ID conforme HTML
    if (!container) return;
    
    container.innerHTML = listaItens.map((item, index) => `
        <div class="item-card">
            <div class="item-header">
                <strong>Unidade #${index + 1}</strong>
                <button class="btn-remove" onclick="removerLinha(${item.id})"><span class="material-icons-outlined">delete</span></button>
            </div>
            <div class="item-body">
                <div class="input-group"><label>MARCA</label><input type="text" value="${item.marca}" oninput="updateItem(${item.id}, 'marca', this.value)"></div>
                <div class="input-group"><label>MODELO</label><input type="text" value="${item.modelo}" oninput="updateItem(${item.id}, 'modelo', this.value)"></div>
                <div class="input-group"><label>N° SÉRIE</label><input type="text" value="${item.serie}" oninput="updateItem(${item.id}, 'serie', this.value)"></div>
            </div>
        </div>
    `).join('');
}

function updateItem(id, campo, valor) {
    const item = listaItens.find(i => i.id === id);
    if (item) item[campo] = valor.toUpperCase();
}

function removerLinha(id) {
    if (listaItens.length > 1) {
        listaItens = listaItens.filter(i => i.id !== id);
        renderizarItens();
    }
}

async function salvarAtivos() {
    alert("Salvando ativos no banco de dados...");
    // Lógica futura de INSERT no Supabase aqui
    window.location.href = 'sgq.html';
}