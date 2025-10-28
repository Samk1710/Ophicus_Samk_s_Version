"use client"

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CosmicConfettiProps {
  trigger?: boolean;
  onComplete?: () => void;
}

export function CosmicConfetti({ trigger = false, onComplete }: CosmicConfettiProps) {
  useEffect(() => {
    if (trigger) {
      fireCosmicConfetti();
      
      // Call onComplete after animation
      const timeout = setTimeout(() => {
        onComplete?.();
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [trigger, onComplete]);

  return null; // This component doesn't render anything visible
}

// Cosmic-themed confetti explosion
export function fireCosmicConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { 
    startVelocity: 30, 
    spread: 360, 
    ticks: 60, 
    zIndex: 9999 
  };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Cosmic colors: gold, purple, blue, cyan
    const colors = ['#FFD700', '#B8860B', '#9370DB', '#4B0082', '#00CED1', '#1E90FF'];
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: colors
    });
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: colors
    });
  }, 250);
}

// Stars and sparkles effect
export function fireStarsEffect() {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#FFD700', '#FFA500', '#FFFFFF', '#87CEEB'],
    shapes: ['star' as const],
    scalar: 1.2
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star' as const],
    });

    confetti({
      ...defaults,
      particleCount: 20,
      scalar: 0.75,
      shapes: ['circle' as const],
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

// Victory celebration with message
export function celebrateCorrectAnswer() {
  // First burst from center
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FFD700', '#B8860B', '#9370DB', '#4B0082']
  });
  
  // Stars from sides
  setTimeout(() => {
    fireStarsEffect();
  }, 300);
  
  // Final cosmic burst
  setTimeout(() => {
    fireCosmicConfetti();
  }, 600);
}
