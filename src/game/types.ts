// ====== ライフステージ ======
export type LifeStage =
  | 'newborn'       // 新生児: 0-1ヶ月
  | 'infant'        // 乳児: 1-12ヶ月
  | 'toddler'       // 幼児: 1-3歳
  | 'preschooler'   // 園児: 3-6歳
  | 'elementary'    // 小学生: 6-12歳
  | 'middleSchool'; // 中学生: 12-15歳

export interface LifeStageConfig {
  id: LifeStage;
  label: string;
  ageRangeMonths: [number, number]; // [開始月, 終了月)
  availableActions: CareActionType[];
  depletionRates: DepletionRates;   // 1ゲーム時間あたりの減少量
}

// ====== ケアアクション ======
export type CareActionType =
  | 'feed'     // ミルク/食事
  | 'diaper'   // おむつ交換/トイレ
  | 'bathe'    // 入浴
  | 'walk'     // 散歩/外遊び
  | 'play'     // 遊び/おもちゃ
  | 'read'     // 読み聞かせ/教育
  | 'sleep'    // 寝かしつけ
  | 'doctor';  // 病院

export interface CareActionConfig {
  type: CareActionType;
  label: string;
  icon: string;
  cooldownSeconds: number;
  effects: Partial<StatusValues>;
  description: string;
}

// ====== ステータス ======
export interface StatusValues {
  hunger: number;       // 満腹度: 0-100
  cleanliness: number;  // 清潔度: 0-100
  mood: number;         // 機嫌: 0-100
  energy: number;       // 体力: 0-100
  intelligence: number; // 知力: 0-100（累積型）
  social: number;       // 社会性: 0-100（累積型）
}

export interface DepletionRates {
  hunger: number;
  cleanliness: number;
  mood: number;
  energy: number;
}

// ====== ゲーム状態 ======
export interface GameState {
  babyName: string;
  gender: 'boy' | 'girl';
  birthTimestamp: number;

  status: StatusValues;
  isSick: boolean;
  isCrying: boolean;
  sickSince: number | null;

  lastUpdateTimestamp: number;
  gameAgeMonths: number;
  currentStage: LifeStage;
  timeScale: number;

  careScore: CareScoreAccumulator;
  milestones: MilestoneRecord[];
  activeEvent: GameEvent | null;

  cooldowns: Partial<Record<CareActionType, number>>;

  gameStarted: boolean;
  gameEnded: boolean;
  finalOutcome: FinalOutcome | null;
}

// ====== ケアスコア ======
export interface CareScoreAccumulator {
  totalActions: number;
  actionsByType: Partial<Record<CareActionType, number>>;
  neglectEvents: number;
  sicknessDays: number;
  stageScores: Partial<Record<LifeStage, number>>;
}

// ====== イベント ======
export type EventType =
  | 'sickness'
  | 'crying_fit'
  | 'milestone'
  | 'behavioral'
  | 'positive_event';

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  requiredAction?: CareActionType;
  autoResolveGameHours?: number;
  statusEffects?: Partial<StatusValues>;
  triggeredAt: number;
}

export interface MilestoneRecord {
  id: string;
  label: string;
  ageMonths: number;
  timestamp: number;
  quality: 'excellent' | 'good' | 'normal' | 'poor';
}

export interface MilestoneConfig {
  id: string;
  ageMonths: number;
  label: string;
  goodDescription: string;
  poorDescription: string;
}

// ====== 最終結末 ======
export type FinalOutcomeType =
  | 'excellent'    // 優等生
  | 'good'         // 健全
  | 'normal'       // 普通
  | 'troubled'     // 問題あり
  | 'delinquent';  // グレた

export interface FinalOutcome {
  type: FinalOutcomeType;
  title: string;
  description: string;
  emoji: string;
}

// ====== ゲームアクション (reducer用) ======
export type GameAction =
  | { type: 'TICK'; now: number }
  | { type: 'PERFORM_CARE'; action: CareActionType; now: number }
  | { type: 'RESOLVE_EVENT'; now: number }
  | { type: 'START_GAME'; babyName: string; gender: 'boy' | 'girl'; timeScale: number; now: number }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'SET_TIME_SCALE'; scale: number }
  | { type: 'RESET_GAME' };
