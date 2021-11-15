import * as React from 'react';

import { isMobile } from 'react-device-detect';

import SearchEngineOptimization from '../components/SearchEngineOptimization';

import useDarkMode from '../hooks/useDarkMode';

import explosion from '../assets/explosion.webp';
import grape from '../assets/grape.webp';
import mango from '../assets/mango.webp';
import pineapple from '../assets/pineapple.webp';
import strawberry from '../assets/strawberry.webp';

const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default function Home() {
  const darkMode = useDarkMode(null);

  const [doneGame, setDoneGame] = React.useState(false);
  const [finalScore, setFinalScore] = React.useState(0);
  const [gameMode, setGameMode] = React.useState('');

  if (gameMode) {
    let canvas = document.getElementById('game');
    let ctx = canvas.getContext('2d');

    const images = [
      document.getElementById('grape'),
      document.getElementById('mango'),
      document.getElementById('pineapple'),
      document.getElementById('strawberry')
    ];
    const explosion = document.getElementById('explosion');

    let image = images[randomInt(0, 3)];
    let bonusClaimed = false;

    let imageX = randomInt(50, isMobile ? 330 : 750);
    let imageY = -2000000;
    let interval = 20000;
    let collisionY = 580;
    let collisionYEnd = 600;
    let imageDY = -2;

    let explodeX = 0;
    let explodeY = -2000000;

    if (isMobile) {
      collisionY = 380;
      collisionYEnd = 400;
    }

    if (gameMode === 'medium') {
      interval = 15000;
      imageDY -= 3;
    }

    if (gameMode === 'hard') {
      interval = 10000;
      imageDY -= 4;
    }

    setInterval(() => {
      image = images[randomInt(0, 3)];
      imageX = randomInt(50, isMobile ? 330 : 750);
      imageY = 0;
      bonusClaimed = false;
    }, interval);

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;

    let paddleHeight = 10;
    let paddleWidth = 100;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    let brickRowCount = 4;
    let brickColumnCount = 10;
    let brickWidth = 65;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 50;
    let brickOffsetLeft = 30;

    if (gameMode === 'medium') {
      paddleWidth = 80;

      brickRowCount = 6;
      brickColumnCount = 12;
      brickWidth = 50;
      brickHeight = 20;
      brickPadding = 15;
      brickOffsetTop = 50;
      brickOffsetLeft = 20;
    }

    if (gameMode === 'hard') {
      paddleWidth = 60;

      brickRowCount = 8;
      brickColumnCount = 12;
      brickWidth = 50;
      brickHeight = 20;
      brickPadding = 15;
      brickOffsetTop = 50;
      brickOffsetLeft = 20;
    }

    let bonus = 0;
    let score = 0;
    let lives = 3;

    if (isMobile) {
      brickColumnCount = 6;
      brickWidth = 40;

      if (gameMode === 'hard') {
        brickRowCount = 6;
      }
    }

    let bricks = [];
    let difference = 0;
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        if (gameMode === 'hard') {
          if (c === 0) {
            if (r === 1 || r === 2 || r === 3 || r === 4) {
              bricks[c][r] = { x: 0, y: 0, status: 0 };
              difference++;
            } else {
              bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
          } else if (c === 3) {
            if (r === 0 || r === 5) {
              bricks[c][r] = { x: 0, y: 0, status: 0 };
              difference++;
            } else {
              bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
          } else if (c === 4) {
            if (r === 1 || r === 4) {
              bricks[c][r] = { x: 0, y: 0, status: 0 };
              difference++;
            } else {
              bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
          } else if (c === 5) {
            if (r === 2 || r === 3) {
              bricks[c][r] = { x: 0, y: 0, status: 0 };
              difference++;
            } else {
              bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
          } else if (c === 6) {
            if (r === 3 || r === 2) {
              bricks[c][r] = { x: 0, y: 0, status: 0 };
              difference++;
            } else {
              bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
          } else if (c === 7) {
            if (r === 4 || r === 1) {
              bricks[c][r] = { x: 0, y: 0, status: 0 };
              difference++;
            } else {
              bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
          } else if (c === 8) {
            if (r === 5 || r === 0) {
              bricks[c][r] = { x: 0, y: 0, status: 0 };
              difference++;
            } else {
              bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
          } else if (c === 11) {
            if (r === 1 || r === 2 || r === 3 || r === 4) {
              bricks[c][r] = { x: 0, y: 0, status: 0 };
              difference++;
            } else {
              bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
          } else {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
          }
        } else {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
    }

    const keyDownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
      }
    };

    const keyUpHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
      }
    };

    const mouseMoveHandler = (e) => {
      let relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 4;
      }
    };

    const touchHandler = (e) => {
      if (e.touches) {
        paddleX = e.touches[0].pageX - paddleWidth / 2;
      }
    };

    if (!isMobile) {
      document.addEventListener('keydown', keyDownHandler, false);
      document.addEventListener('keyup', keyUpHandler, false);
      canvas.addEventListener('mousemove', mouseMoveHandler, false);
    } else {
      document.addEventListener('touchStart', touchHandler, false);
      document.addEventListener('touchmove', touchHandler, false);
    }

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          let b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              score++;
            }
          }
        }
      }
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = darkMode ? '#fff' : '#000';
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(
        paddleX,
        canvas.height - paddleHeight,
        paddleWidth,
        paddleHeight
      );
      ctx.fillStyle = darkMode ? '#fff' : '#000';
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = darkMode ? '#fff' : '#000';
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const drawBonus = () => {
      let center = 450;

      if (isMobile) {
        center = 230;
      }

      ctx.font = '20px Rubik';
      ctx.fillStyle = darkMode ? '#fff' : '#000';
      ctx.fillText('Bonus: ' + bonus, canvas.width - center, 20);
    };

    const drawScore = () => {
      ctx.font = '20px Rubik';
      ctx.fillStyle = darkMode ? '#fff' : '#000';
      ctx.fillText('Score: ' + score, 8, 20);
    };

    const drawLives = () => {
      ctx.font = '20px Rubik';
      ctx.fillStyle = darkMode ? '#fff' : '#000';
      ctx.fillText('Lives: ' + lives, canvas.width - 75, 20);
    };

    const drawImage = (xI, yI) => {
      ctx.drawImage(image, xI, yI, 40, 60);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      drawBonus();

      collisionDetection();

      drawImage(imageX, imageY);
      imageY -= imageDY;

      ctx.drawImage(explosion, explodeX, explodeY, 70, 60);

      explodeY += 1;

      if (
        imageX > paddleX &&
        imageX < paddleX + paddleWidth &&
        imageY >= collisionY &&
        imageY <= collisionYEnd &&
        !bonusClaimed
      ) {
        bonus += 10;
        bonusClaimed = true;
      }

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          lives--;
          if (!lives) {
            setGameMode('');
            setDoneGame(true);
            cancelAnimationFrame(draw);
            setFinalScore(score + bonus);
            return null;
          } else {
            explodeX = x;
            explodeY = y - 45;
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width - paddleWidth) / 2;
          }
        }
      }

      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        if (gameMode === 'easy') {
          paddleX += 7;
        } else if (gameMode === 'medium') {
          paddleX += 10;
        } else {
          paddleX += 14;
        }

        if (paddleX + paddleWidth > canvas.width) {
          paddleX = canvas.width - paddleWidth;
        }
      } else if (leftPressed && paddleX > 0) {
        if (gameMode === 'easy') {
          paddleX -= 7;
        } else if (gameMode === 'medium') {
          paddleX -= 10;
        } else {
          paddleX -= 14;
        }

        if (paddleX < 0) {
          paddleX = 0;
        }
      }

      if (gameMode === 'easy') {
        x += dx;
        y += dy;
      } else if (gameMode === 'medium') {
        x += dx * 2;
        y += dy * 2;
      } else {
        x += dx * 3;
        y += dy * 3;
      }

      if (lives === 0 || lives === -1) {
        setGameMode('');
        setDoneGame(true);
        cancelAnimationFrame(draw);
        setFinalScore(score + bonus);
        return null;
      }

      if (score === brickRowCount * brickColumnCount) {
        setGameMode('');
        setDoneGame(true);
        cancelAnimationFrame(draw);
        setFinalScore(score + bonus);
        return null;
      } else {
        if (gameMode === 'hard') {
          if (score === brickRowCount * brickColumnCount - difference) {
            setGameMode('');
            setDoneGame(true);
            cancelAnimationFrame(draw);
            setFinalScore(score + bonus);
            return null;
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
  }

  const gameModeHandler = (mode) => {
    setDoneGame(false);
    setFinalScore(0);
    setGameMode(mode);
  };

  return (
    <>
      <SearchEngineOptimization title="Home" gameMode={gameMode} />
      <main className="grid grid-cols-1">
        <h1 className="text-center">Brick Breaker</h1>
        <div className="grid grid-cols-5 justify-items-center">
          <img id="grape" src={grape} alt="" width={40} height={65} />
          <img id="mango" src={mango} alt="" width={40} height={65} />
          <img id="pineapple" src={pineapple} alt="" width={40} height={65} />
          <img id="strawberry" src={strawberry} alt="" width={40} height={65} />
          <img id="explosion" src={explosion} alt="" width={40} height={80} />
        </div>
        {doneGame && (
          <p className="text-xl text-center">
            Game over! Your score was: {finalScore}
          </p>
        )}
        {!gameMode && (
          <div className="grid grid-cols-3">
            <button
              className="game-mode"
              onClick={() => gameModeHandler('easy')}
            >
              Easy
            </button>
            <button
              className="game-mode"
              onClick={() => gameModeHandler('medium')}
            >
              Medium
            </button>
            <button
              className="game-mode"
              onClick={() => gameModeHandler('hard')}
            >
              Hard
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 justify-items-center">
          <canvas
            id="game"
            width={isMobile ? 360 : 800}
            height={isMobile ? 400 : 600}
          />
        </div>
      </main>
      <footer className="text-center">
        <p>Copyright ©2021 All rights reserved</p>
      </footer>
    </>
  );
}
