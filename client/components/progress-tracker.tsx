"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CelestialIcon } from "@/components/celestial-icon"
import { CheckCircle, Globe, Flame, Rainbow, Crown, Sparkles } from "lucide-react"
import { useGameState } from "@/components/providers/game-state-provider"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

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
  const { gameSession, sessionId } = useGameState()
  const router = useRouter()
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)
  const [showAnswerDialog, setShowAnswerDialog] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<{ room: string; song: any; emoji: string; color: string } | null>(null)
  
  const totalPoints = gameSession?.totalPoints || 0
  const allRoomsCompleted = completedRooms.length === 4
  
  const handleShowAnswer = (room: string, song: any, emoji: string, color: string) => {
    console.log('[ProgressTracker] handleShowAnswer called:', { room, song, emoji, color })
    setSelectedAnswer({ room, song, emoji, color })
    setShowAnswerDialog(true)
    console.log('[ProgressTracker] Dialog state set to true')
  }
  
  const handleSkipToRevelation = async () => {
    if (!sessionId) {
      alert('No active session found')
      return
    }
    
    setIsSkipping(true)
    
    try {
      // Mark all rooms as completed with 0 points
      const roomsToComplete = ['nebula', 'cradle', 'comet', 'aurora']
      
      for (const room of roomsToComplete) {
        if (!completedRooms.includes(room)) {
          // Call a special endpoint to mark room as skipped (0 points)
          await fetch(`/api/rooms/skip`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              roomId: room,
            }),
          })
        }
      }
      
      // Navigate to revelation
      setShowSkipDialog(false)
      router.push('/final-guess')
    } catch (error) {
      console.error('[ProgressTracker] Failed to skip rooms:', error)
      alert('Failed to skip to revelation. Please try again.')
    } finally {
      setIsSkipping(false)
    }
  }
  
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

        {/* Room Answers Section */}
        {gameSession && (
          <details className="mb-3">
            <summary className="font-poppins text-xs text-gold-400 cursor-pointer hover:text-gold-300 transition-colors">
              Room Answers
            </summary>
            <div className="space-y-2 mt-2 pl-2">
              {/* Nebula Answer */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if ((completedRooms.includes('nebula') || failedRooms.includes('nebula')) && gameSession.intermediarySongs?.[0]) {
                    console.log('[ProgressTracker] Showing Nebula answer:', gameSession.intermediarySongs[0])
                    handleShowAnswer('Nebula', gameSession.intermediarySongs[0], '🔮', 'purple')
                  }
                }}
                disabled={!completedRooms.includes('nebula') && !failedRooms.includes('nebula')}
                className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                  (completedRooms.includes('nebula') || failedRooms.includes('nebula'))
                    ? 'bg-purple-900/20 border border-purple-400/30 hover:bg-purple-900/40 hover:border-purple-400/50 cursor-pointer'
                    : 'bg-gray-900/20 border border-gray-600/20 cursor-not-allowed opacity-50'
                }`}
              >
                <p className="font-poppins text-xs text-purple-300">
                  {completedRooms.includes('nebula') || failedRooms.includes('nebula') 
                    ? '🔮 Nebula (Riddle) - Click to reveal' 
                    : '--- Nebula (Locked)'}
                </p>
              </button>

              {/* Comet Answer */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if ((completedRooms.includes('comet') || failedRooms.includes('comet')) && gameSession.intermediarySongs?.[1]) {
                    console.log('[ProgressTracker] Showing Comet answer:', gameSession.intermediarySongs[1])
                    handleShowAnswer('Comet', gameSession.intermediarySongs[1], '🔥', 'orange')
                  }
                }}
                disabled={!completedRooms.includes('comet') && !failedRooms.includes('comet')}
                className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                  (completedRooms.includes('comet') || failedRooms.includes('comet'))
                    ? 'bg-orange-900/20 border border-orange-400/30 hover:bg-orange-900/40 hover:border-orange-400/50 cursor-pointer'
                    : 'bg-gray-900/20 border border-gray-600/20 cursor-not-allowed opacity-50'
                }`}
              >
                <p className="font-poppins text-xs text-orange-300">
                  {completedRooms.includes('comet') || failedRooms.includes('comet')
                    ? '🔥 Comet (Lyric) - Click to reveal' 
                    : '--- Comet (Locked)'}
                </p>
              </button>
            </div>
          </details>
        )}

        {/* Revelation Link */}
        {allRoomsCompleted ? (
          <Link href="/final-guess">
            <div className="w-full p-2 rounded-lg bg-gradient-to-r from-gold-500/20 to-purple-600/20 border border-gold-400/30 hover:from-gold-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-poppins text-gold-200">Revelation</span>
              </div>
            </div>
          </Link>
        ) : sessionId ? (
          <div 
            onClick={() => setShowSkipDialog(true)}
            className="w-full p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-red-600/20 border border-purple-400/30 hover:from-purple-500/30 hover:to-red-500/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-poppins text-purple-200">Skip to Revelation</span>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* Skip Confirmation Dialog */}
      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent className="glassmorphism border-purple-400/50 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cinzel text-2xl font-bold text-center text-purple-100">
              Skip Cosmic Rooms?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3">
              <p className="font-poppins text-purple-200">
                Are you sure you want to skip the cosmic rooms and go directly to the revelation?
              </p>
              <p className="font-poppins text-sm text-red-400">
                All room points will be set to zero.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="border-purple-400/30 text-purple-300 hover:bg-purple-500/10 w-full bg-transparent"
              onClick={() => setShowSkipDialog(false)}
              disabled={isSkipping}
            >
              No, Continue Quest
            </Button>
            <Button 
              className="mystical-button w-full"
              onClick={handleSkipToRevelation}
              disabled={isSkipping}
            >
              {isSkipping ? 'Skipping...' : 'Yes, Skip Rooms'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Answer Reveal Dialog */}
      <AlertDialog open={showAnswerDialog} onOpenChange={setShowAnswerDialog}>
        <AlertDialogContent className="glassmorphism border-gold-400/50 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cinzel text-2xl font-bold text-center text-purple-100 flex items-center justify-center gap-2">
              <span className="text-3xl">{selectedAnswer?.emoji}</span>
              {selectedAnswer?.room} Answer Revealed
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              {selectedAnswer?.song && (
                <div className="bg-black/30 rounded-lg p-6 border border-gold-400/30">
                  <p className="text-gold-200 font-poppins text-sm mb-4">
                    The answer was:
                  </p>
                  {selectedAnswer.song.imageUrl && (
                    <img 
                      src={selectedAnswer.song.imageUrl} 
                      alt={selectedAnswer.song.name}
                      className="w-48 h-48 mx-auto rounded-lg border-2 border-gold-400/50 object-cover mb-4 shadow-lg"
                    />
                  )}
                  <p className="font-cormorant text-2xl font-bold text-gold-100 mb-2">
                    "{selectedAnswer.song.name}"
                  </p>
                  <p className="font-poppins text-lg text-gold-200">
                    by {selectedAnswer.song.artists.join(', ')}
                  </p>
                  {selectedAnswer.song.spotifyUrl && (
                    <a
                      href={selectedAnswer.song.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-poppins text-sm transition-colors"
                    >
                      Listen on Spotify 🎵
                    </a>
                  )}
                </div>
              )}
              
              <p className="text-purple-300 font-poppins text-xs italic">
                Keep exploring the cosmic mysteries! ✨
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              className="mystical-button w-full"
              onClick={() => setShowAnswerDialog(false)}
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
