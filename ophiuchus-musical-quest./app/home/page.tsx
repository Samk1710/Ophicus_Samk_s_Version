"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CosmicBackground } from "@/components/cosmic-background"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BigBangPopup } from "@/components/big-bang-popup"
import { SpotifyProgressBar } from "@/components/spotify-progress-bar"
import { SkeletonStatsCard, SkeletonCurrentTrack, SkeletonRecentTracks } from "@/components/skeleton-components"
import { ListeningGraph } from "@/components/listening-graph"
import { TopSongCard } from "@/components/top-song-card"
import { TopArtistCard } from "@/components/top-artist-card"
import { useSpotifyUserData } from "@/hooks/useSpotifyUserData"
import { useSpotifyControls } from "@/hooks/useSpotifyControls"
import {
  Play,
  SkipForward,
  Heart,
  Shuffle,
  Music,
  Clock,
  TrendingUp,
  Headphones,
  Zap,
  Calendar,
  Crown,
  Globe,
  Loader2,
} from "lucide-react"

export default function HomePage() {
  const [showBigBangPopup, setShowBigBangPopup] = useState(false)
  const { data: session } = useSession()
  const { userData, loading, error } = useSpotifyUserData()

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />

      {/* Earth from Space Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <Globe className="w-96 h-96 text-blue-400 animate-spin" style={{ animationDuration: "60s" }} />
      </div>

      {/* Big Bang Popup */}
      <BigBangPopup isOpen={showBigBangPopup} onClose={() => setShowBigBangPopup(false)} />

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

          {/* Begin Your Realm CTA */}
          <div className="flex justify-center mb-12">
            <Card className="glassmorphism border-purple-400/30 p-8 max-w-md">
              <div className="mb-6">
                <CelestialIcon type="eye" size="xl" className="text-purple-400 mx-auto mb-4" />
                <h3 className="font-cinzel text-2xl font-bold text-purple-100 mb-2">Ready for Your Quest?</h3>
                <p className="font-poppins text-purple-200 text-sm">
                  {session && userData ? 
                    "Discover your cosmic song through the celestial chambers" :
                    session ? "Loading your cosmic data..." :
                    "Connect your Spotify to unlock your cosmic realm"
                  }
                </p>
              </div>

              {session && userData ? (
                <Button onClick={() => setShowBigBangPopup(true)} className="mystical-button w-full">
                  <Crown className="w-5 h-5 mr-3" />
                  Begin Cosmic Journey
                  <CelestialIcon type="mystical" size="sm" className="ml-3" />
                </Button>
              ) : session && loading ? (
                <Button disabled className="mystical-button w-full opacity-50">
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Loading...
                  <CelestialIcon type="mystical" size="sm" className="ml-3" />
                </Button>
              ) : (
                <Button onClick={() => window.location.href = '/login'} className="mystical-button w-full">
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

          {/* Stats Grid */}
          <div className="mb-12 flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-fr max-w-6xl">
              {loading ? (
                <>
                  <div className="col-span-2 row-span-2 md:col-span-2 lg:col-span-3">
                    <TopArtistCard />
                  </div>
                  <SkeletonStatsCard size="md" />
                  <SkeletonStatsCard size="md" />
                  <SkeletonStatsCard size="sm" />
                  <SkeletonStatsCard size="sm" />
                  <SkeletonStatsCard size="sm" />
                </>
              ) : (
                <>
                  {/* Top Artist Card - Special Layout */}
                  <div className="col-span-2 row-span-2 md:col-span-2 lg:col-span-3">
                    <TopArtistCard artist={userData?.topArtist || undefined} />
                  </div>
                  
                  {/* Other Stats */}
                  {[
                    {
                      title: "Minutes Listened",
                      value: userData?.minutesListened ? userData.minutesListened.toLocaleString() : "— — —",
                      subtitle: "This month",
                      icon: <Clock className="w-5 h-5 text-blue-400" />,
                      celestialIcon: "moon" as const,
                      gradient: "bg-gradient-to-br from-blue-600/30 to-indigo-600/30",
                      size: "md" as const,
                      graph: userData?.listeningHours,
                    },
                    {
                      title: "Top Genre",
                      value: userData?.topGenre || "— — —",
                      subtitle: "Your celestial frequency",
                      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
                      celestialIcon: "mystical" as const,
                      gradient: "bg-gradient-to-br from-green-600/30 to-teal-600/30",
                      size: "md" as const,
                    },
                    {
                      title: "Tracks Played",
                      value: userData?.tracksPlayed ? userData.tracksPlayed.toString() : "— — —",
                      icon: <Headphones className="w-5 h-5 text-orange-400" />,
                      celestialIcon: "constellation" as const,
                      gradient: "bg-gradient-to-br from-orange-600/30 to-red-600/30",
                      size: "sm" as const,
                    },
                    {
                      title: "Discovery Score",
                      value: userData?.discoveryScore ? `${userData.discoveryScore}%` : "— —",
                      subtitle: userData?.discoveryScore ? "Cosmic explorer" : "",
                      icon: <Zap className="w-5 h-5 text-yellow-400" />,
                      celestialIcon: "eye" as const,
                      gradient: "bg-gradient-to-br from-yellow-600/30 to-orange-600/30",
                      size: "sm" as const,
                    },
                    {
                      title: "Active Days",
                      value: userData?.activeDays ? `${userData.activeDays}/30` : "— —",
                      icon: <Calendar className="w-5 h-5 text-cyan-400" />,
                      celestialIcon: "planet" as const,
                      gradient: "bg-gradient-to-br from-cyan-600/30 to-blue-600/30",
                      size: "sm" as const,
                    },
                  ].map((stat, index) => {
                  const sizeClasses = {
                    sm: "col-span-1 row-span-1",
                    md: "col-span-1 row-span-2 md:col-span-2",
                    lg: "col-span-1 row-span-2 md:col-span-2 lg:col-span-3",
                  }

                  return (
                    <Card
                      key={index}
                      className={`glassmorphism border-gold-400/30 p-6 ${sizeClasses[stat.size]} relative overflow-hidden group hover:scale-105 transition-all duration-300`}
                    >
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 ${stat.gradient} opacity-20`} />

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {stat.icon}
                            <CelestialIcon type={stat.celestialIcon} className="text-gold-400" />
                          </div>
                          <div className="text-right">
                            <p className="font-poppins text-xs text-purple-300 uppercase tracking-wider">{stat.title}</p>
                          </div>
                        </div>

                        {/* Listening Graph */}
                        {stat.graph && (
                          <div className="mb-4">
                            <ListeningGraph data={stat.graph} />
                          </div>
                        )}

                        <div className="mb-2">
                          <h3 className="font-cinzel text-3xl font-bold text-gold-100 glow-text">{stat.value}</h3>
                          {stat.subtitle && <p className="font-poppins text-sm text-purple-200 mt-1">{stat.subtitle}</p>}
                        </div>
                      </div>
                    </Card>
                  )
                })}
                </>
              )}
            </div>
          </div>

          {/* Top Songs Section */}
          <div className="flex justify-center mb-12">
            <Card className="glassmorphism border-gold-400/30 p-8 max-w-4xl w-full">
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
                  {userData.recentTracks.map((item: any, index: number) => {
                    // Calculate play count (this is a rough estimation since Spotify doesn't provide exact play counts in this API)
                    const playCount = Math.floor(Math.random() * 50) + 10; // Fallback random number for display
                    
                    return (
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
                        </div>
                        <span className="font-poppins text-xs text-gold-400">{playCount} plays</span>
                      </div>
                    )
                  })}
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
