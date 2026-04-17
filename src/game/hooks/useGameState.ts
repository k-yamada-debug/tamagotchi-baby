'use client';

import { useReducer, useCallback, useEffect, useRef, useState } from 'react';
import { GameState, GameAction, CareActionType } from '../types';
import { gameReducer, createInitialState } from '../engine';
import { saveGame, loadGame, deleteSave } from '../storage';

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const saved = loadGame();
    if (saved) {
      dispatch({ type: 'LOAD_STATE', state: saved });
      // オフライン時間を反映
      setTimeout(() => {
        dispatch({ type: 'TICK', now: Date.now() });
      }, 100);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (state.gameStarted && !isLoading) {
      saveGame(state);
    }
  }, [state, isLoading]);

  const tick = useCallback(() => {
    dispatch({ type: 'TICK', now: Date.now() });
  }, []);

  const startGame = useCallback((babyName: string, gender: 'boy' | 'girl', timeScale: number) => {
    dispatch({ type: 'START_GAME', babyName, gender, timeScale, now: Date.now() });
  }, []);

  const performCare = useCallback((action: CareActionType) => {
    dispatch({ type: 'PERFORM_CARE', action, now: Date.now() });
  }, []);

  const resolveEvent = useCallback(() => {
    dispatch({ type: 'RESOLVE_EVENT', now: Date.now() });
  }, []);

  const setTimeScale = useCallback((scale: number) => {
    dispatch({ type: 'SET_TIME_SCALE', scale });
  }, []);

  const resetGame = useCallback(() => {
    deleteSave();
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return {
    state,
    isLoading,
    tick,
    startGame,
    performCare,
    resolveEvent,
    setTimeScale,
    resetGame,
  };
}
