/* --- userdetails.js --- */
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

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
        const email = user.email;
        const uid = user.id;

        document.getElementById('display-name').innerText = nome;
        document.getElementById('display-role').innerText = metadata.role || 'System Admin';
        
        document.getElementById('input-name').value = nome;
        document.getElementById('input-email').value = email;
        document.getElementById('input-uid').value = uid;
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
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html',
        });
        
        if (error) {
            alert("Erro: " + error.message);
        } else {
            alert("E-mail de redefinição enviado!");
        }
    }
}