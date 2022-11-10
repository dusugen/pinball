const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const paddleHeight = 10; // параметры ракетки для отбивания
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let score = 0;
let lives = 3;
let level = 1;

let rightPressed = false;
let leftPressed = false;

let requestId = 0;

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

let brickRowCount = 1; // количество блоков
let brickColumnCount = 5;

const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10; // параметры блоков
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = null;

function getRandomColor() {
  let color = Math.floor(Math.random() * 16777216).toString(16);
  return "#000000".slice(0, -color.length) + color;
}

function buildBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []; // массив который содержит значения столбца и строки
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, color: getRandomColor() };
    }
  }
}
buildBricks();

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        // bricks[c][r].color = brickColor;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  // отрисовка мяча
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  // отрисовка ракетки
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  // когда кнопка нажата
  if (e.keyCode == 39) {
    // код 37 — это клавиша стрелка влево
    rightPressed = true; // 39 — стрелка вправо.
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  // когда кнопка отжата
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert(`YOU WIN, CONGRATULATIONS! ${requestId}`);
            score = 0;
            level++;
            dx = Math.abs(dx * 2);
            dy = Math.abs(dy * 2) * -1;

            ballRadius -= 2;
            brickRowCount += 1;
            x = canvas.width / 2;
            y = canvas.height - 30;
            paddleX = (canvas.width - paddleWidth) / 2;
            buildBricks();
            drawBall();
            if (level > 3) {
              alert("You are winner!");
              document.location.reload();
            }
          }
        }
      }
      ctx.fillStyle = "#0095DD";
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}
function drawLives() {
  if (lives >= 0) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
  }
}

function drawLevel() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Level: " + level, canvas.width - 132, 20);
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // очищение поля
  drawPaddle();
  drawScore();
  drawLives();
  drawLevel();
  drawBricks();
  drawBall(); // отрисовка мяча.
  collisionDetection();
  x += dx;
  y += dy; // перемещение мячика путем изменения координат.

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5; // изменение координат при нажатии на кнопки
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    // откскок от стенок
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      dy = dy * -1;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx;
        dy;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  requestId = requestAnimationFrame(draw);
}
draw();
