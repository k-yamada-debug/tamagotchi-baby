'use client';

import { MilestoneRecord } from '../types';
import { MILESTONES } from '../constants';

interface MilestoneLogProps {
  milestones: MilestoneRecord[];
  onClose: () => void;
}

function getQualityEmoji(quality: string): string {
  switch (quality) {
    case 'excellent': return '🌟';
    case 'good': return '😊';
    case 'normal': return '😐';
    case 'poor': return '😢';
    default: return '❓';
  }
}

function getQualityLabel(quality: string): string {
  switch (quality) {
    case 'excellent': return 'すばらしい！';
    case 'good': return 'よくできた！';
    case 'normal': return 'ふつう';
    case 'poor': return 'がんばろう';
    default: return '';
  }
}

export function MilestoneLog({ milestones, onClose }: MilestoneLogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="animate-overlay-in max-w-sm w-full rounded-2xl p-6 game-card max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">成長のきろく</h3>
          <button onClick={onClose} className="text-2xl hover:scale-110 transition-transform">
            ✕
          </button>
        </div>

        {milestones.length === 0 ? (
          <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
            まだマイルストーンはありません
          </p>
        ) : (
          <div className="space-y-3">
            {milestones.map(ms => {
              const config = MILESTONES.find(m => m.id === ms.id);
              const description = ms.quality === 'excellent' || ms.quality === 'good'
                ? config?.goodDescription
                : config?.poorDescription;

              return (
                <div
                  key={ms.id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--bg-gradient-from)' }}
                >
                  <span className="text-2xl">{getQualityEmoji(ms.quality)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{ms.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{
                        background: ms.quality === 'excellent' || ms.quality === 'good' ? '#c6f6d5' : '#fed7d7',
                        color: ms.quality === 'excellent' || ms.quality === 'good' ? '#276749' : '#9b2c2c',
                      }}>
                        {getQualityLabel(ms.quality)}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 未達成のマイルストーン */}
        {MILESTONES.filter(ms => !milestones.some(m => m.id === ms.id)).length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
              これからのマイルストーン
            </p>
            <div className="space-y-1">
              {MILESTONES.filter(ms => !milestones.some(m => m.id === ms.id)).map(ms => (
                <div key={ms.id} className="flex items-center gap-2 text-xs opacity-50">
                  <span>❓</span>
                  <span>{ms.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
