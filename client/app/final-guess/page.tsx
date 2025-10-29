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
import { QuestSummary } from "@/components/quest-summary"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"

export default function FinalGuessPage() {
  const router = useRouter()
  const [selectedSong, setSelectedSong] = useState<{ id: string; name: string; artist: string } | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showQuestSummary, setShowQuestSummary] = useState(false)
  const [showFailureDialog, setShowFailureDialog] = useState(false)
  const [showGameOverDialog, setShowGameOverDialog] = useState(false)
  const [showFinalSummary, setShowFinalSummary] = useState(false)
  const [finalStatus, setFinalStatus] = useState<'success' | 'failure' | null>(null)
  const [zodiacTitle, setZodiacTitle] = useState("")
  const [zodiacDescription, setZodiacDescription] = useState("")
  const [zodiacImageUrl, setZodiacImageUrl] = useState("")
  const [attemptsRemaining, setAttemptsRemaining] = useState(3)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questSummaryData, setQuestSummaryData] = useState<any>(null)
  const [revealedCosmicSong, setRevealedCosmicSong] = useState<any>(null)
  const { sessionId, gameSession, refreshGameState, setSessionId } = useGameState()

  console.log('[FinalGuess] === RENDER ===');
  console.log('[FinalGuess] showGameOverDialog:', showGameOverDialog);
  console.log('[FinalGuess] showFailureDialog:', showFailureDialog);
  console.log('[FinalGuess] revealedCosmicSong:', revealedCosmicSong);
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

  // Debug state changes
  useEffect(() => {
    console.log('[FinalGuess] State updated:');
    console.log('  - showGameOverDialog:', showGameOverDialog);
    console.log('  - showFailureDialog:', showFailureDialog);
    console.log('  - revealedCosmicSong:', revealedCosmicSong);
    console.log('  - questSummaryData:', questSummaryData);
  }, [showGameOverDialog, showFailureDialog, revealedCosmicSong, questSummaryData]);

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
        
        // Store quest summary data
        if (data.questSummary) {
          setQuestSummaryData(data.questSummary)
        }
        
        // DON'T clear session yet - wait for "End Quest" button
        console.log('[FinalGuess] Game complete, waiting for user to end quest');
        
        setFinalStatus('success');
        setShowSuccessDialog(true);
      } else {
        setAttemptsRemaining(data.attemptsRemaining || 0)
        console.log('[FinalGuess] Incorrect guess. Attempts remaining:', data.attemptsRemaining)
        
        // Store quest summary data if game is over
        if (data.questSummary) {
          console.log('[FinalGuess] Setting quest summary data:', data.questSummary);
          setQuestSummaryData(data.questSummary)
        }
        
        // If game over (no attempts remaining), show red popup with cosmic song
        if (data.gameOver === true) {
          console.log('[FinalGuess] 🚨 GAME OVER DETECTED!');
          console.log('[FinalGuess] Cosmic song data:', JSON.stringify(data.cosmicSong, null, 2));
          console.log('[FinalGuess] Quest summary data:', JSON.stringify(data.questSummary, null, 2));
          
          // Set all states synchronously
          const cosmicSong = data.cosmicSong;
          console.log('[FinalGuess] Setting revealedCosmicSong:', cosmicSong);
          setRevealedCosmicSong(cosmicSong);
          
          console.log('[FinalGuess] Setting finalStatus to failure');
          setFinalStatus('failure');
          
          console.log('[FinalGuess] Setting showGameOverDialog to TRUE');
          setShowGameOverDialog(true);
          
          // Force a small delay to ensure state updates
          setTimeout(() => {
            console.log('[FinalGuess] After timeout - showGameOverDialog should be:', showGameOverDialog);
          }, 100);
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

        {/* Quest Summary */}
        {showQuestSummary && questSummaryData && (
          <QuestSummary
            isOpen={showQuestSummary}
            onClose={() => setShowQuestSummary(false)}
            questData={questSummaryData}
          />
        )}

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
                onClick={() => {
                  setShowSuccessDialog(false)
                  if (questSummaryData) {
                    setShowQuestSummary(true)
                  }
                }}
                className="mystical-button w-full"
              >
                <PartyPopper className="w-5 h-5 mr-2" />
                View Quest Summary
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

        {/* Game Over Dialog - Red Popup with Cosmic Song Revealed */}
        <AlertDialog open={showGameOverDialog} onOpenChange={setShowGameOverDialog}>
          <AlertDialogContent className="glassmorphism border-red-400/50 max-w-2xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500/30 to-orange-600/30 flex items-center justify-center pulse-glow">
                  <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
                </div>
              </div>
              <AlertDialogTitle className="font-cinzel text-2xl sm:text-3xl font-bold text-center glow-text text-red-400">
                Quest Failed
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center space-y-3 sm:space-y-4">
                <p className="font-poppins text-base sm:text-lg text-red-300">
                  You have exhausted all 3 attempts. The cosmic truth is revealed...
                </p>
                
                {revealedCosmicSong && (
                  <div className="bg-red-900/30 rounded-lg p-3 sm:p-4 border border-red-400/50">
                    <p className="font-cormorant text-lg sm:text-xl font-bold text-red-100 mb-3">The Cosmic Song Was:</p>
                    {revealedCosmicSong.imageUrl && (
                      <div className="mb-3">
                        <img 
                          src={revealedCosmicSong.imageUrl} 
                          alt={revealedCosmicSong.name}
                          className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-lg border-2 border-red-400/50 object-cover"
                        />
                      </div>
                    )}
                    <p className="font-poppins text-base sm:text-lg text-red-100 font-bold break-words">
                      "{revealedCosmicSong.name}"
                    </p>
                    <p className="font-poppins text-sm sm:text-base text-red-200 mt-1">
                      by {revealedCosmicSong.artists?.join(', ')}
                    </p>
                    {revealedCosmicSong.spotifyUrl && (
                      <a 
                        href={revealedCosmicSong.spotifyUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-xs sm:text-sm text-green-400 hover:text-green-300 underline"
                      >
                        Listen on Spotify ↗
                      </a>
                    )}
                  </div>
                )}

                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-red-400/30">
                  <p className="font-poppins text-sm sm:text-base text-red-300">
                    Your final guess: <span className="font-bold text-red-100">"{selectedSong?.name}"</span> by {selectedSong?.artist}
                  </p>
                  <p className="font-poppins text-xs sm:text-sm text-orange-300 mt-2">
                    You've earned 25 consolation points for your cosmic journey.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
              <Button
                onClick={() => {
                  setShowGameOverDialog(false)
                  if (questSummaryData) {
                    setShowQuestSummary(true)
                  }
                }}
                className="mystical-button w-full text-sm sm:text-base bg-red-600/20 hover:bg-red-600/30 border-red-400/50"
              >
                <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                View Quest Summary
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
                  Your guess: <span className="font-bold text-purple-100">"{selectedSong?.name}"</span> by {selectedSong?.artist}
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
    </>
  )
}
