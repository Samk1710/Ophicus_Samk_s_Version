"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CelestialIcon } from "@/components/celestial-icon"
import { Send, X, Minimize2, Maximize2, Sparkles } from "lucide-react"

interface Message {
  id: number
  type: "user" | "lunar"
  content: string
  timestamp: Date
}

export function LunarChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "lunar",
      content:
        "🌙 Greetings, cosmic traveler! I am Lunar, your celestial guide through the mysteries of Ophiuchus. The moonlight illuminates your path - how may I assist your journey among the stars?",
      timestamp: new Date(),
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    }

    // Simulate Lunar's response with moon-themed messages
    const lunarResponses = [
      "🌙 The lunar cycles whisper that your musical essence resonates with ancient cosmic harmonies. Each note you've chosen dances with moonbeams.",
      "✨ I sense the silver light of curiosity flowing through your aura. The 13th zodiac reveals itself to those who seek under the moon's gentle guidance.",
      "🌟 Your musical constellation shimmers like moonlight on water. The chambers ahead will unlock the nocturnal secrets written in your soul's melody.",
      "🌙 The moon has been watching over your musical journey, dear traveler. Your cosmic song is being woven by lunar threads and starlight.",
      "💫 Through the ethereal moonbeams, I perceive your destiny unfolding like night-blooming flowers. Trust in the lunar wisdom, for it knows your true harmonic nature.",
      "🌙 The phases of the moon mirror the rhythm of your heart. Each beat aligns with the celestial symphony that calls to your spirit.",
      "✨ Like the moon's reflection on still waters, your musical preferences reveal the depths of your cosmic soul. The universe listens to your silent songs.",
    ]

    const lunarMessage: Message = {
      id: messages.length + 2,
      type: "lunar",
      content: lunarResponses[Math.floor(Math.random() * lunarResponses.length)],
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage, lunarMessage])
    setCurrentMessage("")
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-900/40 via-purple-800/40 to-blue-900/40 border-2 border-indigo-400/50 hover:border-indigo-300/70 transition-all duration-300 group relative overflow-hidden"
        >
          {/* Moonlight effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Floating sparkles */}
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-3 h-3 text-indigo-300 animate-pulse" />
          </div>

          <div className="flex flex-col items-center relative z-10">
            <CelestialIcon
              type="moon"
              size="lg"
              className="text-indigo-200 group-hover:text-white transition-colors duration-300"
            />
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Card
        className={`glassmorphism border-2 border-indigo-400/50 transition-all duration-300 ${
          isMinimized ? "w-80 h-16" : "max-w-lg w-[90vw] max-h-[80vh] h-[600px]"
        } relative overflow-hidden flex flex-col`}
        style={{
          background:
            "linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(99, 102, 241, 0.1) 50%, rgba(139, 92, 246, 0.1) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Lunar glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5 pointer-events-none" />

        {/* Floating moon particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-indigo-300/30 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="p-4 border-b border-indigo-400/30 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-blue-500/30 flex items-center justify-center border border-indigo-400/30 relative">
              <CelestialIcon type="moon" size="sm" className="text-indigo-200" />
              <div className="absolute -top-1 -right-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="font-cormorant text-lg font-bold text-indigo-100 flex items-center gap-2">
                Lunar
                <Sparkles className="w-4 h-4 text-indigo-300" />
              </h3>
              <p className="font-poppins text-xs text-indigo-300">Moonlight Guide</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-indigo-300 hover:text-indigo-100 hover:bg-indigo-500/20 p-1"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-indigo-300 hover:text-indigo-100 hover:bg-indigo-500/20 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 relative z-10">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg text-sm relative ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-100 border border-purple-400/30"
                        : "bg-gradient-to-r from-indigo-600/30 to-blue-600/30 text-indigo-100 border border-indigo-400/30"
                    }`}
                  >
                    {message.type === "lunar" && (
                      <div className="absolute -left-2 top-3">
                        <CelestialIcon type="moon" size="sm" className="text-indigo-300" />
                      </div>
                    )}
                    <p className="font-poppins leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-indigo-400/30 relative z-10">
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask Lunar about your cosmic journey..."
                  className="glassmorphism border-indigo-400/30 text-indigo-100 placeholder-indigo-300/50 text-sm bg-indigo-900/20 focus:border-indigo-300/50"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-400/30 hover:from-indigo-500/40 hover:to-purple-500/40 text-indigo-100 px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>
    </div>
  )
}
