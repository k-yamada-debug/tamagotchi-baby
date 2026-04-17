'use client';

import { useEffect, useRef } from 'react';
import { TICK_INTERVAL_MS } from '../constants';

export function useGameLoop(tick: () => void, isActive: boolean) {
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    if (!isActive) return;

    const intervalId = setInterval(() => {
      tickRef.current();
    }, TICK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isActive]);
}
