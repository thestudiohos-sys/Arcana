// ============================================================
// Daily Card ("오늘의 한 장") — local-only state
// ============================================================
// One card per local calendar day, drawn by the viewer and kept on this
// device only (localStorage). No account, no server.
//
// Instead of a streak, we keep a gentle "reflection count": the number of
// distinct days the viewer has drawn a card. Missing a day never resets it,
// so there is no pressure to come back every day.
// ============================================================

export const DAILY_CARD_STORAGE_KEY = 'arcana.dailyCard.v1';

export interface DailyCardState {
  /** Local date (YYYY-MM-DD) of the most recent draw. */
  lastDrawDate: string | null;
  /** Card id drawn on lastDrawDate. */
  cardId: string | null;
  /** Number of distinct days a card has been drawn. Never resets. */
  reflectionCount: number;
}

export const EMPTY_DAILY_CARD_STATE: DailyCardState = {
  lastDrawDate: null,
  cardId: null,
  reflectionCount: 0,
};

/** Local calendar date as YYYY-MM-DD (not UTC, so the day turns over at local midnight). */
export function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function hasDrawnToday(state: DailyCardState, today: string): boolean {
  return state.lastDrawDate === today && state.cardId !== null;
}

/**
 * Draws today's card. Drawing again on the same day returns the same state,
 * so a refresh never changes "today's card" or inflates the count.
 */
export function drawDailyCard(
  state: DailyCardState,
  today: string,
  cardIds: readonly string[],
  random: () => number = Math.random,
): DailyCardState {
  if (hasDrawnToday(state, today)) return state;
  if (cardIds.length === 0) throw new Error('No cards available to draw.');

  const index = Math.min(Math.floor(random() * cardIds.length), cardIds.length - 1);
  return {
    lastDrawDate: today,
    cardId: cardIds[index],
    reflectionCount: state.reflectionCount + 1,
  };
}

function isValidState(value: unknown): value is DailyCardState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    (v.lastDrawDate === null || typeof v.lastDrawDate === 'string') &&
    (v.cardId === null || typeof v.cardId === 'string') &&
    typeof v.reflectionCount === 'number' &&
    Number.isFinite(v.reflectionCount) &&
    v.reflectionCount >= 0
  );
}

/** Reads saved state; storage can be unavailable (private mode, blocked), so never throws. */
export function loadDailyCardState(storage: Pick<Storage, 'getItem'> | undefined): DailyCardState {
  try {
    const raw = storage?.getItem(DAILY_CARD_STORAGE_KEY);
    if (!raw) return EMPTY_DAILY_CARD_STATE;
    const parsed: unknown = JSON.parse(raw);
    return isValidState(parsed) ? parsed : EMPTY_DAILY_CARD_STATE;
  } catch {
    return EMPTY_DAILY_CARD_STATE;
  }
}

export function saveDailyCardState(
  storage: Pick<Storage, 'setItem'> | undefined,
  state: DailyCardState,
): void {
  try {
    storage?.setItem(DAILY_CARD_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the card still shows for this visit.
  }
}
