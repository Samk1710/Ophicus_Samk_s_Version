"use client"

import { useState, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Loader2, ChevronLeft, ChevronRight, Crown } from "lucide-react"
import { useRouter } from "next/navigation"

interface LeaderboardEntry {
  rank: number
  username: string
  totalPoints: number
  totalGamesPlayed: number
  isCurrentUser: boolean
}

interface CurrentUser {
  username: string
  totalPoints: number
  totalGamesPlayed: number
  rank: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const limit = 10
  const router = useRouter()

  useEffect(() => {
    fetchLeaderboard()
  }, [page])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    try {
      const skip = page * limit
      const response = await fetch(`/api/leaderboard?limit=${limit}&skip=${skip}`)
      const data = await response.json()

      if (data.success) {
        setLeaderboard(data.leaderboard)
        setCurrentUser(data.currentUser)
        setHasMore(data.pagination.hasMore)
      }
    } catch (error) {
      console.error('[Leaderboard] Error fetching:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankMedal = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />
    if (rank === 2) return <Trophy className="w-6 h-6 text-gray-300" />
    if (rank === 3) return <Trophy className="w-6 h-6 text-amber-600" />
    return <Star className="w-5 h-5 text-purple-400" />
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500/30 to-amber-600/30 border-yellow-400/50"
    if (rank === 2) return "from-gray-300/30 to-gray-500/30 border-gray-400/50"
    if (rank === 3) return "from-amber-500/30 to-orange-600/30 border-amber-400/50"
    return "from-purple-500/20 to-indigo-600/20 border-purple-400/30"
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />

      {/* Header */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button 
              onClick={() => router.push('/home')}
              className="mystical-button"
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-gold-400 mr-4" />
              <h1 className="font-cinzel text-5xl font-bold glow-text text-gold-100">
                Cosmic Leaderboard
              </h1>
              <CelestialIcon type="sun" size="lg" className="text-gold-400 ml-4" />
            </div>
            <p className="font-poppins text-lg text-purple-300 italic">
              The Greatest Constellation Seekers
            </p>
          </div>

          {/* Current User Card */}
          {currentUser && (
            <Card className="glassmorphism border-gold-400/50 p-6 mb-8 pulse-glow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500/30 to-amber-600/30 flex items-center justify-center border-2 border-gold-400/50">
                    <Star className="w-8 h-8 text-gold-400" />
                  </div>
                  <div>
                    <p className="font-poppins text-xs text-gold-300 uppercase tracking-wider mb-1">Your Rank</p>
                    <h3 className="font-cinzel text-2xl font-bold text-gold-100">
                      {currentUser.username}
                    </h3>
                    <p className="font-poppins text-sm text-purple-300">
                      {currentUser.totalGamesPlayed} {currentUser.totalGamesPlayed === 1 ? 'Quest' : 'Quests'} Completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-cormorant text-4xl font-bold text-gold-200">
                    #{currentUser.rank}
                  </p>
                  <p className="font-poppins text-lg text-gold-300">
                    {currentUser.totalPoints.toLocaleString()} pts
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Leaderboard List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry) => (
                <Card 
                  key={entry.rank}
                  className={`glassmorphism p-6 transition-all hover:scale-[1.02] ${
                    entry.isCurrentUser 
                      ? 'border-gold-400/70 bg-gold-900/10' 
                      : `bg-gradient-to-r ${getRankColor(entry.rank)}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rank Medal */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center border-2 border-purple-400/30">
                        {getRankMedal(entry.rank)}
                      </div>

                      {/* User Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-cormorant text-xl font-bold text-purple-100">
                            {entry.username}
                          </h3>
                          {entry.isCurrentUser && (
                            <span className="px-2 py-0.5 rounded-full bg-gold-500/30 border border-gold-400/50 text-gold-200 text-xs font-poppins">
                              You
                            </span>
                          )}
                        </div>
                        <p className="font-poppins text-sm text-purple-300">
                          {entry.totalGamesPlayed} {entry.totalGamesPlayed === 1 ? 'quest' : 'quests'}
                        </p>
                      </div>
                    </div>

                    {/* Points and Rank */}
                    <div className="text-right">
                      <p className="font-cormorant text-3xl font-bold text-purple-100">
                        #{entry.rank}
                      </p>
                      <p className="font-poppins text-lg text-gold-300">
                        {entry.totalPoints.toLocaleString()} pts
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {(page > 0 || hasMore) && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || isLoading}
                className="mystical-button"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <span className="font-poppins text-purple-300">
                Page {page + 1}
              </span>

              <Button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore || isLoading}
                className="mystical-button"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && leaderboard.length === 0 && (
            <Card className="glassmorphism border-purple-400/50 p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
              <h3 className="font-cormorant text-2xl font-bold text-purple-200 mb-2">
                No Players Yet
              </h3>
              <p className="font-poppins text-purple-300">
                Be the first to complete a quest and claim your place in the cosmos!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
