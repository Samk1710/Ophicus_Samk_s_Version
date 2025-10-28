"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { CelestialIcon } from "@/components/celestial-icon"
import { TrendingUp, Clock, Music, Headphones, Calendar, Zap } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  celestialIcon: "sun" | "moon" | "planet" | "constellation" | "eye" | "mystical"
  gradient: string
  size?: "sm" | "md" | "lg"
}

function StatCard({ title, value, subtitle, icon, celestialIcon, gradient, size = "md" }: StatCardProps) {
  const sizeClasses = {
    sm: "col-span-1 row-span-1",
    md: "col-span-1 row-span-2 md:col-span-2",
    lg: "col-span-1 row-span-2 md:col-span-2 lg:col-span-3",
  }

  return (
    <Card
      className={`glassmorphism border-gold-400/30 p-6 ${sizeClasses[size]} relative overflow-hidden group hover:scale-105 transition-all duration-300`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('/images/celestial-elements.png')`,
            backgroundSize: "200px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${gradient} opacity-20`} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon}
            <CelestialIcon type={celestialIcon} className="text-gold-400" />
          </div>
          <div className="text-right">
            <p className="font-poppins text-xs text-purple-300 uppercase tracking-wider">{title}</p>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="font-cinzel text-3xl font-bold text-gold-100 glow-text">{value}</h3>
          {subtitle && <p className="font-poppins text-sm text-purple-200 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  )
}

export function SpotifyStatsGrid() {
  const stats = [
    {
      title: "Top Artist",
      value: "Lana Del Rey",
      subtitle: "Queen of your cosmic realm",
      icon: <Music className="w-5 h-5 text-purple-400" />,
      celestialIcon: "sun" as const,
      gradient: "bg-gradient-to-br from-purple-600/30 to-pink-600/30",
      size: "lg" as const,
    },
    {
      title: "Minutes Listened",
      value: "47,382",
      subtitle: "This month",
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      celestialIcon: "moon" as const,
      gradient: "bg-gradient-to-br from-blue-600/30 to-indigo-600/30",
      size: "md" as const,
    },
    {
      title: "Top Genre",
      value: "Dream Pop",
      subtitle: "Your celestial frequency",
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      celestialIcon: "mystical" as const,
      gradient: "bg-gradient-to-br from-green-600/30 to-teal-600/30",
      size: "md" as const,
    },
    {
      title: "Tracks Played",
      value: "2,847",
      icon: <Headphones className="w-5 h-5 text-orange-400" />,
      celestialIcon: "constellation" as const,
      gradient: "bg-gradient-to-br from-orange-600/30 to-red-600/30",
      size: "sm" as const,
    },
    {
      title: "Discovery Score",
      value: "87%",
      subtitle: "Cosmic explorer",
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      celestialIcon: "eye" as const,
      gradient: "bg-gradient-to-br from-yellow-600/30 to-orange-600/30",
      size: "sm" as const,
    },
    {
      title: "Active Days",
      value: "28/30",
      icon: <Calendar className="w-5 h-5 text-cyan-400" />,
      celestialIcon: "planet" as const,
      gradient: "bg-gradient-to-br from-cyan-600/30 to-blue-600/30",
      size: "sm" as const,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-fr">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
