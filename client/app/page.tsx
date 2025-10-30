"use client";

import { useState, useEffect } from "react";
import { CosmicBackground } from "@/components/cosmic-background";
import { CelestialIcon } from "@/components/celestial-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Crown, Zap, Shield, Globe } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTitle(true), 500);
    const timer2 = setTimeout(() => setShowSubtitle(true), 1500);
    const timer3 = setTimeout(() => setShowContent(true), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] relative overflow-hidden">
      <CosmicBackground />

      {/* Earth Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <Globe
          className="w-60 h-60 sm:w-72 sm:h-72 md:w-96 md:h-96 text-blue-400 animate-spin"
          style={{ animationDuration: "60s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 py-10 md:py-16">
        {/* Floating Celestial Elements */}
        <div className="absolute top-10 left-5 sm:top-20 sm:left-20 floating-animation opacity-60">
          <CelestialIcon type="constellation" className="text-gold-400" />
        </div>
        <div
          className="absolute top-28 right-5 sm:top-32 sm:right-32 floating-animation opacity-60"
          style={{ animationDelay: "1s" }}
        >
          <CelestialIcon type="planet" className="text-purple-400" />
        </div>
        <div
          className="absolute bottom-32 left-5 sm:bottom-40 sm:left-40 floating-animation opacity-60"
          style={{ animationDelay: "2s" }}
        >
          <CelestialIcon type="mystical" className="text-blue-400" />
        </div>
        <div
          className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 floating-animation opacity-60"
          style={{ animationDelay: "0.5s" }}
        >
          <CelestialIcon type="eye" className="text-gold-400" />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 max-w-5xl w-full flex flex-col items-center justify-center min-h-[calc(100dvh-10rem)] px-4">
          {/* Title */}
          <div
            className={`mb-8 transition-all duration-2000 ${
              showTitle
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center justify-center flex-wrap gap-4 mb-6">
              <CelestialIcon type="sun" size="xl" className="text-gold-400" />
              <h1 className="font-cinzel text-5xl sm:text-6xl md:text-8xl font-bold text-gold-100 glow-text leading-tight">
                Ophiuchus
              </h1>
              <CelestialIcon type="moon" size="xl" className="text-gold-400" />
            </div>

            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent w-20 sm:w-32" />
              <CelestialIcon type="eye" className="text-purple-300" />
              <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent w-20 sm:w-32" />
            </div>

            <h2 className="font-cormorant text-2xl sm:text-3xl md:text-5xl text-purple-200 font-light mb-4">
              The 13th Zodiac of Music
            </h2>
          </div>

          {/* Subtitle */}
          <div
            className={`mb-12 transition-all duration-2000 delay-1000 ${
              showSubtitle
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            
            <p className="font-cormorant text-xl sm:text-2xl md:text-3xl text-gold-200 italic mb-6">
              "Look at the stars
            </p>
            <p className="font-cormorant text-xl sm:text-2xl md:text-3xl text-gold-200 italic mb-6">
              Look how they shine for you
            </p>
            <p className="font-cormorant text-xl sm:text-2xl md:text-3xl text-gold-200 italic mb-6">
             And everything you
              do"
            </p>
            <p className="font-poppins text-base sm:text-lg text-purple-100 max-w-xl mx-auto">
              Can you align the stars of your Spotify Wrap?
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center transition-all duration-2000 delay-2000 ${
              showContent
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Link href="/login">
              <Button className="mystical-button text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-full group">
                <Crown className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                Enter the Realm
                <CelestialIcon
                  type="mystical"
                  size="sm"
                  className="ml-3 group-hover:animate-spin"
                />
              </Button>
            </Link>

            <Link href="/astral-nexus">
              <Button
                variant="outline"
                className="border-gold-400/50 text-gold-200 hover:bg-gold-500/10 bg-transparent text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-full"
              >
                <Music className="w-5 h-5 mr-3" />
                Explore Quest
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl w-full mt-8 sm:mt-16 transition-all duration-2000 delay-3000 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {[
            {
              icon: <Zap className="w-8 h-8 text-gold-400" />,
              celestial: "constellation",
              title: "Cosmic Analysis",
              desc: "Advanced algorithms decode your musical DNA through celestial mathematics and ancient wisdom",
              bg: "from-purple-600/30 to-indigo-600/30",
            },
            {
              icon: <Shield className="w-8 h-8 text-gold-400" />,
              celestial: "planet",
              title: "Sacred Privacy",
              desc: "Your musical journey remains protected within our celestial vault, encrypted by cosmic forces",
              bg: "from-green-600/30 to-teal-600/30",
            },
            {
              icon: <Globe className="w-8 h-8 text-gold-400" />,
              celestial: "eye",
              title: "Connection",
              desc: "Join fellow cosmic travelers discovering their musical destiny across the galaxy",
              bg: "from-blue-600/30 to-cyan-600/30",
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="glassmorphism border-gold-400/30 p-6 sm:p-8 text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="mb-6">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${feature.bg} flex items-center justify-center group-hover:pulse-glow`}
                >
                  {feature.icon}
                </div>
                <CelestialIcon
                  type={feature.celestial as any}
                  className="mx-auto text-purple-400"
                />
              </div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-100 mb-3">
                {feature.title}
              </h3>
              <p className="font-poppins text-sm sm:text-base text-purple-200">
                {feature.desc}
              </p>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div
          className={`mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl w-full transition-all duration-2000 delay-4000 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {[
            {
              number: "Musical",
              label: "Cosmic Travelers",
              icon: "constellation",
            },
            { number: "Your", label: "Songs Analyzed", icon: "sun" },
            { number: "4", label: "Celestial Chambers", icon: "mystical" },
            { number: "∞", label: "Musical Possibilities", icon: "eye" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <CelestialIcon
                type={stat.icon as any}
                size="lg"
                className="text-gold-400 mx-auto mb-2"
              />
              <div className="font-cinzel text-xl sm:text-3xl font-bold text-gold-100 glow-text mb-1">
                {stat.number}
              </div>
              <div className="font-poppins text-xs sm:text-sm text-purple-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mystical Quote */}
        <div
          className={`mt-12 sm:mt-16 text-center max-w-2xl px-4 transition-all duration-2000 delay-5000 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 flex-wrap">
            <CelestialIcon type="moon" className="text-gold-400" />
            <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent w-12 sm:w-16" />
            <CelestialIcon type="sun" className="text-gold-400" />
            <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent w-12 sm:w-16" />
            <CelestialIcon type="moon" className="text-gold-400" />
          </div>
          <blockquote className="font-cormorant text-base sm:text-lg md:text-xl text-purple-200 italic">
            "It's Astronomy. We're two worlds apart."
          </blockquote>
          <cite className="font-poppins text-sm text-gold-400 mt-4 block">
            — Conan Gray
          </cite>
        </div>
      </div>
    </div>
  );
}
