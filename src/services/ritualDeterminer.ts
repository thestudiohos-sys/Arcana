import { EntryType, RitualType } from '../types/reading';

const POSITIVE_KEYWORDS_KO = [
  '빛', '태양', '해', '별', '무지개', '꽃', '아기', '웃음', '기쁨',
  '돈', '금', '보석', '선물', '합격', '성공', '날다', '맑다', '희망', '행복'
];

const POSITIVE_KEYWORDS_EN = [
  'light', 'sun', 'star', 'rainbow', 'flower', 'baby', 'smile', 'joy',
  'gold', 'jewel', 'gift', 'success', 'flying', 'clear', 'hope', 'happy'
];

const NEGATIVE_KEYWORDS_KO = [
  '죽음', '쫓기다', '도망', '피', '추락', '불', '괴물', '귀신', '사고',
  '울다', '공포', '무섭다', '깨지다', '썩다', '잃어버리다', '불안', '상처'
];

const NEGATIVE_KEYWORDS_EN = [
  'death', 'chased', 'running away', 'blood', 'falling', 'fire', 'monster',
  'ghost', 'accident', 'crying', 'fear', 'scared', 'broken', 'rotten', 'lost', 'pain'
];

/**
 * Determines the RitualType (blessing, release, reflection) based on local mock rules.
 * This is a deterministic frontend UX helper and does not use AI or predict real-world outcomes.
 */
export function determineRitualType(
  entryType: EntryType | null,
  storyText: string
): RitualType {
  if (!entryType) return 'reflection';

  // 1. Direct Entry Type Mappings
  if (entryType === 'WISH') return 'blessing';
  if (entryType === 'UNEASY') return 'release';
  if (entryType === 'CONCERN' || entryType === 'RELATIONSHIP') return 'reflection';

  // 2. Keyword analysis for DREAM and CUSTOM
  const textLower = storyText.toLowerCase();

  const hasPositive =
    POSITIVE_KEYWORDS_KO.some((kw) => textLower.includes(kw)) ||
    POSITIVE_KEYWORDS_EN.some((kw) => textLower.includes(kw));

  const hasNegative =
    NEGATIVE_KEYWORDS_KO.some((kw) => textLower.includes(kw)) ||
    NEGATIVE_KEYWORDS_EN.some((kw) => textLower.includes(kw));

  if (hasPositive && !hasNegative) return 'blessing';
  if (hasNegative && !hasPositive) return 'release';

  // Fallback to reflection if ambiguous, mixed, or neutral
  return 'reflection';
}
