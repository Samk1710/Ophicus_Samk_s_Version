"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { CosmicLoading } from "@/components/cosmic-loading"
import { ProgressTracker } from "@/components/progress-tracker"
import { PointsWidget } from "@/components/points-widget"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Circle, Loader2, Sparkles, X } from "lucide-react"
import Link from "next/link"
import { useGameState } from "@/components/providers/game-state-provider"
import { SpotifySearch } from "@/components/spotify-search"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog"
import { celebrateCorrectAnswer } from "@/components/cosmic-confetti"

export default function NebulaRoom() {
  const [selectedSong, setSelectedSong] = useState<{id: string; name: string; artist: string} | null>(null)
  const [attempts, setAttempts] = useState(3)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [clueText, setClueText] = useState("")
  const [riddle, setRiddle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showFailureDialog, setShowFailureDialog] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const { sessionId, gameSession, refreshGameState } = useGameState()
  const router = useRouter()

  console.log('[Nebula] Component mounted, session:', sessionId)
  console.log('[Nebula] Game session:', gameSession)

  // Fetch riddle on mount
  useEffect(() => {
    if (!sessionId) {
      console.log('[Nebula] No session ID, redirecting to home')
      router.push('/home')
      return
    }
    
    // Check if room is already completed - lock it
    if (gameSession?.roomClues?.nebula?.completed) {
      console.log('[Nebula] Room already completed, redirecting')
      toast.error("Nebula Chamber Already Explored", {
        description: "This cosmic chamber has already revealed its secrets.",
        duration: 3000,
        className: "glassmorphism border-purple-400/50"
      })
      router.push('/astral-nexus')
      return
    }
    
    fetchRiddle()
  }, [sessionId, gameSession])

  const fetchRiddle = async () => {
    console.log('[Nebula] Fetching riddle...')
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/nebula?sessionId=${sessionId}`)
      const data = await response.json()
      console.log('[Nebula] Riddle data:', data)
      
      setRiddle(data.riddle || '')
      setAttempts(3 - (data.attempts || 0))
      
      if (data.completed) {
        setIsCorrect(true)
        setShowResult(true)
        setClueText(data.clue || '')
      }
    } catch (error) {
      console.error('[Nebula] Failed to fetch riddle:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!selectedSong || attempts === 0 || isSubmitting) {
      console.log('[Nebula] Submit blocked:', { selectedSong, attempts, isSubmitting })
      return
    }

    setIsSubmitting(true)
    console.log('[Nebula] Submitting guess:', selectedSong)

    try {
      const response = await fetch('/api/rooms/nebula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          guessedTrackId: selectedSong.id
        })
      })

      const data = await response.json()
      console.log('[Nebula] Result:', data)

      setAttempts(data.attemptsRemaining || 0)
      setIsCorrect(data.correct || false)
      setShowResult(true)
      
      if (data.correct) {
        setClueText(data.clue || '')
        setEarnedPoints(data.points || 100)
        await refreshGameState()
        
        // Celebrate with confetti
        if (data.celebrateCorrect) {
          celebrateCorrectAnswer()
        }
        
        setShowSuccessDialog(true)
        console.log('[Nebula] CORRECT! Moving to next room...')
      } else {
        setShowFailureDialog(true)
      }
    } catch (error) {
      console.error('[Nebula] Submit failed:', error)
      alert('Failed to submit your guess. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get completed rooms for progress tracker
  const completedRooms = gameSession?.roomClues
    ? Object.entries(gameSession.roomClues)
        .filter(([_, clue]) => clue?.completed && (clue?.score ?? 0) >= 7)
        .map(([roomId]) => roomId)
    : []

  const failedRooms = gameSession?.roomClues
    ? Object.entries(gameSession.roomClues)
        .filter(([_, clue]) => clue?.completed && (clue?.score ?? 0) < 7)
        .map(([roomId]) => roomId)
    : []

  if (isLoading) {
    return <CosmicLoading message="The nebula stirs... ancient riddles awakening from cosmic slumber" />
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={completedRooms} failedRooms={failedRooms} currentRoom="nebula" />
      <PointsWidget />

      {/* Moon Phases Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/images/moon-phases.png')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Nebula Mist Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-indigo-900/20 pointer-events-none" />

      {/* Floating Mist Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300/20 rounded-full floating-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <CelestialIcon type="mystical" size="xl" className="text-purple-400 mr-4" />
              <h1 className="font-cinzel text-4xl font-bold glow-text text-gold-100">Nebula</h1>
              <CelestialIcon type="constellation" size="xl" className="text-purple-400 ml-4" />
            </div>
            <p className="font-poppins text-sm text-purple-300 italic">Riddle of Echoes</p>
          </div>

          {/* Riddle Card */}
          <Card className="glassmorphism border-purple-400/50 p-8 mb-8 relative overflow-hidden">
            {/* Card Background */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url('/images/lunar-wheel.png')`,
                backgroundSize: "200px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />

            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-600/30 flex items-center justify-center pulse-glow">
                  <CelestialIcon type="mystical" size="lg" className="text-purple-300" />
                </div>
                <h2 className="font-cormorant text-2xl font-bold text-purple-100 mb-2">The Cosmic Riddle</h2>
              </div>

              <div className="bg-black/20 rounded-lg p-6 mb-6">
                <pre className="font-cormorant text-lg text-purple-100 leading-relaxed whitespace-pre-wrap text-center">
                  {riddle}
                </pre>
              </div>

              {/* Guess Form */}
              <div className="space-y-4">
                <div>
                  <p className="font-poppins text-sm text-purple-200 mb-3 text-center">
                    Search and select the song that solves the riddle:
                  </p>
                  <SpotifySearch
                    type="track"
                    onSelect={(track: any) => {
                      console.log('[Nebula] Song selected:', track)
                      setSelectedSong({
                        id: track.id,
                        name: track.name,
                        artist: track.artist
                      })
                    }}
                    placeholder="Search for the cosmic song..."
                  />
                </div>

                {selectedSong && (
                  <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-400/30">
                    <p className="font-poppins text-sm text-purple-200 text-center">
                      Selected: <span className="font-bold text-gold-200">{selectedSong.name}</span> by {selectedSong.artist}
                    </p>
                  </div>
                )}

                {/* Attempts */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="font-poppins text-sm text-purple-200">Attempts remaining:</span>
                  {[...Array(3)].map((_, i) => (
                    <Circle
                      key={i}
                      className={`w-3 h-3 ${i < attempts ? "text-purple-400 fill-purple-400" : "text-gray-600"}`}
                    />
                  ))}
                </div>

                <Button 
                  onClick={() => handleSubmit()}
                  className="mystical-button w-full" 
                  disabled={!selectedSong || attempts === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Guess
                    </>
                  )}
                </Button>
              </div>

              {/* Result */}
              {showResult && (
                <div className={`mt-6 p-4 rounded-lg border ${
                  isCorrect 
                    ? 'bg-green-900/20 border-green-400/30' 
                    : 'bg-purple-900/20 border-purple-400/30'
                }`}>
                  <p className="font-poppins text-sm text-center mb-2">
                    {isCorrect
                      ? "✨ The nebula parts, revealing the truth! You have unlocked the first clue."
                      : attempts > 0
                      ? "The nebula whispers... not quite right. Listen deeper to the cosmic echoes."
                      : "The mists part, revealing a fragment of the greater truth. Continue your journey."}
                  </p>
                  
                  {isCorrect && clueText && (
                    <div className="mt-3 p-3 bg-black/20 rounded">
                      <p className="font-cormorant text-gold-200 text-center italic">
                        "{clueText}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Navigation */}
          <div className="text-center">
            <Link href="/astral-nexus">
              <Button
                variant="outline"
                className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10 bg-transparent"
              >
                Continue Quest
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="glassmorphism border-green-400/50 max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <AlertDialogTitle className="font-cinzel text-2xl text-green-100 mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-green-400" />
                  Nebula Solved!
                </AlertDialogTitle>
                <AlertDialogDescription className="font-poppins text-green-200 space-y-3">
                  <p className="text-lg">
                    ✨ The nebula parts, revealing the cosmic truth!
                  </p>
                  <div className="bg-green-900/20 rounded-lg p-3 border border-green-400/30">
                    <p className="font-cormorant text-gold-200 italic">
                      "{clueText}"
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="text-2xl font-bold text-gold-300">+{earnedPoints}</span>
                    <span className="text-sm text-purple-300">points</span>
                  </div>
                </AlertDialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSuccessDialog(false)}
                className="text-green-300 hover:text-green-100 hover:bg-green-500/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowSuccessDialog(false)
                router.push('/astral-nexus')
              }}
              className="mystical-button w-full"
            >
              Continue Quest
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Failure Dialog */}
      <AlertDialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <AlertDialogContent className="glassmorphism border-purple-400/50 max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <AlertDialogTitle className="font-cinzel text-2xl text-purple-100 mb-2">
                  Not Quite Right...
                </AlertDialogTitle>
                <AlertDialogDescription className="font-poppins text-purple-200 space-y-3">
                  <p>
                    {attempts > 0 
                      ? "🌌 The nebula whispers... not quite right. Listen deeper to the cosmic echoes."
                      : "💫 The mists part, revealing a fragment of truth. Continue your journey through the other chambers."}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Circle className="w-3 h-3 text-purple-400" />
                    <span className="text-sm text-purple-300">
                      {attempts > 0 ? `${attempts} attempt${attempts !== 1 ? 's' : ''} remaining` : 'No attempts remaining'}
                    </span>
                  </div>
                </AlertDialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFailureDialog(false)}
                className="text-purple-300 hover:text-purple-100 hover:bg-purple-500/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowFailureDialog(false)}
              className="mystical-button w-full"
            >
              {attempts > 0 ? 'Try Again' : 'Continue Quest'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
