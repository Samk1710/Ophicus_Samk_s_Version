import React from 'react';

interface SpotifyProgressBarProps {
  progress_ms?: number;
  duration_ms?: number;
  className?: string;
}

export function SpotifyProgressBar({ 
  progress_ms = 0, 
  duration_ms = 100, 
  className = "" 
}: SpotifyProgressBarProps) {
  const progressPercentage = duration_ms > 0 ? (progress_ms / duration_ms) * 100 : 0;
  
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-2 text-xs text-purple-300 ${className}`}>
      <span>{formatTime(progress_ms)}</span>
      <div className="flex-1 h-1 bg-purple-900/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-400 to-gold-400 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <span>{formatTime(duration_ms)}</span>
    </div>
  );
}
