'use client';

import { GameEvent } from '../types';

interface EventOverlayProps {
  event: GameEvent;
  onDismiss: () => void;
}

function getEventStyle(type: string): { bg: string; border: string; emoji: string } {
  switch (type) {
    case 'sickness':
      return { bg: '#fff5f5', border: '#feb2b2', emoji: '🏥' };
    case 'crying_fit':
      return { bg: '#fffff0', border: '#fefcbf', emoji: '😭' };
    case 'milestone':
      return { bg: '#f0fff4', border: '#c6f6d5', emoji: '🎉' };
    case 'positive_event':
      return { bg: '#fffff0', border: '#fefcbf', emoji: '✨' };
    case 'behavioral':
      return { bg: '#fff5f5', border: '#feb2b2', emoji: '⚠️' };
    default:
      return { bg: '#f7fafc', border: '#e2e8f0', emoji: '📢' };
  }
}

export function EventOverlay({ event, onDismiss }: EventOverlayProps) {
  const style = getEventStyle(event.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div
        className="animate-overlay-in max-w-sm w-full rounded-2xl p-6 text-center shadow-lg"
        style={{ background: style.bg, border: `2px solid ${style.border}` }}
      >
        <div className="text-5xl mb-3">{style.emoji}</div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {event.title}
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          {event.description}
        </p>
        {event.requiredAction && (
          <p className="text-xs mb-4 font-bold" style={{ color: 'var(--accent)' }}>
            {event.type === 'sickness' && '病院ボタンを押して治療してください！'}
            {event.type === 'crying_fit' && '寝かしつけボタンを押してあげてください！'}
          </p>
        )}
        <button
          onClick={onDismiss}
          className="px-6 py-2 rounded-xl text-white font-bold transition-colors"
          style={{ background: 'var(--accent)' }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
