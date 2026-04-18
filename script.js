const grid = document.getElementById('card-grid');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const winModal = document.getElementById('win-modal');


const icons = ['🍦', '🎨', '🚀', '🥑'];
let cards = [...icons, ...icons]; 

let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let isLocking = false;


function init() {
    grid.innerHTML = '';
    moves = 0;
    matchedCount = 0;
    timer = 0;
    movesDisplay.innerText = moves;
    timerDisplay.innerText = "00:00";
    winModal.style.display = 'none';
    clearInterval(timerInterval);
    timerInterval = null;
    
    
    cards.sort(() => Math.random() - 0.5);

    
    cards.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = icon;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-face card-back">?</div>
            <div class="card-face card-front">${icon}</div>
        `;

        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (isLocking || this.classList.contains('flipped') || flippedCards.includes(this)) return;

   
    if (!timerInterval) startTimer();

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    isLocking = true;
    moves++;
    movesDisplay.innerText = moves;

    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.icon === card2.dataset.icon;

    if (isMatch) {
        matchedCount += 2;
        resetTurn();
        if (matchedCount === cards.length) endGame();
    } else {
       
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    flippedCards = [];
    isLocking = false;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        const mins = Math.floor(timer / 60).toString().padStart(2, '0');
        const secs = (timer % 60).toString().padStart(2, '0');
        timerDisplay.innerText = `${mins}:${secs}`;
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById('final-moves').innerText = moves;
    setTimeout(() => {
        winModal.style.display = 'flex';
    }, 500);
}

function resetGame() {
    init();
}

restartBtn.addEventListener('click', resetGame);


init();