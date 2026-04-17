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

  return (
    <div className="game-card p-3">
      <div className="flex flex-wrap justify-center gap-2">
        {availableActions.map(actionType => {
          const config = CARE_ACTIONS.find(a => a.type === actionType)!;
          const cooldownEnd = cooldowns[actionType] ?? 0;
          const isOnCooldown = now < cooldownEnd;
          const cooldownRemaining = isOnCooldown ? Math.ceil((cooldownEnd - now) / 1000) : 0;
          const cooldownProgress = isOnCooldown
            ? (cooldownEnd - now) / (config.cooldownSeconds * 1000)
            : 0;

          const label = getActionLabel(actionType, stage);

          return (
            <button
              key={actionType}
              className="action-btn"
              disabled={isOnCooldown}
              onClick={() => onAction(actionType)}
              title={config.description}
            >
              {isOnCooldown && (
                <div
                  className="cooldown-overlay"
                  style={{ height: `${cooldownProgress * 100}%` }}
                />
              )}
              <span className="text-2xl relative z-10">{config.icon}</span>
              <span className="text-xs relative z-10" style={{ color: 'var(--text-secondary)' }}>
                {label}
              </span>
              {isOnCooldown && (
                <span className="text-xs font-mono relative z-10" style={{ color: 'var(--danger)' }}>
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
