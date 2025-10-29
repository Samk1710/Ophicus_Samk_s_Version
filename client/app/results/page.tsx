"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CosmicBackground } from "@/components/cosmic-background"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, XCircle, Sparkles, PartyPopper, ArrowDown } from "lucide-react"
import { QuestSummary } from "@/components/quest-summary"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showSummary, setShowSummary] = useState(false)
  const [questData, setQuestData] = useState<any>(null)
  const [result, setResult] = useState<'success' | 'failure' | null>(null)

  useEffect(() => {
    // Get data from URL params or localStorage
    const resultType = searchParams.get('result')
    const dataStr = searchParams.get('data') || localStorage.getItem('questResultData')
    
    if (resultType && dataStr) {
      setResult(resultType as 'success' | 'failure')
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataStr))
        setQuestData(parsedData)
        
        // Trigger confetti for success
        if (resultType === 'success') {
          setTimeout(() => celebrateVictory(), 500)
        }
        
        // Clear localStorage after reading
        localStorage.removeItem('questResultData')
      } catch (error) {
        console.error('[Results] Failed to parse quest data:', error)
        router.push('/astral-nexus')
      }
    } else {
      // No data, redirect to nexus
      router.push('/astral-nexus')
    }
  }, [searchParams, router])

  const celebrateVictory = () => {
    const duration = 5000
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

    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 180,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#9370DB', '#00CED1']
      })
    }, 500)
  }

  const scrollToSummary = () => {
    setShowSummary(true)
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }, 100)
  }

  if (!questData || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center cosmic-bg">
        <CosmicBackground />
        <div className="text-center">
          <p className="font-poppins text-purple-300 animate-pulse">Loading results...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="cosmic-bg">
        <CosmicBackground />
        
        {/* First Screen - Result Reveal */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-screen flex items-center justify-center relative px-4 py-12"
        >
          <div className="max-w-3xl w-full">
            {result === 'success' ? (
              <SuccessReveal questData={questData} onContinue={scrollToSummary} />
            ) : (
              <FailureReveal questData={questData} onContinue={scrollToSummary} />
            )}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <p className="font-poppins text-xs text-purple-400">Scroll for summary</p>
              <ArrowDown className="w-6 h-6 text-purple-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* Second Screen - Quest Summary */}
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex items-center justify-center px-4 py-12"
          >
            <QuestSummary
              isOpen={true}
              onClose={() => {}}
              questData={questData}
            />
          </motion.div>
        )}
      </div>
    </>
  )
}

function SuccessReveal({ questData, onContinue }: { questData: any; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <Card className="glassmorphism border-gold-400/50 p-6 sm:p-8 md:p-12">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-gold-400/30 to-yellow-600/30 flex items-center justify-center pulse-glow"
          >
            <Crown className="w-12 h-12 sm:w-14 sm:h-14 text-gold-300" />
          </motion.div>

          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold glow-text text-gold-100">
            🎊 Cosmic Ascension! 🎊
          </h1>

          <p className="font-poppins text-base sm:text-lg text-gold-200">
            You have unlocked the ultimate cosmic truth!
          </p>

          {questData.cosmicSong && (
            <div className="bg-black/30 rounded-lg p-4 sm:p-6 border border-gold-400/30">
              {questData.cosmicSong.imageUrl && (
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  src={questData.cosmicSong.imageUrl}
                  alt={questData.cosmicSong.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-lg border-2 border-gold-400/50 object-cover mb-4"
                />
              )}
              <p className="font-cormorant text-xl sm:text-2xl font-bold text-gold-100 mb-2">
                Your Cosmic Song
              </p>
              <p className="font-poppins text-base sm:text-lg text-gold-200 italic">
                "{questData.cosmicSong.name}"
              </p>
              <p className="font-poppins text-sm sm:text-base text-gold-300 mt-1">
                by {questData.cosmicSong.artists?.join(', ')}
              </p>
            </div>
          )}

          {questData.ophiuchusIdentity && (
            <div className="bg-purple-900/30 rounded-lg p-4 sm:p-6 border border-purple-400/30">
              <div className="flex justify-center mb-3">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300" />
              </div>
              <p className="font-cinzel text-lg sm:text-xl font-bold text-purple-100 mb-2">
                {questData.ophiuchusIdentity.title}
              </p>
              {questData.ophiuchusIdentity.description && (
                <p className="font-poppins text-xs sm:text-sm text-purple-300 italic">
                  {questData.ophiuchusIdentity.description}
                </p>
              )}
              {questData.ophiuchusIdentity.imageUrl && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  src={questData.ophiuchusIdentity.imageUrl}
                  alt="Your Ophiuchus Identity"
                  className="w-full rounded-lg border border-gold-400/30 mt-4 max-h-64 sm:max-h-96 object-cover"
                />
              )}
            </div>
          )}

          <Button
            onClick={onContinue}
            className="mystical-button w-full text-base sm:text-lg py-6"
          >
            <PartyPopper className="w-5 h-5 mr-2" />
            View Quest Summary
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

function FailureReveal({ questData, onContinue }: { questData: any; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <Card className="glassmorphism border-red-400/50 p-6 sm:p-8 md:p-12">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-red-500/30 to-orange-600/30 flex items-center justify-center pulse-glow"
          >
            <XCircle className="w-12 h-12 sm:w-14 sm:h-14 text-red-400" />
          </motion.div>

          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold glow-text text-red-400">
            Quest Failed
          </h1>

          <p className="font-poppins text-base sm:text-lg text-red-300">
            You have exhausted all 3 attempts. The cosmic truth is revealed...
          </p>

          {questData.cosmicSong && (
            <div className="bg-red-900/30 rounded-lg p-4 sm:p-6 border border-red-400/50">
              <p className="font-cormorant text-xl sm:text-2xl font-bold text-red-100 mb-4">
                The Cosmic Song Was:
              </p>
              {questData.cosmicSong.imageUrl && (
                <motion.img
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  src={questData.cosmicSong.imageUrl}
                  alt={questData.cosmicSong.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-lg border-2 border-red-400/50 object-cover mb-4"
                />
              )}
              <p className="font-poppins text-base sm:text-lg text-red-100 font-bold">
                "{questData.cosmicSong.name}"
              </p>
              <p className="font-poppins text-sm sm:text-base text-red-200 mt-1">
                by {questData.cosmicSong.artists?.join(', ')}
              </p>
              {questData.cosmicSong.spotifyUrl && (
                <a
                  href={questData.cosmicSong.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs sm:text-sm text-green-400 hover:text-green-300 underline"
                >
                  Listen on Spotify ↗
                </a>
              )}
            </div>
          )}

          <div className="bg-black/30 rounded-lg p-4 sm:p-6 border border-red-400/30">
            <p className="font-poppins text-sm sm:text-base text-orange-300">
              You've earned <span className="font-bold text-orange-200">25 consolation points</span> for your cosmic journey.
            </p>
          </div>

          <Button
            onClick={onContinue}
            className="mystical-button w-full text-base sm:text-lg py-6 bg-red-600/20 hover:bg-red-600/30 border-red-400/50"
          >
            <PartyPopper className="w-5 h-5 mr-2" />
            View Quest Summary
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
