const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'SUA_KEY_AQUI'; 

let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
});

async function checkSession() {
    if (!supabaseClient) return;

    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (!session || error) {
        window.location.href = 'login.html';
        return; 
    }

    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    if (session.user) {
        const user = session.user;
        const metadata = user.user_metadata || {};
        
        const nome = metadata.full_name || 'Usuário do Sistema';
        const cargo = metadata.role || 'Não Informado';
        const perfil = metadata.profile_type || 'Aprovador';

        // Atualiza textos do cabeçalho
        document.getElementById('display-name').innerText = nome;
        document.getElementById('display-role').innerText = cargo;
        
        // Preenche os inputs (Nome, E-mail, Cargo, Perfil)
        document.getElementById('input-name').value = nome;
        document.getElementById('input-email').value = user.email;
        document.getElementById('input-role').value = cargo;
        document.getElementById('input-profile').value = perfil;
    }

    const btnLogout = document.getElementById('btn-logout-page');
    if(btnLogout) {
        btnLogout.onclick = async () => {
            if(confirm("Deseja realmente sair da conta?")) {
                await supabaseClient.auth.signOut();
                window.location.href = 'login.html';
            }
        };
    }
}

async function alterarSenha() {
    const email = document.getElementById('input-email').value;
    if(!email) return;

    if(confirm(`Enviar link de redefinição de senha para ${email}?`)) {
        await supabaseClient.auth.resetPasswordForEmail(email);
        alert("Link enviado para o seu e-mail!");
    }
}