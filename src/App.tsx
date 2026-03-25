/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00FFFF] font-sans overflow-hidden flex flex-col relative selection:bg-[#FF00FF] selection:text-black">
      <div className="static-noise"></div>
      <div className="crt-line"></div>
      
      {/* Header */}
      <header className="w-full p-6 flex items-center justify-between relative z-10 border-b-4 border-[#FF00FF]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#00FFFF] animate-pulse"></div>
          <h1 className="text-4xl font-mono glitch text-[#00FFFF]" data-text="SYS.PROTOCOL_SNAKE">
            SYS.PROTOCOL_SNAKE
          </h1>
        </div>
        
        <div className="border-2 border-[#00FFFF] px-4 py-2 bg-black flex items-center gap-4">
          <span className="text-[#FF00FF] font-mono text-sm">DATA_YIELD:</span>
          <span className="text-3xl font-mono text-[#00FFFF]">{score.toString().padStart(4, '0')}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-8 relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Game Area */}
        <div className="flex-1 w-full flex justify-center items-center screen-tear">
          <SnakeGame onScoreUpdate={setScore} />
        </div>

        {/* Music Player Area */}
        <div className="w-full lg:w-auto flex justify-center items-center">
          <MusicPlayer />
        </div>

      </main>
    </div>
  );
}
