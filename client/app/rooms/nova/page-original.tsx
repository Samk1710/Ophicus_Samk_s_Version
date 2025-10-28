"use client"

import { useState } from "react"
import { CosmicBackground } from "@/components/cosmic-background"
import { ProgressTracker } from "@/components/progress-tracker"
import { CelestialIcon } from "@/components/celestial-icon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Link from "next/link"

interface Question {
  id: number
  question: string
  options: string[]
  selectedAnswer?: number
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which genre resonates most with your soul during midnight hours?",
    options: ["Classical symphonies", "Electronic ambient", "Jazz improvisations", "Rock ballads"],
  },
  {
    id: 2,
    question: "When you hear a powerful vocal performance, what moves you most?",
    options: ["Technical precision", "Raw emotion", "Unique tone", "Lyrical storytelling"],
  },
  {
    id: 3,
    question: "Your ideal concert venue would be:",
    options: ["Intimate acoustic setting", "Grand opera house", "Outdoor festival", "Underground club"],
  },
  {
    id: 4,
    question: "Which era of music speaks to your cosmic essence?",
    options: ["60s-70s Classic Rock", "80s New Wave", "90s Alternative", "2000s Pop Revolution"],
  },
  {
    id: 5,
    question: "The instrument that calls to your spirit:",
    options: ["Piano's gentle keys", "Guitar's electric soul", "Violin's ethereal strings", "Voice as pure instrument"],
  },
]

export default function NovaRoom() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Question[]>(questions)
  const [showResults, setShowResults] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const updatedAnswers = [...answers]
    updatedAnswers[questionIndex].selectedAnswer = answerIndex
    setAnswers(updatedAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate final score and show results
      const score = answers.filter((q) => q.selectedAnswer !== undefined).length
      setFinalScore(score)
      setShowResults(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (showResults) {
    return (
      <div className="min-h-screen relative overflow-hidden cosmic-bg">
        <CosmicBackground />
        <ProgressTracker completedRooms={[]} currentRoom="nova" />

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
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${i < finalScore ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                    />
                  ))}
                </div>
                <p className="font-poppins text-yellow-200">
                  {finalScore}/5 memories aligned with the cosmic frequency
                </p>
              </div>

              {/* Clue Fragment */}
              <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-400/30">
                <h4 className="font-cormorant text-lg font-bold text-purple-100 mb-3">Memory Fragment Revealed</h4>
                <p className="font-poppins text-purple-200 italic">
                  "Through the echoes of your musical journey, a fragment emerges... The artist you seek has touched
                  your soul through the power of voice alone."
                </p>
              </div>

              <div className="mt-8">
                <Link href="/astral-nexus">
                  <Button className="mystical-button">Continue to Final Revelation</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden cosmic-bg">
      <CosmicBackground />
      <ProgressTracker completedRooms={[]} currentRoom="nova" />

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
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="font-cormorant text-xl font-bold text-yellow-100 mb-6 text-center">
                {questions[currentQuestion].question}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
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
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentQuestion
                        ? "bg-yellow-400"
                        : answers[index].selectedAnswer !== undefined
                          ? "bg-green-400"
                          : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextQuestion}
                disabled={answers[currentQuestion].selectedAnswer === undefined}
                className="mystical-button"
              >
                {currentQuestion === questions.length - 1 ? "Reveal Results" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
