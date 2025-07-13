import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, Cormorant_Garamond, Cinzel_Decorative } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { LunarChatbot } from "@/components/lunar-chatbot"

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
        <div className="min-h-screen bg-gray-950 text-gray-100 font-inter">
          <Navbar />
          <main className="pt-16">{children}</main>
          <LunarChatbot />
        </div>
      </body>
    </html>
  )
}
