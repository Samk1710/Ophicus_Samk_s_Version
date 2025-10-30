"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { CosmicBackground } from "@/components/cosmic-background"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpotifyProgressBar } from "@/components/spotify-progress-bar"
import { SkeletonStatsCard, SkeletonCurrentTrack, SkeletonRecentTracks } from "@/components/skeleton-components"
import { TopSongCard } from "@/components/top-song-card"
import { TopArtistCard } from "@/components/top-artist-card"
import { TopArtistsCard } from "@/components/top-artists-card"
import { useSpotifyUserData } from "@/hooks/useSpotifyUserData"
import { useRouter } from "next/navigation"
import {
  Music,
  TrendingUp,
  Headphones,
  Zap,
  Globe,
  Sparkles,
} from "lucide-react"
import { CosmicLoading } from "@/components/cosmic-loading"

export default function HomePage() {
  const { data: session } = useSession()
  const { userData, loading, error } = useSpotifyUserData()
  const router = useRouter()

  // Auto-refresh data every 30 seconds when a track is playing
  useEffect(() => {
    if (userData?.currentTrack?.is_playing) {
      const interval = setInterval(() => {
        // Force a re-render to get fresh data
        window.dispatchEvent(new Event('spotify-refresh'));
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userData?.currentTrack?.is_playing]);

  // Show loading screen while fetching initial data for logged-in users
  if (session && loading && !userData) {
    return <CosmicLoading />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />

      {/* Earth from Space Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <Globe className="w-96 h-96 text-blue-400 animate-spin" style={{ animationDuration: "60s" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <CelestialIcon type="eye" size="xl" className="text-gold-400 mr-4" />
              <h1 className="font-cinzel text-5xl font-bold text-gold-100 glow-text">Your Cosmic Realm</h1>
              <CelestialIcon type="mystical" size="xl" className="text-gold-400 ml-4" />
            </div>
            <p className="font-cormorant text-xl text-purple-200 max-w-2xl mx-auto">
              Behold your musical constellation, woven through the fabric of space and time
            </p>
            
            {error && (
              <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg max-w-md mx-auto">
                <p className="font-poppins text-red-300 text-sm text-center">
                  {error} - Showing default cosmic data
                </p>
              </div>
            )}
            
            {!session && (
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg max-w-md mx-auto">
                <p className="font-poppins text-blue-300 text-sm text-center">
                  Connect your Spotify account to see your personalized cosmic realm
                </p>
              </div>
            )}
          </div>

          {/* Quest CTA */}
          <div className="flex justify-center mb-12">
            <Card className="glassmorphism border-purple-400/30 p-8 max-w-md">
              <div className="mb-6">
                <CelestialIcon type="eye" size="xl" className="text-purple-400 mx-auto mb-4" />
                <h3 className="font-cinzel text-2xl font-bold text-purple-400 mb-2 text-center">Embark on Your Quest</h3>
                <p className="font-poppins text-purple-200 text-sm text-center">

                    "Discover your cosmic song through the celestial chambers"
                  
                </p>
              </div>

              {session ? (
                <Button onClick={() => router.push('/astral-nexus')} className="mystical-button w-full">
                  <Sparkles className="w-5 h-5 mr-3" />
                  Enter Astral Nexus
                  <CelestialIcon type="mystical" size="sm" className="ml-3" />
                </Button>
              ) : (
                <Button onClick={() => router.push('/login')} className="mystical-button w-full">
                  <Music className="w-5 h-5 mr-3" />
                  Connect Spotify
                  <CelestialIcon type="mystical" size="sm" className="ml-3" />
                </Button>
              )}
            </Card>
          </div>

          {/* Current/Last Playing Track */}
          <div className="flex justify-center mb-12">
            {loading ? (
              <SkeletonCurrentTrack />
            ) : userData?.currentTrack ? (
              <Card className="glassmorphism border-gold-400/30 p-6 max-w-2xl w-full">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center overflow-hidden">
                    {userData.currentTrack.album?.images?.[0]?.url ? (
                      <img 
                        src={userData.currentTrack.album.images[0].url} 
                        alt="Album cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CelestialIcon type="sun" size="lg" className="text-gold-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-cormorant text-xl font-bold text-gold-100">
                        {userData.currentTrack.name}
                      </h3>
                      {userData.currentTrack.is_playing && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-3 bg-green-400 animate-pulse"></div>
                          <div className="w-1 h-2 bg-green-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-4 bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      )}
                    </div>
                    <p className="font-poppins text-purple-200 mb-2">
                      {userData.currentTrack.artists.map((artist: any) => artist.name).join(", ")}
                    </p>
                    
                    {/* Progress bar for currently playing tracks */}
                    {userData.currentTrack.is_playing && 'progress_ms' in userData.currentTrack && 'duration_ms' in userData.currentTrack && (
                      <SpotifyProgressBar
                        progress_ms={userData.currentTrack.progress_ms}
                        duration_ms={userData.currentTrack.duration_ms}
                        className="mb-3"
                      />
                    )}
                    
                    {/* Show when track was played if not currently playing */}
                    {!userData.currentTrack.is_playing && userData.currentTrack.played_at && (
                      <p className="font-poppins text-xs text-purple-400">
                        Last played: {new Date(userData.currentTrack.played_at).toLocaleString()}
                      </p>
                    )}
                    
                    <p className="font-poppins text-sm text-purple-300 mt-2">
                      {userData.currentTrack.is_playing ? "Now Playing" : "Last Played"} • {userData.currentTrack.album.name}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="glassmorphism border-purple-400/30 p-6 max-w-2xl w-full">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                    <CelestialIcon type="sun" size="lg" className="text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-cormorant text-xl font-bold text-purple-200 mb-1">— — —</h3>
                    <p className="font-poppins text-purple-300 mb-2">No music activity found</p>
                    <p className="font-poppins text-sm text-purple-400">Start playing music on Spotify</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Stats Grid - Modern Bento Style */}
          <div className="mb-12 flex justify-center">
            <div className="w-full max-w-7xl">
              {/* Section Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <CelestialIcon type="constellation" size="md" className="text-gold-400 mr-3" />
                  <h2 className="font-cinzel text-3xl font-bold text-gold-100">Your Cosmic Statistics</h2>
                  <CelestialIcon type="constellation" size="md" className="text-gold-400 ml-3" />
                </div>
                <p className="font-cormorant text-lg text-purple-200">
                  Witness the celestial patterns of your musical journey
                </p>
              </div>

              {/* Desktop Grid - 2x2 Bento Style */}
              <div className="hidden md:grid grid-cols-2 gap-6">
                {loading ? (
                  <>
                    <div className="row-span-2">
                      <TopArtistCard />
                    </div>
                    <div className="row-span-2">
                      <SkeletonStatsCard size="lg" />
                    </div>
                    <div className="col-span-2">
                      <div className="grid grid-cols-3 gap-4">
                        <SkeletonStatsCard size="md" />
                        <SkeletonStatsCard size="md" />
                        <SkeletonStatsCard size="md" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Top Artist Card - Left side, full height */}
                    <div className="row-span-2">
                      <TopArtistCard artist={userData?.topArtist || undefined} />
                    </div>
                    
                    {/* Top Track Card - Right top, full height */}
                    <div className="row-span-2">
                      <Card className="glassmorphism border-gold-400/30 p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 h-full flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="relative z-10 h-full flex flex-col">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                              <Music className="w-5 h-5 text-purple-400" />
                              <h3 className="font-cinzel text-xl font-bold text-gold-100">Top Cosmic Track</h3>
                            </div>
                            <CelestialIcon type="sun" size="sm" className="text-gold-400" />
                          </div>
                          {userData?.topTracks && userData.topTracks.length > 0 ? (
                            <div className="flex-1 flex flex-col justify-center gap-6">
                              <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center shadow-2xl">
                                {userData.topTracks[0].album?.images?.[0]?.url ? (
                                  <img 
                                    src={userData.topTracks[0].album.images[0].url} 
                                    alt={`${userData.topTracks[0].album.name} cover`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <CelestialIcon type="sun" size="xl" className="text-purple-400" />
                                )}
                              </div>
                              <div className="text-center">
                                <h4 className="font-cinzel text-2xl font-bold text-gold-100 mb-2">
                                  {userData.topTracks[0].name}
                                </h4>
                                <p className="font-poppins text-lg text-purple-300 mb-2">
                                  {userData.topTracks[0].artists.map((artist: any) => artist.name).join(", ")}
                                </p>
                                <p className="font-poppins text-sm text-purple-400">Your most played anthem</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-center">
                              <div className="text-center">
                                <p className="font-cinzel text-2xl font-bold text-gold-100 mb-2">— — —</p>
                                <p className="font-poppins text-lg text-purple-300">No top track available</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>

                    {/* Bottom Row - Three stat cards */}
                    <div className="col-span-2">
                      <div className="grid grid-cols-3 gap-4">
                        {/* Top Genre */}
                        <Card className="glassmorphism border-gold-400/30 p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-teal-600/20 opacity-60" />
                          <div className="relative z-10 text-center">
                            <div className="flex items-center justify-center mb-3">
                              <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <h4 className="font-poppins text-xs text-purple-300 mb-2">Top Genre</h4>
                            <p className="font-cinzel text-xl font-bold text-gold-100 mb-2 truncate">
                              {userData?.topGenre || "— — —"}
                            </p>
                            <CelestialIcon type="mystical" size="sm" className="text-gold-400 mx-auto" />
                          </div>
                        </Card>

                        {/* Tracks Played */}
                        <Card className="glassmorphism border-gold-400/30 p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20 opacity-60" />
                          <div className="relative z-10 text-center">
                            <div className="flex items-center justify-center mb-3">
                              <Headphones className="w-5 h-5 text-orange-400" />
                            </div>
                            <h4 className="font-poppins text-xs text-purple-300 mb-2">Tracks Played</h4>
                            <p className="font-cinzel text-2xl font-bold text-gold-100 mb-2">
                              {userData?.tracksPlayed ? userData.tracksPlayed.toString() : "— — —"}
                            </p>
                            <CelestialIcon type="constellation" size="sm" className="text-gold-400 mx-auto" />
                          </div>
                        </Card>

                        {/* Discovery Score */}
                        <Card className="glassmorphism border-gold-400/30 p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 opacity-60" />
                          <div className="relative z-10 text-center">
                            <div className="flex items-center justify-center mb-3">
                              <Zap className="w-5 h-5 text-yellow-400" />
                            </div>
                            <h4 className="font-poppins text-xs text-purple-300 mb-2">Discovery</h4>
                            <p className="font-cinzel text-xl font-bold text-gold-100 mb-2">
                              {userData?.discoveryScore ? `${userData.discoveryScore}%` : "— —"}
                            </p>
                            <CelestialIcon type="eye" size="sm" className="text-gold-400 mx-auto" />
                          </div>
                        </Card>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Grid */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {loading ? (
                  <>
                    <TopArtistCard />
                    <SkeletonStatsCard size="lg" />
                    <div className="grid grid-cols-2 gap-4">
                      <SkeletonStatsCard size="md" />
                      <SkeletonStatsCard size="md" />
                    </div>
                    <SkeletonStatsCard size="md" />
                  </>
                ) : (
                  <>
                    {/* Top Artist Card - Mobile */}
                    <TopArtistCard artist={userData?.topArtist || undefined} />
                    
                    {/* Top Track Card - Mobile */}
                    <Card className="glassmorphism border-gold-400/30 p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-60" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Music className="w-5 h-5 text-purple-400" />
                            <h3 className="font-cinzel text-lg font-bold text-gold-100">Top Cosmic Track</h3>
                          </div>
                          <CelestialIcon type="sun" size="sm" className="text-gold-400" />
                        </div>
                        {userData?.topTracks && userData.topTracks.length > 0 ? (
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                              {userData.topTracks[0].album?.images?.[0]?.url ? (
                                <img 
                                  src={userData.topTracks[0].album.images[0].url} 
                                  alt={`${userData.topTracks[0].album.name} cover`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <CelestialIcon type="sun" size="sm" className="text-purple-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-cinzel text-lg font-bold text-gold-100 truncate">
                                {userData.topTracks[0].name}
                              </p>
                              <p className="font-poppins text-sm text-purple-300 truncate">
                                {userData.topTracks[0].artists.map((artist: any) => artist.name).join(", ")}
                              </p>
                              <p className="font-poppins text-xs text-purple-400">Your most played anthem</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="font-cinzel text-lg font-bold text-gold-100">— — —</p>
                            <p className="font-poppins text-sm text-purple-300">No top track available</p>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Stats Row - Mobile */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="glassmorphism border-gold-400/30 p-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-teal-600/20 opacity-60" />
                        <div className="relative z-10 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                            <h4 className="font-poppins text-xs text-purple-300">Top Genre</h4>
                          </div>
                          <p className="font-cinzel text-lg font-bold text-gold-100 mb-1 truncate">
                            {userData?.topGenre || "— — —"}
                          </p>
                          <CelestialIcon type="mystical" size="sm" className="text-gold-400 mx-auto" />
                        </div>
                      </Card>

                      <Card className="glassmorphism border-gold-400/30 p-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 opacity-60" />
                        <div className="relative z-10 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                            <h4 className="font-poppins text-xs text-purple-300">Discovery</h4>
                          </div>
                          <p className="font-cinzel text-lg font-bold text-gold-100 mb-1">
                            {userData?.discoveryScore ? `${userData.discoveryScore}%` : "— —"}
                          </p>
                          <CelestialIcon type="eye" size="sm" className="text-gold-400 mx-auto" />
                        </div>
                      </Card>
                    </div>

                    {/* Tracks Played - Mobile */}
                    <Card className="glassmorphism border-gold-400/30 p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20 opacity-60" />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Headphones className="w-5 h-5 text-orange-400" />
                          <div>
                            <h4 className="font-poppins text-xs text-purple-300 mb-1">Tracks Played</h4>
                            <p className="font-cinzel text-xl font-bold text-gold-100">
                              {userData?.tracksPlayed ? userData.tracksPlayed.toString() : "— — —"}
                            </p>
                            <p className="font-poppins text-xs text-purple-400">This month</p>
                          </div>
                        </div>
                        <CelestialIcon type="constellation" size="sm" className="text-gold-400" />
                      </div>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Top Songs and Artists Section */}
          <div className="mb-12 flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl w-full">
              {/* Top Songs */}
              <Card className="glassmorphism border-gold-400/30 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CelestialIcon type="sun" className="text-gold-400" />
                  <h2 className="font-cinzel text-2xl font-bold text-gold-100">Top Cosmic Anthems</h2>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TopSongCard key={index} rank={index + 1} />
                    ))}
                  </div>
                ) : userData?.topTracks && userData.topTracks.length > 0 ? (
                  <div className="space-y-4">
                    {userData.topTracks.slice(0, 5).map((track, index) => (
                      <TopSongCard key={index} track={track} rank={index + 1} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CelestialIcon type="planet" size="lg" className="text-purple-400 mx-auto mb-4" />
                    <p className="font-poppins text-purple-300">— — — No top tracks available — — —</p>
                  </div>
                )}
              </Card>

              {/* Top Artists */}
              <TopArtistsCard 
                artists={userData?.topArtists}
                loading={loading}
              />
            </div>
          </div>

          {/* Recent Tracks */}
          <div className="flex justify-center">
            {loading ? (
              <SkeletonRecentTracks />
            ) : userData?.recentTracks && userData.recentTracks.length > 0 ? (
              <Card className="glassmorphism border-gold-400/30 p-8 max-w-4xl w-full">
                <div className="flex items-center gap-3 mb-6">
                  <CelestialIcon type="constellation" className="text-gold-400" />
                  <h2 className="font-cinzel text-2xl font-bold text-gold-100">Recent Celestial Journeys</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData.recentTracks.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-purple-400/20 hover:border-gold-400/30 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                        {item.track.album?.images?.[0]?.url ? (
                          <img 
                            src={item.track.album.images[0].url} 
                            alt={`${item.track.album.name} cover`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <CelestialIcon type="planet" size="sm" className="text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins text-sm font-medium text-purple-100 truncate">{item.track.name}</p>
                        <p className="font-poppins text-xs text-purple-300 truncate">
                          {item.track.artists.map((artist: any) => artist.name).join(", ")}
                        </p>
                        <p className="font-poppins text-xs text-purple-400 truncate">
                          {new Date(item.played_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="glassmorphism border-purple-400/30 p-8 max-w-4xl w-full">
                <div className="flex items-center gap-3 mb-6">
                  <CelestialIcon type="constellation" className="text-purple-400" />
                  <h2 className="font-cinzel text-2xl font-bold text-purple-200">Recent Celestial Journeys</h2>
                </div>
                <div className="text-center py-8">
                  <CelestialIcon type="planet" size="lg" className="text-purple-400 mx-auto mb-4" />
                  <p className="font-poppins text-purple-300">— — — No recent tracks available — — —</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
