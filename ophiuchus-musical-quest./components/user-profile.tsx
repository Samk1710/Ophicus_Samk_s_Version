"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Music } from "lucide-react"
import Link from "next/link"

export default function UserProfile() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500/30 to-purple-600/30 animate-pulse" />
    )
  }

  if (!session) {
    return (
      <Link href="/login">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-purple-200 hover:text-gold-100 hover:bg-gold-600/20"
        >
          <User className="w-4 h-4 mr-2" />
          Login
        </Button>
      </Link>
    )
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10 border-2 border-gold-400/50 hover:border-gold-400 transition-colors">
            <AvatarImage 
              src={session.user?.image || ""} 
              alt={session.user?.name || "User"} 
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-gold-500/30 to-purple-600/30 text-gold-100 font-semibold">
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-black/90 backdrop-blur-md border-gold-400/30" 
        align="end"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={session.user?.image || ""} 
              alt={session.user?.name || "User"} 
            />
            <AvatarFallback className="bg-gradient-to-br from-gold-500/30 to-purple-600/30 text-gold-100 text-xs">
              {session.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-gold-100">
              {session.user?.name || "Cosmic Explorer"}
            </p>
            <p className="text-xs text-purple-300">
              {session.user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-gold-400/20" />
        <DropdownMenuItem className="text-purple-200 hover:text-gold-100 hover:bg-gold-600/20 focus:text-gold-100 focus:bg-gold-600/20">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-purple-200 hover:text-gold-100 hover:bg-gold-600/20 focus:text-gold-100 focus:bg-gold-600/20">
          <Music className="mr-2 h-4 w-4" />
          <span>Spotify Stats</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gold-400/20" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-red-400 hover:text-red-300 hover:bg-red-600/20 focus:text-red-300 focus:bg-red-600/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
