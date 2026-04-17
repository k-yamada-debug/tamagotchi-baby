'use client';

import { StatusValues } from '../types';
import { WARNING_THRESHOLD, CRITICAL_THRESHOLD } from '../constants';

interface StatusBarsProps {
  status: StatusValues;
}

function getBarColor(value: number): string {
  if (value <= CRITICAL_THRESHOLD) return 'var(--danger)';
  if (value <= WARNING_THRESHOLD) return 'var(--warning)';
  if (value <= 50) return '#ffd54f';
  return 'var(--success)';
}

function StatusBar({ label, value, icon, warning }: {
  label: string;
  value: number;
  icon: string;
  warning?: boolean;
}) {
  const color = getBarColor(value);
  const displayValue = Math.round(value);

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg w-7 text-center">{icon}</span>
      <span className="text-xs w-12 shrink-0" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <div className="status-bar flex-1">
        <div
          className="status-bar-fill"
          style={{ width: `${displayValue}%`, background: color }}
        />
      </div>
      <span className="text-xs w-8 text-right font-mono" style={{ color: warning ? 'var(--danger)' : 'var(--text-secondary)' }}>
        {displayValue}
      </span>
      {value <= CRITICAL_THRESHOLD && <span className="text-sm">⚠️</span>}
    </div>
  );
}

function GrowthStat({ label, value, icon }: { label: string; value: number; icon: string }) {
  const stars = Math.floor(value / 20);
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg w-7 text-center">{icon}</span>
      <span className="text-xs w-12 shrink-0" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map(i => (
          <span key={i} className={`text-sm ${i < stars ? '' : 'opacity-20'}`}>
            ★
          </span>
        ))}
      </div>
      <span className="text-xs ml-auto font-mono" style={{ color: 'var(--text-secondary)' }}>
        {Math.round(value)}
      </span>
    </div>
  );
}

export function StatusBars({ status }: StatusBarsProps) {
  return (
    <div className="game-card p-3 space-y-2">
      <StatusBar label="満腹" value={status.hunger} icon="🍼" warning={status.hunger <= WARNING_THRESHOLD} />
      <StatusBar label="清潔" value={status.cleanliness} icon="✨" warning={status.cleanliness <= WARNING_THRESHOLD} />
      <StatusBar label="機嫌" value={status.mood} icon="😊" warning={status.mood <= WARNING_THRESHOLD} />
      <StatusBar label="体力" value={status.energy} icon="💪" warning={status.energy <= WARNING_THRESHOLD} />
      <div className="border-t pt-2 mt-2 space-y-1" style={{ borderColor: 'var(--border)' }}>
        <GrowthStat label="知力" value={status.intelligence} icon="📖" />
        <GrowthStat label="社会" value={status.social} icon="🤝" />
      </div>
    </div>
  );
}
