// --- DADOS INICIAIS (SIMULAÇÃO) ---
let dbCadastros = JSON.parse(localStorage.getItem('fup_cadastros')) || [
    { id: 1, nome: "Ana Pereira", email: "ana.p@fup.com", cargo: "Gerente", status: "Ativo" },
    { id: 2, nome: "Carlos Souza", email: "carlos.s@fup.com", cargo: "Analista", status: "Férias" }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa Tabela
    renderTable();

    // 2. Configura o Sidebar (Três pontinhos + Busca)
    setupSidebar();

    // 3. Listener do Formulário (Salvar)
    const form = document.getElementById('formCadastro');
    if (form) form.addEventListener('submit', salvarCadastro);
});

// --- LÓGICA DO MENU LATERAL (SIDEBAR) ---
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle'); // Botão 3 pontinhos
    const searchInput = document.getElementById('menuSearch'); // Input de busca
    const menuItems = document.querySelectorAll('#sidebarMenu li'); // Itens da lista

    // 1. AÇÃO DOS TRÊS PONTINHOS (Ocultar/Exibir Menu)
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
        });
    }

    // 2. BUSCA NO MENU LATERAL (Filtra opções do menu)
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => { 
            const term = e.target.value.toLowerCase();
            
            menuItems.forEach(item => {
                // Pega o texto do link dentro do item <li>
                const linkText = item.innerText.toLowerCase();
                
                // Se o texto conter o termo digitado, exibe. Se não, oculta.
                if (linkText.includes(term)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// --- LÓGICA DO CRUD (CRIAR, LER, ATUALIZAR, DELETAR) ---

function renderTable() {
    const tbody = document.querySelector('#tabelaCadastros tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (dbCadastros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 48px; color: #999;">
                    <i class="ri-inbox-line" style="font-size: 2.5rem; display: block; margin-bottom: 12px;"></i>
                    Nenhum cadastro encontrado.
                </td>
            </tr>`;
    } else {
        dbCadastros.forEach(item => {
            // Cria classe CSS baseada no texto do status (remove acentos e espaços)
            const statusClass = 'status-' + item.status.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.email}</td>
                <td>${item.cargo}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td style="text-align: right;">
                    <button class="action-btn edit" onclick="editarCadastro(${item.id})" title="Editar"><i class="ri-pencil-line"></i></button>
                    <button class="action-btn delete" onclick="deletarCadastro(${item.id})" title="Excluir"><i class="ri-delete-bin-line"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    // Atualiza contador de registros
    const totalElem = document.getElementById('totalRecords');
    if (totalElem) totalElem.innerText = `${dbCadastros.length} registros encontrados`;
}

// Abrir Modal (Resetando formulário)
function openModal() {
    document.getElementById('formCadastro').reset();
    document.getElementById('editId').value = '';
    document.getElementById('modalTitle').innerText = 'Novo Cadastro';
    document.getElementById('modalOverlay').classList.add('active');
}

// Fechar Modal
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// Salvar (Novo ou Edição)
function salvarCadastro(e) {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cargo = document.getElementById('cargo').value;
    const status = document.getElementById('status').value;

    if (id) {
        // Modo Edição
        const index = dbCadastros.findIndex(item => item.id == id);
        if (index !== -1) {
            dbCadastros[index] = { id: Number(id), nome, email, cargo, status };
        }
    } else {
        // Modo Criação
        const newId = Date.now();
        dbCadastros.push({ id: newId, nome, email, cargo, status });
    }

    localStorage.setItem('fup_cadastros', JSON.stringify(dbCadastros));
    renderTable();
    closeModal();
}

// Preencher Modal para Edição
function editarCadastro(id) {
    const item = dbCadastros.find(d => d.id === id);
    if (item) {
        document.getElementById('editId').value = item.id;
        document.getElementById('nome').value = item.nome;
        document.getElementById('email').value = item.email;
        document.getElementById('cargo').value = item.cargo;
        document.getElementById('status').value = item.status;
        
        document.getElementById('modalTitle').innerText = 'Editar Cadastro';
        document.getElementById('modalOverlay').classList.add('active');
    }
}

// Excluir Cadastro
function deletarCadastro(id) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        dbCadastros = dbCadastros.filter(item => item.id !== id);
        localStorage.setItem('fup_cadastros', JSON.stringify(dbCadastros));
        renderTable();
    }
}

function logout() {
    window.location.href = "login.html";
}