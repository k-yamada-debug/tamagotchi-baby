import { GameState, GameEvent, MilestoneRecord } from './types';
import { MILESTONES, WARNING_THRESHOLD } from './constants';

// ====== マイルストーンチェック ======
export function checkMilestones(state: GameState): MilestoneRecord | null {
  const { gameAgeMonths, milestones, status, careScore } = state;

  for (const ms of MILESTONES) {
    // すでに達成済みならスキップ
    if (milestones.some(m => m.id === ms.id)) continue;

    // まだその年齢に達していなければスキップ
    if (gameAgeMonths < ms.ageMonths) continue;

    // 達成済みの次のマイルストーンのみ（順番に達成）
    // 品質を判定
    const quality = determineMilestoneQuality(state);

    return {
      id: ms.id,
      label: ms.label,
      ageMonths: ms.ageMonths,
      timestamp: Date.now(),
      quality,
    };
  }

  return null;
}

function determineMilestoneQuality(state: GameState): 'excellent' | 'good' | 'normal' | 'poor' {
  const { status, careScore } = state;

  // 平均的なステータスの良さ
  const depletableAvg = (status.hunger + status.cleanliness + status.mood + status.energy) / 4;
  const growthAvg = (status.intelligence + status.social) / 2;

  // ネグレクトの少なさ
  const neglectPenalty = Math.min(1, careScore.neglectEvents / 20);

  const score = (depletableAvg / 100) * 0.4 + (growthAvg / 100) * 0.3 + (1 - neglectPenalty) * 0.3;

  if (score >= 0.8) return 'excellent';
  if (score >= 0.6) return 'good';
  if (score >= 0.4) return 'normal';
  return 'poor';
}

// ====== 閾値イベントチェック ======
export function checkThresholdEvents(state: GameState): GameEvent | null {
  const { status, isSick } = state;

  // 既に病気の場合はスキップ
  if (isSick) return null;

  // 任意のステータスが0の場合、病気リスク
  const zeroStats: string[] = [];
  if (status.hunger === 0) zeroStats.push('お腹が空きすぎ');
  if (status.cleanliness === 0) zeroStats.push('汚れすぎ');
  if (status.energy === 0) zeroStats.push('疲れすぎ');

  if (zeroStats.length > 0) {
    return {
      id: `sickness_${Date.now()}`,
      type: 'sickness',
      title: '体調不良！',
      description: `${zeroStats.join('、')}で体調を崩してしまいました！病院に連れて行ってあげてください。`,
      requiredAction: 'doctor',
      triggeredAt: Date.now(),
    };
  }

  return null;
}

// ====== ランダムイベントチェック ======
export function checkRandomEvents(state: GameState, elapsedGameHours: number): GameEvent | null {
  const { currentStage, status } = state;

  // イベント発生確率（1ゲーム時間あたり）
  const roll = Math.random();

  // 新生児・乳児: 夜泣き（確率5%/ゲーム時間）
  if ((currentStage === 'newborn' || currentStage === 'infant') && roll < 0.05 * elapsedGameHours) {
    return {
      id: `night_cry_${Date.now()}`,
      type: 'crying_fit',
      title: '夜泣き！',
      description: '赤ちゃんが夜中に泣き出しました！寝かしつけてあげてください。',
      requiredAction: 'sleep',
      autoResolveGameHours: 3,
      statusEffects: { mood: -10, energy: -10 },
      triggeredAt: Date.now(),
    };
  }

  // 体力が低い時: 突発熱（確率3%/ゲーム時間）
  if (status.energy < WARNING_THRESHOLD && roll < 0.03 * elapsedGameHours) {
    return {
      id: `fever_${Date.now()}`,
      type: 'sickness',
      title: '発熱！',
      description: '熱が出てしまいました！病院に連れて行ってあげてください。',
      requiredAction: 'doctor',
      triggeredAt: Date.now(),
    };
  }

  // 機嫌が良い時: ポジティブイベント（確率2%/ゲーム時間）
  if (status.mood > 70 && status.energy > 50 && roll < 0.02 * elapsedGameHours) {
    const positiveEvents = getPositiveEventsForStage(state.currentStage);
    if (positiveEvents.length > 0) {
      const event = positiveEvents[Math.floor(Math.random() * positiveEvents.length)];
      return {
        id: `positive_${Date.now()}`,
        type: 'positive_event',
        title: event.title,
        description: event.description,
        autoResolveGameHours: 2,
        statusEffects: { mood: 10 },
        triggeredAt: Date.now(),
      };
    }
  }

  return null;
}

function getPositiveEventsForStage(stage: string): { title: string; description: string }[] {
  switch (stage) {
    case 'newborn':
    case 'infant':
      return [
        { title: 'すやすや', description: 'とっても気持ちよさそうに寝ています♪' },
        { title: 'にこにこ', description: 'ご機嫌でにこにこ笑っています！' },
      ];
    case 'toddler':
      return [
        { title: 'おしゃべり', description: '一生懸命お話しようとしています！かわいい！' },
        { title: 'ダンス', description: '音楽に合わせて体を揺らしています♪' },
      ];
    case 'preschooler':
      return [
        { title: 'お絵かき', description: '素敵な絵を描いてくれました！上手！' },
        { title: 'お手伝い', description: 'お手伝いをしてくれました！えらい！' },
      ];
    case 'elementary':
      return [
        { title: 'テスト100点！', description: 'テストで100点を取りました！すごい！' },
        { title: '友達と遊ぶ', description: '友達と楽しそうに遊んでいます！' },
      ];
    case 'middleSchool':
      return [
        { title: '部活で活躍', description: '部活動で大活躍！みんなに認められています！' },
        { title: '感謝の言葉', description: '「いつもありがとう」と言ってくれました…！' },
      ];
    default:
      return [];
  }
}
