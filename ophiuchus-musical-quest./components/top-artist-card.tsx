import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CelestialIcon } from "@/components/celestial-icon";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface TopArtistCardProps {
  artist?: {
    name: string;
    images: { url: string }[];
    followers?: { total: number };
    popularity?: number;
    genres?: string[];
    external_urls?: { spotify: string };
  };
  className?: string;
}

export function TopArtistCard({ artist, className = "" }: TopArtistCardProps) {
  const [showMore, setShowMore] = useState(false);

  if (!artist) {
    return (
      <Card className={`glassmorphism border-purple-400/30 p-6 relative overflow-hidden ${className}`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CelestialIcon type="sun" className="text-purple-400" />
            </div>
            <div className="text-right">
              <p className="font-poppins text-xs text-purple-300 uppercase tracking-wider">Top Artist</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
              <CelestialIcon type="sun" size="lg" className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-cinzel text-2xl font-bold text-purple-200 mb-1">— — —</h3>
              <p className="font-poppins text-sm text-purple-300">No top artist data</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`glassmorphism border-gold-400/30 p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300 ${className}`}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 opacity-20" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CelestialIcon type="sun" className="text-gold-400" />
            {artist.external_urls?.spotify && (
              <a 
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity duration-200"
              >
                <ExternalLink className="w-4 h-4 text-gold-300" />
              </a>
            )}
          </div>
          <div className="text-right">
            <p className="font-poppins text-xs text-purple-300 uppercase tracking-wider">Top Artist</p>
          </div>
        </div>

        {/* Artist Image and Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center shadow-lg">
            {artist.images?.[0]?.url ? (
              <img 
                src={artist.images[0].url} 
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <CelestialIcon type="sun" size="lg" className="text-gold-400" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-cinzel text-2xl font-bold text-gold-100 glow-text mb-1">
              {artist.name}
            </h3>
            <p className="font-poppins text-sm text-purple-200 mb-2">
              Your cosmic sovereign
            </p>
            
            {artist.followers && (
              <p className="font-poppins text-xs text-purple-300">
                {artist.followers.total.toLocaleString()} followers
              </p>
            )}
            
            {artist.popularity && (
              <div className="mt-2 w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-poppins text-xs text-purple-300">Popularity</span>
                  <span className="font-poppins text-xs text-gold-400">{artist.popularity}%</span>
                </div>
                <div className="w-full h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-gold-400 rounded-full transition-all duration-500"
                    style={{ width: `${artist.popularity}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Genres Section */}
        {artist.genres && artist.genres.length > 0 && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMore(!showMore)}
              className="w-full justify-between text-purple-300 hover:text-purple-100 p-0 h-auto"
            >
              <span className="font-poppins text-sm">
                {showMore ? 'Hide Details' : 'Read More'}
              </span>
              {showMore ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
            
            {showMore && (
              <div className="mt-3 p-3 bg-black/20 rounded-lg border border-purple-400/20">
                <h4 className="font-poppins text-xs text-purple-300 uppercase tracking-wider mb-2">
                  Genres
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artist.genres.slice(0, 5).map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-gold-500/20 text-purple-200 text-xs rounded-full border border-purple-400/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
