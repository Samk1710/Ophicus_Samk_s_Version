"use client"

import { useGameState } from "@/components/providers/game-state-provider"
import { Card } from "@/components/ui/card"
import { CelestialIcon } from "@/components/celestial-icon"
import { Sparkles } from "lucide-react"

export function PointsWidget() {
  const { gameSession } = useGameState()

  if (!gameSession) return null

  const totalPoints = gameSession.totalPoints || 0

  return (
    <Card className="glassmorphism border-gold-400/30 p-4 fixed top-32 right-6 z-50 min-w-[180px]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400/30 to-yellow-600/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gold-300" />
          </div>
          <div>
            <p className="font-poppins text-xs text-purple-300">Cosmic Points</p>
            <p className="font-cinzel text-2xl font-bold text-gold-100">{totalPoints}</p>
          </div>
        </div>
        <CelestialIcon type="sun" size="sm" className="text-gold-400 opacity-50" />
      </div>
      
      {/* Individual room points breakdown */}
      {gameSession.roomClues && Object.keys(gameSession.roomClues).length > 0 && (
        <div className="mt-3 pt-3 border-t border-purple-400/20">
          <p className="font-poppins text-xs text-purple-400 mb-2">Room Points</p>
          <div className="space-y-1">
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
        </div>
      )}
    </Card>
  )
}
