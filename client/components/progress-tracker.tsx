"use client"

import Link from "next/link"
import { CelestialIcon } from "@/components/celestial-icon"
import { CheckCircle, Globe, Flame, Rainbow, Star, Crown } from "lucide-react"

interface ProgressTrackerProps {
  completedRooms: string[]
  currentRoom?: string
}

const rooms = [
  {
    id: "nebula",
    name: "Nebula",
    icon: <CelestialIcon type="mystical" size="sm" className="text-purple-400" />,
    href: "/rooms/nebula",
  },
  { id: "cradle", name: "Cradle", icon: <Globe className="w-4 h-4 text-blue-400" />, href: "/rooms/cradle" },
  { id: "comet", name: "Comet", icon: <Flame className="w-4 h-4 text-orange-400" />, href: "/rooms/comet" },
  { id: "aurora", name: "Aurora", icon: <Rainbow className="w-4 h-4 text-green-400" />, href: "/rooms/aurora" },
  { id: "nova", name: "Nova", icon: <Star className="w-4 h-4 text-yellow-400" />, href: "/rooms/nova" },
]

export function ProgressTracker({ completedRooms, currentRoom }: ProgressTrackerProps) {
  return (
    <div className="fixed top-20 right-6 z-50">
      <div className="glassmorphism rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CelestialIcon type="constellation" size="sm" className="text-purple-300" />
          <span className="text-sm font-poppins text-purple-200">Quest Progress</span>
        </div>
        <div className="flex gap-2 mb-4">
          {rooms.map((room) => (
            <Link key={room.id} href={room.href}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 cursor-pointer hover:scale-110 ${
                  completedRooms.includes(room.id)
                    ? "bg-green-500/30 border border-green-400/50 text-green-300"
                    : currentRoom === room.id
                      ? "bg-purple-500/30 border border-purple-400/50 text-purple-300 pulse-glow"
                      : "bg-gray-700/30 border border-gray-600/50 text-gray-400 hover:bg-gray-600/40"
                }`}
                title={room.name}
              >
                {completedRooms.includes(room.id) ? <CheckCircle className="w-4 h-4" /> : room.icon}
              </div>
            </Link>
          ))}
        </div>

        {/* Revelation Link */}
        <Link href="/final-guess">
          <div className="w-full p-2 rounded-lg bg-gradient-to-r from-gold-500/20 to-purple-600/20 border border-gold-400/30 hover:from-gold-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-poppins text-gold-200">Revelation</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
