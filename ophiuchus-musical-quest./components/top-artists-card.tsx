import React from 'react';
import { Card } from "@/components/ui/card";
import { CelestialIcon } from "@/components/celestial-icon";
import { Music, ExternalLink, Users } from "lucide-react";

interface TopArtistsCardProps {
  artists?: Array<{
    name: string;
    images: { url: string }[];
    followers?: { total: number };
    popularity?: number;
    external_urls?: { spotify: string };
  }>;
  loading?: boolean;
  className?: string;
}

export function TopArtistsCard({ artists, loading = false, className = "" }: TopArtistsCardProps) {
  if (loading) {
    return (
      <Card className={`glassmorphism border-gold-400/30 p-8 max-w-4xl w-full ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <CelestialIcon type="constellation" className="text-gold-400" />
          <h2 className="font-cinzel text-2xl font-bold text-gold-100">Top Cosmic Artists</h2>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-purple-400/20"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30" />
              <div className="flex-1">
                <div className="h-4 bg-purple-600/30 rounded mb-2 w-3/4" />
                <div className="h-3 bg-purple-600/20 rounded w-1/2" />
              </div>
              <div className="text-right">
                <div className="h-4 bg-gold-600/30 rounded w-8" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!artists || artists.length === 0) {
    return (
      <Card className={`glassmorphism border-purple-400/30 p-8 max-w-4xl w-full ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <CelestialIcon type="constellation" className="text-purple-400" />
          <h2 className="font-cinzel text-2xl font-bold text-purple-200">Top Cosmic Artists</h2>
        </div>
        <div className="text-center py-8">
          <CelestialIcon type="sun" size="lg" className="text-purple-400 mx-auto mb-4" />
          <p className="font-poppins text-purple-300">— — — No top artists available — — —</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`glassmorphism border-gold-400/30 p-8 max-w-4xl w-full ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <CelestialIcon type="constellation" className="text-gold-400" />
        <h2 className="font-cinzel text-2xl font-bold text-gold-100">Top Cosmic Artists</h2>
      </div>

      <div className="space-y-4">
        {artists.slice(0, 5).map((artist, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-purple-400/20 hover:border-gold-400/30 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
              {artist.images?.[0]?.url ? (
                <img 
                  src={artist.images[0].url} 
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-6 h-6 text-gold-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-poppins text-sm font-medium text-gold-100 truncate">
                  {artist.name}
                </p>
                {artist.external_urls?.spotify && (
                  <a 
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ExternalLink className="w-3 h-3 text-purple-300 hover:text-gold-300" />
                  </a>
                )}
              </div>
              
              <div className="flex items-center gap-3 mt-1">
                {artist.followers && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-400" />
                    <span className="font-poppins text-xs text-purple-300">
                      {artist.followers.total.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {artist.popularity && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-purple-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-gold-400 rounded-full transition-all duration-500"
                        style={{ width: `${artist.popularity}%` }}
                      />
                    </div>
                    <span className="font-poppins text-xs text-purple-300">{artist.popularity}%</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <span className="font-cinzel text-lg font-bold text-gold-400">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
