const supabaseUrl = 'https://yhumhqwbllqljzztkkrl.supabase.co';
const supabaseKey = 'sb_publishable_cSr2_fWj8PgdFcsteEXDEQ__JdOU0jA';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('message');

    msg.innerText = "Autenticando...";
    msg.style.color = "#0ea5e9";

    try {
        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (error) {
            msg.innerText = "Erro: " + error.message;
            msg.style.color = "#ef4444";
        } else {
            msg.innerText = "Bem-vindo!";
            // Conexão: Redireciona para o Dashboard após login sucesso
            setTimeout(() => window.location.href = "dashboard.html", 500);
        }
    } catch (e) {
        msg.innerText = "Erro de conexão.";
    }
}

async function handleLogout() {
    // Conexão: Limpa sessão e volta para o login
    await sb.auth.signOut();
    window.location.href = "login.html";
}