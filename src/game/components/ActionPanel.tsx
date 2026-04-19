'use client';

import { CareActionType, LifeStage } from '../types';
import { CARE_ACTIONS, getStageConfig, getActionLabel } from '../constants';

interface ActionPanelProps {
  stage: LifeStage;
  cooldowns: Partial<Record<CareActionType, number>>;
  isSick: boolean;
  onAction: (action: CareActionType) => void;
}

export function ActionPanel({ stage, cooldowns, isSick, onAction }: ActionPanelProps) {
  const stageConfig = getStageConfig(stage);
  const now = Date.now();

  // 利用可能なアクション + 病気の場合は病院を追加
  const availableActions = [...stageConfig.availableActions];
  if (isSick && !availableActions.includes('doctor')) {
    availableActions.push('doctor');
  }

  // ボタン数に応じてレイアウトを切り替え: 少ない時は中央寄せ、多い時は横スクロール
  const useScroll = availableActions.length > 5;

  return (
    <div className="game-card p-2">
      <div className={useScroll ? 'action-scroll' : 'flex flex-wrap justify-center gap-2'}>
        {availableActions.map(actionType => {
          const config = CARE_ACTIONS.find(a => a.type === actionType)!;
          const cooldownEnd = cooldowns[actionType] ?? 0;
          const isOnCooldown = now < cooldownEnd;
          const cooldownRemaining = isOnCooldown ? Math.ceil((cooldownEnd - now) / 1000) : 0;
          const cooldownProgress = isOnCooldown
            ? (cooldownEnd - now) / (config.cooldownSeconds * 1000)
            : 0;

          const label = getActionLabel(actionType, stage);
          const isDoctor = actionType === 'doctor';

          return (
            <button
              key={actionType}
              className="action-btn"
              disabled={isOnCooldown}
              onClick={() => onAction(actionType)}
              title={config.description}
              style={isDoctor && isSick ? { borderColor: 'var(--danger)', background: '#fff5f5' } : undefined}
            >
              {isOnCooldown && (
                <div
                  className="cooldown-overlay"
                  style={{ height: `${cooldownProgress * 100}%` }}
                />
              )}
              <span className="text-2xl relative z-10" aria-hidden>{config.icon}</span>
              <span className="text-[11px] leading-tight relative z-10" style={{ color: 'var(--text-secondary)' }}>
                {label}
              </span>
              {isOnCooldown && (
                <span className="text-[10px] font-mono relative z-10" style={{ color: 'var(--danger)' }}>
                  {cooldownRemaining}s
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
