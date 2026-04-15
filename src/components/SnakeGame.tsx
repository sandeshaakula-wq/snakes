import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

interface SnakeGameProps {
  accentColor: string;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ accentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setStatus(GameStatus.PLAYING);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (status === GameStatus.PLAYING) setStatus(GameStatus.PAUSED);
          else if (status === GameStatus.PAUSED) setStatus(GameStatus.PLAYING);
          else if (status === GameStatus.IDLE || status === GameStatus.GAME_OVER) resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  useEffect(() => {
    if (status !== GameStatus.PLAYING) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setStatus(GameStatus.GAME_OVER);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [status, direction, food, generateFood]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#f0f';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    ctx.fillStyle = '#f0f';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#fff' : '#0ff';
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });

  }, [snake, food, accentColor]);

  return (
    <div className="p-4 bg-black flex flex-col items-center relative">
      <div className="w-full flex justify-between mb-4 text-2xl border-b-4 border-[#f0f] pb-2">
        <div>SCORE: <span className="text-[#f0f]">{score.toString().padStart(4, '0')}</span></div>
        <div>HI: <span className="text-[#0ff]">{highScore.toString().padStart(4, '0')}</span></div>
      </div>

      <div className="relative border-4 border-[#0ff]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black block"
        />
        
        {status !== GameStatus.PLAYING && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center border-4 border-[#f0f] m-2">
            {status === GameStatus.IDLE && (
              <div className="text-center">
                <h2 className="text-4xl text-[#f0f] glitch-text mb-4" data-text="SNAKE.EXE">SNAKE.EXE</h2>
                <p className="text-[#0ff] text-xl mb-6">PRESS SPACE TO INIT</p>
                <button onClick={resetGame} className="border-2 border-[#0ff] px-6 py-2 text-2xl hover:bg-[#0ff] hover:text-black">
                  EXECUTE
                </button>
              </div>
            )}

            {status === GameStatus.PAUSED && (
              <div className="text-center">
                <h2 className="text-4xl text-[#0ff] glitch-text mb-4" data-text="PAUSED">PAUSED</h2>
                <button onClick={() => setStatus(GameStatus.PLAYING)} className="border-2 border-[#f0f] px-6 py-2 text-2xl hover:bg-[#f0f] hover:text-black">
                  RESUME
                </button>
              </div>
            )}

            {status === GameStatus.GAME_OVER && (
              <div className="text-center">
                <h2 className="text-4xl text-red-500 glitch-text mb-4" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                <p className="text-[#0ff] text-xl mb-6">FINAL_SCORE: {score}</p>
                <button onClick={resetGame} className="border-2 border-red-500 px-6 py-2 text-2xl hover:bg-red-500 hover:text-black text-red-500">
                  REBOOT
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-8 text-lg text-[#f0f]">
        <div>[ARROWS] = NAVIGATE</div>
        <div>[SPACE] = HALT</div>
      </div>
    </div>
  );
};
