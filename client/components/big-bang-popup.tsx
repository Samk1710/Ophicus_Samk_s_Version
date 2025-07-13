"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CelestialIcon } from "@/components/celestial-icon"
import { X } from "lucide-react"

interface BigBangPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function BigBangPopup({ isOpen, onClose }: BigBangPopupProps) {
  const [stage, setStage] = useState(0)
  const [progress, setProgress] = useState(0)

  const stages = [
    "Initiating cosmic consciousness...",
    "Aligning celestial frequencies...",
    "Awakening the 13th zodiac...",
    "Channeling musical energies...",
    "The Big Bang of your musical universe begins...",
    "Your cosmic realm is ready!",
  ]

  useEffect(() => {
    if (!isOpen) {
      setStage(0)
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onClose()
            // Redirect to astral nexus
            window.location.href = "/astral-nexus"
          }, 1000)
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isOpen, onClose])

  useEffect(() => {
    const stageIndex = Math.floor((progress / 100) * stages.length)
    setStage(Math.min(stageIndex, stages.length - 1))
  }, [progress, stages.length])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Expanding Universe Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-gold-400/30 via-purple-500/30 to-blue-500/30"
          style={{
            width: `${progress * 8}px`,
            height: `${progress * 8}px`,
            animation: "pulse 2s infinite",
          }}
        />

        {/* Particle Effects */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold-400 rounded-full animate-ping"
            style={{
              left: `${50 + (Math.cos((i * 18 * Math.PI) / 180) * progress) / 2}%`,
              top: `${50 + (Math.sin((i * 18 * Math.PI) / 180) * progress) / 2}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Popup Content */}
      <Card className="glassmorphism border-gold-400/50 p-8 max-w-md w-full mx-4 relative z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-purple-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          {/* Central Symbol */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-500/30 to-purple-600/30 flex items-center justify-center pulse-glow">
            <CelestialIcon
              type="eye"
              size="lg"
              className="text-gold-400"
              style={{
                transform: `scale(${1 + progress / 200})`,
                transition: "transform 0.1s ease-out",
              }}
            />
          </div>

          {/* Title */}
          <h2 className="font-cinzel text-2xl font-bold glow-text mb-4 text-gold-100">Cosmic Genesis</h2>

          {/* Stage Text */}
          <p className="font-poppins text-purple-200 mb-6 min-h-[1.5rem]">{stages[stage]}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700/30 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-gold-400 via-purple-500 to-blue-500 h-3 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Progress Percentage */}
          <p className="font-poppins text-sm text-gold-300">{Math.round(progress)}% Complete</p>

          {/* Mystical Quote */}
          {progress > 80 && (
            <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-400/30 animate-fade-in">
              <p className="font-cormorant text-sm text-purple-200 italic">
                "In the beginning was the Word, and the Word was Music, and the Music was with the Stars..."
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
