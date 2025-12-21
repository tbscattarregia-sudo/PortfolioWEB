// ---------------- VARIABLES ----------------
const difficultySelect = document.getElementById('difficulty');
const gameContainer = document.querySelector('.game-container');
const movesText = document.getElementById('moves');
const restartBtn = document.getElementById('restartBtn');
const timerText = document.getElementById('timer');
const bestTimeText = document.getElementById('bestTime');

let currentSymbols = [];
let flippedCards = [];
let lockBoard = false;
let moves = 0;
let timer;
let seconds = 0;
let bestTime = null;

// ---------------- FUNCIONES ----------------

// Barajar cartas
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Configurar dificultad
function setDifficulty() {
    const level = difficultySelect.value;

    if(level === 'easy') {
        currentSymbols = ['🍎','🍎','🍌','🍌','🍇','🍇','🍓','🍓'];
        gameContainer.style.gridTemplateColumns = 'repeat(4, 100px)';
    } else if(level === 'medium') {
        currentSymbols = ['🍎','🍎','🍌','🍌','🍇','🍇','🍓','🍓',
                          '🍍','🍍','🥝','🥝','🍉','🍉','🍒','🍒'];
        gameContainer.style.gridTemplateColumns = 'repeat(4, 100px)';
    } else if(level === 'hard') {
        currentSymbols = ['🍎','🍎','🍌','🍌','🍇','🍇','🍓','🍓',
                          '🍍','🍍','🥝','🥝','🍉','🍉','🍒','🍒',
                          '🥭','🥭','🍑','🍑','🍐','🍐','🍋','🍋'];
        gameContainer.style.gridTemplateColumns = 'repeat(6, 100px)';
    }
}

// Obtener clave del récord según dificultad
function getBestTimeKey() {
    const level = difficultySelect.value;
    return `bestTime_${level}`;
}

// Actualizar texto del récord en pantalla
function updateBestTimeText() {
    const key = getBestTimeKey();
    bestTime = localStorage.getItem(key);

    if(bestTime) {
        bestTimeText.textContent = `Mejor tiempo (${difficultySelect.value}): ${bestTime}s`;
    } else {
        bestTimeText.textContent = `Mejor tiempo (${difficultySelect.value}): --`;
    }
}

// Crear cartas
function createCards() {
    gameContainer.innerHTML = '';
    shuffle(currentSymbols).forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');

        const inner = document.createElement('div');
        inner.classList.add('card-inner');

        const front = document.createElement('div');
        front.classList.add('card-front');
        front.textContent = symbol;

        const back = document.createElement('div');
        back.classList.add('card-back');
        back.textContent = '?';

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', () => flipCard(card));

        gameContainer.appendChild(card);
    });

    startTimer();
}

// Voltear carta
function flipCard(card) {
    if(lockBoard) return;
    if(card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if(flippedCards.length === 2) {
        checkMatch();
    }
}

// Comprobar coincidencia
function checkMatch() {
    lockBoard = true;
    moves++;
    movesText.textContent = `Movimientos: ${moves}`;

    const [card1, card2] = flippedCards;
    const symbol1 = card1.querySelector('.card-front').textContent;
    const symbol2 = card2.querySelector('.card-front').textContent;

    if(symbol1 === symbol2) {
        flippedCards = [];
        lockBoard = false;
        checkVictory();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }
}

// Revisar victoria
function checkVictory() {
    const allFlipped = document.querySelectorAll('.card.flipped');

    if(allFlipped.length === currentSymbols.length) {
        clearInterval(timer);

        const key = getBestTimeKey();
        const storedBest = localStorage.getItem(key);

        if(!storedBest || seconds < storedBest) {
            localStorage.setItem(key, seconds);
            updateBestTimeText();
        }

        setTimeout(() => {
            alert(`¡Ganaste en ${moves} movimientos y ${seconds} segundos!`);
        }, 300);
    }
}

// ---------------- TIMER ----------------
function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timerText.textContent = `Tiempo: 0s`;
    timer = setInterval(() => {
        seconds++;
        timerText.textContent = `Tiempo: ${seconds}s`;
    }, 1000);
}

// ---------------- REINICIO ----------------
restartBtn.addEventListener('click', () => {
    moves = 0;
    movesText.textContent = 'Movimientos: 0';
    flippedCards = [];
    lockBoard = false;
    createCards();
    startTimer();
});

// ---------------- CAMBIO DE DIFICULTAD ----------------
difficultySelect.addEventListener('change', () => {
    moves = 0;
    movesText.textContent = 'Movimientos: 0';
    flippedCards = [];
    lockBoard = false;
    setDifficulty();
    createCards();
    updateBestTimeText();
});

// ---------------- INICIALIZAR JUEGO ----------------
setDifficulty();
createCards();
updateBestTimeText();
