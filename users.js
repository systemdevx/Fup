let allUsers = []; 

document.addEventListener('DOMContentLoaded', async () => {
    // dashboard.js já cuida da sessão, mas garantimos o fetch aqui
    setTimeout(() => {
        fetchUsersData();
        setupFilters();
    }, 500);
});

async function fetchUsersData() {
    const tbody = document.getElementById('users-tbody');
    const loading = document.getElementById('loading-msg');
    
    if (!supabaseClient) return;

    const { data, error } = await supabaseClient
        .from('profiles') // Altere aqui se o nome da tabela no Supabase for outro
        .select('*')
        .order('full_name', { ascending: true });

    if (error) {
        console.error("Erro:", error);
        loading.innerText = "Erro ao carregar dados.";
        return;
    }

    allUsers = data;
    renderTable(allUsers);
    loading.style.display = 'none';
}

function renderTable(data) {
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '';

    data.forEach(user => {
        const tr = document.createElement('tr');
        // Simulação de status baseado no seu print (Bloqueado)
        const statusClass = user.status === 'Bloqueado' ? 'bloqueado' : 'status-aprovado';
        
        tr.innerHTML = `
            <td class="user-name-bold">${user.full_name || '---'}</td>
            <td>${user.profile_type || 'Padrão'}</td>
            <td>${user.role || '---'}</td>
            <td>GERAL</td>
            <td>${user.uid || '---'}</td>
            <td>${user.email}</td>
            <td><span class="status-badge ${statusClass}">${user.status || 'Ativo'}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function setupFilters() {
    // Busca Principal
    document.getElementById('main-user-search').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allUsers.filter(u => 
            u.full_name.toLowerCase().includes(term) || 
            u.email.toLowerCase().includes(term) ||
            (u.uid && u.uid.toString().includes(term))
        );
        renderTable(filtered);
    });

    // Checkboxes de Cargo
    const checkboxes = document.querySelectorAll('#cargo-filters input');
    checkboxes.forEach(chk => {
        chk.addEventListener('change', () => {
            const selectedCargos = Array.from(checkboxes)
                .filter(i => i.checked)
                .map(i => i.value);
            
            if (selectedCargos.length === 0) {
                renderTable(allUsers);
            } else {
                const filtered = allUsers.filter(u => selectedCargos.includes(u.role));
                renderTable(filtered);
            }
        });
    });
}

// Função chamada pelos links da sidebar (Status)
function filterByStatus(status) {
    // Remove active de todos
    document.querySelectorAll('.group-list a').forEach(a => a.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (status === 'todos') {
        renderTable(allUsers);
    } else {
        const filtered = allUsers.filter(u => u.status === status);
        renderTable(filtered);
    }
}