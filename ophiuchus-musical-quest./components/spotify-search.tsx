"use client"

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Music, User } from 'lucide-react';
import Image from 'next/image';

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface SearchResult {
  id: string;
  name: string;
  artists?: string[];
  album?: string;
  imageUrl?: string;
  spotifyUrl?: string;
  followers?: number;
}

interface SpotifySearchProps {
  type: 'track' | 'artist';
  placeholder?: string;
  onSelect: (result: SearchResult) => void;
  className?: string;
}

export function SpotifySearch({ type, placeholder, onSelect, className = '' }: SpotifySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchSpotify = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      console.log('[SpotifySearch] Searching for:', searchQuery);
      setLoading(true);

      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&type=${type}&limit=10`);
        const data = await response.json();

        if (data.success) {
          console.log('[SpotifySearch] Found', data.results.length, 'results');
          setResults(data.results);
          setShowResults(true);
        }
      } catch (error) {
        console.error('[SpotifySearch] Error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [type]
  );

  useEffect(() => {
    searchSpotify(query);
  }, [query, searchSpotify]);

  const handleSelect = (result: SearchResult) => {
    console.log('[SpotifySearch] Selected:', result.name);
    setQuery(result.name);
    setShowResults(false);
    onSelect(result);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder={placeholder || `Search for ${type}...`}
          className="pl-10 glassmorphism border-purple-400/30 text-purple-100 placeholder-purple-300/50"
        />
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-96 overflow-y-auto glassmorphism border-purple-400/50">
          <div className="p-2">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-500/20 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-md bg-purple-900/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {result.imageUrl ? (
                    <Image
                      src={result.imageUrl}
                      alt={result.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {type === 'track' ? (
                        <Music className="w-6 h-6 text-purple-400" />
                      ) : (
                        <User className="w-6 h-6 text-purple-400" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-poppins text-sm font-medium text-purple-100 truncate">
                    {result.name}
                  </div>
                  {type === 'track' && result.artists && (
                    <div className="font-poppins text-xs text-purple-300 truncate">
                      {result.artists.join(', ')}
                    </div>
                  )}
                  {type === 'artist' && result.followers && (
                    <div className="font-poppins text-xs text-purple-300">
                      {result.followers.toLocaleString()} followers
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
