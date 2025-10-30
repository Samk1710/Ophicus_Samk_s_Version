"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CelestialIcon } from "@/components/celestial-icon";
import { Music, Shield, Zap } from "lucide-react";

export function SpotifyLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to astral-nexus if already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log('[SpotifyLogin] User already authenticated, redirecting to astral-nexus');
      router.push('/astral-nexus');
    }
  }, [status, session, router]);

  const handleSpotifyLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("spotify", { callbackUrl: "/home" });
    } catch (error) {
      console.error("Spotify login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Layers */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('/images/celestial-pattern.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/images/mystical-cosmos.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-purple-950/90 to-black/90" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <CelestialIcon type="eye" size="xl" className="text-gold-400" />
                <div className="absolute -top-2 -right-2">
                  <CelestialIcon
                    type="mystical"
                    size="sm"
                    className="text-purple-300 animate-pulse"
                  />
                </div>
              </div>
            </div>
            <h1 className="font-cinzel text-4xl font-bold text-gold-100 mb-4 glow-text">
              Ophiuchus
            </h1>
            <p className="font-cormorant text-xl text-purple-200 mb-2">
              The 13th Zodiac of Songs
            </p>
            <p className="font-poppins text-sm text-purple-300/80">
              Unlock your cosmic musical destiny
            </p>
          </div>

          {/* Login Card */}
          <Card className="glassmorphism border-gold-400/30 p-8 mb-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <CelestialIcon
                  type="sun"
                  size="lg"
                  className="text-gold-400 mr-3"
                />
                <h2 className="font-cormorant text-2xl font-bold text-gold-100">
                  Celestial Gateway
                </h2>
                <CelestialIcon
                  type="moon"
                  size="lg"
                  className="text-gold-400 ml-3"
                />
              </div>
              <p className="font-poppins text-purple-200 text-sm">
                Connect your Spotify to reveal your cosmic musical profile
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-purple-400/20">
                <Music className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-poppins text-sm font-medium text-purple-100">
                    Analyze Your Musical Cosmos
                  </p>
                  <p className="font-poppins text-xs text-purple-300">
                    Discover patterns in your listening habits
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-purple-400/20">
                <Shield className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-poppins text-sm font-medium text-purple-100">
                    Secure & Private
                  </p>
                  <p className="font-poppins text-xs text-purple-300">
                    Your data remains protected and encrypted
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-purple-400/20">
                <Zap className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="font-poppins text-sm font-medium text-purple-100">
                    Instant Insights
                  </p>
                  <p className="font-poppins text-xs text-purple-300">
                    Real-time analysis of your musical journey
                  </p>
                </div>
              </div>
            </div>

            {/* Spotify Login Button */}
            <Button
              onClick={handleSpotifyLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-4 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  Connecting to the Cosmos...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Music className="w-5 h-5 mr-3" />
                  Connect with Spotify
                </div>
              )}
            </Button>

            <p className="text-center text-xs text-purple-400 mt-4">
              By connecting, you agree to our cosmic terms of service
            </p>
          </Card>

          {/* Decorative Icons */}
          <div className="flex justify-center space-x-8 opacity-60">
            <CelestialIcon
              type="constellation"
              className="text-gold-400 animate-pulse"
            />
            <div className="text-purple-400 animate-pulse" style={{ animationDelay: "1s" }}>
              <CelestialIcon
                type="planet"
                className="text-purple-400"
              />
            </div>
            <div className="text-blue-400 animate-pulse" style={{ animationDelay: "2s" }}>
              <CelestialIcon
                type="mystical"
                className="text-blue-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
