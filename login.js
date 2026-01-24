// --- login.js ---

// 1. Conexão com Supabase (Suas chaves fornecidas)
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Elementos
const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const btnLogin = document.getElementById('btn-login');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const errorMsg = document.getElementById('error-msg');

// 3. Ação de Login
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Limpa erros anteriores e ativa carregamento
    errorMsg.classList.add('hidden');
    setLoading(true);

    const email = emailInput.value;
    const password = passInput.value;

    try {
        // Autentica no Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        // Sucesso: Redireciona
        console.log("Login OK:", data);
        window.location.href = "dashboard.html";

    } catch (err) {
        // Erro: Mostra mensagem
        console.error("Erro login:", err);
        let mensagem = "Erro ao conectar.";
        
        if (err.message.includes("Invalid login")) mensagem = "E-mail ou senha incorretos.";
        if (err.message.includes("Email not confirmed")) mensagem = "Confirme seu e-mail antes de entrar.";

        errorMsg.textContent = mensagem;
        errorMsg.classList.remove('hidden');
        setLoading(false);
    }
});

function setLoading(isLoading) {
    if (isLoading) {
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        btnLogin.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
        btnLogin.disabled = false;
    }
}