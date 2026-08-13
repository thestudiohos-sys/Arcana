import {
  ReadingResult,
  PremiumReadingResult,
  SymbolicNumberResult,
  DigitalTalismanResult,
  Language,
  EntryType,
  RitualType,
} from '../types/reading';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
export const READING_PROVIDER = import.meta.env.VITE_READING_PROVIDER || 'local';

export async function fetchFreeReadingApi(params: {
  entryType: EntryType;
  storyText: string;
  ritualType: RitualType;
  selectedCardId: string;
  language: Language;
}): Promise<ReadingResult> {
  const res = await fetch(`${API_BASE_URL}/api/readings/free`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Request failed with status ${res.status}`);
  }

  return await res.json();
}

export async function fetchPremiumReadingApi(params: {
  entryType: EntryType;
  storyText: string;
  ritualType: RitualType;
  cardIds: string[];
  language: Language;
}): Promise<PremiumReadingResult> {
  const res = await fetch(`${API_BASE_URL}/api/readings/premium`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Request failed with status ${res.status}`);
  }

  return await res.json();
}

export async function fetchSymbolicNumbersApi(params: {
  gameType?: string;
  entryType: EntryType;
  storyText: string;
  ritualType: RitualType;
  freeCardId?: string;
  premiumCardIds?: string[];
}): Promise<SymbolicNumberResult> {
  const res = await fetch(`${API_BASE_URL}/api/numbers/symbolic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameType: params.gameType || 'kr_lotto_645',
      ...params,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Request failed with status ${res.status}`);
  }

  return await res.json();
}

export async function fetchDigitalTalismanOptionsApi(params: {
  entryType: EntryType;
  storyText: string;
  ritualType: RitualType;
  freeCardId?: string;
  premiumCardIds?: string[];
  language: Language;
}): Promise<DigitalTalismanResult> {
  const res = await fetch(`${API_BASE_URL}/api/talismans/options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Request failed with status ${res.status}`);
  }

  return await res.json();
}
