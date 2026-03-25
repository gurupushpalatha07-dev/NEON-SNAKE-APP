import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    onScoreUpdate(0);
    setGameOver(false);
    setIsPaused(false);
    setFood({ x: 15, y: 15 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      if (gameOver) return;

      const { x, y } = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
          if (y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            onScoreUpdate(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(directionRef.current);
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, food, generateFood, onScoreUpdate]);

  return (
    <div className="relative w-full max-w-[500px] aspect-square bg-black border-4 border-[#00FFFF] shadow-[8px_8px_0px_#FF00FF] overflow-hidden flex-shrink-0">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 grid opacity-20"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div key={i} className="border border-[#00FFFF]"></div>
        ))}
      </div>

      {/* Game Grid */}
      <div 
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`bg-[#00FFFF] ${index === 0 ? 'bg-white' : ''}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}
        
        {/* Food */}
        <div
          className="bg-[#FF00FF] animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />
      </div>

      {/* Overlays */}
      {(isPaused || gameOver) && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-8 border-[#FF00FF] m-4">
          {gameOver ? (
            <div className="text-center p-6">
              <h2 className="text-5xl font-mono glitch text-[#FF00FF] mb-4" data-text="SYS.HALT">SYS.HALT</h2>
              <p className="text-[#00FFFF] mb-8 text-2xl font-mono">YIELD: {score}</p>
              <button
                onClick={resetGame}
                className="mx-auto block px-6 py-3 bg-[#FF00FF] text-black hover:bg-[#00FFFF] transition-colors font-mono text-xl uppercase border-2 border-white"
              >
                [ REBOOT_SEQ ]
              </button>
            </div>
          ) : (
            <div className="text-center p-6">
              <h2 className="text-4xl font-mono glitch text-[#00FFFF] mb-8" data-text="AWAITING_INPUT">AWAITING_INPUT</h2>
              <button
                onClick={() => setIsPaused(false)}
                className="mx-auto block px-8 py-4 bg-[#00FFFF] text-black hover:bg-[#FF00FF] transition-colors font-mono text-2xl uppercase border-2 border-white"
              >
                [ EXECUTE ]
              </button>
              <p className="text-[#FF00FF] mt-8 text-lg font-mono uppercase">ARROWS: NAVIGATE<br/>SPACE: INTERRUPT</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
