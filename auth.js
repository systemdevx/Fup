// auth.js
// IMPORTANTE: Substitua pelos seus dados do Supabase
const supabaseUrl = 'SUA_URL_DO_SUPABASE_AQUI'; 
const supabaseKey = 'SUA_ANON_KEY_AQUI';

// Inicializa o cliente apenas se as chaves existirem
let sb;
if (typeof supabase !== 'undefined') {
    sb = supabase.createClient(supabaseUrl, supabaseKey);
} else {
    console.error("Supabase não carregou. Verifique sua conexão.");
}

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('message');

    if (!email || !password) {
        msg.innerText = "Preencha todos os campos.";
        msg.style.color = "#d4af37";
        return;
    }

    msg.innerText = "Autenticando...";
    msg.style.color = "#666";

    // Login via Supabase
    const { data, error } = await sb.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        msg.innerText = "Erro: " + error.message;
        msg.style.color = "red";
    } else {
        msg.innerText = "Sucesso!";
        msg.style.color = "green";
        // Redireciona para o painel (certifique-se de criar o dashboard.html)
        setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
    }
}