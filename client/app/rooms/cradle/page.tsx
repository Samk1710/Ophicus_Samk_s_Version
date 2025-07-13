"use client"

import type React from "react"

import { useState } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle, Globe } from "lucide-react"

interface Message {
  id: number
  type: "user" | "system"
  content: string
  timestamp: Date
}

export default function CradleRoom() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "system",
      content:
        "From the cradle of creation, where worlds are born and dreams take flight, emerges an artist whose voice echoes through the cosmos. Ask me anything to uncover their identity...",
      timestamp: new Date(),
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [artistGuess, setArtistGuess] = useState("")
  const [showGuessForm, setShowGuessForm] = useState(false)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    }

    const systemResponse: Message = {
      id: messages.length + 2,
      type: "system",
      content:
        "The cosmic wisdom flows through me... This artist has touched the hearts of millions with their powerful voice and emotional depth. They are known for their ability to convey raw emotion through song.",
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage, systemResponse])
    setCurrentMessage("")
  }

  const handleArtistGuess = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle artist guess logic here
    console.log("Artist guess:", artistGuess)
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={[]} currentRoom="cradle" />

      {/* Earth from Space Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <Globe className="w-96 h-96 text-blue-400 animate-spin" style={{ animationDuration: "60s" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-blue-400 mr-4" />
            <h1 className="font-cinzel text-4xl font-bold glow-text text-gold-100">Cradle</h1>
            <CelestialIcon type="planet" size="lg" className="text-blue-400 ml-4" />
          </div>
          <p className="font-poppins text-sm text-purple-300 italic">The Veiled Origin</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="glassmorphism border-blue-400/50 h-96 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-blue-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-600/30 flex items-center justify-center">
                    <CelestialIcon type="eye" className="text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-cormorant text-lg font-bold text-blue-100">Cosmic Oracle</h3>
                    <p className="font-poppins text-xs text-blue-300">Guardian of Musical Mysteries</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === "user" ? "bg-purple-600/30 text-purple-100" : "bg-blue-600/30 text-blue-100"
                      }`}
                    >
                      <p className="font-poppins text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-blue-400/30">
                <div className="flex gap-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask about the artist..."
                    className="glassmorphism border-blue-400/30 text-blue-100 placeholder-blue-300/50"
                  />
                  <Button type="submit" className="mystical-button px-4">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Artist Guess Panel */}
          <div className="space-y-6">
            <Card className="glassmorphism border-green-400/50 p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-500/30 to-teal-600/30 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-300" />
                </div>
                <h3 className="font-cormorant text-xl font-bold text-green-100">Reveal the Artist</h3>
              </div>

              <Button onClick={() => setShowGuessForm(!showGuessForm)} className="mystical-button w-full mb-4">
                {showGuessForm ? "Hide Form" : "Make Your Guess"}
              </Button>

              {showGuessForm && (
                <form onSubmit={handleArtistGuess} className="space-y-4">
                  <Input
                    value={artistGuess}
                    onChange={(e) => setArtistGuess(e.target.value)}
                    placeholder="Enter artist name..."
                    className="glassmorphism border-green-400/30 text-green-100 placeholder-green-300/50"
                  />
                  <Button type="submit" className="mystical-button w-full">
                    Submit Guess
                  </Button>
                </form>
              )}
            </Card>

            {/* Hint Card */}
            <Card className="glassmorphism border-yellow-400/50 p-6">
              <div className="flex items-center mb-3">
                <CelestialIcon type="sun" className="text-yellow-400 mr-2" />
                <h4 className="font-cormorant text-lg font-bold text-yellow-100">Cosmic Hint</h4>
              </div>
              <p className="font-poppins text-sm text-yellow-200">
                The artist you seek has a voice that can move mountains and touch souls. Their music transcends genres
                and generations.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
