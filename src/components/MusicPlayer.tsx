import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentTrackIndex, onTrackChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleNext = () => {
    onTrackChange((currentTrackIndex + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    onTrackChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="p-4 bg-black text-[#0ff] font-pixel">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="border-2 border-[#0ff] p-4 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#f0f] text-black px-2 py-1 text-xs">ERR_0x99</div>
        <h3 className="text-3xl text-[#f0f] glitch-text truncate" data-text={currentTrack.title}>{currentTrack.title}</h3>
        <p className="text-xl mt-2">AUTHOR: {currentTrack.artist}</p>
      </div>

      <div className="flex justify-between items-center border-2 border-[#f0f] p-2 mb-4">
        <button onClick={handlePrev} className="hover:bg-[#f0f] hover:text-black px-4 py-2 text-xl">{'<<'}</button>
        <button onClick={togglePlay} className="text-2xl hover:bg-[#0ff] hover:text-black px-6 py-2 border-x-2 border-[#0ff]">
          {isPlaying ? 'PAUSE' : 'EXECUTE'}
        </button>
        <button onClick={handleNext} className="hover:bg-[#f0f] hover:text-black px-4 py-2 text-xl">{'>>'}</button>
      </div>

      <div className="border-2 border-[#0ff] p-2">
        <div className="flex justify-between text-lg mb-1">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>{audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}</span>
        </div>
        <div className="h-6 bg-black border-2 border-[#f0f] relative">
          <div className="h-full bg-[#0ff]" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};
