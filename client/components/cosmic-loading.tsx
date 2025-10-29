"use client"

import { CosmicBackground } from "@/components/cosmic-background"
import { CelestialIcon } from "@/components/celestial-icon"
import { Loader2 } from "lucide-react"

interface CosmicLoadingProps {
  message?: string
}

export function CosmicLoading({ message = "Aligning cosmic frequencies..." }: CosmicLoadingProps) {
  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg flex items-center justify-center">
      <CosmicBackground />
      
      <div className="relative z-10 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <CelestialIcon type="eye" size="xl" className="text-purple-400 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-gold-400 animate-spin" />
            </div>
          </div>
        </div>
        
        <h2 className="font-cinzel text-2xl font-bold text-gold-100 mb-3 glow-text">
          {message}
        </h2>
        
        <div className="flex justify-center gap-2">
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
    </div>
  )
}
