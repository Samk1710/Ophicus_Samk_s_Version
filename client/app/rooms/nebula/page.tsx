"use client"

import type React from "react"

import { useState } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Circle } from "lucide-react"
import Link from "next/link"

export default function NebulaRoom() {
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState(3)
  const [showResult, setShowResult] = useState(false)

  const riddle = `In chambers of echo where silence once dwelt,
A voice breaks the void with passion unfelt.
Through valleys of sound and mountains of beat,
Where rhythm and melody tenderly meet.

Born from the heart of a queen of the night,
Her voice pierces darkness, bringing forth light.
In purple she reigns, with power so true,
What song holds the key to this celestial clue?`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (attempts > 0) {
      setAttempts(attempts - 1)
      // Here you would check the answer
      setShowResult(true)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={[]} currentRoom="nebula" />

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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Enter your guess for the song..."
                    className="glassmorphism border-purple-400/30 text-purple-100 placeholder-purple-300/50 text-center"
                    disabled={attempts === 0}
                  />
                </div>

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

                <Button type="submit" className="mystical-button w-full" disabled={!guess.trim() || attempts === 0}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Guess
                </Button>
              </form>

              {/* Result */}
              {showResult && (
                <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-400/30">
                  <p className="font-poppins text-sm text-purple-200 text-center">
                    {attempts > 0
                      ? "The nebula whispers... not quite right. Listen deeper to the cosmic echoes."
                      : "The mists part, revealing a fragment of the greater truth. Continue your journey."}
                  </p>
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
    </div>
  )
}
