/* --- login.js --- */
const SUPABASE_URL = 'https://qolqfidcvvinetdkxeim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHFmaWRjdnZpbmV0ZGt4ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQ3ODgsImV4cCI6MjA4NDA4MDc4OH0.zdpL4AAypVH8iWchfaMEob3LMi6q8YrfY5WQbECti4E';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const btnLogin = document.getElementById('btn-login');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const errorMsg = document.getElementById('error-msg');

/**
 * 1. VERIFICAÇÃO DE SESSÃO
 * Adicionado um delay de 600ms para evitar o "pulo" instantâneo 
 * e dar tempo da intro terminar suavemente.
 */
async function checkActiveSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 600); 
    }
}
checkActiveSession();

/**
 * 2. LÓGICA DE INATIVIDADE (30 MINUTOS)
 * Reseta o timer a cada interação. Se atingir 30min, desloga.
 */
let idleTimeout;
function resetIdleTimer() {
    clearTimeout(idleTimeout);
    // 1800000 ms = 30 minutos
    idleTimeout = setTimeout(async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (!error) {
            alert("Sua sessão expirou por inatividade (30 minutos).");
            window.location.reload();
        }
    }, 1800000); 
}

// Monitora interações do usuário para manter a sessão ativa
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, resetIdleTimer, true);
});

/**
 * 3. EVENTO DE LOGIN
 */
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.classList.add('hidden');
    setLoading(true);

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: emailInput.value,
            password: passInput.value,
        });

        if (error) throw error;
        
        // Redireciona imediatamente após o login manual bem-sucedido
        window.location.href = "dashboard.html";

    } catch (err) {
        errorMsg.textContent = "Usuário ou senha inválidos.";
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