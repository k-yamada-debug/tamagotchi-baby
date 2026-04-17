import { LifeStage, LifeStageConfig, CareActionType, CareActionConfig, MilestoneConfig } from './types';

// ====== ライフステージ定義 ======
export const LIFE_STAGES: LifeStageConfig[] = [
  {
    id: 'newborn',
    label: '新生児',
    ageRangeMonths: [0, 1],
    availableActions: ['feed', 'diaper', 'sleep'],
    depletionRates: { hunger: 8, cleanliness: 5, mood: 3, energy: 4 },
  },
  {
    id: 'infant',
    label: '乳児',
    ageRangeMonths: [1, 12],
    availableActions: ['feed', 'diaper', 'sleep', 'bathe', 'play'],
    depletionRates: { hunger: 6, cleanliness: 6, mood: 4, energy: 4 },
  },
  {
    id: 'toddler',
    label: '幼児',
    ageRangeMonths: [12, 36],
    availableActions: ['feed', 'diaper', 'sleep', 'bathe', 'play', 'walk', 'read'],
    depletionRates: { hunger: 5, cleanliness: 7, mood: 5, energy: 5 },
  },
  {
    id: 'preschooler',
    label: '園児',
    ageRangeMonths: [36, 72],
    availableActions: ['feed', 'diaper', 'sleep', 'bathe', 'play', 'walk', 'read'],
    depletionRates: { hunger: 4, cleanliness: 5, mood: 6, energy: 6 },
  },
  {
    id: 'elementary',
    label: '小学生',
    ageRangeMonths: [72, 144],
    availableActions: ['feed', 'sleep', 'bathe', 'play', 'walk', 'read'],
    depletionRates: { hunger: 3, cleanliness: 4, mood: 5, energy: 5 },
  },
  {
    id: 'middleSchool',
    label: '中学生',
    ageRangeMonths: [144, 180],
    availableActions: ['feed', 'sleep', 'bathe', 'play', 'walk', 'read'],
    depletionRates: { hunger: 3, cleanliness: 3, mood: 6, energy: 4 },
  },
];

// ====== ケアアクション定義 ======
export const CARE_ACTIONS: CareActionConfig[] = [
  {
    type: 'feed',
    label: 'ミルク',
    icon: '🍼',
    cooldownSeconds: 30,
    effects: { hunger: 40, mood: 5 },
    description: 'おなかいっぱいにしてあげよう',
  },
  {
    type: 'diaper',
    label: 'おむつ',
    icon: '🧷',
    cooldownSeconds: 45,
    effects: { cleanliness: 50, mood: 10 },
    description: 'きれいにしてあげよう',
  },
  {
    type: 'bathe',
    label: '入浴',
    icon: '🛁',
    cooldownSeconds: 120,
    effects: { cleanliness: 60, mood: 15 },
    description: 'お風呂に入れてあげよう',
  },
  {
    type: 'walk',
    label: '散歩',
    icon: '🚶',
    cooldownSeconds: 120,
    effects: { energy: 10, social: 3, mood: 20 },
    description: 'お外を歩こう',
  },
  {
    type: 'play',
    label: '遊び',
    icon: '🎮',
    cooldownSeconds: 60,
    effects: { mood: 30, social: 2 },
    description: '一緒に遊ぼう',
  },
  {
    type: 'read',
    label: '読み聞かせ',
    icon: '📖',
    cooldownSeconds: 90,
    effects: { intelligence: 3, mood: 10 },
    description: '絵本を読んであげよう',
  },
  {
    type: 'sleep',
    label: '寝かしつけ',
    icon: '💤',
    cooldownSeconds: 120,
    effects: { energy: 50, mood: 5 },
    description: 'ぐっすり寝かせてあげよう',
  },
  {
    type: 'doctor',
    label: '病院',
    icon: '🏥',
    cooldownSeconds: 180,
    effects: { energy: 20 },
    description: 'お医者さんに診てもらおう',
  },
];

// ====== マイルストーン定義 ======
export const MILESTONES: MilestoneConfig[] = [
  { id: 'neck', ageMonths: 1, label: '首すわり', goodDescription: '首がしっかりしてきた！', poorDescription: '首すわりが少し遅れ気味…' },
  { id: 'smile', ageMonths: 3, label: '初めての笑顔', goodDescription: 'にっこり笑顔を見せてくれた！', poorDescription: 'あまり笑顔が見られない…' },
  { id: 'rollover', ageMonths: 6, label: '寝返り', goodDescription: '元気に寝返りを打った！', poorDescription: 'まだ寝返りが難しいみたい…' },
  { id: 'crawl', ageMonths: 9, label: 'ハイハイ', goodDescription: '活発にハイハイしている！', poorDescription: 'ハイハイをあまりしない…' },
  { id: 'walk', ageMonths: 12, label: '初めての一歩', goodDescription: 'しっかり歩き始めた！', poorDescription: 'よちよち歩きがまだ不安定…' },
  { id: 'word', ageMonths: 18, label: '初めての言葉', goodDescription: 'たくさんおしゃべりするように！', poorDescription: '言葉が少し遅れ気味…' },
  { id: 'toilet', ageMonths: 24, label: 'トイレトレーニング', goodDescription: 'すぐに覚えた！えらい！', poorDescription: 'まだ時間がかかりそう…' },
  { id: 'kindergarten', ageMonths: 36, label: '幼稚園入園', goodDescription: '楽しそうに通い始めた！', poorDescription: '泣いて嫌がる日が続く…' },
  { id: 'school', ageMonths: 72, label: '小学校入学', goodDescription: 'わくわくして登校！', poorDescription: '不安そうな顔をしている…' },
  { id: 'middle_school', ageMonths: 144, label: '中学校入学', goodDescription: '自信たっぷりで新生活！', poorDescription: '無気力な様子が心配…' },
];

// ====== 最終結末定義 ======
export const FINAL_OUTCOMES = {
  excellent: { type: 'excellent' as const, title: '優等生', description: '思いやりのある立派な子に育ちました！みんなに愛される素敵な人間に成長しました。', emoji: '🌟' },
  good: { type: 'good' as const, title: '健全', description: '明るく健康な子に育ちました。友達もたくさんできて、楽しい毎日を過ごしています。', emoji: '😊' },
  normal: { type: 'normal' as const, title: '普通', description: '普通に育ちました。良くも悪くもない、平凡な日々を送っています。', emoji: '😐' },
  troubled: { type: 'troubled' as const, title: '問題あり', description: '少し心配な面がある子に育ちました…学校でトラブルを起こすことも…', emoji: '😟' },
  delinquent: { type: 'delinquent' as const, title: 'グレた', description: '非行に走ってしまいました…親の愛情が足りなかったのかもしれません…', emoji: '😈' },
};

// ====== ゲームバランス定数 ======
export const DEFAULT_TIME_SCALE = 1; // 1リアル分 = 1ゲーム時間
export const GAME_END_MONTHS = 180;  // 15歳 = 180ヶ月
export const TICK_INTERVAL_MS = 1000; // 1秒ごとにtick

// 閾値
export const CRITICAL_THRESHOLD = 10;  // この値以下で泣く
export const WARNING_THRESHOLD = 20;   // この値以下で警告
export const SICKNESS_HOURS = 2;       // ステータス0がこの時間続くと病気

// ステージに応じたケアアクションのラベル変更
export function getActionLabel(action: CareActionType, stage: LifeStage): string {
  if (action === 'feed') {
    if (stage === 'newborn' || stage === 'infant') return 'ミルク';
    return 'ごはん';
  }
  if (action === 'diaper') {
    if (stage === 'newborn' || stage === 'infant' || stage === 'toddler') return 'おむつ';
    return 'トイレ';
  }
  const config = CARE_ACTIONS.find(a => a.type === action);
  return config?.label ?? action;
}

export function getStageConfig(stage: LifeStage): LifeStageConfig {
  return LIFE_STAGES.find(s => s.id === stage)!;
}

export function getLifeStageForAge(ageMonths: number): LifeStage {
  for (const stage of LIFE_STAGES) {
    if (ageMonths >= stage.ageRangeMonths[0] && ageMonths < stage.ageRangeMonths[1]) {
      return stage.id;
    }
  }
  return 'middleSchool';
}
