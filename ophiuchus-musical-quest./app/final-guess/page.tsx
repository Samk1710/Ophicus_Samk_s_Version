"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
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
import { Send, Crown, Globe, Loader2, PartyPopper, XCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { useGameState } from "@/components/providers/game-state-provider"
import { SpotifySearch } from "@/components/spotify-search"
import confetti from "canvas-confetti"

export default function FinalGuessPage() {
  const [selectedSong, setSelectedSong] = useState<{ id: string; name: string; artist: string } | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showFailureDialog, setShowFailureDialog] = useState(false)
  const [zodiacTitle, setZodiacTitle] = useState("")
  const [zodiacDescription, setZodiacDescription] = useState("")
  const [zodiacImageUrl, setZodiacImageUrl] = useState("")
  const [attemptsRemaining, setAttemptsRemaining] = useState(2)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { sessionId, gameSession, refreshGameState } = useGameState()

  console.log('[FinalGuess] Session ID:', sessionId)
  console.log('[FinalGuess] Game Session:', gameSession)
  console.log('[FinalGuess] Selected Song:', selectedSong)

  // Epic confetti celebration for final success
  const celebrateVictory = () => {
    const duration = 5000 // 5 seconds of confetti!
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 100 * (timeLeft / duration)
      
      // Shoot confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#9370DB', '#00CED1']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#9370DB', '#00CED1']
      })
    }, 250)

    // Extra burst at the center
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 180,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#9370DB', '#00CED1']
      })
    }, 500)
  }

  useEffect(() => {
    if (showSuccessDialog) {
      celebrateVictory()
    }
  }, [showSuccessDialog])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSong || !sessionId) {
      console.log('[FinalGuess] Missing required data:', { selectedSong, sessionId })
      return
    }

    setIsSubmitting(true)
    console.log('[FinalGuess] Submitting guess:', selectedSong)

    try {
      const response = await fetch('/api/final-guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          guessedTrackId: selectedSong.id,
        }),
      })

      const data = await response.json()
      console.log('[FinalGuess] Response:', data)

      if (data.correct) {
        // Parse Ophiuchus identity
        let identity = data.ophiuchusIdentity
        if (typeof identity === 'string') {
          try {
            identity = JSON.parse(identity)
          } catch (e) {
            console.error('[FinalGuess] Failed to parse identity:', e)
          }
        }
        
        setZodiacTitle(identity?.title || "Celestial Harmonist of the 13th House")
        setZodiacDescription(identity?.description || "")
        setZodiacImageUrl(identity?.imageUrl || "")
        console.log('[FinalGuess] CORRECT! Ophiuchus Identity:', identity)
        
        setShowSuccessDialog(true)
      } else {
        setAttemptsRemaining(data.attemptsRemaining || 0)
        console.log('[FinalGuess] Incorrect guess. Attempts remaining:', data.attemptsRemaining)
        
        setShowFailureDialog(true)
      }

      await refreshGameState()
    } catch (error) {
      console.error('[FinalGuess] Failed to submit guess:', error)
      alert('Failed to submit your guess. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={gameSession?.roomClues 
        ? Object.entries(gameSession.roomClues)
            .filter(([_, clue]) => clue?.completed)
            .map(([roomId]) => roomId)
        : []} 
      />

      {/* Success Dialog - Epic Victory */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="glassmorphism border-gold-400/50 max-w-2xl">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400/30 to-yellow-600/30 flex items-center justify-center pulse-glow">
                <Crown className="w-12 h-12 text-gold-300" />
              </div>
            </div>
            <AlertDialogTitle className="font-cinzel text-3xl font-bold text-center glow-text text-gold-100">
              🎊 COSMIC ASCENSION! 🎊
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              <p className="font-poppins text-lg text-gold-200">
                You have unlocked the ultimate cosmic truth!
              </p>
              
              <div className="bg-black/30 rounded-lg p-4 border border-gold-400/30">
                <p className="font-cormorant text-xl font-bold text-gold-100 mb-2">Your Cosmic Song</p>
                <p className="font-poppins text-gold-200 italic">
                  "{selectedSong?.name}" by {selectedSong?.artist}
                </p>
              </div>

              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/30">
                <div className="flex justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </div>
                <p className="font-cinzel text-lg font-bold text-purple-100 mb-2">{zodiacTitle}</p>
                {zodiacDescription && (
                  <p className="font-poppins text-sm text-purple-300 italic">
                    {zodiacDescription}
                  </p>
                )}
              </div>

              {zodiacImageUrl && (
                <div className="mt-4">
                  <img 
                    src={zodiacImageUrl} 
                    alt="Your Ophiuchus Identity"
                    className="w-full rounded-lg border border-gold-400/30"
                  />
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="mystical-button w-full"
            >
              <PartyPopper className="w-5 h-5 mr-2" />
              Share Your Journey
            </Button>
            <Link href="/astral-nexus" className="w-full">
              <Button
                variant="outline"
                className="border-gold-400/30 text-gold-200 hover:bg-gold-500/10 w-full bg-transparent"
              >
                Return to Nexus
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
              The Stars Have Not Aligned
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3">
              <p className="font-poppins text-purple-200">
                Your guess: <span className="font-bold text-purple-100">"{selectedSong?.name}"</span> by {selectedSong?.artist}
              </p>
              <p className="font-poppins text-purple-300">
                {attemptsRemaining > 0 ? (
                  <>You have <span className="font-bold text-yellow-300">{attemptsRemaining}</span> {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining.</>
                ) : (
                  <span className="text-red-400 font-bold">All attempts exhausted. The cosmic song remains hidden.</span>
                )}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            {attemptsRemaining > 0 ? (
              <Button
                onClick={() => {
                  setShowFailureDialog(false)
                  setSelectedSong(null)
                }}
                className="mystical-button w-full"
              >
                Try Again
              </Button>
            ) : (
              <Link href="/astral-nexus" className="w-full">
                <Button className="mystical-button w-full">
                  Return to Nexus
                </Button>
              </Link>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Earth from Space Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <Globe className="w-96 h-96 text-blue-400 animate-spin" style={{ animationDuration: "60s" }} />
      </div>

      {/* Starry Sky Opening Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-black/40" />
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <CelestialIcon type="eye" size="xl" className="text-gold-400 mr-4" />
              <h1 className="font-cinzel text-4xl font-bold glow-text text-gold-100">Final Revelation</h1>
              <CelestialIcon type="mystical" size="xl" className="text-gold-400 ml-4" />
            </div>
            <p className="font-poppins text-sm text-purple-300 italic">The Cosmic Convergence</p>
          </div>

          <Card className="glassmorphism border-purple-400/50 p-8 mb-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-600/30 flex items-center justify-center pulse-glow">
                <CelestialIcon type="mystical" size="xl" className="text-purple-300" />
              </div>
              <h2 className="font-cinzel text-3xl font-bold glow-text mb-4 text-gold-100">The Moment of Truth</h2>
              <p className="font-poppins text-purple-200 mb-6">
                You have journeyed through the five cosmic chambers and gathered the celestial clues. The stars have
                aligned, and the universe awaits your final answer.
              </p>
            </div>

            {/* Clue Summary */}
            <div className="bg-black/20 rounded-lg p-6 mb-8 border border-purple-400/30">
              <h3 className="font-cormorant text-xl font-bold text-purple-100 mb-4 text-center">
                Cosmic Clues Gathered
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CelestialIcon type="mystical" size="sm" className="text-purple-300" />
                  <span className="text-purple-200">Nebula's riddle solved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CelestialIcon type="planet" size="sm" className="text-blue-300" />
                  <span className="text-purple-200">Artist's origin revealed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CelestialIcon type="constellation" size="sm" className="text-orange-300" />
                  <span className="text-purple-200">Lyric fragment captured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CelestialIcon type="sun" size="sm" className="text-green-300" />
                  <span className="text-purple-200">Emotional resonance felt</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2 justify-center">
                  <CelestialIcon type="eye" size="sm" className="text-yellow-300" />
                  <span className="text-purple-200">Musical memories aligned</span>
                </div>
              </div>
            </div>

            {/* Final Question */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h3 className="font-cormorant text-2xl font-bold text-purple-100 mb-4">What is your Cosmic Song?</h3>
                <p className="font-poppins text-sm text-purple-300 mb-6">
                  Search and select the song that echoes through the 13th zodiac
                </p>
              </div>

              <SpotifySearch
                type="track"
                onSelect={(track: any) => {
                  console.log('[FinalGuess] Song selected:', track)
                  setSelectedSong({
                    id: track.id,
                    name: track.name,
                    artist: track.artist,
                  })
                }}
                placeholder="Search for your cosmic song..."
              />

              {selectedSong && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/30">
                  <p className="font-poppins text-sm text-purple-200 text-center">
                    Selected: <span className="font-bold text-gold-200">{selectedSong.name}</span> by {selectedSong.artist}
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="mystical-button w-full text-lg py-4"
                disabled={!selectedSong || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Revealing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Reveal the Cosmic Truth
                    <CelestialIcon type="mystical" size="sm" className="ml-3" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Mystical Elements */}
          <div className="text-center">
            <p className="font-poppins text-xs text-purple-400 italic">
              "In the silence between the notes, the universe whispers its secrets"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
