const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const grid = 15;
const paddleHeight = grid * 5; // 75
const maxPaddleY = canvas.height - grid - paddleHeight;

const paddleSpeed = 6;
const ballSpeed = 5;

const leftPaddle = {
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0,
};

const rightPaddle = {
    x: canvas.width - grid * 3,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0,
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,
    resetting: false,
    dx: ballSpeed,
    dy: -ballSpeed,
};

const keysPressed = new Set();

const collides = (obj1, obj2) => (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
);

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const resetBall = () => {
    ball.resetting = true;
    setTimeout(() => {
        ball.resetting = false;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }, 400);
};

const updatePaddles = () => {
    // Left paddle controls: KeyW (up), KeyS (down)
    if (keysPressed.has('KeyW')) leftPaddle.dy = -paddleSpeed;
    else if (keysPressed.has('KeyS')) leftPaddle.dy = paddleSpeed;
    else leftPaddle.dy = 0;

    // Right paddle controls: ArrowUp, ArrowDown
    if (keysPressed.has('ArrowUp')) rightPaddle.dy = -paddleSpeed;
    else if (keysPressed.has('ArrowDown')) rightPaddle.dy = paddleSpeed;
    else rightPaddle.dy = 0;

    leftPaddle.y = clamp(leftPaddle.y + leftPaddle.dy, grid, maxPaddleY);
    rightPaddle.y = clamp(rightPaddle.y + rightPaddle.dy, grid, maxPaddleY);
};

const loop = () => {
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    updatePaddles();

    // Draw paddles
    context.fillStyle = 'white';
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce ball off top and bottom walls
    if (ball.y < grid) {
        ball.y = grid;
        ball.dy *= -1;
    } else if (ball.y + ball.height > canvas.height - grid) {
        ball.y = canvas.height - grid - ball.height;
        ball.dy *= -1;
    }

    // Reset ball if out of bounds
    if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
        resetBall();
    }

    // Ball-paddle collision
    if (collides(ball, leftPaddle)) {
        ball.dx = Math.abs(ball.dx); // ensure positive to go right
        ball.x = leftPaddle.x + leftPaddle.width;
    } else if (collides(ball, rightPaddle)) {
        ball.dx = -Math.abs(ball.dx); // ensure negative to go left
        ball.x = rightPaddle.x - ball.width;
    }

    // Draw ball
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // Draw top and bottom walls
    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, canvas.width, grid);
    context.fillRect(0, canvas.height - grid, canvas.width, grid);

    // Draw dotted center line
    for (let i = grid; i < canvas.height - grid; i += grid * 2) {
        context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
    }
};

// Keyboard events to track keys pressed
document.addEventListener('keydown', e => {
    keysPressed.add(e.code);
});

document.addEventListener('keyup', e => {
    keysPressed.delete(e.code);
});

requestAnimationFrame(loop);
