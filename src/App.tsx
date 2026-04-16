/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { PlaylistCard, ControlsCard, useMusicPlayer } from './components/MusicPlayerComponents';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const music = useMusicPlayer();

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="font-mono font-black text-2xl tracking-tighter text-neon-green neon-text-green">
          SYNTH-SNAKE // 01
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-white/40">
          Latency: 12ms | FPS: 60
        </div>
      </header>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_240px] grid-rows-[1fr_120px] gap-5 flex-grow">
        {/* Column 1: Playlist */}
        <div className="lg:row-span-1">
          <PlaylistCard 
            currentTrackIndex={music.currentTrackIndex} 
            onTrackSelect={music.setCurrentTrackIndex} 
          />
        </div>

        {/* Column 2: Game Viewport */}
        <div className="bento-card flex items-center justify-center bg-[#080808] border-neon-green/40 shadow-[inset_0_0_30px_rgba(0,255,65,0.05)]">
          <SnakeGame onScoreChange={handleScoreChange} />
        </div>

        {/* Column 3: Stats */}
        <div className="bento-card flex flex-col justify-between">
          <div>
            <span className="card-title">Current Score</span>
            <div className="text-5xl font-mono font-black text-neon-green tabular-nums">
              {score.toLocaleString()}
            </div>
            <p className="text-xs text-white/40 mt-1">Multiplier: x1.5</p>
          </div>
          
          <div>
            <span className="card-title">High Score</span>
            <div className="text-2xl font-mono font-black text-white tabular-nums">
              {highScore.toLocaleString()}
            </div>
          </div>

          <div className="flex items-end gap-1 h-10">
            {[0.4, 0.8, 0.6, 0.9, 0.3, 0.7].map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] }}
                transition={{ repeat: Infinity, duration: 1 + i * 0.2 }}
                className="flex-1 bg-neon-green/40 rounded-t-sm"
              />
            ))}
          </div>
        </div>

        {/* Bottom Row: Controls */}
        <div className="lg:col-span-3">
          <ControlsCard 
            currentTrackIndex={music.currentTrackIndex}
            isPlaying={music.isPlaying}
            progress={music.progress}
            togglePlay={music.togglePlay}
            skipForward={music.skipForward}
            skipBack={music.skipBack}
          />
        </div>
      </div>
    </div>
  );
}
