'use client';

import { useGameState } from '@/game/hooks/useGameState';
import { useGameLoop } from '@/game/hooks/useGameLoop';
import { StartScreen } from '@/game/components/StartScreen';
import { GameScreen } from '@/game/components/GameScreen';
import { GameOverScreen } from '@/game/components/GameOverScreen';

export default function TamagotchiPage() {
  const {
    state,
    isLoading,
    tick,
    startGame,
    performCare,
    resolveEvent,
    setTimeScale,
    resetGame,
  } = useGameState();

  useGameLoop(tick, state.gameStarted && !state.gameEnded);

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-idle">👶</div>
          <p style={{ color: 'var(--text-secondary)' }}>よみこみ中...</p>
        </div>
      </div>
    );
  }

  // ゲーム終了画面
  if (state.gameEnded && state.finalOutcome) {
    return (
      <GameOverScreen
        outcome={state.finalOutcome}
        babyName={state.babyName}
        status={state.status}
        milestones={state.milestones}
        onRestart={resetGame}
      />
    );
  }

  // ゲーム中（セーブデータがあれば自動的にここに来る）
  if (state.gameStarted) {
    return (
      <GameScreen
        state={state}
        onCare={performCare}
        onResolveEvent={resolveEvent}
        onSetTimeScale={setTimeScale}
        onReset={resetGame}
      />
    );
  }

  // スタート画面（セーブデータがない場合のみ）
  return (
    <StartScreen
      onStart={startGame}
    />
  );
}
