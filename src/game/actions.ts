import { GameState, CareActionType } from './types';
import { CARE_ACTIONS, getStageConfig } from './constants';

export function applyCareAction(state: GameState, actionType: CareActionType, now: number): GameState {
  const stageConfig = getStageConfig(state.currentStage);

  // 病院は全ステージで常に利用可能（病気を治すため）
  const isAvailable = actionType === 'doctor' || stageConfig.availableActions.includes(actionType);
  if (!isAvailable) {
    return state;
  }

  // クールダウンチェック
  const cooldownEnd = state.cooldowns[actionType];
  if (cooldownEnd && now < cooldownEnd) {
    return state;
  }

  const actionConfig = CARE_ACTIONS.find(a => a.type === actionType);
  if (!actionConfig) return state;

  let newState = { ...state };

  // ステータス効果を適用
  const effects = actionConfig.effects;
  newState.status = {
    hunger: Math.min(100, state.status.hunger + (effects.hunger ?? 0)),
    cleanliness: Math.min(100, state.status.cleanliness + (effects.cleanliness ?? 0)),
    mood: Math.min(100, state.status.mood + (effects.mood ?? 0)),
    energy: Math.min(100, state.status.energy + (effects.energy ?? 0)),
    intelligence: Math.min(100, state.status.intelligence + (effects.intelligence ?? 0)),
    social: Math.min(100, state.status.social + (effects.social ?? 0)),
  };

  // 病院アクション: 病気を治す
  if (actionType === 'doctor') {
    if (state.isSick) {
      newState.isSick = false;
      newState.sickSince = null;
      // 病気で下がっていた機嫌と体力を回復
      newState.status = {
        ...newState.status,
        mood: Math.min(100, newState.status.mood + 20),
        energy: Math.min(100, newState.status.energy + 20),
      };
    }
    // 病気イベントがアクティブなら解消
    if (newState.activeEvent?.type === 'sickness') {
      newState.activeEvent = null;
    }
  }

  // 泣きイベントの解消チェック
  if (newState.activeEvent?.type === 'crying_fit') {
    if (newState.activeEvent.requiredAction === actionType) {
      newState.activeEvent = null;
    }
  }

  // クールダウン設定
  newState.cooldowns = {
    ...state.cooldowns,
    [actionType]: now + actionConfig.cooldownSeconds * 1000,
  };

  // ケアスコア更新
  const prevCount = state.careScore.actionsByType[actionType] ?? 0;
  newState.careScore = {
    ...state.careScore,
    totalActions: state.careScore.totalActions + 1,
    actionsByType: {
      ...state.careScore.actionsByType,
      [actionType]: prevCount + 1,
    },
  };

  // 泣き状態の再判定
  newState.isCrying =
    newState.status.hunger < 10 ||
    newState.status.cleanliness < 10 ||
    newState.status.mood < 10 ||
    newState.status.energy < 10;

  return newState;
}
