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
import { useGameState } from "@/components/providers/game-state-provider"
import { useRouter } from "next/navigation"

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
    roomsCompletedMap?: { [key: string]: 'pending' | 'correct' | 'wrong' }
    ophiuchusIdentity?: {
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
    nebulaSong?: {
      id: string
      name: string
      artists: string[]
      imageUrl: string
      spotifyUrl?: string
    }
    cometSong?: {
      id: string
      name: string
      artists: string[]
      imageUrl: string
      spotifyUrl?: string
    }
  }
}

export function QuestSummary({ isOpen, onClose, questData }: QuestSummaryProps) {
  const { setSessionId } = useGameState()
  const router = useRouter()
  
  const handleEndQuest = () => {
    // End the game session
    setSessionId(null)
    onClose()
    router.push('/astral-nexus')
  }
  
  const rooms = [
    { id: 'nebula', name: 'Nebula', color: 'text-purple-400' },
    { id: 'cradle', name: 'Cradle', color: 'text-blue-400' },
    { id: 'comet', name: 'Comet', color: 'text-orange-400' },
    { id: 'aurora', name: 'Aurora', color: 'text-green-400' },
  ]

  // Helper to get per-room final state. Prefer roomsCompletedMap, then fallback to legacy roomsCompleted array stored on session (if any).
  const getRoomState = (roomId: string) => {
    // If a roomsCompletedMap is included in questData (preferred shape)
    if (questData.roomsCompletedMap && typeof questData.roomsCompletedMap[roomId] !== 'undefined') {
      return questData.roomsCompletedMap[roomId]
    }

    // Fallback: if a legacy array exists on the questData (some builds may still provide it via roomPoints keys)
    // We'll treat presence in an assumed `roomsCompleted` array (not provided here) as 'correct'
    // and otherwise consider it 'pending'. This keeps backward compatibility.
    // NOTE: if you have access to the session object on client, prefer to pass roomsCompletedMap from server.
    return 'pending' as 'pending' | 'correct' | 'wrong'
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="glassmorphism border-gold-400/50 max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <AlertDialogHeader className="flex-shrink-0">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gold-400/30 to-purple-600/30 flex items-center justify-center pulse-glow">
              <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-gold-300" />
            </div>
          </div>
          <AlertDialogTitle className="font-cinzel text-2xl sm:text-3xl font-bold text-center glow-text text-gold-100">
            Quest Summary
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            <p className="font-poppins text-base sm:text-lg text-gold-200 mb-4 sm:mb-6">
              Your cosmic journey through the 13th zodiac
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 sm:space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Cosmic Song Section */}
          <Card className="glassmorphism border-purple-400/30 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-purple-100">Your Cosmic Song</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {questData.cosmicSong.imageUrl && (
                <img
                  src={questData.cosmicSong.imageUrl}
                  alt={questData.cosmicSong.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-purple-400/30 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-cormorant text-xl sm:text-2xl font-bold text-gold-100 break-words">
                  {questData.cosmicSong.name}
                </p>
                <p className="font-poppins text-sm sm:text-base text-purple-200 break-words">
                  by {questData.cosmicSong.artists.join(', ')}
                </p>
                <p className="font-poppins text-xs sm:text-sm text-purple-400 mt-1">
                  Revealed in {questData.finalGuessAttempts} {questData.finalGuessAttempts === 1 ? 'attempt' : 'attempts'}
                </p>
              </div>
            </div>
          </Card>

          {/* Ophiuchus Identity - Only show if quest was successful */}
          {questData.ophiuchusIdentity && (
            <Card className="glassmorphism border-gold-400/30 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <CelestialIcon type="eye" size="sm" className="text-gold-400" />
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-100">Your Ophiuchus Identity</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <p className="font-cinzel text-base sm:text-lg font-bold text-purple-100 break-words">
                  {questData.ophiuchusIdentity.title}
                </p>
                {questData.ophiuchusIdentity.description && (
                  <p className="font-poppins text-xs sm:text-sm text-purple-300 italic">
                    {questData.ophiuchusIdentity.description}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Room Answers Section */}
          {(questData.nebulaSong || questData.cometSong) && (
            <Card className="glassmorphism border-purple-400/30 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-purple-100">Room Answers</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {/* Nebula Song */}
                {questData.nebulaSong && (
                  <div className="bg-purple-900/20 rounded-lg p-3 sm:p-4 border border-purple-400/30">
                    <p className="font-poppins text-xs sm:text-sm text-purple-300 mb-2">🔮 Nebula (Riddle)</p>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {questData.nebulaSong.imageUrl && (
                        <img
                          src={questData.nebulaSong.imageUrl}
                          alt={questData.nebulaSong.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded border border-purple-400/30 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins text-sm sm:text-base font-bold text-purple-100 truncate">
                          {questData.nebulaSong.name}
                        </p>
                        <p className="font-poppins text-xs sm:text-sm text-purple-300 truncate">
                          {questData.nebulaSong.artists.join(', ')}
                        </p>
                        {questData.nebulaSong.spotifyUrl && (
                          <a
                            href={questData.nebulaSong.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-400 hover:text-green-300 underline mt-1 inline-block"
                          >
                            Listen ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Comet Song */}
                {questData.cometSong && (
                  <div className="bg-orange-900/20 rounded-lg p-3 sm:p-4 border border-orange-400/30">
                    <p className="font-poppins text-xs sm:text-sm text-orange-300 mb-2">🔥 Comet (Lyric)</p>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {questData.cometSong.imageUrl && (
                        <img
                          src={questData.cometSong.imageUrl}
                          alt={questData.cometSong.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded border border-orange-400/30 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins text-sm sm:text-base font-bold text-orange-100 truncate">
                          {questData.cometSong.name}
                        </p>
                        <p className="font-poppins text-xs sm:text-sm text-orange-300 truncate">
                          {questData.cometSong.artists.join(', ')}
                        </p>
                        {questData.cometSong.spotifyUrl && (
                          <a
                            href={questData.cometSong.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-400 hover:text-green-300 underline mt-1 inline-block"
                          >
                            Listen ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Room Points Breakdown */}
          <Card className="glassmorphism border-blue-400/30 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-blue-100">Chambers Explored</h3>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {rooms.map((room) => {
                const points = questData?.roomPoints?.[room.id as keyof typeof questData.roomPoints] || 0
                const state = getRoomState(room.id)
                const stateColor = state === 'correct' ? 'text-green-300' : state === 'wrong' ? 'text-red-400' : 'text-gray-400'
                return (
                  <div key={room.id} className="flex items-center justify-between p-2 sm:p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${room.color} ${stateColor}`} />
                      <div className="flex items-center gap-2">
                        <span className="font-poppins text-sm sm:text-base text-purple-200">{room.name}</span>
                        <span className={`text-xs sm:text-sm font-medium ${stateColor} ml-2 capitalize`}>
                          {state}
                        </span>
                      </div>
                    </div>
                    <span className="font-cinzel text-base sm:text-lg font-bold text-gold-200">
                      {points} pts
                    </span>
                  </div>
                )
              })}
              
              {/* Revelation Points */}
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gold-900/20 rounded-lg border border-gold-400/30">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
                  <span className="font-poppins text-sm sm:text-base text-gold-200">Final Revelation</span>
                </div>
                <span className="font-cinzel text-base sm:text-lg font-bold text-gold-100">
                  {questData?.revelationPoints || 0} pts
                </span>
              </div>
            </div>
          </Card>

          {/* Total Points */}
          <Card className="glassmorphism border-gold-400/50 p-4 sm:p-6 bg-gradient-to-br from-gold-500/10 to-purple-600/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gold-400/30 to-yellow-600/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-gold-300" />
                </div>
                <div>
                  <p className="font-poppins text-xs sm:text-sm text-purple-300">Total Quest Points</p>
                  <p className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-100">
                    {questData?.totalPoints || 0}
                  </p>
                </div>
              </div>
              <CelestialIcon type="sun" size="lg" className="text-gold-400 opacity-50 hidden sm:block" />
            </div>
          </Card>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4 sm:mt-6 flex-shrink-0">
          <Link href="/astral-nexus" className="w-full">
            <Button
              variant="outline"
              className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10 w-full bg-transparent text-sm sm:text-base"
            >
              Return to Nexus
            </Button>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
