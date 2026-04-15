import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { TRACKS } from './constants';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#0ff] font-pixel flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-[#f0f] selection:text-black">
      <div className="static-overlay"></div>
      <div className="scanline"></div>

      <header className="mb-8 text-center tear-effect z-10 mt-10">
        <h1 className="text-6xl glitch-text font-bold tracking-widest" data-text="NEON_RHYTHM.EXE">
          NEON_RHYTHM.EXE
        </h1>
        <p className="text-[#f0f] mt-2 text-xl tracking-[0.5em]">SYSTEM_COMPROMISED</p>
      </header>

      <main className="relative z-10 flex flex-col lg:flex-row gap-12 w-full max-w-5xl items-center justify-center tear-effect">
        <div className="border-4 border-[#0ff] p-1 bg-black shadow-[8px_8px_0px_#f0f]">
          <SnakeGame accentColor="#0ff" />
        </div>

        <div className="border-4 border-[#f0f] p-1 bg-black shadow-[-8px_8px_0px_#0ff] flex flex-col w-full max-w-md">
          <MusicPlayer 
            currentTrackIndex={currentTrackIndex} 
            onTrackChange={setCurrentTrackIndex} 
          />
          
          <div className="mt-4 border-t-4 border-[#0ff] pt-4 p-4">
            <h4 className="text-[#f0f] text-xl mb-4 glitch-text" data-text="AUDIO_QUEUE">AUDIO_QUEUE</h4>
            <div className="space-y-2">
              {TRACKS.map((track, index) => {
                const isActive = index === currentTrackIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => setCurrentTrackIndex(index)}
                    className={`w-full text-left p-2 border-2 transition-all flex justify-between items-center ${
                      isActive ? 'border-[#0ff] bg-[#0ff] text-black' : 'border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-black'
                    }`}
                  >
                    <span className="text-lg">{track.title}</span>
                    <span className="text-sm">{isActive ? '[PLAYING]' : '[IDLE]'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
