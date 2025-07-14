"use client"

import { useState } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BigBangPopup } from "@/components/big-bang-popup"
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
} from "lucide-react"

export default function HomePage() {
  const [showBigBangPopup, setShowBigBangPopup] = useState(false)

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
          </div>

          {/* Begin Your Realm CTA */}
          <div className="flex justify-center mb-12">
            <Card className="glassmorphism border-purple-400/30 p-8 max-w-md">
              <div className="mb-6">
                <CelestialIcon type="eye" size="xl" className="text-purple-400 mx-auto mb-4" />
                <h3 className="font-cinzel text-2xl font-bold text-purple-100 mb-2">Ready for Your Quest?</h3>
                <p className="font-poppins text-purple-200 text-sm">
                  Discover your cosmic song through the celestial chambers
                </p>
              </div>

              <Button onClick={() => setShowBigBangPopup(true)} className="mystical-button w-full">
                <Crown className="w-5 h-5 mr-3" />
                Begin Cosmic Journey
                <CelestialIcon type="mystical" size="sm" className="ml-3" />
              </Button>
            </Card>
          </div>

          {/* Current Playing */}
          <div className="flex justify-center mb-12">
            <Card className="glassmorphism border-gold-400/30 p-6 max-w-2xl w-full">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                  <CelestialIcon type="sun" size="lg" className="text-gold-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-cormorant text-xl font-bold text-gold-100 mb-1">West Coast</h3>
                  <p className="font-poppins text-purple-200 mb-2">Lana Del Rey</p>
                  <div className="flex items-center gap-4">
                    <Button size="sm" className="mystical-button">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-purple-300 hover:text-purple-100">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-purple-300 hover:text-purple-100">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-purple-300 hover:text-purple-100">
                      <Shuffle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="mb-12 flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-fr max-w-6xl">
              {[
                {
                  title: "Top Artist",
                  value: "Lana Del Rey",
                  subtitle: "Queen of your cosmic realm",
                  icon: <Music className="w-5 h-5 text-purple-400" />,
                  celestialIcon: "sun" as const,
                  gradient: "bg-gradient-to-br from-purple-600/30 to-pink-600/30",
                  size: "lg" as const,
                },
                {
                  title: "Minutes Listened",
                  value: "47,382",
                  subtitle: "This month",
                  icon: <Clock className="w-5 h-5 text-blue-400" />,
                  celestialIcon: "moon" as const,
                  gradient: "bg-gradient-to-br from-blue-600/30 to-indigo-600/30",
                  size: "md" as const,
                },
                {
                  title: "Top Genre",
                  value: "Dream Pop",
                  subtitle: "Your celestial frequency",
                  icon: <TrendingUp className="w-5 h-5 text-green-400" />,
                  celestialIcon: "mystical" as const,
                  gradient: "bg-gradient-to-br from-green-600/30 to-teal-600/30",
                  size: "md" as const,
                },
                {
                  title: "Tracks Played",
                  value: "2,847",
                  icon: <Headphones className="w-5 h-5 text-orange-400" />,
                  celestialIcon: "constellation" as const,
                  gradient: "bg-gradient-to-br from-orange-600/30 to-red-600/30",
                  size: "sm" as const,
                },
                {
                  title: "Discovery Score",
                  value: "87%",
                  subtitle: "Cosmic explorer",
                  icon: <Zap className="w-5 h-5 text-yellow-400" />,
                  celestialIcon: "eye" as const,
                  gradient: "bg-gradient-to-br from-yellow-600/30 to-orange-600/30",
                  size: "sm" as const,
                },
                {
                  title: "Active Days",
                  value: "28/30",
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

                      <div className="mb-2">
                        <h3 className="font-cinzel text-3xl font-bold text-gold-100 glow-text">{stat.value}</h3>
                        {stat.subtitle && <p className="font-poppins text-sm text-purple-200 mt-1">{stat.subtitle}</p>}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Recent Tracks */}
          <div className="flex justify-center">
            <Card className="glassmorphism border-gold-400/30 p-8 max-w-4xl w-full">
              <div className="flex items-center gap-3 mb-6">
                <CelestialIcon type="constellation" className="text-gold-400" />
                <h2 className="font-cinzel text-2xl font-bold text-gold-100">Recent Celestial Journeys</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Video Games", artist: "Lana Del Rey", plays: "47" },
                  { title: "Bohemian Rhapsody", artist: "Queen", plays: "23" },
                  { title: "Space Oddity", artist: "David Bowie", plays: "31" },
                  { title: "Cosmic Dancer", artist: "T. Rex", plays: "19" },
                  { title: "Starlight", artist: "Muse", plays: "28" },
                  { title: "Moonage Daydream", artist: "David Bowie", plays: "15" },
                ].map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-purple-400/20 hover:border-gold-400/30 transition-all duration-300"
                  >
                    <CelestialIcon type="planet" size="sm" className="text-purple-400" />
                    <div className="flex-1">
                      <p className="font-poppins text-sm font-medium text-purple-100">{track.title}</p>
                      <p className="font-poppins text-xs text-purple-300">{track.artist}</p>
                    </div>
                    <span className="font-poppins text-xs text-gold-400">{track.plays} plays</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
