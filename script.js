// عناصر التحكم في الشاشات والمنبثقات
const xoModal = document.getElementById('game-modal');
const snakeModal = document.getElementById('snake-modal');
const customAlert = document.getElementById('custom-alert');

// أزرار الإغلاق
const closeXoBtn = document.querySelector('#game-modal .close-btn');
const closeSnakeBtn = document.getElementById('close-snake-btn');
const alertCloseBtn = document.getElementById('alert-close-btn');

// أزرار فتح الألعاب الصريحة
const playXoBtn = document.getElementById('play-xo-btn');
const playSnakeBtn = document.getElementById('play-snake-btn');

const alertMessage = document.getElementById('alert-message');

// دالة تشغيل التنبيه الاحترافي
function showAlert(message) {
    alertMessage.innerText = message;
    customAlert.classList.add('show');
}

alertCloseBtn.addEventListener('click', () => customAlert.classList.remove('show'));

// فتح وإغلاق XO بشكل مستقل تماماً
if (playXoBtn) {
    playXoBtn.addEventListener('click', () => {
        xoModal.style.display = 'flex';
        resetGame();
    });
}
closeXoBtn.addEventListener('click', () => xoModal.style.display = 'none');

// فتح وإغلاق لعبة الثعبان بشكل مستقل تماماً
if (playSnakeBtn) {
    playSnakeBtn.addEventListener('click', () => {
        snakeModal.style.display = 'flex';
        initSnakeGame();
    });
}
closeSnakeBtn.addEventListener('click', () => {
    snakeModal.style.display = 'none';
    clearInterval(snakeGameInterval);
    snakeRunning = false;
});

// إغلاق النوافذ عند الضغط خارجها
window.addEventListener('click', (e) => {
    if (e.target === xoModal) xoModal.style.display = 'none';
    if (e.target === snakeModal) {
        snakeModal.style.display = 'none';
        clearInterval(snakeGameInterval);
        snakeRunning = false;
    }
});

/* ================= منطق لعبة XO الشغال 100% 🛠️ ================= */
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
const cells = document.querySelectorAll('.cell');
const playerTurnElement = document.getElementById('current-player');
const resetBtn = document.getElementById('reset-btn');

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = parseInt(cell.getAttribute('data-index'));
        if (board[index] !== '' || !isGameActive) return;
        
        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        checkResult();
    });
});

function checkResult() {
    let roundWon = false;

    // طرق الفوز صريحة ومستحيل تختفي (0,1,2 - 3,4,5 - 6,7,8 - 0,3,6 - 1,4,7 - 2,5,8 - 0,4,8 - 2,4,6)
    if (board[0] !== '' && board[0] === board[1] && board[1] === board[2]) roundWon = true;
    else if (board[3] !== '' && board[3] === board[4] && board[4] === board[5]) roundWon = true;
    else if (board[6] !== '' && board[6] === board[7] && board[7] === board[8]) roundWon = true;
    else if (board[0] !== '' && board[0] === board[3] && board[3] === board[6]) roundWon = true;
    else if (board[1] !== '' && board[1] === board[4] && board[4] === board[7]) roundWon = true;
    else if (board[2] !== '' && board[2] === board[5] && board[5] === board[8]) roundWon = true;
    else if (board[0] !== '' && board[0] === board[4] && board[4] === board[8]) roundWon = true;
    else if (board[2] !== '' && board[2] === board[4] && board[4] === board[6]) roundWon = true;

    if (roundWon) {
        setTimeout(() => { 
            showAlert(`مبروووك! اللاعب ${currentPlayer} كسب في السايبر! 🎉`); 
            isGameActive = false; 
        }, 100);
        return;
    }
    
    if (!board.includes('')) {
        setTimeout(() => { 
            showAlert('الماتش خلص تعادل! شدوا حيلكم الجيم الجاي 🤝'); 
            isGameActive = false; 
        }, 100);
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerTurnElement.innerText = currentPlayer;
}

resetBtn.addEventListener('click', resetGame);
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    playerTurnElement.innerText = currentPlayer;
    cells.forEach(cell => { cell.innerText = ''; cell.classList.remove('x', 'o'); });
}

/* ================= منطق لعبة الثعبان الشغال 100% 🐍 ================= */
const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('snake-score');
const startSnakeBtn = document.getElementById('start-snake-btn');

let grid = 20;
let snake = [];
let food = { x: 0, y: 0 };
let dx = grid;
let dy = 0;
let score = 0;
let snakeGameInterval;
let snakeRunning = false;

if (startSnakeBtn) {
    startSnakeBtn.addEventListener('click', () => {
        if (!snakeRunning) {
            initSnakeGame();
            snakeGameInterval = setInterval(updateSnake, 100);
            snakeRunning = true;
            startSnakeBtn.innerText = "إعادة البدء 🔄";
        } else {
            clearInterval(snakeGameInterval);
            initSnakeGame();
            snakeGameInterval = setInterval(updateSnake, 100);
        }
    });
}

function initSnakeGame() {
    snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }];
    dx = grid;
    dy = 0;
    score = 0;
    scoreElement.innerText = score;
    generateFood();
    drawSnakeGame();
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
}

function updateSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snakeCollision(head)) {
        clearInterval(snakeGameInterval);
        snakeRunning = false;
        startSnakeBtn.innerText = "ابدأ اللعب 🎮";
        showAlert(`جيم أوفر! السكور بتاعك: ${score} 💀`);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        generateFood();
    } else {
        snake.pop();
    }

    drawSnakeGame();
}

function snakeCollision(head) {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

function drawSnakeGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#45f3ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#45f3ff';
    ctx.fillRect(food.x, food.y, grid - 2, grid - 2);

    ctx.fillStyle = '#ff007f';
    ctx.shadowColor = '#ff007f';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, grid - 2, grid - 2);
    });
    ctx.shadowBlur = 0;
}

window.addEventListener('keydown', (e) => {
    if (!snakeRunning) return;
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -grid; }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = grid; }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -grid; dy = 0; }
    if (e.key === 'ArrowRight' && dx === 0) { dx = grid; dy = 0; }
});
