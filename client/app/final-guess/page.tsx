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
import { Send, Globe, Loader2, XCircle } from "lucide-react"
import { useGameState } from "@/components/providers/game-state-provider"
import { SpotifySearch } from "@/components/spotify-search"
import { useRouter } from "next/navigation"

export default function FinalGuessPage() {
  const router = useRouter()
  const [selectedSong, setSelectedSong] = useState<{ id: string; name: string; artist: string } | null>(null)
  const [showFailureDialog, setShowFailureDialog] = useState(false)
  const [attemptsRemaining, setAttemptsRemaining] = useState(3)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { sessionId, gameSession, refreshGameState, setSessionId } = useGameState()

  console.log('[FinalGuess] === RENDER ===');
  console.log('[FinalGuess] showFailureDialog:', showFailureDialog);
  console.log('[FinalGuess] Session ID:', sessionId)
  console.log('[FinalGuess] Game Session:', gameSession)
  console.log('[FinalGuess] Selected Song:', selectedSong)

  // Redirect to nexus if no session exists
  useEffect(() => {
    if (!sessionId) {
      console.log('[FinalGuess] No session found, redirecting to nexus');
      router.push('/astral-nexus');
    }
  }, [sessionId, router]);

  // Auto-complete incomplete rooms with 0 points when page loads
  useEffect(() => {
    if (!gameSession || !sessionId) return;

    const completedRooms = gameSession.roomClues
      ? Object.entries(gameSession.roomClues)
          .filter(([_, clue]) => clue?.completed)
          .map(([roomId]) => roomId)
      : [];

    console.log('[FinalGuess] Completed rooms:', completedRooms);

    // If less than 4 rooms completed, mark the rest as skipped (0 points)
    if (completedRooms.length < 4) {
      const allRooms = ['nebula', 'cradle', 'comet', 'aurora'];
      const incompleteRooms = allRooms.filter(room => !completedRooms.includes(room));
      
      console.log('[FinalGuess] Auto-completing incomplete rooms with 0 points:', incompleteRooms);
      
      // Mark each incomplete room as skipped
      incompleteRooms.forEach(async (roomId) => {
        try {
          await fetch('/api/rooms/skip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, roomId }),
          });
        } catch (error) {
          console.error('[FinalGuess] Failed to skip room:', roomId, error);
        }
      });
    }
  }, [gameSession, sessionId]);

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

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json()
      console.log('[FinalGuess] ======= FULL API RESPONSE =======');
      console.log(JSON.stringify(data, null, 2));
      console.log('[FinalGuess] ===================================');
      console.log('[FinalGuess] data.correct:', data.correct)
      console.log('[FinalGuess] data.gameOver:', data.gameOver)
      console.log('[FinalGuess] data.attemptsRemaining:', data.attemptsRemaining)
      console.log('[FinalGuess] data.cosmicSong:', data.cosmicSong)
      console.log('[FinalGuess] data.questSummary:', data.questSummary)

      if (data.correct) {
        console.log('[FinalGuess] ✅ CORRECT! Redirecting to results page...');
        
        // Store quest data in localStorage and redirect to results page
        if (data.questSummary) {
          localStorage.setItem('questResultData', JSON.stringify(data.questSummary))
          router.push(`/results?result=success&data=${encodeURIComponent(JSON.stringify(data.questSummary))}`)
        }
      } else {
        setAttemptsRemaining(data.attemptsRemaining || 0)
        console.log('[FinalGuess] Incorrect guess. Attempts remaining:', data.attemptsRemaining)
        
        // If game over (no attempts remaining), redirect to results page
        if (data.gameOver === true) {
          console.log('[FinalGuess] 🚨 GAME OVER - Redirecting to results page...');
          
          // Store quest data in localStorage and redirect to results page
          if (data.questSummary) {
            localStorage.setItem('questResultData', JSON.stringify(data.questSummary))
            router.push(`/results?result=failure&data=${encodeURIComponent(JSON.stringify(data.questSummary))}`)
          }
        } else if (data.attemptsRemaining > 0) {
          // Still have attempts, show regular failure dialog
          console.log('[FinalGuess] Still have attempts, showing failure dialog');
          setShowFailureDialog(true);
        } else {
          console.error('[FinalGuess] ⚠️ WARNING: No attempts remaining but gameOver is not true!');
          console.error('[FinalGuess] data.gameOver:', data.gameOver);
          console.error('[FinalGuess] data.attemptsRemaining:', data.attemptsRemaining);
        }
      }

      // Only refresh game state if the session is not completed/archived
      // to avoid 404 errors
      if (!data.gameOver && !data.correct) {
        console.log('[FinalGuess] Refreshing game state...');
        try {
          await refreshGameState();
        } catch (error) {
          console.error('[FinalGuess] Error refreshing game state (non-critical):', error);
        }
      } else {
        console.log('[FinalGuess] Skipping game state refresh - game is over');
      }
    } catch (error) {
      console.error('[FinalGuess] Failed to submit guess:', error)
      alert('Failed to submit your guess. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden cosmic-bg">
        <CosmicBackground />
        <ProgressTracker completedRooms={gameSession?.roomClues 
          ? Object.entries(gameSession.roomClues)
              .filter(([_, clue]) => clue?.completed)
              .map(([roomId]) => roomId)
          : []} 
        />

        {/* Failure Dialog - For Incorrect Attempts (Still Have Tries Left) */}
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
                  Your guess: <span className="font-bold text-purple-100">"{selectedSong?.name}"</span> {selectedSong?.artist}
                </p>
                <p className="font-poppins text-purple-300">
                  You have <span className="font-bold text-yellow-300">{attemptsRemaining}</span> {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  setShowFailureDialog(false)
                  setSelectedSong(null)
                }}
                className="mystical-button w-full"
              >
                Try Again
              </Button>
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
                <p className="font-poppins text-purple-200 mb-6">The stars have
                  aligned, and the universe awaits your final answer.
                </p>
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
                      Selected: <span className="font-bold text-gold-200">{selectedSong.name}</span> {selectedSong.artist}
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
    </>
  )
}
