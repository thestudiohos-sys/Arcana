import {
  ReadingResult,
  PremiumReadingResult,
  SymbolicNumberResult,
  DigitalTalismanResult,
  Language,
  EntryType,
  RitualType,
} from '../types/reading';

export const READING_PROVIDER = import.meta.env.VITE_READING_PROVIDER || 'local';

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim();
  }

  // If in production and READING_PROVIDER is set to 'api', require explicit VITE_API_BASE_URL
  if (import.meta.env.PROD && READING_PROVIDER === 'api') {
    throw new Error('ARCANA API base URL is not configured for production.');
  }

  // Local development fallback
  return 'http://127.0.0.1:8000';
}

export async function fetchFreeReadingApi(params: {
  entryType: EntryType;
  storyText: string;
  ritualType: RitualType;
  selectedCardId: string;
  language: Language;
}): Promise<ReadingResult> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/readings/free`, {
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
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/readings/premium`, {
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
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/numbers/symbolic`, {
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
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/talismans/options`, {
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
