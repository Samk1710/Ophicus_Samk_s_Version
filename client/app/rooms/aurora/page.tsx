"use client"

import React, { useState, useRef, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { CosmicLoading } from "@/components/cosmic-loading"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Play, Pause, Send, Volume2, Rainbow, Loader2, PartyPopper, XCircle, Sparkles, AlertTriangle } from "lucide-react"
import { useGameState } from "@/components/providers/game-state-provider"
import { SpotifySearch } from "@/components/spotify-search"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import Link from "next/link"

export default function AuroraRoom() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<{id: string; name: string} | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showFailureDialog, setShowFailureDialog] = useState(false)
  const [showServerErrorDialog, setShowServerErrorDialog] = useState(false)
  const [showReentryDialog, setShowReentryDialog] = useState(false)
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [audioUrl, setAudioUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clueText, setClueText] = useState("")
  const [feedbackText, setFeedbackText] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
  const { sessionId, gameSession, refreshGameState, auroraRoomEnter, setRoomEnter } = useGameState()
  const router = useRouter()
  const hasFetchedRef = useRef(false)

  console.log('[Aurora] Component mounted, session:', sessionId)

  // Confetti celebration for success
  const celebrateSuccess = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#9370DB', '#00CED1']
    })
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      })
    }, 250)
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      })
    }, 400)
  }

  useEffect(() => {
    if (showSuccessDialog && moodScore && moodScore >= 7) {
      celebrateSuccess()
    }
  }, [showSuccessDialog, moodScore])

  useEffect(() => {
    if (!sessionId) {
      console.log('[Aurora] No session ID yet, waiting...')
      return
    }

    // Check if room is already completed
    if (gameSession?.roomClues?.aurora?.completed) {
      console.log('[Aurora] Room already completed, showing reentry dialog')
      setShowReentryDialog(true)
      return
    }

    // Mark room as entered
    if (!auroraRoomEnter) {
      setRoomEnter('aurora', true)
    }

    // Prevent duplicate API calls
    if (hasFetchedRef.current) {
      console.log('[Aurora] Already fetched, skipping...')
      return
    }
    
    hasFetchedRef.current = true
    fetchAudio()
  }, [sessionId, gameSession]) // Depend on sessionId and gameSession

  const fetchAudio = async () => {
    console.log('[Aurora] Fetching audio vignette...')
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/aurora?sessionId=${sessionId}`)
      
      // Handle server errors (500+)
      if (response.status >= 500) {
        console.error('[Aurora] Server error:', response.status)
        setShowServerErrorDialog(true)
        setRoomEnter('aurora', false) // Reverse room entry state
        return
      }
      
      const data = await response.json()
      console.log('[Aurora] Audio data:', data)
      
      if (data.completed) {
        console.log('[Aurora] Room already completed, showing reentry dialog')
        setShowReentryDialog(true)
      } else {
        setAudioUrl(data.audioUrl || '')
      }
    } catch (error) {
      console.error('[Aurora] Failed to fetch:', error)
      setShowServerErrorDialog(true)
      setRoomEnter('aurora', false) // Reverse room entry state
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTrack || isSubmitting) {
      console.log('[Aurora] Cannot submit:', { selectedTrack, isSubmitting })
      return
    }

    setIsSubmitting(true)
    console.log('[Aurora] Submitting:', { track: selectedTrack })

    try {
      const response = await fetch('/api/rooms/aurora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          guessedTrackId: selectedTrack.id
        })
      })

      // Handle server errors (500+)
      if (response.status >= 500) {
        console.error('[Aurora] Server error on submit:', response.status)
        setShowServerErrorDialog(true)
        setRoomEnter('aurora', false) // Reverse room entry state
        return
      }

      const data = await response.json()
      console.log('[Aurora] Result:', data)

      setMoodScore(data.score)
      setPointsEarned(data.points || 0)
      setFeedbackText(data.feedback || '')
      setClueText(data.clue || '')

      // Show appropriate dialog based on score
      if (data.score >= 7) {
        setShowSuccessDialog(true)
      } else {
        setShowFailureDialog(true)
      }

      await refreshGameState()
    } catch (error) {
      console.error('[Aurora] Submit failed:', error)
      setShowServerErrorDialog(true)
      setRoomEnter('aurora', false) // Reverse room entry state
    } finally {
      setIsSubmitting(false)
    }
  }

  const completedRooms = gameSession?.roomClues
    ? Object.entries(gameSession.roomClues)
        .filter(([_, clue]) => clue?.completed && (clue?.points ?? 0) > 0)
        .map(([roomId]) => roomId)
    : []

  const failedRooms = gameSession?.roomClues
    ? Object.entries(gameSession.roomClues)
        .filter(([_, clue]) => clue?.completed && (clue?.points ?? 0) === 0)
        .map(([roomId]) => roomId)
    : []

  if (isLoading) {
    return <CosmicLoading message="Aurora awakens... feel the light dancing through the void" />
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={completedRooms} failedRooms={failedRooms} currentRoom="aurora" />

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="glassmorphism border-green-400/50">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400/30 to-teal-600/30 flex items-center justify-center pulse-glow">
                <PartyPopper className="w-10 h-10 text-green-300" />
              </div>
            </div>
            <AlertDialogTitle className="font-cinzel text-2xl font-bold text-center text-green-100">
              Perfect Resonance!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3">
              <p className="font-poppins text-green-200">
                Your song beautifully matches the emotional frequency!
              </p>
              
              {/* Score Display */}
              <div className="bg-green-900/30 rounded-lg p-4 border border-green-400/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < (moodScore || 0) ? "bg-green-400 shadow-lg shadow-green-400/50" : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-cormorant text-lg font-bold text-green-100">
                  Score: {moodScore}/10
                </p>
              </div>

              {/* Points Earned */}
              <div className="bg-gold-900/30 rounded-lg p-4 border border-gold-400/30">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-300" />
                  <p className="font-cinzel text-xl font-bold text-gold-100">+{pointsEarned} Points</p>
                </div>
              </div>

              {/* Feedback */}
              {feedbackText && (
                <p className="font-poppins text-sm text-green-300 italic">
                  {feedbackText}
                </p>
              )}

              {/* Clue */}
              {clueText && (
                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/30">
                  <p className="font-poppins text-xs text-purple-300 mb-1">Cosmic Clue Unlocked:</p>
                  <p className="font-poppins text-sm text-purple-100 italic">
                    {clueText}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="/astral-nexus" className="w-full">
              <Button className="mystical-button w-full">
                Continue Journey
              </Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Failure Dialog */}
      <AlertDialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <AlertDialogContent className="glassmorphism border-purple-400/50">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/30 to-orange-600/30 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
            </div>
            <AlertDialogTitle className="font-cinzel text-2xl font-bold text-center text-purple-100">
              Weak Resonance
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3">
              <p className="font-poppins text-purple-200">
                The emotional frequency doesn't quite align...
              </p>
              
              {/* Score Display */}
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < (moodScore || 0) ? "bg-purple-400" : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-cormorant text-lg font-bold text-purple-100">
                  Score: {moodScore}/10
                </p>
                <p className="font-poppins text-xs text-purple-300 mt-2">
                  Need 7+ to pass
                </p>
              </div>

              {/* Points Earned (still get some) */}
              {pointsEarned > 0 && (
                <div className="bg-gold-900/30 rounded-lg p-3 border border-gold-400/30">
                  <p className="font-cinzel text-lg font-bold text-gold-200">+{pointsEarned} Points</p>
                </div>
              )}

              {/* Feedback */}
              {feedbackText && (
                <p className="font-poppins text-sm text-purple-300 italic">
                  {feedbackText}
                </p>
              )}

              <p className="font-poppins text-xs text-yellow-300">
                The aurora remains silent. Continue your journey through other chambers.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="/astral-nexus" className="w-full">
              <Button className="mystical-button w-full">
                Continue Journey
              </Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Aurora Borealis Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-green-400/20 via-blue-500/20 to-purple-600/20 animate-pulse" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/10 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-pink-400/10 to-transparent animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Mountain Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Rainbow className="w-8 h-8 text-green-400 mr-4" />
              <h1 className="font-cinzel text-4xl font-bold glow-text text-gold-100">Aurora</h1>
              <CelestialIcon type="mystical" size="lg" className="text-green-400 ml-4" />
            </div>
            <p className="font-poppins text-sm text-purple-300 italic">Voice of Light</p>
          </div>

          {/* Audio Player Card */}
          <Card className="glassmorphism border-green-400/50 p-8 mb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/30 to-teal-600/30 flex items-center justify-center pulse-glow">
                <Rainbow className="w-8 h-8 text-green-300" />
              </div>
              <h2 className="font-cormorant text-2xl font-bold text-green-100 mb-2">Listen to the Light</h2>
              <p className="font-poppins text-green-200">Feel the melody flowing through the aurora's dance</p>
            </div>

            {/* Audio Player */}
            {audioUrl && (
              <div className="bg-black/20 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Button
                    onClick={toggleAudio}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500/30 to-teal-600/30 border border-green-400/50 hover:from-green-500/40 hover:to-teal-600/40 transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-green-900" />
                    ) : (
                      <Play className="w-6 h-6 text-green-900 ml-1" />
                    )}
                  </Button>
                  <Volume2 className="w-5 h-5 text-green-300" />
                </div>

                {/* Visualizer */}
                <div className="flex items-center justify-center gap-1 h-12">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-gradient-to-t from-green-400 to-teal-400 rounded-full transition-all duration-300 ${
                        isPlaying ? "animate-pulse" : ""
                      }`}
                      style={{
                        height: `${Math.random() * 40 + 10}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Hidden Audio Element */}
                <audio 
                  ref={audioRef} 
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
              </div>
            )}

            {/* Song Selection Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-poppins text-sm text-green-200 mb-2">
                  Which song from your library matches this emotional moment?
                </label>
                <SpotifySearch
                  type="track"
                  onSelect={(track: any) => {
                    console.log('[Aurora] Track selected:', track)
                    setSelectedTrack({
                      id: track.id,
                      name: track.name
                    })
                  }}
                  placeholder="Search for a song that fits the emotion..."
                />
                
                {selectedTrack && (
                  <div className="mt-3 bg-green-900/20 rounded-lg p-3 border border-green-400/30">
                    <p className="font-poppins text-sm text-green-200 text-center">
                      Selected: <span className="font-bold text-gold-200">{selectedTrack.name}</span>
                    </p>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="mystical-button w-full"
                disabled={!selectedTrack || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Song
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Hint Card */}
          <div className="text-center">
            <Card className="glassmorphism border-yellow-400/50 p-4">
              <div className="flex items-center justify-center">
                <CelestialIcon type="sun" className="text-yellow-400 mr-2" />
                <p className="font-poppins text-sm text-yellow-200">
                  Listen deeply - suggest a song that matches the emotional moment you hear
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Server Error Dialog */}
      <AlertDialog open={showServerErrorDialog} onOpenChange={setShowServerErrorDialog}>
        <AlertDialogContent className="glassmorphism border-red-400/50 max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/30 to-orange-600/30 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
            </div>
            <AlertDialogTitle className="font-cinzel text-2xl font-bold text-center text-red-100">
              Server Down
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3">
              <p className="font-poppins text-red-200">
                The cosmic servers are experiencing turbulence. Please try again later.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowServerErrorDialog(false)
                router.push('/astral-nexus')
              }}
              className="mystical-button w-full"
            >
              Return to Nexus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reentry Prevention Dialog */}
      <AlertDialog open={showReentryDialog} onOpenChange={setShowReentryDialog}>
        <AlertDialogContent className="glassmorphism border-yellow-400/50 max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/30 to-amber-600/30 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
            <AlertDialogTitle className="font-cinzel text-2xl font-bold text-center text-yellow-100">
              Chamber Already Explored
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3">
              <p className="font-poppins text-yellow-200">
                You can't enter this room again. The cosmic secrets have already been revealed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowReentryDialog(false)
                router.push('/astral-nexus')
              }}
              className="mystical-button w-full"
            >
              Return to Nexus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
