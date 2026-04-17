'use client';

import { FinalOutcome, StatusValues, MilestoneRecord } from '../types';

interface GameOverScreenProps {
  outcome: FinalOutcome;
  babyName: string;
  status: StatusValues;
  milestones: MilestoneRecord[];
  onRestart: () => void;
}

function getOutcomeBg(type: string): string {
  switch (type) {
    case 'excellent': return 'linear-gradient(135deg, #fff9c4, #f0fff4)';
    case 'good': return 'linear-gradient(135deg, #f0fff4, #e8f5e9)';
    case 'normal': return 'linear-gradient(135deg, #f5f5f5, #fafafa)';
    case 'troubled': return 'linear-gradient(135deg, #fff3e0, #fbe9e7)';
    case 'delinquent': return 'linear-gradient(135deg, #fce4ec, #f3e5f5)';
    default: return '';
  }
}

export function GameOverScreen({ outcome, babyName, status, milestones, onRestart }: GameOverScreenProps) {
  const goodMilestones = milestones.filter(m => m.quality === 'excellent' || m.quality === 'good').length;
  const totalMilestones = milestones.length;

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div
        className="max-w-md w-full rounded-2xl p-8 text-center shadow-lg"
        style={{ background: getOutcomeBg(outcome.type) }}
      >
        <div className="text-6xl mb-4">{outcome.emoji}</div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {babyName}の成長結果
        </h1>

        <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
          {outcome.title}
        </div>

        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {outcome.description}
        </p>

        {/* 最終ステータス */}
        <div className="game-card p-4 mb-4 text-left">
          <h3 className="font-bold text-sm mb-3">最終ステータス</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>🍼 満腹度: {Math.round(status.hunger)}</div>
            <div>✨ 清潔度: {Math.round(status.cleanliness)}</div>
            <div>😊 機嫌: {Math.round(status.mood)}</div>
            <div>💪 体力: {Math.round(status.energy)}</div>
            <div>📖 知力: {Math.round(status.intelligence)}</div>
            <div>🤝 社会性: {Math.round(status.social)}</div>
          </div>
        </div>

        {/* マイルストーン成績 */}
        <div className="game-card p-4 mb-6 text-left">
          <h3 className="font-bold text-sm mb-2">マイルストーン</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {totalMilestones}個中 {goodMilestones}個を良い結果で達成
          </p>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3 px-6 rounded-xl text-white font-bold text-lg transition-colors"
          style={{ background: 'var(--accent)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
        >
          もういちど遊ぶ
        </button>
      </div>
    </div>
  );
}
