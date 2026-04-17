'use client';

import { LifeStage } from '../types';
import { getStageConfig } from '../constants';

interface StageInfoProps {
  stage: LifeStage;
  ageMonths: number;
  babyName: string;
  onShowMilestones: () => void;
  onShowSettings: () => void;
}

function formatAge(months: number): string {
  if (months < 1) return '生後0ヶ月';
  if (months < 12) return `生後${Math.floor(months)}ヶ月`;
  const years = Math.floor(months / 12);
  const remainMonths = Math.floor(months % 12);
  if (remainMonths === 0) return `${years}歳`;
  return `${years}歳${remainMonths}ヶ月`;
}

export function StageInfo({ stage, ageMonths, babyName, onShowMilestones, onShowSettings }: StageInfoProps) {
  const config = getStageConfig(stage);

  return (
    <div className="flex items-center justify-between px-4 py-3 game-card">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
          {config.label}
        </span>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {babyName} ・ {formatAge(ageMonths)}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onShowMilestones}
          className="text-xl p-1 hover:scale-110 transition-transform"
          title="マイルストーン"
        >
          📋
        </button>
        <button
          onClick={onShowSettings}
          className="text-xl p-1 hover:scale-110 transition-transform"
          title="設定"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
