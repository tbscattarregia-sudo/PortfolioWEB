// PLANETAS E INFO
const planets = document.querySelectorAll('.planet');
const planetInfo = document.getElementById('planet-info');

planets.forEach(planet => {
    planet.addEventListener('mouseenter', () => {
        planetInfo.textContent = `${planet.title} - Tamaño: ${planet.dataset.size} km - Distancia: ${planet.dataset.distance} millones km`;
    });
    planet.addEventListener('mouseleave', () => {
        planetInfo.textContent = '';
    });
    planet.addEventListener('click', () => {
        alert(`¡Haz hecho click en ${planet.title}!`);
    });
});

// TIMER
let seconds = 0;
const timerEl = document.getElementById('timer');
setInterval(() => {
    seconds++;
    timerEl.textContent = `Tiempo: ${seconds}s`;
}, 1000);

// REINICIO
document.getElementById('resetBtn').addEventListener('click', () => location.reload());
