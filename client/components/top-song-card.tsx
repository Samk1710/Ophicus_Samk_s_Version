import React from 'react';
import { Card } from "@/components/ui/card";
import { CelestialIcon } from "@/components/celestial-icon";
import { Music, ExternalLink } from "lucide-react";

interface TopSongCardProps {
  track?: {
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
      name: string;
    };
    popularity: number;
    external_urls?: { spotify: string };
  };
  rank: number;
  className?: string;
}

export function TopSongCard({ track, rank, className = "" }: TopSongCardProps) {
  if (!track) {
    return (
      <Card className={`glassmorphism border-purple-400/30 p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
            <CelestialIcon type="planet" size="sm" className="text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="font-poppins text-sm font-medium text-purple-300">— — —</p>
            <p className="font-poppins text-xs text-purple-400">— — —</p>
          </div>
          <div className="text-right">
            <span className="font-cinzel text-lg font-bold text-gold-400">#{rank}</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`glassmorphism border-gold-400/30 p-4 hover:border-gold-300/50 transition-all duration-300 group ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
          {track.album?.images?.[0]?.url ? (
            <img 
              src={track.album.images[0].url} 
              alt={`${track.album.name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="w-6 h-6 text-gold-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-poppins text-sm font-medium text-gold-100 truncate">
              {track.name}
            </p>
            {track.external_urls?.spotify && (
              <a 
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ExternalLink className="w-3 h-3 text-purple-300 hover:text-gold-300" />
              </a>
            )}
          </div>
          <p className="font-poppins text-xs text-purple-300 truncate">
            {track.artists.map(artist => artist.name).join(", ")}
          </p>
          
          {/* Popularity bar */}
          <div className="mt-1 w-full h-1 bg-purple-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-gold-400 rounded-full transition-all duration-500"
              style={{ width: `${track.popularity}%` }}
            />
          </div>
        </div>
        
        <div className="text-right">
          <span className="font-cinzel text-lg font-bold text-gold-400">#{rank}</span>
          <p className="font-poppins text-xs text-purple-300">{track.popularity}% pop</p>
        </div>
      </div>
    </Card>
  );
}
