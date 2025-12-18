const supabaseUrl = 'https://yhumhqwbllqljzztkkrl.supabase.co';
const supabaseKey = 'sb_publishable_cSr2_fWj8PgdFcsteEXDEQ__JdOU0jA';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('message');

    msg.innerText = "Validando...";
    msg.style.color = "#0ea5e9";

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
        msg.innerText = "Falha na autenticação.";
        msg.style.color = "#ef4444";
    } else {
        msg.innerText = "Bem-vindo!";
        setTimeout(() => window.location.href = "dashboard.html", 800);
    }
}

async function handleLogout() {
    await sb.auth.signOut();
    window.location.href = "login.html";
}