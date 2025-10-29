"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CelestialIcon } from "@/components/celestial-icon"
import UserProfile  from "@/components/user-profile"
import { Menu, X, Home, Map, Trophy, User, Scroll } from "lucide-react"

const navItems = [
	{ href: "/", label: "Origin", icon: Home },
	{ href: "/home", label: "Realm", icon: User },
	{ href: "/astral-nexus", label: "Nexus", icon: Map },
	{ href: "/my-quests", label: "My Quests", icon: Scroll },
	{ href: "/leaderboard", label: "Leaderboard", icon: Trophy },
]

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	const pathname = usePathname()

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-gold-400/20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-3">
						<div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500/30 to-purple-600/30 flex items-center justify-center">
							<CelestialIcon type="eye" size="sm" className="text-gold-300" />
						</div>
						<span className="font-cinzel text-xl font-bold text-gold-100 hidden sm:block">
							Ophiuchus
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-4">
							{navItems.map((item) => {
								const Icon = item.icon
								const isActive = pathname === item.href
								return (
									<Link
										key={item.href}
										href={item.href}
										className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
											isActive
												? "bg-gold-600/30 text-gold-100 border border-gold-400/50"
												: "text-purple-200 hover:bg-gold-600/20 hover:text-gold-100"
										}`}
									>
										<Icon className="w-4 h-4" />
										<span>{item.label}</span>
									</Link>
								)
							})}
						</div>
					</div>

					{/* User Profile and Username */}
					<div className="hidden md:flex items-center gap-3">
						<UserProfile />
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center space-x-2">
						<div className="md:hidden">
							<UserProfile />
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsOpen(!isOpen)}
							className="text-purple-200 hover:text-purple-100"
						>
							{isOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isOpen && (
				<div className="md:hidden bg-black/40 backdrop-blur-md border-t border-gold-400/20">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{navItems.map((item) => {
							const Icon = item.icon
							const isActive = pathname === item.href
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`flex px-3 py-2 rounded-md text-base font-medium transition-all duration-300 items-center space-x-2 ${
										isActive
											? "bg-gold-600/30 text-gold-100 border border-gold-400/50"
											: "text-purple-200 hover:bg-gold-600/20 hover:text-gold-100"
									}`}
									onClick={() => setIsOpen(false)}
								>
									<Icon className="w-4 h-4" />
									<span>{item.label}</span>
								</Link>
							)
						})}
					</div>
				</div>
			)}
		</nav>
	)
}