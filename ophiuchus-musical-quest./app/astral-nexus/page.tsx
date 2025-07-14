"use client"

import { useState } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Flame, Rainbow, Star } from "lucide-react"
import Link from "next/link"

const planets = [
  {
    id: "nebula",
    name: "Nebula",
    subtitle: "Riddle of Echoes",
    description: "Decipher the cosmic riddle hidden in the mists of creation",
    icon: <CelestialIcon type="mystical" size="lg" className="text-purple-400" />,
    color: "from-purple-500/30 to-indigo-600/30",
    borderColor: "border-purple-400/50",
    href: "/rooms/nebula",
  },
  {
    id: "cradle",
    name: "Cradle",
    subtitle: "The Veiled Origin",
    description: "Uncover the artist through questions and cosmic wisdom",
    icon: <Globe className="w-8 h-8 text-blue-400" />,
    color: "from-blue-500/30 to-cyan-600/30",
    borderColor: "border-blue-400/50",
    href: "/rooms/cradle",
  },
  {
    id: "comet",
    name: "Comet",
    subtitle: "Flash of the Past",
    description: "Catch the fleeting lyric as it streaks across the void",
    icon: <Flame className="w-8 h-8 text-orange-400" />,
    color: "from-orange-500/30 to-red-600/30",
    borderColor: "border-orange-400/50",
    href: "/rooms/comet",
  },
  {
    id: "aurora",
    name: "Aurora",
    subtitle: "Voice of Light",
    description: "Feel the melody and express the emotion within",
    icon: <Rainbow className="w-8 h-8 text-green-400" />,
    color: "from-green-500/30 to-teal-600/30",
    borderColor: "border-green-400/50",
    href: "/rooms/aurora",
  },
  {
    id: "nova",
    name: "Nova",
    subtitle: "Reverb of Memory",
    description: "Navigate through your musical memories and preferences",
    icon: <Star className="w-8 h-8 text-yellow-400" />,
    color: "from-yellow-500/30 to-orange-600/30",
    borderColor: "border-yellow-400/50",
    href: "/rooms/nova",
  },
]

export default function AstralNexus() {
  const [completedRooms] = useState<string[]>([])
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={completedRooms} />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Central Hub Description */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <CelestialIcon type="eye" size="xl" className="text-gold-400 mr-4" />
              <h1 className="font-cinzel text-4xl md:text-5xl font-bold glow-text text-gold-100">Astral Nexus</h1>
              <CelestialIcon type="mystical" size="xl" className="text-gold-400 ml-4" />
            </div>
            <p className="font-poppins text-lg text-purple-200 max-w-2xl mx-auto">
              Five celestial chambers await your exploration. Each holds a piece of the cosmic puzzle that will reveal
              your destined song among the stars.
            </p>
          </div>

          {/* Planet Grid - Centered */}
          <div className="flex justify-center mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
              {planets.map((planet, index) => (
                <Card
                  key={planet.id}
                  className={`glassmorphism ${planet.borderColor} p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden`}
                  style={{
                    backgroundImage: `url('/images/golden-frame.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  onMouseEnter={() => setHoveredPlanet(planet.id)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                >
                  {/* Card overlay for readability */}
                  <div className="absolute inset-0 bg-black/40" />

                  <Link href={planet.href}>
                    <div className="text-center relative z-10">
                      {/* Planet Icon */}
                      <div
                        className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${planet.color} flex items-center justify-center group-hover:pulse-glow transition-all duration-300`}
                      >
                        {planet.icon}
                      </div>

                      {/* Planet Info */}
                      <h3 className="font-cormorant text-2xl font-bold text-gold-100 mb-2">{planet.name}</h3>
                      <h4 className="font-poppins text-sm text-purple-300 mb-3 italic">{planet.subtitle}</h4>

                      {/* Description (shown on hover) */}
                      <div
                        className={`transition-all duration-300 ${
                          hoveredPlanet === planet.id ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
                        } overflow-hidden`}
                      >
                        <p className="font-poppins text-sm text-purple-200">{planet.description}</p>
                      </div>

                      {/* Enter Button */}
                      <div className="mt-4">
                        <Button className="mystical-button text-sm px-6 py-2">
                          <CelestialIcon type="constellation" size="sm" className="mr-2" />
                          Enter Chamber
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Progress Card - Centered */}
          <div className="flex justify-center">
            <Card className="glassmorphism border-gold-400/30 p-6 max-w-md">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <CelestialIcon type="sun" className="text-gold-400 mr-2" />
                  <h3 className="font-cormorant text-xl font-bold text-gold-100">Cosmic Progress</h3>
                </div>
                <p className="font-poppins text-sm text-purple-200 mb-4">
                  Chambers Explored: {completedRooms.length} / 5
                </p>
                <div className="flex justify-center gap-2">
                  {planets.map((planet) => (
                    <div
                      key={planet.id}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        completedRooms.includes(planet.id)
                          ? "bg-green-400 shadow-lg shadow-green-400/50"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
