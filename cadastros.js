// --- DADOS MOCKADOS ---
const mockAtivos = [
    { id: "001", nome: "Notebook Dell Latitude 5420", marca: "Dell", data: "2023-10-15", usuario: "Admin" },
    { id: "002", nome: "Monitor Samsung 24pol", marca: "Samsung", data: "2023-10-16", usuario: "Admin" },
    { id: "003", nome: "Cadeira Ergonômica", marca: "Herman Miller", data: "2023-11-01", usuario: "Roberto" },
    { id: "004", nome: "Projetor Epson W42", marca: "Epson", data: "2023-11-05", usuario: "Ana" }
];

const mockFornecedores = [
    { razao: "Tech Soluções LTDA", cnpj: "12.345.678/0001-99", data: "2023-09-10", usuario: "Admin" },
    { razao: "Kalunga Comércio", cnpj: "98.765.432/0001-11", data: "2023-09-12", usuario: "Ana" },
    { razao: "Serviços Gerais Silva", cnpj: "45.123.789/0001-55", data: "2023-09-20", usuario: "Roberto" }
];

const mockItens = [
    { id: "101", grupo: "AXP", codigo: "CAB-001", descricao: "Cabo HDMI 2m Blindado", unidade: "UN", data: "2023-10-05", usuario: "Admin" },
    { id: "102", grupo: "AX", codigo: "PAP-A4", descricao: "Papel A4 500fls", unidade: "CX", data: "2023-10-06", usuario: "Admin" },
    { id: "103", grupo: "AXM", codigo: "MOU-09", descricao: "Mouse Óptico USB", unidade: "UN", data: "2023-10-08", usuario: "Roberto" },
    { id: "104", grupo: "AXP", codigo: "TEC-W", descricao: "Teclado Wireless ABNT2", unidade: "UN", data: "2023-10-12", usuario: "Ana" }
];

// --- RENDERIZAÇÃO ---
function renderTables(filterText = '') {
    const text = filterText.toLowerCase();

    // Filtra e Renderiza ATIVOS
    const ativosFiltrados = mockAtivos.filter(i => i.nome.toLowerCase().includes(text) || i.marca.toLowerCase().includes(text));
    document.getElementById('count-ativos').innerText = ativosFiltrados.length;
    document.getElementById('tbody-ativos').innerHTML = ativosFiltrados.map(item => `
        <tr>
            <td>#${item.id}</td>
            <td><strong>${item.nome}</strong></td>
            <td>${item.marca}</td>
            <td>${formatDate(item.data)}</td>
            <td>${renderUser(item.usuario)}</td>
            <td class="text-center">${renderActions(item.id)}</td>
        </tr>
    `).join('');

    // Filtra e Renderiza FORNECEDORES
    const fornFiltrados = mockFornecedores.filter(i => i.razao.toLowerCase().includes(text) || i.cnpj.includes(text));
    document.getElementById('count-fornecedores').innerText = fornFiltrados.length;
    document.getElementById('tbody-fornecedores').innerHTML = fornFiltrados.map(item => `
        <tr>
            <td><strong>${item.razao}</strong></td>
            <td>${item.cnpj}</td>
            <td>${formatDate(item.data)}</td>
            <td>${renderUser(item.usuario)}</td>
            <td class="text-center">${renderActions(item.cnpj)}</td>
        </tr>
    `).join('');

    // Filtra e Renderiza ITENS
    const itensFiltrados = mockItens.filter(i => i.descricao.toLowerCase().includes(text) || i.codigo.toLowerCase().includes(text));
    document.getElementById('count-itens').innerText = itensFiltrados.length;
    document.getElementById('tbody-itens').innerHTML = itensFiltrados.map(item => `
        <tr>
            <td>#${item.id}</td>
            <td><span class="grupo-tag grupo-${item.grupo.toLowerCase()}">${item.grupo}</span></td>
            <td>${item.codigo}</td>
            <td><strong>${item.descricao}</strong></td>
            <td>${item.unidade}</td>
            <td>${formatDate(item.data)}</td>
            <td>${item.usuario}</td>
            <td class="text-center">${renderActions(item.id)}</td>
        </tr>
    `).join('');
}

// --- HELPERS VISUAIS ---
function renderUser(user) {
    return `<span class="user-badge"><i class="ri-user-3-line"></i> ${user}</span>`;
}

function renderActions(id) {
    return `
        <div class="actions-cell">
            <button class="action-btn edit" title="Editar"><i class="ri-pencil-line"></i></button>
            <button class="action-btn delete" title="Excluir"><i class="ri-delete-bin-line"></i></button>
        </div>
    `;
}

// --- NAVEGAÇÃO E UTILS ---
function switchTab(tabName) {
    ['ativos', 'fornecedores', 'itens'].forEach(t => document.getElementById(`view-${t}`).classList.add('hidden'));
    document.getElementById(`view-${tabName}`).classList.remove('hidden');

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const index = { 'ativos': 0, 'fornecedores': 1, 'itens': 2 }[tabName];
    if(buttons[index]) buttons[index].classList.add('active');
}

function filtrarTabela() {
    const input = document.getElementById('searchInput');
    renderTables(input.value);
}

function formatDate(dateString) {
    const parts = dateString.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function logout() {
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema Carregado.");
    renderTables();
});