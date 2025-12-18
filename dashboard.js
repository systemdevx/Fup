document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkUser();
    if (user) {
        document.getElementById('welcome').innerText = `Bem-vindo, ${user.email.split('@')[0]}`;
    } else {
        window.location.href = "login.html";
    }

    const dateEl = document.getElementById('date');
    if (dateEl) {
        dateEl.innerText = new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', day: 'numeric', month: 'long' 
        });
    }
});