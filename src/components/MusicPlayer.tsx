import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "AI Synth",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-cyan)"
  },
  {
    id: 2,
    title: "Cyber City",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-magenta)"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Quantum Rhythms",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "var(--color-neon-lime)"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-lg"
          style={{ boxShadow: `0 0 20px ${currentTrack.color}44` }}
        >
          <Music className="w-8 h-8" style={{ color: currentTrack.color }} />
        </motion.div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="text-lg font-bold text-white truncate">{currentTrack.title}</h3>
          <p className="text-sm text-white/50 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full"
            style={{ 
              width: `${progress}%`,
              backgroundColor: currentTrack.color,
              boxShadow: `0 0 10px ${currentTrack.color}`
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={skipBack}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
              style={{ 
                backgroundColor: currentTrack.color,
                boxShadow: `0 0 15px ${currentTrack.color}`
              }}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>

            <button 
              onClick={skipForward}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-white/40">
            <Volume2 className="w-4 h-4" />
            <div className="w-16 h-1 bg-white/10 rounded-full">
              <div className="w-2/3 h-full bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
