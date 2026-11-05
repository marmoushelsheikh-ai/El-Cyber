// ==========================================
// 1. عناصر التحكم في الشاشات والمنبثقات
// ==========================================
const xoModal = document.getElementById('game-modal');
const snakeModal = document.getElementById('snake-modal');
const bricksModal = document.getElementById('bricks-modal');
const subwayModal = document.getElementById('subway-modal');
const customAlert = document.getElementById('custom-alert');

// أزرار الإغلاق
const closeXoBtn = document.querySelector('#game-modal .close-btn');
const closeSnakeBtn = document.getElementById('close-snake-btn');
const closeBricksBtn = document.getElementById('close-bricks-btn');
const closeSubwayBtn = document.getElementById('close-subway-btn');
const alertCloseBtn = document.getElementById('alert-close-btn');

// أزرار فتح الألعاب
const playXoBtn = document.getElementById('play-xo-btn');
const playSnakeBtn = document.getElementById('play-snake-btn');
const playBricksBtn = document.getElementById('play-bricks-btn');
const playSubwayBtn = document.getElementById('play-subway-btn');

const alertMessage = document.getElementById('alert-message');

// عناصر لعبة ساب واي وسيرفر تشغيل HTML5 النظيف المعتمد
const subwayFrame = document.getElementById('subway-frame');
const subwayContainer = document.getElementById('subway-container');
const startSubwayFullscreen = document.getElementById('start-subway-fullscreen');
const subwayGameUrl = "https://marmoushelsheikh-ai.github.io/subway/";

// دالة التنبيه الاحترافية المخصصة
function showAlert(message) {
    alertMessage.innerText = message;
    customAlert.classList.add('show');
}
alertCloseBtn.addEventListener('click', () => customAlert.classList.remove('show'));

// ربط أزرار الفتح وإغلاق النوافذ
if (playXoBtn) playXoBtn.addEventListener('click', () => { xoModal.style.display = 'flex'; resetGame(); });
closeXoBtn.addEventListener('click', () => xoModal.style.display = 'none');

if (playSnakeBtn) playSnakeBtn.addEventListener('click', () => { snakeModal.style.display = 'flex'; initSnakeGame(); });
closeSnakeBtn.addEventListener('click', () => { snakeModal.style.display = 'none'; clearInterval(snakeGameInterval); snakeRunning = false; });

if (playBricksBtn) playBricksBtn.addEventListener('click', () => { bricksModal.style.display = 'flex'; initBricksGame(); });
closeBricksBtn.addEventListener('click', () => { bricksModal.style.display = 'none'; clearInterval(bricksInterval); bricksRunning = false; });

// تشغيل وإيقاف ساب واي لمنع استهلاك البيانات عند الإغلاق
if (playSubwayBtn) playSubwayBtn.addEventListener('click', () => { subwayModal.style.display = 'flex'; subwayFrame.src = subwayGameUrl; });
closeSubwayBtn.addEventListener('click', () => { subwayModal.style.display = 'none'; subwayFrame.src = ""; });

// إغلاق النوافذ عند الضغط خارجها
window.addEventListener('click', (e) => {
    if (e.target === xoModal) xoModal.style.display = 'none';
    if (e.target === snakeModal) { snakeModal.style.display = 'none'; clearInterval(snakeGameInterval); snakeRunning = false; }
    if (e.target === bricksModal) { bricksModal.style.display = 'none'; clearInterval(bricksInterval); bricksRunning = false; }
    if (e.target === subwayModal) { subwayModal.style.display = 'none'; subwayFrame.src = ""; }
});

// تفعيل ميزة طلب الـ Fullscreen بكامل الشاشة لساب واي
if (startSubwayFullscreen) {
    startSubwayFullscreen.addEventListener('click', () => {
        if (subwayContainer.requestFullscreen) {
            subwayContainer.requestFullscreen();
        } else if (subwayContainer.webkitRequestFullscreen) { /* أجهزة آيفون وسفاري */
            subwayContainer.webkitRequestFullscreen();
        } else if (subwayContainer.msRequestFullscreen) {
            subwayContainer.msRequestFullscreen();
        }
    });
}


// ==========================================
// 2. منطق لعبة XO (تيك تاك تو)
// ==========================================
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
    
    // شروط الفوز محمية ومكتوبة بنصوص صريحة لمنع الاختفاء أثناء النقل والنسخ
    const winConditions = [
        [parseInt('0'), parseInt('1'), parseInt('2')], 
        [parseInt('3'), parseInt('4'), parseInt('5')], 
        [parseInt('6'), parseInt('7'), parseInt('8')], 
        [parseInt('0'), parseInt('3'), parseInt('6')], 
        [parseInt('1'), parseInt('4'), parseInt('7')], 
        [parseInt('2'), parseInt('5'), parseInt('8')], 
        [parseInt('0'), parseInt('4'), parseInt('8')], 
        [parseInt('2'), parseInt('4'), parseInt('6')]
    ];

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const a = condition[0];
        const b = condition[1];
        const c = condition[2];
        
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        showAlert(`مليون مبروك! اللاعب (${currentPlayer}) كسب الجيم 🏆`);
        isGameActive = false;
        return;
    }

    if (!board.includes('')) {
        showAlert("التعادل سيد الموقف! 🤝 العبوا تاني.");
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerTurnElement.innerText = currentPlayer;
    
    if (currentPlayer === 'X') {
        playerTurnElement.style.color = '#ff007f';
        playerTurnElement.style.textShadow = '0 0 10px #ff007f';
    } else {
        playerTurnElement.style.color = '#45f3ff';
        playerTurnElement.style.textShadow = '0 0 10px #45f3ff';
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    playerTurnElement.innerText = currentPlayer;
    playerTurnElement.style.color = '#ff007f';
    playerTurnElement.style.textShadow = '0 0 10px #ff007f';
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o');
    });
}
if (resetBtn) resetBtn.addEventListener('click', resetGame);


// ==========================================
// 3. منطق لعبة الثعبان الكلاسيكية (Snake)
// ==========================================
const snakeCanvas = document.getElementById('snake-canvas');
const snakeCtx = snakeCanvas.getContext('2d');
let snake, snakeDir, food, snakeScore, snakeGameInterval;
let snakeRunning = false;
const snakeGridSize = 20;

const startSnakeBtn = document.getElementById('start-snake-btn');
if (startSnakeBtn) startSnakeBtn.addEventListener('click', initSnakeGame);

function initSnakeGame() {
    clearInterval(snakeGameInterval);
    snake = [{x: 200, y: 200}, {x: 180, y: 200}, {x: 160, y: 200}];
    snakeDir = 'RIGHT';
    snakeScore = 0;
    document.getElementById('snake-score').innerText = snakeScore;
    generateSnakeFood();
    snakeRunning = true;
    snakeGameInterval = setInterval(updateSnakeGame, 130);
}

function generateSnakeFood() {
    food = {
        x: Math.floor(Math.random() * (snakeCanvas.width / snakeGridSize)) * snakeGridSize,
        y: Math.floor(Math.random() * (snakeCanvas.height / snakeGridSize)) * snakeGridSize
    };
}

function updateSnakeGame() {
    if (!snakeRunning) return;

    let head = { x: snake[0].x, y: snake[0].y };
    if (snakeDir === 'UP') head.y -= snakeGridSize;
    if (snakeDir === 'DOWN') head.y += snakeGridSize;
    if (snakeDir === 'LEFT') head.x -= snakeGridSize;
    if (snakeDir === 'RIGHT') head.x += snakeGridSize;

    if (head.x < 0 || head.x >= snakeCanvas.width || head.y < 0 || head.y >= snakeCanvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(snakeGameInterval);
        snakeRunning = false;
        showAlert(`جيم أوفر يا بطل! 🐍 السكور بتاعك: ${snakeScore}`);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        snakeScore += 10;
        document.getElementById('snake-score').innerText = snakeScore;
        generateSnakeFood();
    } else {
        snake.pop();
    }

    snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    snakeCtx.fillStyle = '#45f3ff';
    snake.forEach(segment => snakeCtx.fillRect(segment.x, segment.y, snakeGridSize - 2, snakeGridSize - 2));
    
    snakeCtx.fillStyle = '#ff007f';
    snakeCtx.fillRect(food.x, food.y, snakeGridSize - 2, snakeGridSize - 2);
}

function changeDirection(newDir) {
    if (newDir === 'UP' && snakeDir !== 'DOWN') snakeDir = 'UP';
    if (newDir === 'DOWN' && snakeDir !== 'UP') snakeDir = 'DOWN';
    if (newDir === 'LEFT' && snakeDir !== 'RIGHT') snakeDir = 'LEFT';
    if (newDir === 'RIGHT' && snakeDir !== 'LEFT') snakeDir = 'RIGHT';
}

window.addEventListener('keydown', e => {
    if (!snakeRunning) return;
    if (e.key === 'ArrowUp') changeDirection('UP');
    if (e.key === 'ArrowDown') changeDirection('DOWN');
    if (e.key === 'ArrowLeft') changeDirection('LEFT');
    if (e.key === 'ArrowRight') changeDirection('RIGHT');
});

// اللمس السريع عالي الاستجابة للموبايل
document.getElementById('btn-up').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection('UP'); });
document.getElementById('btn-down').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection('DOWN'); });
document.getElementById('btn-left').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection('LEFT'); });
document.getElementById('btn-right').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection('RIGHT'); });
document.getElementById('btn-up').addEventListener('click', () => changeDirection('UP'));
document.getElementById('btn-down').addEventListener('click', () => changeDirection('DOWN'));
document.getElementById('btn-left').addEventListener('click', () => changeDirection('LEFT'));
document.getElementById('btn-right').addEventListener('click', () => changeDirection('RIGHT'));
// ==========================================
// 4. منطق لعبة تكسير الكتل (Bricks)
// ==========================================
const bricksCanvas = document.getElementById('bricks-canvas');
const bricksCtx = bricksCanvas.getContext('2d');
let paddleWidth = 80, paddleHeight = 12, paddleX;
let ballRadius = 8, ballX, ballY, dx, dy;
let brickRowCount = 3, brickColumnCount = 5, brickWidth = 65, brickHeight = 18, brickPadding = 10, brickOffsetTop = 30, brickOffsetLeft = 20;
let bricks = [], bricksScore = 0, bricksInterval;
let bricksRunning = false;
let moveLeft = false, moveRight = false;
const startBricksBtn = document.getElementById('start-bricks-btn');
if (startBricksBtn) startBricksBtn.addEventListener('click', initBricksGame);
function initBricksGame() {
clearInterval(bricksInterval);
bricksScore = 0;
document.getElementById('bricks-score').innerText = bricksScore;
paddleX = (bricksCanvas.width - paddleWidth) / 2;
ballX = bricksCanvas.width / 2;
ballY = bricksCanvas.height - 30;
dx = 3;
dy = -3;
for (let c = 0; c < brickColumnCount; c++) {
bricks[c] = [];
for (let r = 0; r < brickRowCount; r++) {
bricks[c][r] = { x: 0, y: 0, status: 1 };
}
}
bricksRunning = true;
bricksInterval = setInterval(updateBricksGame, 16);
}
function updateBricksGame() {
if (!bricksRunning) return;
if (ballX + dx > bricksCanvas.width - ballRadius || ballX + dx < ballRadius) dx = -dx;
if (ballY + dy < ballRadius) dy = -dy;
else if (ballY + dy > bricksCanvas.height - ballRadius) {
if (ballX > paddleX && ballX < paddleX + paddleWidth) {
dy = -dy;
} else {
clearInterval(bricksInterval);
bricksRunning = false;
showAlert(`للأسف خسرت الكرة! 🧱 السكور: ${bricksScore}`);
return;
}
}
for (let c = 0; c < brickColumnCount; c++) {
for (let r = 0; r < brickRowCount; r++) {
let b = bricks[c][r];
if (b.status === 1) {
if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
dy = -dy;
b.status = 0;
bricksScore++;
document.getElementById('bricks-score').innerText = bricksScore;
if (bricksScore === brickRowCount * brickColumnCount) {
clearInterval(bricksInterval);
bricksRunning = false;
showAlert("عاش يا وحش! كسرت كل الكتل بنجاح 🏆");
}
}
}
}
}
if (moveRight && paddleX < bricksCanvas.width - paddleWidth) paddleX += 6;
if (moveLeft && paddleX > 0) paddleX -= 6;
ballX += dx;
ballY += dy;
bricksCtx.clearRect(0, 0, bricksCanvas.width, bricksCanvas.height);
for (let c = 0; c < brickColumnCount; c++) {
for (let r = 0; r < brickRowCount; r++) {
if (bricks[c][r].status === 1) {
let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
bricks[c][r].x = brickX;
bricks[c][r].y = brickY;
bricksCtx.fillStyle = "#ff007f";
bricksCtx.fillRect(brickX, brickY, brickWidth, brickHeight);
}
}
}
bricksCtx.fillStyle = "#45f3ff";
bricksCtx.fillRect(paddleX, bricksCanvas.height - paddleHeight, paddleWidth, paddleHeight);
bricksCtx.beginPath();
bricksCtx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
bricksCtx.fill();
bricksCtx.closePath();
}
window.addEventListener('keydown', e => {
if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight = true;
if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft = true;
});
window.addEventListener('keyup', e => {
if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight = false;
if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft = false;
});
// سحب ومس المضرب للموبايل بسلاسة وبدون تهنيج للشاشة
bricksCanvas.addEventListener('touchmove', e => {
e.preventDefault();
let rect = bricksCanvas.getBoundingClientRect();
let relativeX = e.touches[0].clientX - rect.left;
if (relativeX > 0 && relativeX < bricksCanvas.width) {
paddleX = relativeX - paddleWidth / 2;
}
}, { passive: false });
bricksCanvas.addEventListener('touchstart', e => {
e.preventDefault();
let rect = bricksCanvas.getBoundingClientRect();
let relativeX = e.touches[0].clientX - rect.left;
if (relativeX > 0 && relativeX < bricksCanvas.width) {
paddleX = relativeX - paddleWidth / 2;
}
}, { passive: false });