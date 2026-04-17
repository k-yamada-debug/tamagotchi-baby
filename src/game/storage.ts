import { GameState } from './types';

const STORAGE_KEY = 'tamagotchi-baby-save';
const STORAGE_VERSION = 1;

interface SaveData {
  version: number;
  state: GameState;
  savedAt: number;
}

export function saveGame(state: GameState): void {
  try {
    const data: SaveData = {
      version: STORAGE_VERSION,
      state,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage が利用不可の場合は無視
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data: SaveData = JSON.parse(raw);
    if (data.version !== STORAGE_VERSION) return null;
    if (!data.state?.gameStarted) return null;

    return data.state;
  } catch {
    return null;
  }
}

export function deleteSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 無視
  }
}

export function hasSaveData(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}
