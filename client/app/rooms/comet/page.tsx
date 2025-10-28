"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Zap, Flame, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useGameState } from "@/components/providers/game-state-provider"
import { SpotifySearch } from "@/components/spotify-search"
import { useRouter } from "next/navigation"
import { celebrateCorrectAnswer } from "@/components/cosmic-confetti"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CometRoom() {
  const [timeLeft, setTimeLeft] = useState(10)
  const [showLyric, setShowLyric] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [cometVisible, setCometVisible] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<{id: string; name: string} | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [lyric, setLyric] = useState("")
  const [clueText, setClueText] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showFailureDialog, setShowFailureDialog] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const { sessionId, gameSession, refreshGameState } = useGameState()
  const router = useRouter()

  console.log('[Comet] Component mounted, session:', sessionId)

  useEffect(() => {
    if (!sessionId) {
      console.log('[Comet] No session ID, redirecting')
      router.push('/home')
      return
    }
    fetchLyric()
  }, [sessionId])

  const fetchLyric = async () => {
    console.log('[Comet] Fetching lyric fragment...')
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/comet?sessionId=${sessionId}`)
      const data = await response.json()
      console.log('[Comet] Lyric data:', data)
      
      if (data.completed) {
        setIsCompleted(true)
        setClueText(data.clue || '')
        setShowInput(true)
      } else {
        setLyric(data.lyric || "Mysterious lyrics from the cosmos...")
        // Start comet animation
        setTimeout(() => {
          setCometVisible(true)
          setShowLyric(true)
        }, 1000)
      }
    } catch (error) {
      console.error('[Comet] Failed to fetch:', error)
      setLyric("Error loading lyric...")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (showLyric && timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && showLyric) {
      console.log('[Comet] Time expired, showing guess form')
      setShowLyric(false)
      setShowInput(true)
    }
  }, [timeLeft, showLyric, isCompleted])

  const handleGuess = async () => {
    if (!selectedTrack || isSubmitting) {
      console.log('[Comet] Cannot submit:', { selectedTrack, isSubmitting })
      return
    }

    setIsSubmitting(true)
    console.log('[Comet] Submitting track guess:', selectedTrack)

    try {
      const response = await fetch('/api/rooms/comet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          guessedTrackId: selectedTrack.id
        })
      })

      const data = await response.json()
      console.log('[Comet] Guess result:', data)

      if (data.correct) {
        // Trigger confetti celebration  
        if (data.celebrateCorrect) {
          celebrateCorrectAnswer()
        }
        
        setIsCompleted(true)
        setClueText(data.clue || '')
        setEarnedPoints(data.points || 0)
        setShowSuccessDialog(true)
        await refreshGameState()
      } else {
        // Comet only has ONE CHANCE - show failure
        setIsCompleted(true)
        setShowFailureDialog(true)
        await refreshGameState()
      }
    } catch (error) {
      console.error('[Comet] Guess failed:', error)
      alert('Failed to submit guess. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const completedRooms = gameSession?.roomClues
    ? Object.entries(gameSession.roomClues)
        .filter(([_, clue]) => clue?.completed)
        .map(([roomId]) => roomId)
    : []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={completedRooms} currentRoom="comet" />

      {/* Comet Trail Animation */}
      {cometVisible && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="comet-trail absolute w-4 h-4 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50">
            <div className="absolute -left-20 top-1/2 w-20 h-1 bg-gradient-to-r from-transparent to-orange-400 transform -translate-y-1/2" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 text-orange-400 mr-4" />
              <h1 className="font-cinzel text-4xl font-bold glow-text text-gold-100">Comet</h1>
              <CelestialIcon type="mystical" size="lg" className="text-orange-400 ml-4" />
            </div>
            <p className="font-poppins text-sm text-purple-300 italic">Flash of the Past</p>
          </div>

          {/* Instructions */}
          <Card className="glassmorphism border-orange-400/50 p-8 mb-8">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500/30 to-red-600/30 flex items-center justify-center pulse-glow">
                <Flame className="w-8 h-8 text-orange-300" />
              </div>
              <h2 className="font-cormorant text-2xl font-bold text-orange-100 mb-2">Catch the Cosmic Flash</h2>
              <p className="font-poppins text-orange-200">
                A comet streaks across the void carrying a lyric from the past. You have 10 seconds to memorize it
                before it disappears forever.
              </p>
            </div>

            {/* Timer and Lyric Display */}
            {showLyric && !isCompleted && (
              <div className="space-y-6">
                {/* Circular Timer */}
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="rgba(251, 146, 60, 0.3)" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgb(251, 146, 60)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / 10)}`}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-cormorant text-2xl font-bold text-orange-100">{timeLeft}</span>
                  </div>
                </div>

                {/* Lyric Display */}
                <div className="bg-black/40 rounded-lg p-6 border border-orange-400/30">
                  <p className="font-cormorant text-2xl text-orange-100 glow-text">"{lyric}"</p>
                </div>
              </div>
            )}

            {/* Input Form */}
            {showInput && !isCompleted && (
              <div className="space-y-6">
                <div className="text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                  <h3 className="font-cormorant text-xl font-bold text-orange-100 mb-2">The Comet Has Passed</h3>
                  <p className="font-poppins text-orange-200 mb-6">Which song contained that lyric?</p>
                </div>

                <div className="space-y-4">
                  <SpotifySearch
                    type="track"
                    onSelect={(track: any) => {
                      console.log('[Comet] Track selected:', track)
                      setSelectedTrack({
                        id: track.id,
                        name: track.name
                      })
                    }}
                    placeholder="Search for the song..."
                  />
                  
                  {selectedTrack && (
                    <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-400/30">
                      <p className="font-poppins text-sm text-orange-200 text-center">
                        Selected: <span className="font-bold text-gold-200">{selectedTrack.name}</span>
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleGuess}
                    className="mystical-button w-full"
                    disabled={!selectedTrack || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Answer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Completed State */}
            {isCompleted && clueText && (
              <div className="space-y-6 text-center">
                <div className="text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                  <h3 className="font-cormorant text-xl font-bold text-orange-100 mb-2">Chamber Complete!</h3>
                </div>
                <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-400/30">
                  <p className="font-poppins text-sm text-orange-200 italic">
                    {clueText}
                  </p>
                </div>
              </div>
            )}

            {/* Waiting State */}
            {!showLyric && !showInput && !isCompleted && (
              <div className="text-center">
                <p className="font-poppins text-orange-200 mb-4">Prepare yourself... the comet approaches...</p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400" />
                </div>
              </div>
            )}
          </Card>

          {/* Navigation Hint */}
          <div className="text-center">
            <Card className="glassmorphism border-yellow-400/50 p-4">
              <div className="flex items-center justify-center">
                <CelestialIcon type="sun" className="text-yellow-400 mr-2" />
                <p className="font-poppins text-sm text-yellow-200">
                  Focus on the lyrics - they hold the key to the song's identity
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="glassmorphism border-green-400/50">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-cinzel text-green-100">
              Correct! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              <p className="text-green-200 font-poppins">
                You caught the comet's message!
              </p>
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-400/30">
                <p className="text-gold-200 font-bold text-xl">+{earnedPoints} Points</p>
              </div>
              {clueText && (
                <p className="text-green-200 italic font-poppins text-sm">
                  {clueText}
                </p>
              )}
              <Button 
                onClick={() => {
                  setShowSuccessDialog(false)
                  router.push('/home')
                }}
                className="mystical-button w-full mt-4"
              >
                Continue Journey
              </Button>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      {/* Failure Dialog */}
      <AlertDialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <AlertDialogContent className="glassmorphism border-red-400/50">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-red-400" />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-cinzel text-red-100">
              Not Quite... 💫
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              <p className="text-red-200 font-poppins">
                The comet has passed. You only had one chance!
              </p>
              <div className="bg-red-900/20 rounded-lg p-4 border border-red-400/30">
                <p className="text-red-200 font-poppins text-sm">
                  No points earned this time.
                </p>
              </div>
              <Button 
                onClick={() => {
                  setShowFailureDialog(false)
                  router.push('/home')
                }}
                className="mystical-button w-full mt-4"
              >
                Continue Journey
              </Button>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
