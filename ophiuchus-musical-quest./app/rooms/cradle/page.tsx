"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { CosmicConfetti, celebrateCorrectAnswer } from "@/components/cosmic-confetti"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle, Globe, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useGameState } from "@/components/providers/game-state-provider"
import { SpotifySearch } from "@/components/spotify-search"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Message {
  id: number
  type: "user" | "system"
  content: string
  timestamp: Date
}

export default function CradleRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [selectedArtist, setSelectedArtist] = useState<{id: string; name: string} | null>(null)
  const [showGuessForm, setShowGuessForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionsRemaining, setQuestionsRemaining] = useState(5)
  const [attemptsRemaining, setAttemptsRemaining] = useState(3)
  const [isCompleted, setIsCompleted] = useState(false)
  const [clueText, setClueText] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showFailureDialog, setShowFailureDialog] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const { sessionId, gameSession, refreshGameState } = useGameState()
  const router = useRouter()

  console.log('[Cradle] Component mounted, session:', sessionId)
  console.log('[Cradle] Game session:', gameSession)

  useEffect(() => {
    if (!sessionId) {
      console.log('[Cradle] No session ID, redirecting')
      router.push('/home')
      return
    }
    fetchInitialClue()
  }, [sessionId])

  const fetchInitialClue = async () => {
    console.log('[Cradle] Fetching initial artist clue...')
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/cradle?sessionId=${sessionId}`)
      const data = await response.json()
      console.log('[Cradle] Initial data:', data)
      
      if (data.completed) {
        setIsCompleted(true)
        setClueText(data.clue || '')
        setMessages([{
          id: 1,
          type: "system",
          content: "You have already completed this chamber. " + (data.clue || ''),
          timestamp: new Date()
        }])
      } else {
        setMessages([{
          id: 1,
          type: "system",
          content: data.clue || "From the cradle of creation, ask me anything to uncover the artist's identity...",
          timestamp: new Date()
        }])
        setQuestionsRemaining(5 - (data.questionsAsked || 0))
      }
    } catch (error) {
      console.error('[Cradle] Failed to fetch:', error)
      setMessages([{
        id: 1,
        type: "system",
        content: "The cosmic oracle is silent... Try again.",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentMessage.trim() || isSending || questionsRemaining <= 0) {
      console.log('[Cradle] Cannot send:', { currentMessage, isSending, questionsRemaining })
      return
    }

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setCurrentMessage("")
    setIsSending(true)
    console.log('[Cradle] Asking question:', currentMessage)

    try {
      const response = await fetch('/api/rooms/cradle/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          question: currentMessage
        })
      })

      const data = await response.json()
      console.log('[Cradle] Answer received:', data)

      const systemResponse: Message = {
        id: messages.length + 2,
        type: "system",
        content: data.answer || "The oracle ponders your question...",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, systemResponse])
      setQuestionsRemaining(data.questionsRemaining || 0)

      // No automatic showing of guess form - it's always visible
    } catch (error) {
      console.error('[Cradle] Failed to get answer:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleArtistGuess = async () => {
    if (!selectedArtist || isSubmitting) {
      console.log('[Cradle] Cannot submit:', { selectedArtist, isSubmitting })
      return
    }

    setIsSubmitting(true)
    console.log('[Cradle] Submitting artist guess:', selectedArtist)

    try {
      const response = await fetch('/api/rooms/cradle/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          guessedArtistId: selectedArtist.id
        })
      })

      const data = await response.json()
      console.log('[Cradle] Guess result:', data)

      if (data.correct) {
        // Trigger confetti celebration
        if (data.celebrateCorrect) {
          celebrateCorrectAnswer()
        }
        
        setIsCompleted(true)
        setClueText(data.clue || '')
        setEarnedPoints(data.points || 0)
        setShowSuccessDialog(true)
        
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: "system",
          content: `✨ Correct! The artist is ${data.correctArtist?.name}. You earned ${data.points} points!`,
          timestamp: new Date()
        }])
        await refreshGameState()
      } else {
        setAttemptsRemaining(data.attemptsRemaining || 0)
        setShowFailureDialog(true)
        
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: "system",
          content: `❌ Not quite. ${data.attemptsRemaining} attempts remaining.`,
          timestamp: new Date()
        }])
        
        // Clear selection for next attempt
        setSelectedArtist(null)
      }
    } catch (error) {
      console.error('[Cradle] Guess failed:', error)
      alert('Failed to submit guess. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const completedRooms = gameSession?.roomClues
    ? Object.entries(gameSession.roomClues)
        .filter(([_, clue]) => clue?.completed)
        .map(([roomId]) => roomId)
    : []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={completedRooms} currentRoom="cradle" />

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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-600/30 flex items-center justify-center">
                      <CelestialIcon type="eye" className="text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-cormorant text-lg font-bold text-blue-100">Cosmic Oracle</h3>
                      <p className="font-poppins text-xs text-blue-300">Guardian of Musical Mysteries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-poppins text-xs text-blue-300">Questions: {questionsRemaining}/5</p>
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
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-blue-600/30 text-blue-100 px-4 py-2 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-blue-400/30">
                {questionsRemaining > 0 && !isCompleted ? (
                  <div className="flex gap-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Ask about the artist..."
                      className="glassmorphism border-blue-400/30 text-blue-100 placeholder-blue-300/50"
                      disabled={isSending}
                    />
                    <Button 
                      type="submit" 
                      className="mystical-button px-4"
                      disabled={isSending}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-blue-300 font-poppins text-sm">
                    {isCompleted ? 'Challenge completed!' : 'All questions used. Time to guess the artist!'}
                  </p>
                )}
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
                <p className="font-poppins text-xs text-green-300 mt-2">
                  Attempts: {attemptsRemaining}/3
                </p>
              </div>

              {/* Always show guess form, even before all questions are asked */}
              {!isCompleted && attemptsRemaining > 0 ? (
                <div className="space-y-4">
                  <p className="font-poppins text-sm text-green-200 text-center mb-3">
                    Search and select the artist:
                  </p>
                  <SpotifySearch
                    type="artist"
                    onSelect={(artist: any) => {
                      console.log('[Cradle] Artist selected:', artist)
                      setSelectedArtist({
                        id: artist.id,
                        name: artist.name
                      })
                    }}
                    placeholder="Search for the artist..."
                  />
                  
                  {selectedArtist && (
                    <div className="bg-green-900/20 rounded-lg p-3 border border-green-400/30">
                      <p className="font-poppins text-sm text-green-200 text-center">
                        Selected: <span className="font-bold text-gold-200">{selectedArtist.name}</span>
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleArtistGuess}
                    className="mystical-button w-full"
                    disabled={!selectedArtist || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Guess'
                    )}
                  </Button>
                </div>
              ) : isCompleted && clueText ? (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-400/30">
                  <p className="font-poppins text-sm text-green-200 italic text-center">
                    {clueText}
                  </p>
                </div>
              ) : null}
            </Card>

            {/* Hint Card */}
            <Card className="glassmorphism border-yellow-400/50 p-6">
              <div className="flex items-center mb-3">
                <CelestialIcon type="sun" className="text-yellow-400 mr-2" />
                <h4 className="font-cormorant text-lg font-bold text-yellow-100">Cosmic Hint</h4>
              </div>
              <p className="font-poppins text-sm text-yellow-200">
                The artist you seek has a voice that transcends time. Use your questions wisely to uncover their identity.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="glassmorphism border-green-400/50">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-cinzel text-green-100">
              Correct! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              <p className="text-green-200 font-poppins">
                You've successfully identified the artist!
              </p>
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-400/30">
                <p className="text-gold-200 font-bold text-xl">+{earnedPoints} Points</p>
              </div>
              {clueText && (
                <p className="text-green-200 italic font-poppins text-sm">
                  {clueText}
                </p>
              )}
              <Button 
                onClick={() => {
                  setShowSuccessDialog(false)
                  router.push('/home')
                }}
                className="mystical-button w-full mt-4"
              >
                Continue Journey
              </Button>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      {/* Failure Dialog */}
      <AlertDialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <AlertDialogContent className="glassmorphism border-yellow-400/50">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-yellow-400" />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-cinzel text-yellow-100">
              Not Quite Right
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              <p className="text-yellow-200 font-poppins">
                {attemptsRemaining > 0 
                  ? `That's not the correct artist. You have ${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.`
                  : "You've used all your attempts, but the journey continues through other chambers."}
              </p>
              <Button 
                onClick={() => {
                  setShowFailureDialog(false)
                  if (attemptsRemaining === 0) {
                    router.push('/astral-nexus')
                  }
                }}
                className="mystical-button w-full mt-4"
              >
                {attemptsRemaining > 0 ? 'Try Again' : 'Continue Journey'}
              </Button>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
