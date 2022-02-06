import * as React from 'react';

import SearchEngineOptimization from '../components/common/SearchEngineOptimization';

import useDarkMode from '../hooks/useDarkMode';

import { getRandomInt } from '../utils';

import grapeImage from '../assets/grape.webp';
import mangoImage from '../assets/mango.webp';
import pineappleImage from '../assets/pineapple.webp';
import strawberryImage from '../assets/strawberry.webp';

type Bricks = { [coordinate: string]: number }[][];

export default function Home(): JSX.Element {
  const darkMode = useDarkMode(false);

  const [difficulty, setDifficulty] = React.useState('');
  const [start, setStart] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  const animationFrame = React.useRef(0);
  const bonus = React.useRef(0);
  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  const ctx = React.useRef<CanvasRenderingContext2D | null>(null);
  const lives = React.useRef(3);
  const score = React.useRef(0);

  // Ball
  const speedX = React.useRef(2);
  const speedY = React.useRef(-2);
  const x = React.useRef(0);
  const y = React.useRef(0);

  // Bricks
  const bricks = React.useRef<Bricks>([]);
  const brickRowCount = React.useRef(4);
  const brickColumnCount = React.useRef(10);
  const brickWidth = React.useRef(65);
  const brickHeight = React.useRef(20);
  const brickPadding = React.useRef(10);
  const brickOffsetTop = React.useRef(50);
  const brickOffsetLeft = React.useRef(30);

  // Characters
  const imageDropDuration = React.useRef(1000);
  const imageUsed = React.useRef<HTMLImageElement | null>(null);
  const imageX = React.useRef(0);
  const imageY = React.useRef(0);
  const imageYSpeed = React.useRef(-2);

  // Paddle
  const leftPressed = React.useRef(false);
  const paddleSpeed = React.useRef(7);
  const paddleX = React.useRef(0);
  const paddleWidth = React.useRef(100);
  const rightPressed = React.useRef(false);

  const grape = React.useRef<HTMLImageElement | null>(null);
  const mango = React.useRef<HTMLImageElement | null>(null);
  const pineapple = React.useRef<HTMLImageElement | null>(null);
  const strawberry = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const mobile = urlParams.get('mobile');
    setIsMobile(mobile === 'true');
  }, []);

  const keyDownHandler = React.useCallback((e: KeyboardEvent) => {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
      rightPressed.current = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
      leftPressed.current = true;
    }
  }, []);

  const keyUpHandler = React.useCallback((e: KeyboardEvent) => {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
      rightPressed.current = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
      leftPressed.current = false;
    }
  }, []);

  const mouseMoveHandler = React.useCallback((e: MouseEvent) => {
    if (canvas.current) {
      const relativeX = e.clientX - canvas.current.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.current.width) {
        paddleX.current = relativeX - paddleWidth.current / 2;
      }
    }
  }, []);

  const touchScreenHandler = React.useCallback((e: TouchEvent) => {
    if (e.touches) {
      paddleX.current = e.touches[0].pageX - paddleWidth.current / 2;
    }
  }, []);

  const removeEventListeners = React.useCallback(() => {
    document.removeEventListener('keydown', keyDownHandler, false);
    document.removeEventListener('keyup', keyUpHandler, false);
    document.removeEventListener('mousemove', mouseMoveHandler, false);
  }, [keyDownHandler, keyUpHandler, mouseMoveHandler]);

  const removeMobileEventListeners = React.useCallback(() => {
    document.removeEventListener('touchstart', touchScreenHandler, false);
    document.removeEventListener('touchmove', touchScreenHandler, false);
  }, [touchScreenHandler]);

  const startGame = React.useCallback(() => {
    bonus.current = 0;
    score.current = 0;
    lives.current = 3;
    setGameOver(false);
    setStart(true);

    if (isMobile) {
      document.addEventListener('touchstart', touchScreenHandler, false);
      document.addEventListener('touchmove', touchScreenHandler, false);
    } else {
      document.addEventListener('keydown', keyDownHandler, false);
      document.addEventListener('keyup', keyUpHandler, false);
      document.addEventListener('mousemove', mouseMoveHandler, false);
    }
  }, [
    isMobile,
    keyDownHandler,
    keyUpHandler,
    mouseMoveHandler,
    touchScreenHandler
  ]);

  const collisionDetection = React.useCallback(() => {
    for (let c = 0; c < brickColumnCount.current; c++) {
      for (let r = 0; r < brickRowCount.current; r++) {
        const b = bricks.current[c][r];
        if (b.status == 1) {
          if (
            x.current > b.x &&
            x.current < b.x + brickWidth.current &&
            y.current > b.y &&
            y.current < b.y + brickHeight.current
          ) {
            speedY.current = -speedY.current;
            b.status = 0;
            score.current++;
          }
        }
      }
    }
  }, []);

  const imageCollisionDetection = React.useCallback(() => {
    if (canvas.current) {
      if (
        imageX.current >= paddleX.current - paddleWidth.current / 2 + 20 &&
        imageX.current <= paddleX.current + paddleWidth.current - 20 &&
        imageY.current > canvas.current.height - 20 &&
        imageY.current <= canvas.current.height
      ) {
        bonus.current += 1;
      }
    }
  }, []);

  const drawBall = React.useCallback(() => {
    if (ctx.current) {
      ctx.current.beginPath();
      ctx.current.arc(x.current, y.current, 10, 0, Math.PI * 2);
      ctx.current.fillStyle = darkMode ? '#fff' : '#000';
      ctx.current.fill();
      ctx.current.closePath();
    }
  }, [darkMode]);

  const drawBonus = React.useCallback(() => {
    if (canvas.current && ctx.current) {
      ctx.current.font = '16px Rubik';
      ctx.current.fillStyle = darkMode ? '#fff' : '#000';
      ctx.current.fillText(
        'Bonus: ' + bonus.current,
        canvas.current.width / 2 - 25,
        20
      );
    }
  }, [darkMode]);

  const drawBricks = React.useCallback(() => {
    for (let c = 0; c < brickColumnCount.current; c++) {
      for (let r = 0; r < brickRowCount.current; r++) {
        if (bricks.current[c][r].status == 1) {
          const brickX =
            c * (brickWidth.current + brickPadding.current) +
            brickOffsetLeft.current;
          const brickY =
            r * (brickHeight.current + brickPadding.current) +
            brickOffsetTop.current;
          bricks.current[c][r].x = brickX;
          bricks.current[c][r].y = brickY;

          if (ctx.current) {
            ctx.current.beginPath();
            ctx.current.rect(
              brickX,
              brickY,
              brickWidth.current,
              brickHeight.current
            );
            ctx.current.fillStyle = darkMode ? '#fff' : '#000';
            ctx.current.fill();
            ctx.current.closePath();
          }
        }
      }
    }
  }, [darkMode]);

  const drawImage = React.useCallback(() => {
    const images = [
      grape.current,
      mango.current,
      pineapple.current,
      strawberry.current
    ];

    if (canvas.current) {
      if (imageY.current > canvas.current.height + imageDropDuration.current) {
        imageUsed.current = images[getRandomInt(4)];
        imageY.current = getRandomInt(-60);
        imageX.current = getRandomInt(canvas.current.width - 40);
      }

      if (imageUsed.current && ctx.current) {
        ctx.current.drawImage(
          imageUsed.current,
          imageX.current,
          imageY.current,
          40,
          60
        );
      }
    }
  }, []);

  const drawLives = React.useCallback(() => {
    if (canvas.current && ctx.current) {
      ctx.current.font = '16px Rubik';
      ctx.current.fillStyle = darkMode ? '#fff' : '#000';
      ctx.current.fillText(
        'Lives: ' + lives.current,
        canvas.current.width - 65,
        20
      );
    }
  }, [darkMode]);

  const drawPaddle = React.useCallback(() => {
    if (canvas.current && ctx.current) {
      ctx.current.beginPath();
      ctx.current.rect(
        paddleX.current,
        canvas.current.height - 10,
        paddleWidth.current,
        10
      );
      ctx.current.fillStyle = darkMode ? '#fff' : '#000';
      ctx.current.fill();
      ctx.current.closePath();
    }
  }, [darkMode]);

  const drawScore = React.useCallback(() => {
    if (ctx.current) {
      ctx.current.font = '16px Rubik';
      ctx.current.fillStyle = darkMode ? '#fff' : '#000';
      ctx.current.fillText('Score: ' + score.current, 8, 20);
    }
  }, [darkMode]);

  const draw = React.useCallback(() => {
    if (canvas.current && ctx.current) {
      ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      drawBonus();
      collisionDetection();

      drawImage();
      imageCollisionDetection();

      imageY.current -= imageYSpeed.current;

      if (score.current === brickRowCount.current * brickColumnCount.current) {
        if (isMobile) {
          removeMobileEventListeners();
        } else {
          removeEventListeners();
        }

        cancelAnimationFrame(animationFrame.current);
        setDifficulty('');
        setGameOver(true);
        setStart(false);

        return;
      }

      if (
        x.current + speedX.current > canvas.current.width - 10 ||
        x.current + speedX.current < 10
      )
        speedX.current = -speedX.current;

      if (y.current + speedY.current < 10) {
        speedY.current = -speedY.current;
      } else if (y.current + speedY.current > canvas.current.height - 10) {
        if (
          x.current > paddleX.current &&
          x.current < paddleX.current + paddleWidth.current
        ) {
          if ((y.current = y.current - 10)) speedY.current = -speedY.current;
        } else {
          lives.current--;
          if (!lives.current) {
            if (isMobile) {
              removeMobileEventListeners();
            } else {
              removeEventListeners();
            }

            cancelAnimationFrame(animationFrame.current);
            setDifficulty('');
            setGameOver(true);
            setStart(false);

            return;
          } else {
            x.current = canvas.current.width / 2;
            y.current = canvas.current.height - 30;
            paddleX.current = (canvas.current.width - paddleWidth.current) / 2;
          }
        }
      }

      if (
        rightPressed.current &&
        paddleX.current < canvas.current.width - paddleWidth.current
      ) {
        paddleX.current += paddleSpeed.current;
      } else if (leftPressed.current && paddleX.current > 0) {
        paddleX.current -= paddleSpeed.current;
      }

      x.current += speedX.current;
      y.current += speedY.current;
    }

    animationFrame.current = requestAnimationFrame(draw);
  }, [
    collisionDetection,
    drawBall,
    drawBonus,
    drawBricks,
    drawImage,
    drawLives,
    drawPaddle,
    drawScore,
    imageCollisionDetection,
    isMobile,
    removeEventListeners,
    removeMobileEventListeners
  ]);

  if (difficulty && start) {
    if (canvas.current) {
      ctx.current = canvas.current.getContext('2d');

      if (ctx.current) {
        x.current = canvas.current.width / 2;
        y.current = canvas.current.height - 30;

        paddleX.current = (canvas.current.width - paddleWidth.current) / 2;

        if (difficulty === 'easy') {
          speedX.current = 2;
          speedY.current = -2;

          imageDropDuration.current = 3000;

          paddleSpeed.current = 7;
          paddleWidth.current = 100;

          brickRowCount.current = 4;
          brickColumnCount.current = 10;
          brickWidth.current = 65;
          brickHeight.current = 20;
          brickPadding.current = 10;
          brickOffsetTop.current = 50;
          brickOffsetLeft.current = 30;
        }

        if (difficulty === 'medium') {
          speedX.current = 3;
          speedY.current = -3;

          imageDropDuration.current = 4000;

          paddleSpeed.current = 10;
          paddleWidth.current = 85;
          paddleX.current = 10;

          brickRowCount.current = 6;
          brickColumnCount.current = 12;
          brickWidth.current = 50;
          brickHeight.current = 20;
          brickPadding.current = 15;
          brickOffsetTop.current = 50;
          brickOffsetLeft.current = 20;
        }

        if (difficulty === 'hard') {
          speedX.current = 4;
          speedY.current = -4;

          imageDropDuration.current = 6000;

          paddleSpeed.current = 12;
          paddleWidth.current = 75;

          brickRowCount.current = 8;
          brickColumnCount.current = 12;
          brickWidth.current = 50;
          brickHeight.current = 20;
          brickPadding.current = 15;
          brickOffsetTop.current = 50;
          brickOffsetLeft.current = 20;
        }

        if (isMobile) {
          brickColumnCount.current = 6;
          brickWidth.current = 40;

          if (difficulty === 'hard') {
            brickRowCount.current = 6;
          }
        }

        for (let c = 0; c < brickColumnCount.current; c++) {
          bricks.current[c] = [];
          for (let r = 0; r < brickRowCount.current; r++) {
            bricks.current[c][r] = { x: 0, y: 0, status: 1 };
          }
        }

        draw();
      }
    }
  }

  return (
    <>
      <SearchEngineOptimization title="Home" difficulty={difficulty} />
      <main className="grid grid-cols-1">
        {gameOver && (
          <p className="text-xl text-center">
            Game over! Your score was: {score.current + bonus.current}
          </p>
        )}
        {!difficulty ? (
          <>
            <p className="text-xl text-center">Choose a difficulty level...</p>
            <div className="grid grid-cols-3">
              <button
                type="button"
                className="game-mode"
                onClick={() => setDifficulty('easy')}
              >
                Easy
              </button>
              <button
                type="button"
                className="game-mode"
                onClick={() => setDifficulty('medium')}
              >
                Medium
              </button>
              <button
                type="button"
                className="game-mode"
                onClick={() => setDifficulty('hard')}
              >
                Hard
              </button>
            </div>
          </>
        ) : (
          <>
            {!start && (
              <button
                type="button"
                className="game-mode w-60 mx-auto"
                onClick={startGame}
              >
                Start Game
              </button>
            )}
            <div className="grid grid-cols-4 justify-items-center">
              <img ref={grape} src={grapeImage} alt="" width={40} height={65} />
              <img ref={mango} src={mangoImage} alt="" width={40} height={65} />
              <img
                ref={pineapple}
                src={pineappleImage}
                alt=""
                width={40}
                height={65}
              />
              <img
                ref={strawberry}
                src={strawberryImage}
                alt=""
                width={40}
                height={65}
              />
            </div>
            <div className="grid grid-cols-1 justify-items-center">
              <canvas
                ref={canvas}
                width={isMobile ? 360 : 800}
                height={isMobile ? 400 : 600}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
}
