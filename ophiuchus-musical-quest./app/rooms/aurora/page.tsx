"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Send, Volume2, Rainbow, Loader2 } from "lucide-react"
import { useGameState } from "@/components/providers/game-state-provider"
import { SpotifySearch } from "@/components/spotify-search"
import { useRouter } from "next/navigation"

export default function AuroraRoom() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<{id: string; name: string} | null>(null)
  const [showScore, setShowScore] = useState(false)
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [audioUrl, setAudioUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [clueText, setClueText] = useState("")
  const [feedbackText, setFeedbackText] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
  const { sessionId, gameSession, refreshGameState } = useGameState()
  const router = useRouter()

  console.log('[Aurora] Component mounted, session:', sessionId)

  useEffect(() => {
    if (!sessionId) {
      console.log('[Aurora] No session ID, redirecting')
      router.push('/home')
      return
    }
    fetchAudio()
  }, [sessionId])

  const fetchAudio = async () => {
    console.log('[Aurora] Fetching audio vignette...')
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/aurora?sessionId=${sessionId}`)
      const data = await response.json()
      console.log('[Aurora] Audio data:', data)
      
      if (data.completed) {
        setIsCompleted(true)
        setClueText(data.clue || '')
      } else {
        setAudioUrl(data.audioUrl || '')
      }
    } catch (error) {
      console.error('[Aurora] Failed to fetch:', error)
      alert('Failed to load audio. Please try again.')
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

      const data = await response.json()
      console.log('[Aurora] Result:', data)

      setMoodScore(data.score)
      setFeedbackText(data.feedback || '')
      setShowScore(true)

      if (data.passed) {
        setIsCompleted(true)
        setClueText(data.clue || '')
        await refreshGameState()
      }
    } catch (error) {
      console.error('[Aurora] Submit failed:', error)
      alert('Failed to submit. Please try again.')
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
        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={completedRooms} currentRoom="aurora" />

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
            {audioUrl && !isCompleted && (
              <div className="bg-black/20 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Button
                    onClick={toggleAudio}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500/30 to-teal-600/30 border border-green-400/50 hover:from-green-500/40 hover:to-teal-600/40 transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-green-300" />
                    ) : (
                      <Play className="w-6 h-6 text-green-300 ml-1" />
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

            {/* Song Selection */}
            {!isCompleted && (
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
            )}

            {/* Mood Score */}
            {showScore && moodScore !== null && (
              <div className="mt-6 p-4 bg-green-900/20 rounded-lg border border-green-400/30">
                <h3 className="font-cormorant text-lg font-bold text-green-100 mb-3 text-center">
                  Emotional Resonance
                </h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        i < moodScore ? "bg-green-400 shadow-lg shadow-green-400/50" : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-poppins text-sm text-green-200 text-center mb-2">
                  Your song resonates at {moodScore}/10 with the cosmic frequency
                </p>
                {feedbackText && (
                  <p className="font-poppins text-xs text-green-300 text-center italic">
                    {feedbackText}
                  </p>
                )}
                {!isCompleted && (
                  <p className="font-poppins text-xs text-yellow-300 text-center mt-3">
                    {moodScore >= 7 ? '✨ Excellent match!' : '💫 Try another song for a better match (need 7+ to pass)'}
                  </p>
                )}
              </div>
            )}

            {/* Completed State */}
            {isCompleted && clueText && (
              <div className="space-y-6 text-center">
                <div className="text-center">
                  <Rainbow className="w-12 h-12 mx-auto mb-4 text-green-400" />
                  <h3 className="font-cormorant text-xl font-bold text-green-100 mb-2">Chamber Complete!</h3>
                </div>
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-400/30">
                  <p className="font-poppins text-sm text-green-200 italic">
                    {clueText}
                  </p>
                </div>
              </div>
            )}
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
    </div>
  )
}
