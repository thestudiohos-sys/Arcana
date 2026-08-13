import { SymbolicNumberRequest, SymbolicNumberResult } from '../types/reading';
import { NUMBER_GAMES_CONFIG } from '../config/numberGames';

// Deterministic string seed generator (excludes language to keep numbers identical on KO/EN toggle)
export function createSymbolicSeedSource(request: SymbolicNumberRequest): string {
  const { gameType, entryType, storyText, ritualType, freeCardId, premiumCardIds } = request;
  const trimmedStory = storyText ? storyText.trim() : '';
  const freeCardStr = freeCardId || '';
  const premiumCardsStr = premiumCardIds && premiumCardIds.length ? premiumCardIds.join('-') : '';

  return `${gameType}|${entryType}|${trimmedStory}|${ritualType}|${freeCardStr}|${premiumCardsStr}`;
}

// 32-bit FNV-1a Hash Algorithm for high-entropy initial seed
function fnv1aHash(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

// Linear Congruential Generator (LCG) for deterministic pseudo-random sequence
class DeterministicPRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  // Returns next pseudo-random float [0, 1)
  nextFloat(): number {
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 4294967296;
  }

  // Returns pseudo-random integer in range [min, max] inclusive
  nextIntRange(min: number, max: number): number {
    const range = max - min + 1;
    return min + Math.floor(this.nextFloat() * range);
  }
}

export function generateSymbolicNumbers(request: SymbolicNumberRequest): SymbolicNumberResult {
  const seedSource = createSymbolicSeedSource(request);
  const initialSeed = fnv1aHash(seedSource);
  const prng = new DeterministicPRNG(initialSeed);

  const gameConfig = NUMBER_GAMES_CONFIG[request.gameType] || NUMBER_GAMES_CONFIG.kr_lotto_645;
  const { min, max, count, sortAscending } = gameConfig;

  // Generate unique main numbers
  const numberSet = new Set<number>();
  let safetyLoop = 0;

  while (numberSet.size < count && safetyLoop < 1000) {
    safetyLoop++;
    const candidate = prng.nextIntRange(min, max);
    numberSet.add(candidate);
  }

  let numbers = Array.from(numberSet);

  // If safety loop aborted early, fallback to deterministic fill
  if (numbers.length < count) {
    for (let i = min; i <= max && numbers.length < count; i++) {
      if (!numberSet.has(i)) numbers.push(i);
    }
  }

  if (sortAscending) {
    numbers.sort((a, b) => a - b);
  }

  const cardIdsList: string[] = [];
  if (request.freeCardId) cardIdsList.push(request.freeCardId);
  if (request.premiumCardIds && request.premiumCardIds.length) {
    cardIdsList.push(...request.premiumCardIds);
  }

  const seedFingerprint = `${request.gameType}-${initialSeed.toString(16)}`;

  const disclaimerKo =
    '이 숫자들은 당신의 이야기와 카드 선택에서 영감을 받아 만든 상징적 숫자입니다. 실제 복권 결과를 예측하거나 당첨 가능성을 높이지 않으며, 엔터테인먼트 목적으로만 제공됩니다.';

  const disclaimerEn =
    'These numbers are symbolic values inspired by your story and card choices. They do not predict lottery results or improve your chances of winning, and are provided for entertainment purposes only.';

  return {
    gameType: request.gameType,
    numberSet: {
      gameType: 'kr_lotto_645',
      mainNumbers: numbers,
    },
    generatedFrom: {
      entryType: request.entryType,
      cardIds: cardIdsList,
    },
    seedFingerprint,
    disclaimerKo,
    disclaimerEn,
  };
}
