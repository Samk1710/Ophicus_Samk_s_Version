"use client"

import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Sparkles, Star, Music, Crown, CheckCircle } from "lucide-react"
import Link from "next/link"

interface QuestSummaryProps {
  isOpen: boolean
  onClose: () => void
  questData: {
    cosmicSong: {
      id: string
      name: string
      artists: string[]
      imageUrl: string
    }
    ophiuchusIdentity: {
      title: string
      description: string
      imageUrl: string
    }
    roomPoints: {
      nebula?: number
      cradle?: number
      comet?: number
      aurora?: number
    }
    revelationPoints: number
    totalPoints: number
    finalGuessAttempts: number
  }
}

export function QuestSummary({ isOpen, onClose, questData }: QuestSummaryProps) {
  const rooms = [
    { id: 'nebula', name: 'Nebula', color: 'text-purple-400' },
    { id: 'cradle', name: 'Cradle', color: 'text-blue-400' },
    { id: 'comet', name: 'Comet', color: 'text-orange-400' },
    { id: 'aurora', name: 'Aurora', color: 'text-green-400' },
  ]

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="glassmorphism border-gold-400/50 max-w-3xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400/30 to-purple-600/30 flex items-center justify-center pulse-glow">
              <Crown className="w-12 h-12 text-gold-300" />
            </div>
          </div>
          <AlertDialogTitle className="font-cinzel text-3xl font-bold text-center glow-text text-gold-100">
            Quest Summary
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            <p className="font-poppins text-lg text-gold-200 mb-6">
              Your cosmic journey through the 13th zodiac
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* Cosmic Song Section */}
          <Card className="glassmorphism border-purple-400/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-5 h-5 text-purple-400" />
              <h3 className="font-cinzel text-xl font-bold text-purple-100">Your Cosmic Song</h3>
            </div>
            <div className="flex items-center gap-4">
              {questData.cosmicSong.imageUrl && (
                <img
                  src={questData.cosmicSong.imageUrl}
                  alt={questData.cosmicSong.name}
                  className="w-20 h-20 rounded-lg border border-purple-400/30"
                />
              )}
              <div>
                <p className="font-cormorant text-2xl font-bold text-gold-100">
                  {questData.cosmicSong.name}
                </p>
                <p className="font-poppins text-purple-200">
                  by {questData.cosmicSong.artists.join(', ')}
                </p>
                <p className="font-poppins text-sm text-purple-400 mt-1">
                  Revealed in {questData.finalGuessAttempts} {questData.finalGuessAttempts === 1 ? 'attempt' : 'attempts'}
                </p>
              </div>
            </div>
          </Card>

          {/* Ophiuchus Identity */}
          <Card className="glassmorphism border-gold-400/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CelestialIcon type="eye" size="sm" className="text-gold-400" />
              <h3 className="font-cinzel text-xl font-bold text-gold-100">Your Ophiuchus Identity</h3>
            </div>
            <div className="space-y-3">
              <p className="font-cinzel text-lg font-bold text-purple-100">
                {questData.ophiuchusIdentity.title}
              </p>
              {questData.ophiuchusIdentity.description && (
                <p className="font-poppins text-sm text-purple-300 italic">
                  {questData.ophiuchusIdentity.description}
                </p>
              )}
            </div>
          </Card>

          {/* Room Points Breakdown */}
          <Card className="glassmorphism border-blue-400/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-blue-400" />
              <h3 className="font-cinzel text-xl font-bold text-blue-100">Chambers Explored</h3>
            </div>
            <div className="space-y-3">
              {rooms.map((room) => {
                const points = questData.roomPoints[room.id as keyof typeof questData.roomPoints] || 0
                return (
                  <div key={room.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${room.color}`} />
                      <span className="font-poppins text-purple-200">{room.name}</span>
                    </div>
                    <span className="font-cinzel text-lg font-bold text-gold-200">
                      {points} pts
                    </span>
                  </div>
                )
              })}
              
              {/* Revelation Points */}
              <div className="flex items-center justify-between p-3 bg-gold-900/20 rounded-lg border border-gold-400/30">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-gold-400" />
                  <span className="font-poppins text-gold-200">Final Revelation</span>
                </div>
                <span className="font-cinzel text-lg font-bold text-gold-100">
                  {questData.revelationPoints} pts
                </span>
              </div>
            </div>
          </Card>

          {/* Total Points */}
          <Card className="glassmorphism border-gold-400/50 p-6 bg-gradient-to-br from-gold-500/10 to-purple-600/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400/30 to-yellow-600/30 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-gold-300" />
                </div>
                <div>
                  <p className="font-poppins text-sm text-purple-300">Total Quest Points</p>
                  <p className="font-cinzel text-3xl font-bold text-gold-100">
                    {questData.totalPoints}
                  </p>
                </div>
              </div>
              <CelestialIcon type="sun" size="lg" className="text-gold-400 opacity-50" />
            </div>
          </Card>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-6">
          <Link href="/my-quests" className="w-full">
            <Button
              variant="outline"
              className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10 w-full bg-transparent"
            >
              View All Quests
            </Button>
          </Link>
          <Link href="/astral-nexus" className="w-full">
            <Button className="mystical-button w-full">
              Return to Nexus
            </Button>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
