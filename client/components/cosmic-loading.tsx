"use client"

import { useState, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"

interface CosmicLoadingProps {
  message?: string
}

export function CosmicLoading({ message = "Aligning cosmic frequencies..." }: CosmicLoadingProps) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 3
      })
    }, 50)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg flex items-center justify-center">
      <CosmicBackground />
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Expanding Universe Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-gold-400/20 via-purple-500/20 to-blue-500/20"
          style={{
            width: `${progress * 6}px`,
            height: `${progress * 6}px`,
            animation: "pulse 2s infinite",
          }}
        />

        {/* Particle Effects */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
            style={{
              left: `${50 + (Math.cos((i * 24 * Math.PI) / 180) * progress) / 2}%`,
              top: `${50 + (Math.sin((i * 24 * Math.PI) / 180) * progress) / 2}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      
      {/* Popup Content */}
      <Card className="glassmorphism border-purple-400/50 p-8 max-w-md w-full mx-4 relative z-10">
        <div className="text-center">
          {/* Central Symbol */}
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-600/30 flex items-center justify-center pulse-glow transition-transform duration-100"
            style={{
              transform: `scale(${1 + progress / 200})`,
            }}
          >
            <CelestialIcon
              type="mystical"
              size="lg"
              className="text-purple-400 animate-pulse"
            />
          </div>

          {/* Message */}
          <h2 className="font-cinzel text-2xl font-bold glow-text mb-6 text-purple-100">{message}</h2>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700/30 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Progress Percentage */}
          <p className="font-poppins text-sm text-purple-300">{Math.round(progress)}% Complete</p>
          
          {/* Cosmic dots animation */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
