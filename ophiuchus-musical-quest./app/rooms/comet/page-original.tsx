"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Zap, Flame } from "lucide-react"
import Link from "next/link"

export default function CometRoom() {
  const [timeLeft, setTimeLeft] = useState(10)
  const [showLyric, setShowLyric] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [guess, setGuess] = useState("")
  const [cometVisible, setCometVisible] = useState(false)

  const lyric = "Is this the real life? Is this just fantasy?"

  useEffect(() => {
    // Start comet animation
    const cometTimer = setTimeout(() => {
      setCometVisible(true)
      setShowLyric(true)
    }, 1000)

    return () => clearTimeout(cometTimer)
  }, [])

  useEffect(() => {
    if (showLyric && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && showLyric) {
      setShowLyric(false)
      setShowInput(true)
    }
  }, [timeLeft, showLyric])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle guess submission
    console.log("Guess:", guess)
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={[]} currentRoom="comet" />

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
            {showLyric && (
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
            {showInput && (
              <div className="space-y-6">
                <div className="text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                  <h3 className="font-cormorant text-xl font-bold text-orange-100 mb-2">The Comet Has Passed</h3>
                  <p className="font-poppins text-orange-200 mb-6">What lyric did you glimpse in the cosmic flash?</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Enter the lyric you saw..."
                    className="glassmorphism border-orange-400/30 text-orange-100 placeholder-orange-300/50 text-center"
                  />
                  <Button type="submit" className="mystical-button w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Answer
                  </Button>
                </form>
              </div>
            )}

            {/* Waiting State */}
            {!showLyric && !showInput && (
              <div className="text-center">
                <p className="font-poppins text-orange-200 mb-4">Prepare yourself... the comet approaches...</p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400" />
                </div>
              </div>
            )}
          </Card>

          {/* Navigation */}
          <div className="text-center">
            <Link href="/astral-nexus">
              <Button
                variant="outline"
                className="border-orange-400/30 text-orange-200 hover:bg-orange-500/10 bg-transparent"
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
