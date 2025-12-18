// Alternar visibilidade da senha
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.style.stroke = "#0056b3"; // Azul quando visível
    } else {
        passwordInput.type = 'password';
        eyeIcon.style.stroke = "#94a3b8"; // Cinza quando oculto
    }
}

// Lógica de Envio do Formulário
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = document.querySelector('.btn-login');
    const btnText = btn.querySelector('span');
    
    // Feedback visual
    btnText.innerText = "Autenticando...";
    btn.disabled = true;
    btn.style.opacity = "0.8";

    // Simulação de delay de rede
    setTimeout(() => {
        alert("Autenticado com sucesso!");
        // window.location.href = "dashboard.html"; // Descomente para redirecionar
        
        // Reset (apenas para teste)
        btnText.innerText = "Entrar no Sistema";
        btn.disabled = false;
        btn.style.opacity = "1";
    }, 1500);
});