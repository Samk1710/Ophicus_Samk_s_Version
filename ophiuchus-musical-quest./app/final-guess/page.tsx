"use client"

import type React from "react"

import { useState } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Crown, Globe } from "lucide-react"
import Link from "next/link"

export default function FinalGuessPage() {
  const [cosmicSong, setCosmicSong] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [zodiacTitle, setZodiacTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cosmicSong.trim()) return

    // Simulate answer checking
    const correct = Math.random() > 0.5 // Random for demo
    setIsCorrect(correct)

    if (correct) {
      setZodiacTitle("Celestial Harmonist of the 13th House")
    }

    setShowResult(true)
  }

  if (showResult) {
    return (
      <div className="min-h-screen relative overflow-hidden cosmic-bg">
        <CosmicBackground />

        {/* Earth from Space Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <Globe className="w-96 h-96 text-blue-400 animate-spin" style={{ animationDuration: "60s" }} />
        </div>

        {isCorrect ? (
          // Success - Ascension
          <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
            <div className="max-w-2xl mx-auto text-center">
              {/* Ascension Animation */}
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-400/30 to-yellow-600/30 flex items-center justify-center pulse-glow animate-bounce">
                  <Crown className="w-16 h-16 text-gold-300" />
                </div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>

              <Card className="glassmorphism border-gold-400/50 p-8">
                <h1 className="font-cinzel text-4xl font-bold glow-text mb-4 text-gold-100">ASCENSION</h1>
                <p className="font-poppins text-xl text-gold-200 mb-6">You have unlocked the cosmic truth!</p>

                <div className="bg-black/20 rounded-lg p-6 mb-6 border border-gold-400/30">
                  <h2 className="font-cormorant text-2xl font-bold text-gold-100 mb-3">Your Cosmic Song</h2>
                  <p className="font-poppins text-lg text-gold-200 italic">"{cosmicSong}"</p>
                </div>

                <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-400/30">
                  <Crown className="w-8 h-8 mx-auto mb-3 text-purple-300" />
                  <h3 className="font-cinzel text-xl font-bold text-purple-100 mb-2">Your Zodiac Title</h3>
                  <p className="font-cormorant text-lg text-purple-200">{zodiacTitle}</p>
                </div>

                <div className="mt-8">
                  <Button className="mystical-button">
                    <CelestialIcon type="mystical" size="sm" className="mr-2" />
                    Share Your Cosmic Journey
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          // Failure - Cosmic Fog
          <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            <div className="relative max-w-2xl mx-auto text-center">
              <Card className="glassmorphism border-gray-400/50 p-8">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-500/30 to-gray-700/30 flex items-center justify-center">
                    <CelestialIcon type="moon" size="xl" className="text-gray-400" />
                  </div>
                  <h1 className="font-cinzel text-3xl font-bold text-gray-100 mb-4">The Cosmic Fog Descends</h1>
                  <p className="font-poppins text-gray-200 mb-6">
                    The stars have not aligned. The cosmic song remains hidden in the void.
                  </p>
                </div>

                <div className="bg-black/20 rounded-lg p-6 mb-6">
                  <p className="font-poppins text-gray-300">Your guess: "{cosmicSong}"</p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      setShowResult(false)
                      setCosmicSong("")
                    }}
                    className="mystical-button w-full"
                  >
                    Try Again
                  </Button>
                  <Link href="/astral-nexus">
                    <Button
                      variant="outline"
                      className="border-gray-400/30 text-gray-200 hover:bg-gray-500/10 w-full bg-transparent"
                    >
                      Return to Nexus
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={["nebula", "cradle", "comet", "aurora", "nova"]} />

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
                  Speak the title that echoes through the 13th zodiac
                </p>
              </div>

              <Input
                value={cosmicSong}
                onChange={(e) => setCosmicSong(e.target.value)}
                placeholder="Enter the cosmic song title..."
                className="glassmorphism border-purple-400/30 text-purple-100 placeholder-purple-300/50 text-center text-lg py-4"
              />

              <Button type="submit" className="mystical-button w-full text-lg py-4">
                <Send className="w-5 h-5 mr-3" />
                Reveal the Cosmic Truth
                <CelestialIcon type="mystical" size="sm" className="ml-3" />
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
