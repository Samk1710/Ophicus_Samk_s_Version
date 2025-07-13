"use client"

import { useState, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { CelestialIcon } from "@/components/celestial-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Music, Crown, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [showTitle, setShowTitle] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTitle(true), 500)
    const timer2 = setTimeout(() => setShowSubtitle(true), 1500)
    const timer3 = setTimeout(() => setShowContent(true), 2500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />

      {/* Earth from Space Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <Globe className="w-96 h-96 text-blue-400 animate-spin" style={{ animationDuration: "60s" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Floating Celestial Elements */}
        <div className="absolute top-20 left-20 floating-animation opacity-60">
          <CelestialIcon type="constellation" className="text-gold-400" />
        </div>
        <div className="absolute top-32 right-32 floating-animation opacity-60" style={{ animationDelay: "1s" }}>
          <CelestialIcon type="planet" className="text-purple-400" />
        </div>
        <div className="absolute bottom-40 left-40 floating-animation opacity-60" style={{ animationDelay: "2s" }}>
          <CelestialIcon type="mystical" className="text-blue-400" />
        </div>
        <div className="absolute bottom-20 right-20 floating-animation opacity-60" style={{ animationDelay: "0.5s" }}>
          <CelestialIcon type="eye" className="text-gold-400" />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl">
          {/* Title */}
          <div
            className={`mb-8 transition-all duration-2000 ${showTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="flex items-center justify-center mb-6">
              <CelestialIcon type="sun" size="xl" className="text-gold-400 mr-6" />
              <h1 className="font-cinzel text-6xl md:text-8xl font-bold text-gold-100 glow-text leading-tight">
                Ophiuchus
              </h1>
              <CelestialIcon type="moon" size="xl" className="text-gold-400 ml-6" />
            </div>

            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent w-32" />
              <CelestialIcon type="eye" className="text-purple-300" />
              <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent w-32" />
            </div>

            <h2 className="font-cormorant text-3xl md:text-5xl text-purple-200 font-light mb-4">
              The 13th Zodiac of Songs
            </h2>
          </div>

          {/* Subtitle */}
          <div
            className={`mb-12 transition-all duration-2000 delay-1000 ${showSubtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <p className="font-cormorant text-2xl md:text-3xl text-gold-200 font-light italic mb-6">
              "Written in the stars. Heard in your soul."
            </p>
            <p className="font-poppins text-lg text-purple-100 max-w-2xl mx-auto">
              Embark on a celestial journey through your musical cosmos. Discover the cosmic song that defines your
              essence through ancient wisdom and modern technology.
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-2000 delay-2000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Link href="/login">
              <Button className="mystical-button text-lg px-12 py-6 rounded-full group">
                <Crown className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                Enter the Realm
                <CelestialIcon type="mystical" size="sm" className="ml-3 group-hover:animate-spin" />
              </Button>
            </Link>

            <Link href="/astral-nexus">
              <Button
                variant="outline"
                className="border-gold-400/50 text-gold-200 hover:bg-gold-500/10 bg-transparent text-lg px-12 py-6 rounded-full"
              >
                <Music className="w-5 h-5 mr-3" />
                Explore Quest
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full transition-all duration-2000 delay-3000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Card className="glassmorphism border-gold-400/30 p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600/30 to-indigo-600/30 flex items-center justify-center group-hover:pulse-glow">
                <Zap className="w-8 h-8 text-gold-400" />
              </div>
              <CelestialIcon type="constellation" className="text-purple-400 mx-auto" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-gold-100 mb-3">Cosmic Analysis</h3>
            <p className="font-poppins text-purple-200 text-sm">
              Advanced algorithms decode your musical DNA through celestial mathematics and ancient wisdom
            </p>
          </Card>

          <Card className="glassmorphism border-gold-400/30 p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-600/30 to-teal-600/30 flex items-center justify-center group-hover:pulse-glow">
                <Shield className="w-8 h-8 text-gold-400" />
              </div>
              <CelestialIcon type="planet" className="text-green-400 mx-auto" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-gold-100 mb-3">Sacred Privacy</h3>
            <p className="font-poppins text-purple-200 text-sm">
              Your musical journey remains protected within our celestial vault, encrypted by cosmic forces
            </p>
          </Card>

          <Card className="glassmorphism border-gold-400/30 p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-600/30 flex items-center justify-center group-hover:pulse-glow">
                <Globe className="w-8 h-8 text-gold-400" />
              </div>
              <CelestialIcon type="eye" className="text-blue-400 mx-auto" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-gold-100 mb-3">Universal Connection</h3>
            <p className="font-poppins text-purple-200 text-sm">
              Join thousands of cosmic travelers discovering their musical destiny across the galaxy
            </p>
          </Card>
        </div>

        {/* Stats Section */}
        <div
          className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full transition-all duration-2000 delay-4000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {[
            { number: "50K+", label: "Cosmic Travelers", icon: "constellation" },
            { number: "1M+", label: "Songs Analyzed", icon: "sun" },
            { number: "13", label: "Celestial Chambers", icon: "mystical" },
            { number: "∞", label: "Musical Possibilities", icon: "eye" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-3">
                <CelestialIcon type={stat.icon as any} size="lg" className="text-gold-400 mx-auto mb-2" />
              </div>
              <div className="font-cinzel text-3xl font-bold text-gold-100 glow-text mb-1">{stat.number}</div>
              <div className="font-poppins text-sm text-purple-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mystical Quote */}
        <div
          className={`mt-16 text-center max-w-2xl transition-all duration-2000 delay-5000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <CelestialIcon type="moon" className="text-gold-400" />
            <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent w-16" />
            <CelestialIcon type="sun" className="text-gold-400" />
            <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent w-16" />
            <CelestialIcon type="moon" className="text-gold-400" />
          </div>
          <blockquote className="font-cormorant text-xl text-purple-200 italic">
            "In the silence between the notes, the universe whispers its secrets. In the harmony of your choices, your
            cosmic song is born."
          </blockquote>
          <cite className="font-poppins text-sm text-gold-400 mt-4 block">— Ancient Ophiuchus Wisdom</cite>
        </div>
      </div>
    </div>
  )
}
