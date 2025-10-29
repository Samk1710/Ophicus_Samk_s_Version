"use client"

import { useState, useEffect } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Loader2 } from "lucide-react"
import { useGameState } from "@/components/providers/game-state-provider"
import { useRouter } from "next/navigation"

interface Question {
  question: string
  options: string[]
  selectedAnswer?: number
}

export default function NovaRoom() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Question[]>([])
  const [showResults, setShowResults] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [clueText, setClueText] = useState("")
  const { sessionId, gameSession, refreshGameState } = useGameState()
  const router = useRouter()

  console.log('[Nova] Component mounted, session:', sessionId)

  useEffect(() => {
    if (!sessionId) {
      console.log('[Nova] No session ID yet, waiting...')
      return
    }
    fetchQuestions()
  }, [sessionId])

  const fetchQuestions = async () => {
    console.log('[Nova] Fetching quiz questions...')
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/rooms/nova?sessionId=${sessionId}`)
      const data = await response.json()
      console.log('[Nova] Questions data:', data)
      
      if (data.completed) {
        setIsCompleted(true)
        setClueText(data.clue || '')
        setShowResults(true)
      } else if (data.questions && Array.isArray(data.questions)) {
        setAnswers(data.questions.map((q: any) => ({
          question: q.question,
          options: q.options,
          selectedAnswer: undefined
        })))
      }
    } catch (error) {
      console.error('[Nova] Failed to fetch:', error)
      alert('Failed to load questions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    console.log('[Nova] Answer selected:', { questionIndex, answerIndex })
    const updatedAnswers = [...answers]
    updatedAnswers[questionIndex].selectedAnswer = answerIndex
    setAnswers(updatedAnswers)
  }

  const nextQuestion = async () => {
    if (currentQuestion < answers.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Submit all answers
      await submitQuiz()
    }
  }

  const submitQuiz = async () => {
    console.log('[Nova] Submitting quiz...')
    setIsSubmitting(true)

    try {
      const formattedAnswers = answers.map(q => q.selectedAnswer ?? -1)
      
      const response = await fetch('/api/rooms/nova', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers: formattedAnswers
        })
      })

      const data = await response.json()
      console.log('[Nova] Quiz result:', data)

      setFinalScore(data.score || 0)
      setShowResults(true)

      if (data.passed) {
        setIsCompleted(true)
        setClueText(data.clue || '')
        await refreshGameState()
      }
    } catch (error) {
      console.error('[Nova] Submit failed:', error)
      alert('Failed to submit quiz. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const completedRooms = gameSession?.roomClues
    ? Object.entries(gameSession.roomClues)
        .filter(([_, clue]) => clue?.completed && (clue?.points ?? 0) > 0)
        .map(([roomId]) => roomId)
    : []

  const failedRooms = gameSession?.roomClues
    ? Object.entries(gameSession.roomClues)
        .filter(([_, clue]) => clue?.completed && (clue?.points ?? 0) === 0)
        .map(([roomId]) => roomId)
    : []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen relative overflow-hidden cosmic-bg">
        <CosmicBackground />
        <ProgressTracker completedRooms={completedRooms} currentRoom="nova" />

        {/* Results Page */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="glassmorphism border-yellow-400/50 p-8">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-600/30 flex items-center justify-center pulse-glow">
                  <Star className="w-10 h-10 text-yellow-300" />
                </div>
                <h2 className="font-cinzel text-3xl font-bold text-yellow-100 mb-4 glow-text">Nova Revelation</h2>
                <p className="font-poppins text-yellow-200 mb-6">
                  Your musical memories have been analyzed by the cosmic forces
                </p>
              </div>

              {/* Score Display */}
              <div className="bg-black/20 rounded-lg p-6 mb-6">
                <h3 className="font-cormorant text-xl font-bold text-yellow-100 mb-4">Cosmic Alignment Score</h3>
                <div className="flex justify-center gap-2 mb-4">
                  {[...Array(answers.length)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${i < finalScore ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                    />
                  ))}
                </div>
                <p className="font-poppins text-yellow-200">
                  {finalScore}/{answers.length} memories aligned with the cosmic frequency
                </p>
              </div>

              {/* Clue Fragment */}
              {isCompleted && clueText ? (
                <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-400/30">
                  <h4 className="font-cormorant text-lg font-bold text-purple-100 mb-3">Memory Fragment Revealed</h4>
                  <p className="font-poppins text-purple-200 italic">
                    {clueText}
                  </p>
                </div>
              ) : (
                <div className="bg-red-900/20 rounded-lg p-6 border border-red-400/30">
                  <h4 className="font-cormorant text-lg font-bold text-red-100 mb-3">Score Too Low</h4>
                  <p className="font-poppins text-red-200">
                    Your alignment with the cosmic frequency needs to be stronger. Try again to unlock the clue.
                  </p>
                  <Button 
                    onClick={() => {
                      setShowResults(false)
                      setCurrentQuestion(0)
                      setAnswers(answers.map(q => ({ ...q, selectedAnswer: undefined })))
                    }}
                    className="mystical-button mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={completedRooms} currentRoom="nova" />

      {/* Floating Memory Cards Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-24 bg-gradient-to-br from-yellow-500/10 to-orange-600/10 rounded-lg border border-yellow-400/20 floating-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            <div className="w-2 h-2 bg-yellow-400/30 rounded-full m-2" />
            <div className="w-1 h-1 bg-yellow-400/50 rounded-full m-1" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-yellow-400 mr-4" />
              <h1 className="font-cinzel text-4xl font-bold glow-text text-gold-100">Nova</h1>
              <CelestialIcon type="mystical" size="lg" className="text-yellow-400 ml-4" />
            </div>
            <p className="font-poppins text-sm text-purple-300 italic">Reverb of Memory</p>
          </div>

          {/* Question Card */}
          <Card className="glassmorphism border-yellow-400/50 p-8 mb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-600/30 flex items-center justify-center pulse-glow">
                <Star className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-poppins text-sm text-yellow-300">
                  Question {currentQuestion + 1} of {answers.length}
                </span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / answers.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            {answers.length > 0 && (
              <div className="mb-8">
                <h2 className="font-cormorant text-xl font-bold text-yellow-100 mb-6 text-center">
                  {answers[currentQuestion].question}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                  {answers[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                      className={`w-full p-4 rounded-lg border transition-all duration-300 text-left ${
                        answers[currentQuestion].selectedAnswer === index
                          ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-100"
                          : "bg-black/20 border-gray-600/30 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-400/30"
                      }`}
                    >
                      <span className="font-poppins">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
                className="border-yellow-400/30 text-yellow-200 hover:bg-yellow-500/10 disabled:opacity-50 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {answers.map((q, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentQuestion
                        ? "bg-yellow-400"
                        : q.selectedAnswer !== undefined
                          ? "bg-green-400"
                          : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextQuestion}
                disabled={answers[currentQuestion]?.selectedAnswer === undefined || isSubmitting}
                className="mystical-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    {currentQuestion === answers.length - 1 ? "Reveal Results" : "Next"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
