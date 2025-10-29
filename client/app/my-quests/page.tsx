"use client"

import { useState, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CosmicLoading } from "@/components/cosmic-loading"
import { Crown, Music, Calendar, Trophy, Star, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { format } from "date-fns"

interface CompletedQuest {
  _id: string
  cosmicSong: {
    id: string
    name: string
    artists: string[]
    imageUrl?: string
  }
  ophiuchusIdentity: {
    title: string
    description?: string
    imageUrl?: string
  }
  roomPoints: {
    nebula?: number
    cradle?: number
    comet?: number
    aurora?: number
  }
  revelationPoints: number
  totalPoints: number
  finalGuessAttempts: number
  completedAt: string
}

export default function MyQuestsPage() {
  const { data: session } = useSession()
  const [quests, setQuests] = useState<CompletedQuest[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const response = await fetch('/api/user/quests')
        if (response.ok) {
          const data = await response.json()
          setQuests(data.quests || [])
        }
      } catch (error) {
        console.error('[MyQuests] Failed to fetch quests:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchQuests()
    }
  }, [session])

  const rooms = [
    { id: 'nebula', name: 'Nebula', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { id: 'cradle', name: 'Cradle', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { id: 'comet', name: 'Comet', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    { id: 'aurora', name: 'Aurora', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  ]

  if (loading) {
    return <CosmicLoading />
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />

      {/* Header */}
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <CelestialIcon type="mystical" size="xl" className="text-gold-400 mr-4" />
              <h1 className="font-cinzel text-5xl font-bold glow-text text-gold-100">My Cosmic Quests</h1>
              <CelestialIcon type="constellation" size="xl" className="text-gold-400 ml-4" />
            </div>
            <p className="font-poppins text-lg text-purple-300">
              Your journey through the 13th zodiac
            </p>
            {quests.length > 0 && (
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gold-400" />
                  <span className="font-poppins text-purple-200">
                    {quests.length} {quests.length === 1 ? 'Quest' : 'Quests'} Completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gold-400" />
                  <span className="font-poppins text-purple-200">
                    {quests.reduce((sum, q) => sum + q.totalPoints, 0)} Total Points
                  </span>
                </div>
              </div>
            )}
          </div>

          {quests.length === 0 ? (
            <Card className="glassmorphism border-purple-400/30 p-12 text-center">
              <CelestialIcon type="eye" size="xl" className="text-purple-400 mx-auto mb-6 opacity-50" />
              <h3 className="font-cinzel text-2xl font-bold text-purple-100 mb-4">
                No Quests Completed Yet
              </h3>
              <p className="font-poppins text-purple-300 mb-8 max-w-md mx-auto">
                Begin your cosmic journey and discover your Ophiuchus identity through the celestial chambers.
              </p>
              <Link href="/astral-nexus">
                <Button className="mystical-button">
                  Start Your Journey
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {quests.map((quest) => (
                <Card key={quest._id} className="glassmorphism border-purple-400/30 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Cosmic Song Image */}
                      {quest.cosmicSong.imageUrl && (
                        <div className="w-full md:w-40 h-40 rounded-lg overflow-hidden border border-purple-400/30 flex-shrink-0">
                          <img
                            src={quest.cosmicSong.imageUrl}
                            alt={quest.cosmicSong.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Quest Info */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Music className="w-5 h-5 text-purple-400" />
                              <h3 className="font-cormorant text-2xl font-bold text-gold-100">
                                {quest.cosmicSong.name}
                              </h3>
                            </div>
                            <p className="font-poppins text-purple-200 mb-2">
                              by {quest.cosmicSong.artists.join(', ')}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-purple-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(quest.completedAt), 'MMM dd, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Trophy className="w-4 h-4" />
                                {quest.finalGuessAttempts} {quest.finalGuessAttempts === 1 ? 'attempt' : 'attempts'}
                              </div>
                            </div>
                          </div>

                          {/* Total Points Badge */}
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400/20 to-purple-600/20 flex items-center justify-center flex-shrink-0 border border-gold-400/30">
                            <div className="text-center">
                              <p className="font-cinzel text-2xl font-bold text-gold-100">
                                {quest.totalPoints}
                              </p>
                              <p className="font-poppins text-xs text-purple-300">points</p>
                            </div>
                          </div>
                        </div>

                        {/* Ophiuchus Identity */}
                        <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-4 h-4 text-gold-400" />
                            <p className="font-cinzel text-lg font-bold text-purple-100">
                              {quest.ophiuchusIdentity.title}
                            </p>
                          </div>
                          {quest.ophiuchusIdentity.description && expandedQuest === quest._id && (
                            <p className="font-poppins text-sm text-purple-300 mt-2 italic">
                              {quest.ophiuchusIdentity.description}
                            </p>
                          )}
                        </div>

                        {/* Room Points Preview */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {rooms.map((room) => {
                            const points = quest.roomPoints[room.id as keyof typeof quest.roomPoints] || 0
                            return (
                              <Badge
                                key={room.id}
                                variant="outline"
                                className={`${room.bgColor} ${room.color} border-${room.color.replace('text-', '')}/30`}
                              >
                                {room.name}: {points}pts
                              </Badge>
                            )
                          })}
                          <Badge
                            variant="outline"
                            className="bg-gold-500/10 text-gold-400 border-gold-400/30"
                          >
                            Revelation: {quest.revelationPoints}pts
                          </Badge>
                        </div>

                        {/* Expand/Collapse Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedQuest(expandedQuest === quest._id ? null : quest._id)}
                          className="text-purple-300 hover:text-purple-100 w-full"
                        >
                          {expandedQuest === quest._id ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              Show Details
                            </>
                          )}
                        </Button>

                        {/* Expanded Details */}
                        {expandedQuest === quest._id && (
                          <div className="space-y-3 pt-4 border-t border-purple-400/20">
                            <h4 className="font-cinzel text-sm font-bold text-purple-100 uppercase">
                              Chamber Breakdown
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {rooms.map((room) => {
                                const points = quest.roomPoints[room.id as keyof typeof quest.roomPoints] || 0
                                return (
                                  <div
                                    key={room.id}
                                    className={`${room.bgColor} rounded-lg p-3 border border-${room.color.replace('text-', '')}/30`}
                                  >
                                    <p className={`font-poppins text-sm ${room.color} mb-1`}>
                                      {room.name}
                                    </p>
                                    <p className="font-cinzel text-lg font-bold text-purple-100">
                                      {points} pts
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Back Button */}
          <div className="text-center mt-12">
            <Link href="/astral-nexus">
              <Button variant="outline" className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10">
                Return to Astral Nexus
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
