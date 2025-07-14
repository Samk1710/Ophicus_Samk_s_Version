import React from 'react';

interface ListeningGraphProps {
  data?: Array<{ hour: number; minutes: number }>;
  className?: string;
}

export function ListeningGraph({ data, className = "" }: ListeningGraphProps) {
  // Generate mock hourly listening data if no real data provided
  const defaultData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    minutes: Math.floor(Math.random() * 60) + 10
  }));

  const chartData = data || defaultData;
  const maxMinutes = Math.max(...chartData.map(d => d.minutes));

  return (
    <div className={`w-full h-16 flex items-end gap-1 ${className}`}>
      {chartData.map((item, index) => {
        const height = (item.minutes / maxMinutes) * 100;
        const isCurrentHour = new Date().getHours() === item.hour;
        
        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center group relative"
          >
            <div
              className={`w-full rounded-t transition-all duration-300 ${
                isCurrentHour 
                  ? 'bg-gradient-to-t from-gold-500 to-gold-300' 
                  : 'bg-gradient-to-t from-purple-600 to-purple-400'
              } group-hover:from-gold-500 group-hover:to-gold-300`}
              style={{ height: `${Math.max(height, 5)}%` }}
            />
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {item.hour}:00 - {item.minutes}m
            </div>
          </div>
        );
      })}
    </div>
  );
}
