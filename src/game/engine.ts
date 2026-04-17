import {
  GameState, GameAction, StatusValues, LifeStage, CareActionType,
} from './types';
import {
  getLifeStageForAge, getStageConfig, GAME_END_MONTHS,
  CRITICAL_THRESHOLD, SICKNESS_HOURS, CARE_ACTIONS, FINAL_OUTCOMES,
} from './constants';
import { checkMilestones, checkRandomEvents, checkThresholdEvents } from './events';
import { applyCareAction } from './actions';

// ====== 初期状態 ======
export function createInitialState(): GameState {
  return {
    babyName: '',
    gender: 'girl',
    birthTimestamp: 0,
    status: { hunger: 80, cleanliness: 80, mood: 80, energy: 80, intelligence: 0, social: 0 },
    isSick: false,
    isCrying: false,
    sickSince: null,
    lastUpdateTimestamp: 0,
    gameAgeMonths: 0,
    currentStage: 'newborn',
    timeScale: 1,
    careScore: {
      totalActions: 0,
      actionsByType: {},
      neglectEvents: 0,
      sicknessDays: 0,
      stageScores: {},
    },
    milestones: [],
    activeEvent: null,
    cooldowns: {},
    gameStarted: false,
    gameEnded: false,
    finalOutcome: null,
  };
}

// ====== 時間計算 ======
export function calculateGameAgeMonths(birthTimestamp: number, now: number, timeScale: number): number {
  const realElapsedMs = now - birthTimestamp;
  const realElapsedMinutes = realElapsedMs / 60000;
  const gameHours = realElapsedMinutes * timeScale;
  const gameDays = gameHours / 24;
  const gameMonths = gameDays / 30;
  return gameMonths;
}

function calculateElapsedGameHours(lastUpdate: number, now: number, timeScale: number): number {
  const realElapsedMs = now - lastUpdate;
  const realElapsedMinutes = realElapsedMs / 60000;
  return realElapsedMinutes * timeScale;
}

// ====== ステータス減衰 ======
function applyDepletion(status: StatusValues, stage: LifeStage, elapsedGameHours: number): {
  newStatus: StatusValues;
  anyHitZero: boolean;
} {
  const config = getStageConfig(stage);
  const rates = config.depletionRates;

  const newStatus: StatusValues = {
    hunger: Math.max(0, status.hunger - rates.hunger * elapsedGameHours),
    cleanliness: Math.max(0, status.cleanliness - rates.cleanliness * elapsedGameHours),
    mood: Math.max(0, status.mood - rates.mood * elapsedGameHours),
    energy: Math.max(0, status.energy - rates.energy * elapsedGameHours),
    intelligence: status.intelligence,
    social: status.social,
  };

  const anyHitZero =
    (status.hunger > 0 && newStatus.hunger === 0) ||
    (status.cleanliness > 0 && newStatus.cleanliness === 0) ||
    (status.mood > 0 && newStatus.mood === 0) ||
    (status.energy > 0 && newStatus.energy === 0);

  return { newStatus, anyHitZero };
}

// ====== 泣き判定 ======
function checkCrying(status: StatusValues): boolean {
  return (
    status.hunger < CRITICAL_THRESHOLD ||
    status.cleanliness < CRITICAL_THRESHOLD ||
    status.mood < CRITICAL_THRESHOLD ||
    status.energy < CRITICAL_THRESHOLD
  );
}

// ====== 最終スコア計算 ======
function calculateFinalScore(state: GameState): number {
  const { careScore, status } = state;
  const totalGameDays = GAME_END_MONTHS * 30;

  // ケアの頻度スコア (0-1)
  const expectedActionsPerDay = 8;
  const careFrequency = Math.min(1, careScore.totalActions / (totalGameDays * expectedActionsPerDay));

  // ネグレクトペナルティ (0-1, 低いほど良い)
  const neglectPenalty = Math.min(1, careScore.neglectEvents / 50);

  // 病気ペナルティ (0-1, 低いほど良い)
  const sicknessPenalty = Math.min(1, careScore.sicknessDays / 30);

  // 知力・社会性 (0-1)
  const intellNorm = status.intelligence / 100;
  const socialNorm = status.social / 100;

  const score =
    careFrequency * 0.35 +
    (1 - neglectPenalty) * 0.25 +
    (1 - sicknessPenalty) * 0.10 +
    intellNorm * 0.15 +
    socialNorm * 0.15;

  return Math.max(0, Math.min(1, score));
}

export function determineFinalOutcome(state: GameState) {
  const score = calculateFinalScore(state);

  if (score >= 0.85) return FINAL_OUTCOMES.excellent;
  if (score >= 0.70) return FINAL_OUTCOMES.good;
  if (score >= 0.50) return FINAL_OUTCOMES.normal;
  if (score >= 0.30) return FINAL_OUTCOMES.troubled;
  return FINAL_OUTCOMES.delinquent;
}

// ====== メインReducer ======
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const now = action.now;
      return {
        ...createInitialState(),
        babyName: action.babyName,
        gender: action.gender,
        timeScale: action.timeScale,
        birthTimestamp: now,
        lastUpdateTimestamp: now,
        gameStarted: true,
      };
    }

    case 'LOAD_STATE': {
      return action.state;
    }

    case 'RESET_GAME': {
      return createInitialState();
    }

    case 'SET_TIME_SCALE': {
      return { ...state, timeScale: action.scale };
    }

    case 'TICK': {
      if (!state.gameStarted || state.gameEnded) return state;

      const now = action.now;
      const elapsedGameHours = calculateElapsedGameHours(state.lastUpdateTimestamp, now, state.timeScale);
      if (elapsedGameHours <= 0) return state;

      let newState = { ...state };

      // 1. ゲーム年齢を計算
      const newAgeMonths = calculateGameAgeMonths(state.birthTimestamp, now, state.timeScale);
      const newStage = getLifeStageForAge(newAgeMonths);
      newState.gameAgeMonths = newAgeMonths;
      newState.currentStage = newStage;

      // 2. ステータス減衰
      const { newStatus, anyHitZero } = applyDepletion(state.status, newState.currentStage, elapsedGameHours);
      newState.status = newStatus;

      // ネグレクトカウント
      if (anyHitZero) {
        newState.careScore = {
          ...newState.careScore,
          neglectEvents: newState.careScore.neglectEvents + 1,
        };
      }

      // 3. 病気チェック
      if (newState.isSick) {
        const sickGameHours = calculateElapsedGameHours(newState.sickSince!, now, state.timeScale);
        newState.careScore = {
          ...newState.careScore,
          sicknessDays: newState.careScore.sicknessDays + (elapsedGameHours / 24),
        };
        // 病気中はmoodが追加で下がる
        newState.status = {
          ...newState.status,
          mood: Math.max(0, newState.status.mood - elapsedGameHours * 2),
          energy: Math.max(0, newState.status.energy - elapsedGameHours * 1),
        };
      }

      // 4. 泣き判定
      newState.isCrying = checkCrying(newState.status);

      // 5. 閾値イベント（病気発生）
      if (!newState.activeEvent) {
        const thresholdEvent = checkThresholdEvents(newState);
        if (thresholdEvent) {
          newState.activeEvent = thresholdEvent;
          if (thresholdEvent.type === 'sickness') {
            newState.isSick = true;
            newState.sickSince = now;
          }
        }
      }

      // 6. マイルストーンチェック
      const milestone = checkMilestones(newState);
      if (milestone) {
        newState.milestones = [...newState.milestones, milestone];
        if (!newState.activeEvent) {
          newState.activeEvent = {
            id: `milestone_${milestone.id}`,
            type: 'milestone',
            title: milestone.label,
            description: milestone.quality === 'excellent' || milestone.quality === 'good'
              ? `${milestone.label}を達成しました！`
              : `${milestone.label}の時期です…`,
            autoResolveGameHours: 1,
            triggeredAt: now,
          };
        }
      }

      // 7. ランダムイベント（アクティブイベントがなければ）
      if (!newState.activeEvent) {
        const randomEvent = checkRandomEvents(newState, elapsedGameHours);
        if (randomEvent) {
          newState.activeEvent = randomEvent;
        }
      }

      // 8. アクティブイベントの自動解決チェック
      if (newState.activeEvent?.autoResolveGameHours) {
        const eventGameHours = calculateElapsedGameHours(
          newState.activeEvent.triggeredAt, now, state.timeScale
        );
        if (eventGameHours >= newState.activeEvent.autoResolveGameHours) {
          newState.activeEvent = null;
        }
      }

      // 9. ゲーム終了チェック
      if (newAgeMonths >= GAME_END_MONTHS) {
        newState.gameEnded = true;
        newState.finalOutcome = determineFinalOutcome(newState);
      }

      newState.lastUpdateTimestamp = now;
      return newState;
    }

    case 'PERFORM_CARE': {
      if (!state.gameStarted || state.gameEnded) return state;
      return applyCareAction(state, action.action, action.now);
    }

    case 'RESOLVE_EVENT': {
      return {
        ...state,
        activeEvent: null,
      };
    }

    default:
      return state;
  }
}
