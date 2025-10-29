"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BigBangPopup } from "@/components/big-bang-popup"
import { Globe, Flame, Rainbow, Star, Loader2, Crown, Music } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { useGameState } from "@/components/providers/game-state-provider"
import { useRouter } from "next/navigation"

const planets = [
  {
    id: "nebula",
    name: "Nebula",
    subtitle: "Riddle of Echoes",
    description: "Decipher the cosmic riddle hidden in the mists of creation",
    icon: <CelestialIcon type="mystical" size="lg" className="text-purple-400" />,
    color: "from-purple-500/30 to-indigo-600/30",
    borderColor: "border-purple-400/50",
    href: "/rooms/nebula",
  },
  {
    id: "cradle",
    name: "Cradle",
    subtitle: "The Veiled Origin",
    description: "Uncover the artist through questions and cosmic wisdom",
    icon: <Globe className="w-8 h-8 text-blue-400" />,
    color: "from-blue-500/30 to-cyan-600/30",
    borderColor: "border-blue-400/50",
    href: "/rooms/cradle",
  },
  {
    id: "comet",
    name: "Comet",
    subtitle: "Flash of the Past",
    description: "Catch the fleeting lyric as it streaks across the void",
    icon: <Flame className="w-8 h-8 text-orange-400" />,
    color: "from-orange-500/30 to-red-600/30",
    borderColor: "border-orange-400/50",
    href: "/rooms/comet",
  },
  {
    id: "aurora",
    name: "Aurora",
    subtitle: "Voice of Light",
    description: "Feel the melody and express the emotion within",
    icon: <Rainbow className="w-8 h-8 text-green-400" />,
    color: "from-green-500/30 to-teal-600/30",
    borderColor: "border-green-400/50",
    href: "/rooms/aurora",
  },
]

export default function AstralNexus() {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [showBigBangPopup, setShowBigBangPopup] = useState(false)
  const [showConfirmEndSession, setShowConfirmEndSession] = useState(false)
  const [isBigBangLoading, setIsBigBangLoading] = useState(false)
  const { data: session } = useSession()
  const { sessionId, gameSession, initializeBigBang, refreshGameState } = useGameState()
  const router = useRouter()

  // Refresh game state when component mounts
  useEffect(() => {
    console.log('[AstralNexus] Component mounted, session ID:', sessionId)
    if (sessionId) {
      refreshGameState()
    }
  }, [sessionId])

  // Log game session data
  useEffect(() => {
    console.log('[AstralNexus] Game session updated:', gameSession)
  }, [gameSession])

  // Handle Big Bang initialization
  const handleBeginJourney = async () => {
    console.log('[AstralNexus] Begin Journey button clicked')
    setIsBigBangLoading(true)
    try {
      const newSessionId = await initializeBigBang()
      console.log('[AstralNexus] Big Bang initialized, session:', newSessionId)
      setShowBigBangPopup(false)
      await refreshGameState()
    } catch (error) {
      console.error('[AstralNexus] Failed to initialize Big Bang:', error)
      alert('Failed to start cosmic journey. Please try again.')
    } finally {
      setIsBigBangLoading(false)
    }
  }

  // End current session and start new quest (reset points)
  const handleEndSessionAndStartNew = async () => {
    // Call server to archive and delete the session, then clear local client state
    try {
      if (sessionId) {
        await fetch('/api/game/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      }
    } catch (err) {
      console.error('[AstralNexus] Failed to complete session via API', err);
    }

    // Clear local session id and refresh client state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sessionId')
    }
    await refreshGameState()
    setShowConfirmEndSession(false)
    setShowBigBangPopup(true)
  }

  // Get completed rooms from game session (any completed room)
  const completedRooms = gameSession?.roomClues
    ? Object.entries(gameSession.roomClues)
        .filter(([_, clue]) => clue?.completed)
        .map(([roomId]) => roomId)
    : []

  // Failed rooms are those attempted but with 0 points (don't show X, just not completed)
  const failedRooms: string[] = []  // We don't want to show X marks, only incomplete rooms

  console.log('[AstralNexus] Completed rooms:', completedRooms)
  console.log('[AstralNexus] Game session completed status:', gameSession?.completed)

  // Redirect to revelation if 4 rooms are completed and game not finished
  useEffect(() => {
    if (completedRooms.length === 4 && gameSession && !gameSession.completed) {
      console.log('[AstralNexus] All 4 rooms completed, redirecting to revelation');
      router.push('/final-guess');
    }
  }, [completedRooms.length, gameSession?.completed, router]);

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      {/* Only show progress tracker if there's an active session */}
      {sessionId && gameSession && (
        <ProgressTracker completedRooms={completedRooms} failedRooms={failedRooms} />
      )}

      {/* Confirmation Popup for ending session */}
      <AlertDialog open={showConfirmEndSession} onOpenChange={setShowConfirmEndSession}>
        <AlertDialogContent className="glassmorphism border-red-400/50 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cinzel text-2xl font-bold text-center text-red-400">
              End Current Quest?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3">
              <p className="font-poppins text-red-200">
                This quest will be counted as completed. Are you sure you want to start a new quest?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="border-red-400/30 text-red-300 w-full" onClick={() => setShowConfirmEndSession(false)}>
              No, Return to Nexus
            </Button>
            <Button className="mystical-button w-full" onClick={handleEndSessionAndStartNew}>
              Yes, End Quest
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Big Bang Popup */}
      <BigBangPopup isOpen={showBigBangPopup} onClose={() => setShowBigBangPopup(false)} />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl mx-auto">{/* Central Hub Description */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <CelestialIcon type="eye" size="xl" className="text-gold-400 mr-4" />
              <h1 className="font-cinzel text-4xl md:text-5xl font-bold glow-text text-gold-100">Astral Nexus</h1>
              <CelestialIcon type="mystical" size="xl" className="text-gold-400 ml-4" />
            </div>
            <p className="font-poppins text-lg text-purple-200 max-w-2xl mx-auto mb-8">
              Four celestial chambers await your exploration. Each holds a piece of the cosmic puzzle that will reveal
              your destined song among the stars.
            </p>

            {/* Quest Status Card */}
            {/* If not logged in, show connect card */}
            {!session ? (
              <Card className="glassmorphism border-purple-400/30 p-6 max-w-md mx-auto">
                <div className="text-center">
                  <CelestialIcon type="eye" size="lg" className="text-purple-400 mx-auto mb-4" />
                  <h3 className="font-cinzel text-xl font-bold text-purple-100 mb-2">Connect to Begin</h3>
                  <p className="font-poppins text-purple-200 text-sm mb-4">
                    Connect your Spotify account to unlock your cosmic realm
                  </p>
                  <Button onClick={() => router.push('/login')} className="mystical-button w-full">
                    <Music className="w-5 h-5 mr-3" />
                    Connect Spotify
                    <CelestialIcon type="mystical" size="sm" className="ml-3" />
                  </Button>
                </div>
              </Card>
            ) : !sessionId || !gameSession ? (
              <Card className="glassmorphism border-purple-400/30 p-6 max-w-md mx-auto">
                <div className="text-center">
                  <CelestialIcon type="eye" size="lg" className="text-purple-400 mx-auto mb-4" />
                  <h3 className="font-cinzel text-xl font-bold text-purple-100 mb-2">Ready for Your Quest?</h3>
                  <p className="font-poppins text-purple-200 text-sm mb-4">
                    Discover your cosmic song through the celestial chambers
                  </p>
                  <Button 
                    onClick={() => setShowBigBangPopup(true)} 
                    className="mystical-button w-full"
                    disabled={isBigBangLoading}
                  >
                    {isBigBangLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5 mr-3" />
                        Begin Cosmic Journey
                        <CelestialIcon type="mystical" size="sm" className="ml-3" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="glassmorphism border-gold-400/30 p-6 max-w-md mx-auto">
                <div className="text-center">
                  <CelestialIcon type="sun" size="lg" className="text-gold-400 mx-auto mb-4" />
                  <h3 className="font-cinzel text-xl font-bold text-gold-100 mb-2">Journey in Progress</h3>
                  <p className="font-poppins text-purple-200 text-sm mb-4">
                    Continue exploring the chambers or start a new quest
                  </p>
                  <div className="space-y-3">
                    <div className="font-poppins text-sm text-purple-300">
                      Chambers Explored: {completedRooms.length} / 4
                    </div>
                    <Button 
                      onClick={() => setShowConfirmEndSession(true)} 
                      variant="outline"
                      className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10 w-full bg-transparent"
                    >
                      <Music className="w-5 h-5 mr-3" />
                      Start New Quest
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Planet Grid - Centered */}
          {sessionId && gameSession && (
            <div className="flex justify-center mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
                {planets.map((planet, index) => {
                  const isCompleted = completedRooms.includes(planet.id)
                  return (
                    <Card
                      key={planet.id}
                      className={`glassmorphism ${planet.borderColor} p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden`}
                      style={{
                        backgroundImage: `url('/images/golden-frame.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                      onMouseEnter={() => setHoveredPlanet(planet.id)}
                      onMouseLeave={() => setHoveredPlanet(null)}
                    >
                      {/* Card overlay for readability */}
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="text-center relative z-10">
                        {/* Planet Icon */}
                        <div
                          className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${planet.color} flex items-center justify-center group-hover:pulse-glow transition-all duration-300`}
                        >
                          {planet.icon}
                        </div>
                        {/* Planet Info */}
                        <h3 className="font-cormorant text-2xl font-bold text-gold-100 mb-2">{planet.name}</h3>
                        <h4 className="font-poppins text-sm text-purple-300 mb-3 italic">{planet.subtitle}</h4>
                        {/* Description (shown on hover) */}
                        <div
                          className={`transition-all duration-300 ${
                            hoveredPlanet === planet.id ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
                          } overflow-hidden`}
                        >
                          <p className="font-poppins text-sm text-purple-200">{planet.description}</p>
                        </div>
                        {/* Enter Button or Chamber Explored */}
                        <div className="mt-4">
                          {isCompleted ? (
                            <Button disabled className="bg-green-900/30 text-green-400 border-green-400/30 px-6 py-2 cursor-not-allowed">
                              <CelestialIcon type="constellation" size="sm" className="mr-2" />
                              Chamber Explored
                            </Button>
                          ) : (
                            <Link href={planet.href}>
                              <Button className="mystical-button text-sm px-6 py-2">
                                <CelestialIcon type="constellation" size="sm" className="mr-2" />
                                Enter Chamber
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Progress Card - Centered */}
          <div className="flex justify-center">
            <Card className="glassmorphism border-gold-400/30 p-6 max-w-md">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <CelestialIcon type="sun" className="text-gold-400 mr-2" />
                  <h3 className="font-cormorant text-xl font-bold text-gold-100">Cosmic Progress</h3>
                </div>
                <p className="font-poppins text-sm text-purple-200 mb-4">
                  Chambers Explored: {completedRooms.length} / 4
                </p>
                <div className="flex justify-center gap-2 mb-4">
                  {planets.map((planet) => (
                    <div
                      key={planet.id}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        completedRooms.includes(planet.id)
                          ? "bg-green-400 shadow-lg shadow-green-400/50"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                {completedRooms.length === 4 && (
                  <div className="mt-4">
                    <Link href="/final-guess">
                      <Button className="mystical-button w-full">
                        <CelestialIcon type="eye" size="sm" className="mr-2" />
                        Make Final Guess
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
