"use client"

interface CelestialIconProps {
  type: "sun" | "moon" | "planet" | "constellation" | "eye" | "mystical"
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function CelestialIcon({ type, className = "", size = "md" }: CelestialIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  const icons = {
    sun: (
      <svg viewBox="0 0 24 24" className={`${sizeClasses[size]} ${className}`} fill="currentColor">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    moon: (
      <svg viewBox="0 0 24 24" className={`${sizeClasses[size]} ${className}`} fill="currentColor">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    ),
    planet: (
      <svg viewBox="0 0 24 24" className={`${sizeClasses[size]} ${className}`} fill="currentColor">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" fill="none" />
        <ellipse cx="12" cy="12" rx="12" ry="3" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    ),
    constellation: (
      <svg viewBox="0 0 24 24" className={`${sizeClasses[size]} ${className}`} fill="currentColor">
        <circle cx="5" cy="5" r="1" fill="currentColor" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
        <circle cx="19" cy="5" r="1" fill="currentColor" />
        <circle cx="8" cy="15" r="1" fill="currentColor" />
        <circle cx="16" cy="18" r="1" fill="currentColor" />
        <line x1="5" y1="5" x2="12" y2="8" stroke="currentColor" strokeWidth="0.5" />
        <line x1="12" y1="8" x2="19" y2="5" stroke="currentColor" strokeWidth="0.5" />
        <line x1="12" y1="8" x2="8" y2="15" stroke="currentColor" strokeWidth="0.5" />
        <line x1="8" y1="15" x2="16" y2="18" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    ),
    eye: (
      <svg viewBox="0 0 24 24" className={`${sizeClasses[size]} ${className}`} fill="currentColor">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    mystical: (
      <svg viewBox="0 0 24 24" className={`${sizeClasses[size]} ${className}`} fill="currentColor">
        <polygon
          points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  }

  return icons[type]
}
