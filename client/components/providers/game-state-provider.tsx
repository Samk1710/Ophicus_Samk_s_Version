"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IGameSession } from '@/lib/models/GameSession';

interface GameStateContextType {
  sessionId: string | null;
  gameSession: Partial<IGameSession> | null;
  loading: boolean;
  error: string | null;
  initializeBigBang: () => Promise<void>;
  refreshGameState: () => Promise<void>;
  updateRoomProgress: (roomName: string) => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameSession, setGameSession] = useState<Partial<IGameSession> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load session ID from localStorage on mount and check if active
  useEffect(() => {
    const checkActiveSession = async () => {
      const savedSessionId = localStorage.getItem('gameSessionId');
      if (savedSessionId) {
        console.log('[GameStateProvider] Found saved session:', savedSessionId);
        
        // Check if session still exists in DB
        try {
          const response = await fetch(`/api/game/${savedSessionId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.session && !data.session.completed) {
              setSessionId(savedSessionId);
              setGameSession(data.session);
            } else {
              // Session completed or doesn't exist, clear it
              console.log('[GameStateProvider] Session completed or not found, clearing');
              localStorage.removeItem('gameSessionId');
              setSessionId(null);
              setGameSession(null);
            }
          } else {
            // Session doesn't exist, clear localStorage
            localStorage.removeItem('gameSessionId');
            setSessionId(null);
          }
        } catch (error) {
          console.error('[GameStateProvider] Error checking session:', error);
          // On error, keep the session ID but mark as error
          setError('Failed to check session status');
        }
      }
    };
    
    checkActiveSession();
  }, []);

  const initializeBigBang = async () => {
    console.log('[GameStateProvider] Initializing Big Bang');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bigbang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize Big Bang');
      }

      console.log('[GameStateProvider] Big Bang initialized:', data.sessionId);
      setSessionId(data.sessionId);
      localStorage.setItem('gameSessionId', data.sessionId);

      // Fetch full game state
      await refreshGameState(data.sessionId);

    } catch (err) {
      console.error('[GameStateProvider] Big Bang error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const refreshGameState = async (sid?: string) => {
    const targetSessionId = sid || sessionId;
    if (!targetSessionId) {
      console.log('[GameStateProvider] No session ID to refresh');
      return;
    }

    console.log('[GameStateProvider] Refreshing game state:', targetSessionId);
    setLoading(true);

    try {
      const response = await fetch(`/api/game/${targetSessionId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch game state');
      }

      console.log('[GameStateProvider] Game state loaded:', data.session);
      setGameSession(data.session);

    } catch (err) {
      console.error('[GameStateProvider] Refresh error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateRoomProgress = (roomName: string) => {
    console.log('[GameStateProvider] Updating room progress:', roomName);
    if (gameSession) {
      setGameSession({
        ...gameSession,
        roomsCompleted: [...(gameSession.roomsCompleted || []), roomName]
      });
    }
  };

  return (
    <GameStateContext.Provider
      value={{
        sessionId,
        gameSession,
        loading,
        error,
        initializeBigBang,
        refreshGameState,
        updateRoomProgress,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}
