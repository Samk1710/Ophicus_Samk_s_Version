"use client"

import { useEffect, useState } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  constellation?: string
}

interface ConstellationLine {
  from: number
  to: number
  constellation: string
}

export function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [constellationLines, setConstellationLines] = useState<ConstellationLine[]>([])

  useEffect(() => {
    const generateConstellations = () => {
      const newStars: Star[] = []
      const newLines: ConstellationLine[] = []
      let starId = 0

      // Orion Constellation (top-left area)
      const orionStars = [
        { x: 15, y: 20, size: 3 }, // Betelgeuse
        { x: 25, y: 15, size: 2.5 }, // Bellatrix
        { x: 20, y: 25, size: 2 }, // Alnitak
        { x: 22, y: 27, size: 2 }, // Alnilam
        { x: 24, y: 29, size: 2 }, // Mintaka
        { x: 18, y: 35, size: 2.5 }, // Saiph
        { x: 28, y: 32, size: 3 }, // Rigel
      ]

      orionStars.forEach((star, index) => {
        newStars.push({
          id: starId++,
          x: star.x,
          y: star.y,
          size: star.size,
          opacity: 0.9,
          twinkleSpeed: 2 + Math.random(),
          constellation: "orion",
        })
      })

      // Orion belt and connections
      newLines.push(
        { from: 2, to: 3, constellation: "orion" }, // Belt
        { from: 3, to: 4, constellation: "orion" }, // Belt
        { from: 0, to: 1, constellation: "orion" }, // Shoulders
        { from: 1, to: 6, constellation: "orion" }, // Right side
        { from: 0, to: 2, constellation: "orion" }, // Left side
        { from: 5, to: 6, constellation: "orion" }, // Bottom
      )

      // Big Dipper (top-right area)
      const bigDipperStars = [
        { x: 70, y: 15, size: 2.5 },
        { x: 75, y: 18, size: 2 },
        { x: 80, y: 20, size: 2.5 },
        { x: 85, y: 18, size: 2 },
        { x: 82, y: 25, size: 2 },
        { x: 78, y: 28, size: 2.5 },
        { x: 73, y: 30, size: 2 },
      ]

      const bigDipperStartId = starId
      bigDipperStars.forEach((star, index) => {
        newStars.push({
          id: starId++,
          x: star.x,
          y: star.y,
          size: star.size,
          opacity: 0.8,
          twinkleSpeed: 1.5 + Math.random(),
          constellation: "bigDipper",
        })
      })

      // Big Dipper connections
      for (let i = 0; i < bigDipperStars.length - 1; i++) {
        newLines.push({
          from: bigDipperStartId + i,
          to: bigDipperStartId + i + 1,
          constellation: "bigDipper",
        })
      }

      // Cassiopeia (center-top area)
      const cassiopeiaStars = [
        { x: 45, y: 10, size: 2 },
        { x: 50, y: 8, size: 2.5 },
        { x: 55, y: 12, size: 2 },
        { x: 60, y: 8, size: 2 },
        { x: 65, y: 11, size: 2.5 },
      ]

      const cassiopeiaStartId = starId
      cassiopeiaStars.forEach((star, index) => {
        newStars.push({
          id: starId++,
          x: star.x,
          y: star.y,
          size: star.size,
          opacity: 0.85,
          twinkleSpeed: 2 + Math.random(),
          constellation: "cassiopeia",
        })
      })

      // Cassiopeia W shape
      for (let i = 0; i < cassiopeiaStars.length - 1; i++) {
        newLines.push({
          from: cassiopeiaStartId + i,
          to: cassiopeiaStartId + i + 1,
          constellation: "cassiopeia",
        })
      }

      // Southern Cross (bottom-right area)
      const southernCrossStars = [
        { x: 75, y: 70, size: 3 }, // Acrux
        { x: 80, y: 75, size: 2.5 }, // Gacrux
        { x: 85, y: 80, size: 2 }, // Imai
        { x: 78, y: 82, size: 2.5 }, // Mimosa
        { x: 72, y: 78, size: 1.5 }, // Delta Crucis
      ]

      const southernCrossStartId = starId
      southernCrossStars.forEach((star, index) => {
        newStars.push({
          id: starId++,
          x: star.x,
          y: star.y,
          size: star.size,
          opacity: 0.9,
          twinkleSpeed: 1.8 + Math.random(),
          constellation: "southernCross",
        })
      })

      // Southern Cross shape
      newLines.push(
        { from: southernCrossStartId, to: southernCrossStartId + 2, constellation: "southernCross" }, // Vertical
        { from: southernCrossStartId + 1, to: southernCrossStartId + 3, constellation: "southernCross" }, // Horizontal
        { from: southernCrossStartId + 4, to: southernCrossStartId + 1, constellation: "southernCross" }, // Extra
      )

      // Leo (bottom-left area)
      const leoStars = [
        { x: 10, y: 60, size: 2.5 }, // Regulus
        { x: 15, y: 65, size: 2 },
        { x: 20, y: 70, size: 2 },
        { x: 25, y: 68, size: 2.5 },
        { x: 30, y: 65, size: 2 },
        { x: 35, y: 70, size: 2 },
        { x: 25, y: 75, size: 2 },
      ]

      const leoStartId = starId
      leoStars.forEach((star, index) => {
        newStars.push({
          id: starId++,
          x: star.x,
          y: star.y,
          size: star.size,
          opacity: 0.8,
          twinkleSpeed: 2.2 + Math.random(),
          constellation: "leo",
        })
      })

      // Leo connections (lion shape)
      newLines.push(
        { from: leoStartId, to: leoStartId + 1, constellation: "leo" },
        { from: leoStartId + 1, to: leoStartId + 2, constellation: "leo" },
        { from: leoStartId + 2, to: leoStartId + 6, constellation: "leo" },
        { from: leoStartId + 3, to: leoStartId + 4, constellation: "leo" },
        { from: leoStartId + 4, to: leoStartId + 5, constellation: "leo" },
        { from: leoStartId + 1, to: leoStartId + 3, constellation: "leo" },
      )

      // Add some random background stars
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: starId++,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          twinkleSpeed: Math.random() * 3 + 1,
        })
      }

      setStars(newStars)
      setConstellationLines(newLines)
    }

    generateConstellations()
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Nebula Background */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `url('/images/nebula-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1px)",
        }}
      />

      {/* Aurora Overlay */}
      <div className="absolute inset-0 aurora-gradient opacity-20" />

      {/* Constellation Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {constellationLines.map((line, index) => {
          const fromStar = stars.find((s) => s.id === line.from)
          const toStar = stars.find((s) => s.id === line.to)
          if (!fromStar || !toStar) return null

          return (
            <line
              key={index}
              x1={`${fromStar.x}%`}
              y1={`${fromStar.y}%`}
              x2={`${toStar.x}%`}
              y2={`${toStar.y}%`}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              className="constellation-line"
            />
          )
        })}
      </svg>

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${star.constellation ? "bg-yellow-200" : "bg-white"} constellation-star`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.twinkleSpeed}s infinite alternate`,
            boxShadow: star.constellation
              ? `0 0 ${star.size * 3}px rgba(255, 255, 150, 0.8)`
              : `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5)`,
          }}
        />
      ))}

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 rounded-full opacity-30 floating-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        
        .constellation-line {
          animation: fadeInOut 4s ease-in-out infinite;
        }
        
        .constellation-star {
          transition: all 0.3s ease;
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
