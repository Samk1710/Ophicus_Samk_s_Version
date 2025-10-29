"use client"

import Link from "next/link"
import { CelestialIcon } from "@/components/celestial-icon"
import { CheckCircle, Globe, Flame, Rainbow, Crown, Sparkles } from "lucide-react"
import { useGameState } from "@/components/providers/game-state-provider"

interface ProgressTrackerProps {
  completedRooms: string[]
  failedRooms?: string[]
  currentRoom?: string
}

const rooms = [
  {
    id: "nebula",
    name: "Nebula",
    icon: <CelestialIcon type="mystical" size="sm" className="text-purple-400" />,
    href: "/rooms/nebula",
  },
  { id: "cradle", name: "Cradle", icon: <Globe className="w-4 h-4 text-blue-400" />, href: "/rooms/cradle" },
  { id: "comet", name: "Comet", icon: <Flame className="w-4 h-4 text-orange-400" />, href: "/rooms/comet" },
  { id: "aurora", name: "Aurora", icon: <Rainbow className="w-4 h-4 text-green-400" />, href: "/rooms/aurora" },
]

export function ProgressTracker({ completedRooms, failedRooms = [], currentRoom }: ProgressTrackerProps) {
  const { gameSession } = useGameState()
  
  const totalPoints = gameSession?.totalPoints || 0
  
  return (
    <div className="fixed top-20 right-6 z-50">
      <div className="glassmorphism rounded-2xl p-4">
        {/* Points Display */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-purple-400/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400/30 to-yellow-600/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gold-300" />
            </div>
            <div>
              <p className="font-poppins text-xs text-purple-300">Cosmic Points</p>
              <p className="font-cinzel text-xl font-bold text-gold-100">{totalPoints}</p>
            </div>
          </div>
          <CelestialIcon type="sun" size="sm" className="text-gold-400 opacity-50" />
        </div>
        
        {/* Quest Progress */}
        <div className="flex items-center gap-2 mb-3">
          <CelestialIcon type="constellation" size="sm" className="text-purple-300" />
          <span className="text-sm font-poppins text-purple-200">Quest Progress</span>
        </div>
        
        {/* Initial Clue Display */}
        {gameSession?.initialClue && (
          <details className="mb-3">
            <summary className="font-poppins text-xs text-gold-400 cursor-pointer hover:text-gold-300 transition-colors flex items-center gap-2">
              <CelestialIcon type="eye" size="sm" className="text-gold-400" />
              Initial Cosmic Clue
            </summary>
            <div className="mt-2 p-3 bg-purple-900/20 rounded-lg border border-purple-400/30">
              <p className="font-cormorant text-sm text-purple-100 italic leading-relaxed">
                "{gameSession.initialClue}"
              </p>
            </div>
          </details>
        )}
        
        <div className="flex gap-2 mb-4">
          {rooms.map((room) => (
            <Link key={room.id} href={room.href}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 cursor-pointer hover:scale-110 ${
                  completedRooms.includes(room.id)
                    ? "bg-green-500/30 border border-green-400/50 text-green-300"
                    : currentRoom === room.id
                      ? "bg-purple-500/30 border border-purple-400/50 text-purple-300 pulse-glow"
                      : "bg-gray-700/30 border border-gray-600/50 text-gray-400 hover:bg-gray-600/40"
                }`}
                title={room.name}
              >
                {completedRooms.includes(room.id) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  room.icon
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Individual room points breakdown (collapsed) */}
        {gameSession?.roomClues && Object.keys(gameSession.roomClues).length > 0 && (
          <details className="mb-3">
            <summary className="font-poppins text-xs text-purple-400 cursor-pointer hover:text-purple-300 transition-colors">
              Room Points
            </summary>
            <div className="space-y-1 mt-2 pl-2">
              {Object.entries(gameSession.roomClues).map(([room, clue]) => {
                if (!clue?.completed) return null
                return (
                  <div key={room} className="flex justify-between items-center">
                    <span className="font-poppins text-xs text-purple-300 capitalize">{room}</span>
                    <span className="font-poppins text-xs font-bold text-gold-200">+{clue.points || 0}</span>
                  </div>
                )
              })}
            </div>
          </details>
        )}

        {/* Revelation Link */}
        <Link href="/final-guess">
          <div className="w-full p-2 rounded-lg bg-gradient-to-r from-gold-500/20 to-purple-600/20 border border-gold-400/30 hover:from-gold-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-poppins text-gold-200">Revelation</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
