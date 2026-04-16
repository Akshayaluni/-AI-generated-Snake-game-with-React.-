import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "AI Genesis",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-blue)"
  },
  {
    id: 2,
    title: "Crystal Void",
    artist: "Neural Synth",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-magenta)"
  },
  {
    id: 3,
    title: "Midnight Logic",
    artist: "Silicon Dream",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "var(--color-neon-lime)"
  }
];

interface MusicContextType {
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number;
  togglePlay: () => void;
  skipForward: () => void;
  skipBack: () => void;
  setCurrentTrackIndex: (index: number) => void;
}

export const useMusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(DUMMY_TRACKS[currentTrackIndex].url);
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(p || 0);
        }
      };
      audioRef.current.onended = () => skipForward();
    } else {
      audioRef.current.src = DUMMY_TRACKS[currentTrackIndex].url;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const skipForward = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  }, []);

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  return {
    currentTrackIndex,
    isPlaying,
    progress,
    togglePlay,
    skipForward,
    skipBack,
    setCurrentTrackIndex: (idx: number) => {
      setCurrentTrackIndex(idx);
      setIsPlaying(true);
    }
  };
};

export const PlaylistCard: React.FC<{ 
  currentTrackIndex: number; 
  onTrackSelect: (index: number) => void 
}> = ({ currentTrackIndex, onTrackSelect }) => {
  return (
    <div className="bento-card h-full flex flex-col gap-4">
      <span className="card-title">AI Sequence Queue</span>
      <div className="space-y-2 overflow-y-auto">
        {DUMMY_TRACKS.map((track, index) => (
          <button
            key={track.id}
            onClick={() => onTrackSelect(index)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
              currentTrackIndex === index 
                ? 'border-neon-blue bg-neon-blue/5' 
                : 'border-transparent bg-white/2 hover:bg-white/5'
            }`}
          >
            <div className="w-10 h-10 bg-[#222] rounded flex items-center justify-center font-mono text-[10px] text-white/40">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="text-left overflow-hidden">
              <h4 className="text-sm font-medium text-white truncate">{track.title}</h4>
              <p className="text-xs text-white/40 truncate">{track.artist}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const ControlsCard: React.FC<{
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number;
  togglePlay: () => void;
  skipForward: () => void;
  skipBack: () => void;
}> = ({ currentTrackIndex, isPlaying, progress, togglePlay, skipForward, skipBack }) => {
  const track = DUMMY_TRACKS[currentTrackIndex];
  
  return (
    <div className="bento-card flex items-center px-10 gap-12 h-full">
      <div className="w-48 shrink-0">
        <h4 className="text-base font-bold text-white truncate">{track.title}</h4>
        <p className="text-xs text-white/40 truncate">{track.artist} &bull; 2026</p>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-center gap-8">
          <button onClick={skipBack} className="text-white/60 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <button onClick={skipForward} className="text-white/60 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          <div className="h-1 w-full bg-[#222] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-neon-blue shadow-[0_0_10px_var(--color-neon-blue)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[9px] text-white/40">
            <span>00:00</span>
            <span>03:45</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-end gap-1 h-5">
          {[0.4, 0.8, 0.6, 0.9, 0.3, 0.7].map((h, i) => (
            <motion.div 
              key={i}
              animate={{ height: isPlaying ? [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] : `${h*100}%` }}
              transition={{ repeat: Infinity, duration: 0.5 + i * 0.1 }}
              className="w-0.5 bg-neon-blue rounded-full"
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-white/60">VOL 85%</span>
          <div className="w-20 h-0.5 bg-[#333]">
            <div className="w-[85%] h-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
