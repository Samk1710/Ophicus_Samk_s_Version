import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, Cormorant_Garamond, Cinzel_Decorative } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { LunarChatbot } from "@/components/lunar-chatbot"
import SessionProvider from "@/components/providers/session-provider"
import { GameStateProvider } from "@/components/providers/game-state-provider"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
})

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-cinzel",
})

export const metadata: Metadata = {
  title: "Ophiuchus: The 13th Zodiac of Songs",
  description: "A cosmic musical quest through the stars",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${cormorantGaramond.variable} ${cinzelDecorative.variable} antialiased`}
      >
        <SessionProvider>
          <GameStateProvider>
            <div className="min-h-screen bg-gray-950 text-gray-100 font-inter">
              <Navbar />
              <main className="pt-16">{children}</main>
              <LunarChatbot />
            </div>
            <Toaster 
              position="top-center"
              toastOptions={{
                className: "glassmorphism border-purple-400/50",
                style: {
                  background: "rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(168, 85, 247, 0.5)",
                  color: "#e9d5ff"
                }
              }}
            />
          </GameStateProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
