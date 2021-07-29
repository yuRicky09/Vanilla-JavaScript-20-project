const rulesBtn = document.querySelector("#rules-btn");
const closeBtn = document.querySelector("#close-btn");
const rules = document.querySelector("#rules");

//*  使用canvas的起手式
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let score = 0;

const brickRowCount = 5;
const brickColumnCount = 9;

//* 設定球、板與分數的樣式
const ball = {
  // 這樣設定是希望球的初始位置在畫板區塊正中間
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddle = {
  //這邊的-40是為了讓板子能到正中間 (板子預設自身長度80)
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

const drawBall = function () {
  // 使用路徑來繪製圖型
  ctx.beginPath();
  // arc()方法來畫弧形或圓形 參數各代表啥自看mdn
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
};

const drawPaddle = function () {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
};

const bricks = [];
//! 繪製思維 第一欄的第一列的磚塊x,y為... 第一欄的第二列的磚塊x,y為...   最後資訊會存起來像 [ [第一欄的所有磚塊], [第二欄的所有磚塊], [],...]
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    //! 在把基本資訊散到每個對應的磚塊裡面
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

console.log(bricks);

const drawBricks = function () {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
};

// canvas也可繪製文字
const drawScore = function () {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 20);
};

const draw = function () {
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
};

const increaseScore = function () {
  score++;
};

const resetGame = function () {
  score = 0;
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
};

//* 更新Paddle and Ball (x,y)值
// * 下方的鍵盤監聽handler會先決定移動值是多少，決定後我們在設定如何移動板子
const movePaddle = function () {
  paddle.x += paddle.dx;

  // 設置板子可移動範圍要在canvas範圍裡
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  } else if (paddle.x < 0) {
    paddle.x = 0;
  }
};

const moveBall = function () {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 設置球的移動範圍 球的(x,y)是圓心點 所以他的左右上下正確(x,y)值都要加減半徑
  // 遊戲原理是撞牆則反彈 所以撞左右邊就改dx值 反之
  // 左右邊
  if (ball.x + ball.size > canvas.width) {
    ball.dx *= -1;
  } else if (ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  // 上下邊
  if (ball.y + ball.size > canvas.height) {
    ball.dy *= -1;
  } else if (ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // 撞到板子時  會撞到板就代表球的x值介於板子x與板子的x+width之間 並且球的y值>板子的y值
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -4;
    console.log("hit");
  }

  // 撞到磚塊時 會撞到磚塊代表球的y值-半徑<磚塊的y值 + h,並且球的x值介於磚塊的x值和磚塊的x值 + h之間
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x > brick.x &&
          ball.x < brick.x + brick.w &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          brick.visible = false;
          ball.dy = 4;

          // 增加分數
          increaseScore();
        }
      }
    });
  });

  // 重置遊戲 1.全磚塊都打掉 2.撞到底端
  if (
    score % (brickRowCount * brickColumnCount) === 0 ||
    ball.y + ball.size > canvas.height
  ) {
    resetGame();
  }
};

//* 想要在canvas畫出動畫效果就是要不斷清掉舊畫面在畫出新畫面
//! 可以搭配requestAnimationFrame 每1秒約回呼60次callback 不斷更新畫面楨數 畫所需物件
const updateCanvas = function () {
  //! 下面的method就是把整個畫布內容清掉 我們動畫效過就是不斷更新物件的值然後藉由requestAnimationFrame不斷回乎我們的updateCanvas然重畫物件 就會呈現出動畫的效果了
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePaddle();
  moveBall();

  // Draw everything
  draw();
  requestAnimationFrame(updateCanvas);
};

requestAnimationFrame(updateCanvas);

// 監聽左右鍵來決定移動方向
const move = function (e) {
  if (e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  }

  if (e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
};

const stop = function (e) {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    paddle.dx = 0;
  }
};

window.addEventListener("keydown", move);
window.addEventListener("keyup", stop);

//* Show rules and close rules
rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});

// Create ball props
// const ball = {
//   x: canvas.width / 2,
//   y: canvas.height / 2,
//   size: 10,
//   speed: 4,
//   dx: 4,
//   dy: -4
// };

// // Create paddle props
// const paddle = {
//   x: canvas.width / 2 - 40,
//   y: canvas.height - 20,
//   w: 80,
//   h: 10,
//   speed: 8,
//   dx: 0
// };

// // Create brick props
// const brickInfo = {
//   w: 70,
//   h: 20,
//   padding: 10,
//   offsetX: 45,
//   offsetY: 60,
//   visible: true
// };

// // Create bricks
// const bricks = [];
// for (let i = 0; i < brickRowCount; i++) {
//   bricks[i] = [];
//   for (let j = 0; j < brickColumnCount; j++) {
//     const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
//     const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
//     bricks[i][j] = { x, y, ...brickInfo };
//   }
// }

// // Draw ball on canvas
// function drawBall() {
//   ctx.beginPath();
//   ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
//   ctx.fillStyle = '#0095dd';
//   ctx.fill();
//   ctx.closePath();
// }

// // Draw paddle on canvas
// function drawPaddle() {
//   ctx.beginPath();
//   ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
//   ctx.fillStyle = '#0095dd';
//   ctx.fill();
//   ctx.closePath();
// }

// // Draw score oon canvas
// function drawScore() {
//   ctx.font = '20px Arial';
//   ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
// }

// // Draw bricks on canvas
// function drawBricks() {
//   bricks.forEach(column => {
//     column.forEach(brick => {
//       ctx.beginPath();
//       ctx.rect(brick.x, brick.y, brick.w, brick.h);
//       ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
//       ctx.fill();
//       ctx.closePath();
//     });
//   });
// }

// // Move paddle on canvas
// function movePaddle() {
//   paddle.x += paddle.dx;

//   // Wall detection
//   if (paddle.x + paddle.w > canvas.width) {
//     paddle.x = canvas.width - paddle.w;
//   }

//   if (paddle.x < 0) {
//     paddle.x = 0;
//   }
// }

// // Move ball on canvas
// function moveBall() {
//   ball.x += ball.dx;
//   ball.y += ball.dy;

//   // Wall collision (right/left)
//   if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
//     ball.dx *= -1; // ball.dx = ball.dx * -1
//   }

//   // Wall collision (top/bottom)
//   if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
//     ball.dy *= -1;
//   }

//   // console.log(ball.x, ball.y);

//   // Paddle collision
//   if (
//     ball.x - ball.size > paddle.x &&
//     ball.x + ball.size < paddle.x + paddle.w &&
//     ball.y + ball.size > paddle.y
//   ) {
//     ball.dy = -ball.speed;
//   }

//   // Brick collision
//   bricks.forEach(column => {
//     column.forEach(brick => {
//       if (brick.visible) {
//         if (
//           ball.x - ball.size > brick.x && // left brick side check
//           ball.x + ball.size < brick.x + brick.w && // right brick side check
//           ball.y + ball.size > brick.y && // top brick side check
//           ball.y - ball.size < brick.y + brick.h // bottom brick side check
//         ) {
//           ball.dy *= -1;
//           brick.visible = false;

//           increaseScore();
//         }
//       }
//     });
//   });

//   // Hit bottom wall - Lose
//   if (ball.y + ball.size > canvas.height) {
//     showAllBricks();
//     score = 0;
//   }
// }

// // Increase score
// function increaseScore() {
//   score++;

//   if (score % (brickRowCount * brickRowCount) === 0) {
//     showAllBricks();
//   }
// }

// // Make all bricks appear
// function showAllBricks() {
//   bricks.forEach(column => {
//     column.forEach(brick => (brick.visible = true));
//   });
// }

// // Draw everything
// function draw() {
//   // clear canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   drawBall();
//   drawPaddle();
//   drawScore();
//   drawBricks();
// }

// // Update canvas drawing and animation
// function update() {
//   movePaddle();
//   moveBall();

//   // Draw everything
//   draw();

//   requestAnimationFrame(update);
// }

// update();

// // Keydown event
// function keyDown(e) {
//   if (e.key === 'Right' || e.key === 'ArrowRight') {
//     paddle.dx = paddle.speed;
//   } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
//     paddle.dx = -paddle.speed;
//   }
// }

// // Keyup event
// function keyUp(e) {
//   if (
//     e.key === 'Right' ||
//     e.key === 'ArrowRight' ||
//     e.key === 'Left' ||
//     e.key === 'ArrowLeft'
//   ) {
//     paddle.dx = 0;
//   }
// }

// // Keyboard event handlers
// document.addEventListener('keydown', keyDown);
// document.addEventListener('keyup', keyUp);

// // Rules and close event handlers
// rulesBtn.addEventListener('click', () => rules.classList.add('show'));
// closeBtn.addEventListener('click', () => rules.classList.remove('show'));
