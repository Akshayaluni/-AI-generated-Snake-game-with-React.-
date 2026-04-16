import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const speed = 150; // ms

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, onScoreChange, generateFood]);

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
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const loop = (time: number) => {
      if (time - lastUpdateTimeRef.current > speed) {
        moveSnake();
        lastUpdateTimeRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div 
        className="grid bg-[#080808] border-2 border-neon-green/30 rounded-lg overflow-hidden shadow-[inset_0_0_30px_rgba(0,255,65,0.05)]"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 300px)'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i} 
              className="relative w-full h-full border-[0.5px] border-white/5"
            >
              {isSnakeHead && (
                <motion.div 
                  layoutId="snake-head"
                  className="absolute inset-0.5 bg-neon-green rounded-sm neon-shadow-green z-10"
                />
              )}
              {isSnakeBody && (
                <div className="absolute inset-0.5 bg-neon-green/60 rounded-sm" />
              )}
              {isFood && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute inset-1 bg-neon-pink rounded-full neon-shadow-pink"
                />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {(gameOver || isPaused) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20 rounded-lg"
          >
            {gameOver ? (
              <>
                <h2 className="text-4xl font-bold text-neon-pink neon-text-pink mb-4">GAME OVER</h2>
                <p className="text-xl text-white mb-6">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-8 py-3 bg-neon-green text-black font-bold rounded-full hover:scale-105 transition-transform neon-shadow-green"
                >
                  RETRY
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-neon-green neon-text-green mb-8">PAUSED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-neon-green text-black font-bold rounded-full hover:scale-105 transition-transform neon-shadow-green mb-4"
                >
                  RESUME
                </button>
                <p className="text-sm text-white/50">Press SPACE to toggle pause</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex gap-4 text-xs font-mono text-white/40">
        <span>[ARROW KEYS] MOVE</span>
        <span>[SPACE] PAUSE</span>
      </div>
    </div>
  );
};
