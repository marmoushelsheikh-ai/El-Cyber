// عناصر التحكم في الشاشات والمنبثقات
const xoModal = document.getElementById('game-modal');
const snakeModal = document.getElementById('snake-modal');
const bricksModal = document.getElementById('bricks-modal');
const customAlert = document.getElementById('custom-alert');

// أزرار الإغلاق
const closeXoBtn = document.querySelector('#game-modal .close-btn');
const closeSnakeBtn = document.getElementById('close-snake-btn');
const closeBricksBtn = document.getElementById('close-bricks-btn');
const alertCloseBtn = document.getElementById('alert-close-btn');

// أزرار فتح الألعاب
const playXoBtn = document.getElementById('play-xo-btn');
const playSnakeBtn = document.getElementById('play-snake-btn');
const playBricksBtn = document.getElementById('play-bricks-btn');

const alertMessage = document.getElementById('alert-message');

function showAlert(message) {
    alertMessage.innerText = message;
    customAlert.classList.add('show');
}
alertCloseBtn.addEventListener('click', () => customAlert.classList.remove('show'));

// فتح وإغلاق الألعاب بشكل مستقل
if (playXoBtn) playXoBtn.addEventListener('click', () => { xoModal.style.display = 'flex'; resetGame(); });
closeXoBtn.addEventListener('click', () => xoModal.style.display = 'none');

if (playSnakeBtn) playSnakeBtn.addEventListener('click', () => { snakeModal.style.display = 'flex'; initSnakeGame(); });
closeSnakeBtn.addEventListener('click', () => { snakeModal.style.display = 'none'; clearInterval(snakeGameInterval); snakeRunning = false; });

if (playBricksBtn) playBricksBtn.addEventListener('click', () => { bricksModal.style.display = 'flex'; initBricksGame(); });
closeBricksBtn.addEventListener('click', () => { bricksModal.style.display = 'none'; clearInterval(bricksInterval); bricksRunning = false; });

window.addEventListener('click', (e) => {
    if (e.target === xoModal) xoModal.style.display = 'none';
    if (e.target === snakeModal) { snakeModal.style.display = 'none'; clearInterval(snakeGameInterval); snakeRunning = false; }
    if (e.target === bricksModal) { bricksModal.style.display = 'none'; clearInterval(bricksInterval); bricksRunning = false; }
});

/* ================= منطق لعبة XO ================= */
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
    if (board[0] !== '' && board[0] === board[1] && board[1] === board[2]) roundWon = true;
    else if (board[3] !== '' && board[3] === board[4] && board[4] === board[5]) roundWon = true;
    else if (board[6] !== '' && board[6] === board[7] && board[7] === board[8]) roundWon = true;
    else if (board[0] !== '' && board[0] === board[3] && board[3] === board[6]) roundWon = true;
    else if (board[1] !== '' && board[1] === board[4] && board[4] === board[7]) roundWon = true;
    else if (board[2] !== '' && board[2] === board[5] && board[5] === board[8]) roundWon = true;
    else if (board[0] !== '' && board[0] === board[4] && board[4] === board[8]) roundWon = true;
    else if (board[2] !== '' && board[2] === board[4] && board[4] === board[6]) roundWon = true;

    if (roundWon) {
        setTimeout(() => { showAlert(`مبروووك! اللاعب ${currentPlayer} كسب في السايبر! 🎉`); isGameActive = false; }, 100);
        return;
    }
    if (!board.includes('')) {
        setTimeout(() => { showAlert('الماتش خلص تعادل! شدوا حيلكم الجيم الجاي 🤝'); isGameActive = false; }, 100);
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
    if(playerTurnElement) playerTurnElement.innerText = currentPlayer;
    cells.forEach(cell => { cell.innerText = ''; cell.classList.remove('x', 'o'); });
}

/* ================= منطق لعبة الثعبان 🐍 ================= */
const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('snake-score');
const startSnakeBtn = document.getElementById('start-snake-btn');

let grid = 20;
let snake = [];
let food = { x: 0, y: 0 };
let dx = grid, dy = 0, score = 0, snakeGameInterval, snakeRunning = false;

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
    dx = grid; dy = 0; score = 0; scoreElement.innerText = score; generateFood(); drawSnakeGame();
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
}

function updateSnake() {
    if (snake.length === 0) return;
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snakeCollision(head)) {
        clearInterval(snakeGameInterval); snakeRunning = false; startSnakeBtn.innerText = "ابدأ اللعب 🎮";
        showAlert(`جيم أوفر! السكور بتاعك: ${score} 💀`); return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) { score += 10; scoreElement.innerText = score; generateFood(); } else { snake.pop(); }
    drawSnakeGame();
}

function snakeCollision(head) {
    for (let i = 0; i < snake.length; i++) { if (snake[i].x === head.x && snake[i].y === head.y) return true; }
    return false;
}

function drawSnakeGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#45f3ff'; ctx.shadowBlur = 10; ctx.shadowColor = '#45f3ff';
    ctx.fillRect(food.x, food.y, grid - 2, grid - 2);
    ctx.fillStyle = '#ff007f'; ctx.shadowColor = '#ff007f';
    snake.forEach(part => ctx.fillRect(part.x, part.y, grid - 2, grid - 2));
    ctx.shadowBlur = 0;
}

/* ================= منطق لعبة تكسير الكتل الكاملة 🧱 ================= */
const bCanvas = document.getElementById('bricks-canvas');
const bCtx = bCanvas.getContext('2d');
const bScoreElement = document.getElementById('bricks-score');
const startBricksBtn = document.getElementById('start-bricks-btn');

let ballRadius = 8, bX, bY, bDx, bDy;
let paddleHeight = 10, paddleWidth = 75, paddleX;
let rightPressed = false, leftPressed = false;
let brickRowCount = 4, brickColumnCount = 5, brickWidth = 65, brickHeight = 15, brickPadding = 10, brickOffsetTop = 30, brickOffsetLeft = 20;
let bricks = [], bScore = 0, bricksInterval, bricksRunning = false;

if (startBricksBtn) {
    startBricksBtn.addEventListener('click', () => {
        initBricksGame();
        if (!bricksRunning) {
            bricksInterval = setInterval(drawBricksGame, 10);
            bricksRunning = true;
            startBricksBtn.innerText = "إعادة البدء 🔄";
        } else {
            clearInterval(bricksInterval);
            bricksInterval = setInterval(drawBricksGame, 10);
        }
    });
}

function initBricksGame() {
    bX = bCanvas.width / 2; bY = bCanvas.height - 30; bDx = 2; bDy = -2;
    paddleX = (bCanvas.width - paddleWidth) / 2; bScore = 0; bScoreElement.innerText = bScore;
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) { bricks[c][r] = { x: 0, y: 0, status: 1 }; }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (bX > b.x && bX < b.x + brickWidth && bY > b.y && bY < b.y + brickHeight) {
                    bDy = -bDy; b.status = 0; bScore += 10; bScoreElement.innerText = bScore;
                    if (bScore === brickRowCount * brickColumnCount * 10) {
                        clearInterval(bricksInterval); bricksRunning = false; startBricksBtn.innerText = "ابدأ اللعب 🎮";
                        showAlert("عاش يا وحش! كسرت كل الكتل وكسبت الماتش! 🎉");
                    }
                }
            }
        }
    }
}

function drawBall() {
    bCtx.beginPath(); bCtx.arc(bX, bY, ballRadius, 0, Math.PI * 2);
    bCtx.fillStyle = "#45f3ff"; bCtx.shadowBlur = 10; bCtx.shadowColor = "#45f3ff"; bCtx.fill(); bCtx.closePath();
}

function drawPaddle() {
    bCtx.beginPath(); bCtx.rect(paddleX, bCanvas.height - paddleHeight, paddleWidth, paddleHeight);
    bCtx.fillStyle = "#ff007f"; bCtx.shadowColor = "#ff007f"; bCtx.fill(); bCtx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX; bricks[c][r].y = brickY;
                bCtx.beginPath(); bCtx.rect(brickX, brickY, brickWidth, brickHeight);
bCtx.fillStyle = "#ff007f"; bCtx.fill(); bCtx.closePath();
}
}
}
}
function drawBricksGame() {
bCtx.clearRect(0, 0, bCanvas.width, bCanvas.height);
drawBricks(); drawBall(); drawPaddle(); collisionDetection(); bCtx.shadowBlur = 0;
if (bX + bDx > bCanvas.width - ballRadius || bX + bDx < ballRadius) bDx = -bDx;
if (bY + bDy < ballRadius) bDy = -bDy;
else if (bY + bDy > bCanvas.height - ballRadius) {
if (bX > paddleX && bX < paddleX + paddleWidth) bDy = -bDy;
else {
clearInterval(bricksInterval); bricksRunning = false; startBricksBtn.innerText = "ابدأ اللعب 🎮";
showAlert("جيم أوفر! الكتل كسبتك والسكور: " + bScore + " 💀"); return;
}
}
if (rightPressed && paddleX < bCanvas.width - paddleWidth) paddleX += 5;
else if (leftPressed && paddleX > 0) paddleX -= 5;
bX += bDx; bY += bDy;
}
// التحكم بالأسهم المشترك لجميع الألعاب
window.addEventListener('keydown', (e) => {
if (snakeRunning) {
if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -grid; }
if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = grid; }
if (e.key === 'ArrowLeft' && dx === 0) { dx = -grid; dy = 0; }
if (e.key === 'ArrowRight' && dx === 0) { dx = grid; dy = 0; }
}
if (bricksRunning) {
if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}
});
window.addEventListener('keyup', (e) => {
if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});