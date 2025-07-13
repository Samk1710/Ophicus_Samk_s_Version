"use client"

import type React from "react"

import { useState, useRef } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Pause, Send, Volume2, Rainbow } from "lucide-react"
import Link from "next/link"

export default function AuroraRoom() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [moodInput, setMoodInput] = useState("")
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [showScore, setShowScore] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

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

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!moodInput.trim()) return

    // Simulate mood analysis
    const score = Math.floor(Math.random() * 10) + 1
    setMoodScore(score)
    setShowScore(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={[]} currentRoom="aurora" />

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
              <audio ref={audioRef} loop onEnded={() => setIsPlaying(false)}>
                <source src="/placeholder-audio.mp3" type="audio/mpeg" />
              </audio>
            </div>

            {/* Mood Input */}
            <form onSubmit={handleMoodSubmit} className="space-y-4">
              <div>
                <label className="block font-poppins text-sm text-green-200 mb-2">
                  Describe the feeling this melody evokes:
                </label>
                <Input
                  value={moodInput}
                  onChange={(e) => setMoodInput(e.target.value)}
                  placeholder="Enter the emotion or mood you feel..."
                  className="glassmorphism border-green-400/30 text-green-100 placeholder-green-300/50"
                />
              </div>
              <Button type="submit" className="mystical-button w-full">
                <Send className="w-4 h-4 mr-2" />
                Submit Feeling
              </Button>
            </form>

            {/* Mood Score */}
            {showScore && moodScore && (
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
                <p className="font-poppins text-sm text-green-200 text-center">
                  Your feeling resonates at {moodScore}/10 with the cosmic frequency
                </p>
              </div>
            )}
          </Card>

          {/* Navigation */}
          <div className="text-center">
            <Link href="/astral-nexus">
              <Button
                variant="outline"
                className="border-green-400/30 text-green-200 hover:bg-green-500/10 bg-transparent"
              >
                Continue Quest
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
