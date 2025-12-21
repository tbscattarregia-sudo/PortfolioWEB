// main.js

// Ejemplo 1: Scroll suave para enlaces del menú
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Ejemplo 2: Cambiar tema oscuro/claro
const themeBtn = document.getElementById('themeBtn');
themeBtn?.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});
