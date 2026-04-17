'use client';

import { useState, useCallback } from 'react';
import { GameState, CareActionType } from '../types';
import { CARE_ACTIONS } from '../constants';
import { StageInfo } from './StageInfo';
import { BabySprite } from './BabySprite';
import { StatusBars } from './StatusBars';
import { ActionPanel } from './ActionPanel';
import { EventOverlay } from './EventOverlay';
import { MilestoneLog } from './MilestoneLog';
import { MessagePanel } from './MessagePanel';

interface GameScreenProps {
  state: GameState;
  onCare: (action: CareActionType) => void;
  onResolveEvent: () => void;
  onSetTimeScale: (scale: number) => void;
  onReset: () => void;
}

export function GameScreen({ state, onCare, onResolveEvent, onSetTimeScale, onReset }: GameScreenProps) {
  const [showMilestones, setShowMilestones] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [showEventOverlay, setShowEventOverlay] = useState<string | null>(null);

  if (state.activeEvent && state.activeEvent.id !== showEventOverlay && showEventOverlay !== `dismissed_${state.activeEvent.id}`) {
    setShowEventOverlay(state.activeEvent.id);
  }

  const handleCare = useCallback((action: CareActionType) => {
    const config = CARE_ACTIONS.find(a => a.type === action);
    if (config) {
      setActionFeedback(config.icon);
      setFeedbackKey(k => k + 1);
    }
    onCare(action);
  }, [onCare]);

  const handleDismissEvent = useCallback(() => {
    if (state.activeEvent) {
      setShowEventOverlay(`dismissed_${state.activeEvent.id}`);
    }
    if (state.activeEvent && !state.activeEvent.requiredAction) {
      onResolveEvent();
    }
  }, [state.activeEvent, onResolveEvent]);

  return (
    <div className="min-h-dvh flex flex-col max-w-lg mx-auto px-2 py-2 gap-2">
      {/* ヘッダー */}
      <StageInfo
        stage={state.currentStage}
        ageMonths={state.gameAgeMonths}
        babyName={state.babyName}
        onShowMilestones={() => setShowMilestones(true)}
        onShowSettings={() => setShowSettings(true)}
      />

      {/* 赤ちゃん */}
      <div className="game-card flex-1 flex items-center justify-center min-h-[200px] relative">
        <BabySprite
          key={feedbackKey}
          stage={state.currentStage}
          gender={state.gender}
          isCrying={state.isCrying}
          isSick={state.isSick}
          status={state.status}
          actionFeedback={actionFeedback}
        />
        {/* メッセージボタン */}
        <button
          onClick={() => setShowMessages(true)}
          className="absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md transition-transform hover:scale-110"
          style={{ background: 'var(--accent)', color: 'white' }}
          title="おはなしする"
        >
          💬
        </button>
      </div>

      {/* ステータス */}
      <StatusBars status={state.status} />

      {/* アクション */}
      <ActionPanel
        stage={state.currentStage}
        cooldowns={state.cooldowns}
        isSick={state.isSick}
        onAction={handleCare}
      />

      {/* イベントオーバーレイ */}
      {state.activeEvent && showEventOverlay === state.activeEvent.id && (
        <EventOverlay
          event={state.activeEvent}
          onDismiss={handleDismissEvent}
        />
      )}

      {/* マイルストーン一覧 */}
      {showMilestones && (
        <MilestoneLog
          milestones={state.milestones}
          onClose={() => setShowMilestones(false)}
        />
      )}

      {/* メッセージパネル */}
      {showMessages && (
        <MessagePanel
          stage={state.currentStage}
          status={state.status}
          babyName={state.babyName}
          isSick={state.isSick}
          isCrying={state.isCrying}
          onClose={() => setShowMessages(false)}
        />
      )}

      {/* 設定パネル */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="animate-overlay-in max-w-sm w-full rounded-2xl p-6 game-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">設定</h3>
              <button onClick={() => setShowSettings(false)} className="text-2xl hover:scale-110 transition-transform">
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2 font-bold">ゲーム速度</label>
              <div className="flex gap-2">
                {[
                  { value: 1, label: 'ふつう' },
                  { value: 3, label: 'はやい' },
                  { value: 10, label: 'とてもはやい' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onSetTimeScale(opt.value)}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm transition-colors ${
                      state.timeScale === opt.value ? 'border-orange-400 bg-orange-50' : ''
                    }`}
                    style={state.timeScale !== opt.value ? { borderColor: 'var(--border)' } : undefined}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => {
                  if (confirm('ゲームをリセットしますか？セーブデータは削除されます。')) {
                    onReset();
                    setShowSettings(false);
                  }
                }}
                className="w-full py-2 rounded-lg text-white font-bold transition-colors"
                style={{ background: 'var(--danger)' }}
              >
                ゲームをリセット
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
