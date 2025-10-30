"use client"

import { useState } from "react"
import { Map, X, Sparkles } from "lucide-react"
import { useGameState } from "@/components/providers/game-state-provider"
import { motion, AnimatePresence } from "framer-motion"

export function AstronomyMap() {
  const [isOpen, setIsOpen] = useState(false)
  const { gameSession } = useGameState()

  // Room data with colors and emojis
  const roomData = {
    nebula: {
      name: "Nebula",
      emoji: "🌌",
      color: "purple",
      label: "Poem of the Stars",
    },
    comet: {
      name: "Comet",
      emoji: "☄️",
      color: "orange",
      label: "Lyric Flash",
    },
    aurora: {
      name: "Aurora",
      emoji: "🌈",
      color: "green",
      label: "Emotional Resonance",
    },
    cradle: {
      name: "Cradle",
      emoji: "🌍",
      color: "blue",
      label: "Cosmic Discovery",
    },
  }

  // Get all completed clues (not skipped)
  const clues = Object.entries(gameSession?.roomClues || {}).filter(
    ([room, clueObj]: [string, any]) => 
      clueObj?.completed && !clueObj?.skipped && clueObj?.clue
  )

  const hasClues = clues.length > 0

  return (
    <>
      {/* Floating Button - Positioned at bottom-left like LunarChatbot was */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          hasClues
            ? 'bg-gradient-to-br from-purple-600 to-gold-600 hover:from-purple-500 hover:to-gold-500'
            : 'bg-gradient-to-br from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 opacity-50'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        disabled={!hasClues}
      >
        <Map className="w-6 h-6 text-white" />
        {hasClues && (
          <motion.div
            className="absolute -top-1 -left-1 w-5 h-5 bg-gold-400 rounded-full flex items-center justify-center text-xs font-bold text-black"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {clues.length}
          </motion.div>
        )}
      </motion.button>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 flex items-center justify-center transition-colors border border-gold-400/30"
              >
                <X className="w-5 h-5 text-gold-300" />
              </button>

              {/* Content */}
              <div className="bg-gradient-to-br from-zinc-900 via-purple-900/20 to-zinc-900 border-2 border-gold-400/30 rounded-3xl p-8 overflow-y-auto max-h-[90vh] custom-scrollbar">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Map className="w-8 h-8 text-gold-400" />
                    <h2 className="font-cinzel text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-purple-300 to-gold-300">
                      Astronomy Map
                    </h2>
                  </div>
                  <p className="font-poppins text-sm text-purple-300 italic">
                    The cosmic clues you've gathered on your journey
                  </p>
                </div>

                {/* Clues Grid */}
                {!hasClues ? (
                  <div className="text-center py-16">
                    <Sparkles className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                    <p className="font-poppins text-lg text-purple-300">
                      Complete rooms to unlock cosmic clues
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {clues.map(([room, clueObj]: [string, any]) => {
                      const data = roomData[room as keyof typeof roomData]
                      if (!data) return null

                      // Define colors based on room
                      const bgGradient = 
                        room === 'nebula' ? 'from-purple-900/20 to-black/40' :
                        room === 'comet' ? 'from-orange-900/20 to-black/40' :
                        room === 'aurora' ? 'from-green-900/20 to-black/40' :
                        'from-blue-900/20 to-black/40'
                      
                      const borderColor = 
                        room === 'nebula' ? 'border-purple-400/30 hover:border-purple-400/50' :
                        room === 'comet' ? 'border-orange-400/30 hover:border-orange-400/50' :
                        room === 'aurora' ? 'border-green-400/30 hover:border-green-400/50' :
                        'border-blue-400/30 hover:border-blue-400/50'
                      
                      const iconBg = 
                        room === 'nebula' ? 'to-purple-900/30' :
                        room === 'comet' ? 'to-orange-900/30' :
                        room === 'aurora' ? 'to-green-900/30' :
                        'to-blue-900/30'
                      
                      const iconBorder = 
                        room === 'nebula' ? 'border-purple-400/30' :
                        room === 'comet' ? 'border-orange-400/30' :
                        room === 'aurora' ? 'border-green-400/30' :
                        'border-blue-400/30'
                      
                      const titleColor = 
                        room === 'nebula' ? 'text-purple-100' :
                        room === 'comet' ? 'text-orange-100' :
                        room === 'aurora' ? 'text-green-100' :
                        'text-blue-100'
                      
                      const labelColor = 
                        room === 'nebula' ? 'text-purple-300' :
                        room === 'comet' ? 'text-orange-300' :
                        room === 'aurora' ? 'text-green-300' :
                        'text-blue-300'

                      return (
                        <motion.div
                          key={room}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`bg-gradient-to-br ${bgGradient} border-2 ${borderColor} rounded-2xl p-6 transition-all duration-300`}
                        >
                          {/* Room Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-black/50 ${iconBg} flex items-center justify-center text-3xl border ${iconBorder}`}>
                              {data.emoji}
                            </div>
                            <div>
                              <h3 className={`font-cinzel text-2xl font-bold ${titleColor}`}>
                                {data.name}
                              </h3>
                              <p className={`font-poppins text-xs ${labelColor} italic`}>
                                {data.label}
                              </p>
                            </div>
                            <div className="ml-auto">
                              <div className="bg-gold-400/20 border border-gold-400/40 rounded-full px-3 py-1">
                                <span className="font-poppins text-sm font-bold text-gold-200">
                                  +{clueObj.points || 0}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Clue Content */}
                          <div className="bg-black/40 rounded-xl p-4 border border-gold-400/20">
                            <p className="font-cormorant text-lg text-gold-100 leading-relaxed whitespace-pre-wrap">
                              "{clueObj.clue}"
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                {/* Initial Clue */}
                {gameSession?.initialClue && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-br from-zinc-800/50 to-purple-900/20 border-2 border-purple-400/30 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h4 className="font-cinzel text-xl font-bold text-purple-100">
                        Initial Cosmic Clue
                      </h4>
                    </div>
                    <div className="bg-black/40 rounded-xl p-4 border border-purple-400/20">
                      <p className="font-cormorant text-lg text-purple-100 leading-relaxed">
                        "{gameSession.initialClue}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
