import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'AUDIO_STREAM_0x01.DAT',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 2,
    title: 'CORRUPTED_SECTOR_7.WAV',
    artist: 'SYS_ADMIN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 3,
    title: 'SYSTEM_OVERRIDE.MP3',
    artist: 'GHOST_IN_MACHINE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#FF00FF] p-6 shadow-[-8px_8px_0px_#00FFFF] relative overflow-hidden font-mono">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      <div className="border-b-2 border-[#00FFFF] pb-4 mb-6">
        <h2 className="text-[#00FFFF] text-xl mb-2 glitch" data-text="AUDIO_SUBSYSTEM">AUDIO_SUBSYSTEM</h2>
        <div className="flex justify-between text-sm text-[#FF00FF]">
          <span>STATUS: {isPlaying ? 'ACTIVE' : 'IDLE'}</span>
          <span>VOL: {isMuted ? '000' : Math.round(volume * 100).toString().padStart(3, '0')}</span>
        </div>
      </div>

      <div className="mb-6 bg-[#00FFFF] text-black p-4 border-2 border-white">
        <h3 className="font-bold text-lg truncate uppercase">{currentTrack.title}</h3>
        <p className="text-sm truncate uppercase">SRC: {currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-black border-2 border-[#FF00FF] mb-6 relative">
        <div 
          className="h-full bg-[#FF00FF] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] text-white mix-blend-difference">
          <span>{Math.floor(progress)}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="text-[#00FFFF] hover:text-[#FF00FF] hover:bg-[#00FFFF] px-2 py-1 border border-[#00FFFF] transition-colors"
          >
            {isMuted || volume === 0 ? '[MUTED]' : '[SND_ON]'}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 appearance-none bg-black border border-[#00FFFF] h-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#FF00FF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevTrack} className="text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black px-3 py-2 border border-[#00FFFF] transition-colors">
            {'<<'}
          </button>
          <button 
            onClick={togglePlay} 
            className={`px-4 py-2 border-2 transition-colors font-bold ${isPlaying ? 'bg-[#FF00FF] text-black border-[#FF00FF]' : 'bg-black text-[#FF00FF] border-[#FF00FF] hover:bg-[#FF00FF] hover:text-black'}`}
          >
            {isPlaying ? '||' : '>>'}
          </button>
          <button onClick={nextTrack} className="text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black px-3 py-2 border border-[#00FFFF] transition-colors">
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}
