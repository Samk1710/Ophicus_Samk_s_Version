"use client"

import { ReactNode } from 'react';
import { create } from 'zustand';
import { IGameSession } from '@/lib/models/GameSession';

interface GameState {
  sessionId: string | null;
  gameSession: Partial<IGameSession> | null;
  loading: boolean;
  error: string | null;
  initializeBigBang: () => Promise<void>;
  refreshGameState: () => Promise<void>;
  updateRoomProgress: (roomName: string) => void;
  setSessionId: (sessionId: string | null) => void;
}

export const useGameState = create<GameState>((set: (partial: Partial<GameState>) => void, get: () => GameState) => ({
  sessionId: typeof window !== 'undefined' ? localStorage.getItem('gameSessionId') : null,
  gameSession: null,
  loading: false,
  error: null,

  setSessionId: (sessionId: string | null) => {
    set({ sessionId });
    if (sessionId) {
      localStorage.setItem('gameSessionId', sessionId);
    } else {
      localStorage.removeItem('gameSessionId');
    }
  },

  initializeBigBang: async () => {
    console.log('[GameState] Initializing Big Bang');
    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/bigbang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize Big Bang');
      }

      console.log('[GameState] Big Bang initialized:', data.sessionId);
      get().setSessionId(data.sessionId);
      await get().refreshGameState();
    } catch (err) {
      console.error('[GameState] Big Bang error:', err);
      set({ error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      set({ loading: false });
    }
  },

  refreshGameState: async () => {
    const sessionId = get().sessionId;
    if (!sessionId) {
      console.log('[GameState] No session ID to refresh');
      return;
    }

    console.log('[GameState] Refreshing game state:', sessionId);
    set({ loading: true });

    try {
      const response = await fetch(`/api/game/${sessionId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch game state');
      }

      console.log('[GameState] Game state loaded:', data.session);
      set({ gameSession: data.session });
    } catch (err) {
      console.error('[GameState] Refresh error:', err);
      set({ error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      set({ loading: false });
    }
  },

  updateRoomProgress: (roomName: string) => {
    console.log('[GameState] Updating room progress:', roomName);
    const gameSession = get().gameSession;
    if (gameSession) {
      set({
        gameSession: {
          ...gameSession,
          roomsCompleted: [...(gameSession.roomsCompleted || []), roomName],
        },
      });
    }
  },
}));

// Initialize session on load
if (typeof window !== 'undefined') {
  const sessionId = localStorage.getItem('gameSessionId');
  if (sessionId) {
    console.log('[GameState] Found saved session:', sessionId);
    useGameState.getState().refreshGameState();
  }
}

export function GameStateProvider({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}
