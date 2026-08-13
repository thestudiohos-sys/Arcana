import { DigitalTalismanRequest, DigitalTalismanResult, DigitalTalismanOption } from '../types/reading';

export function createTalismanSeedSource(request: DigitalTalismanRequest): string {
  const { entryType, storyText, ritualType, freeCardId, premiumCardIds } = request;
  const trimmedStory = storyText ? storyText.trim() : '';
  const freeCardStr = freeCardId || '';
  const premiumCardsStr = premiumCardIds && premiumCardIds.length ? premiumCardIds.join('-') : '';

  return `${entryType}|${trimmedStory}|${ritualType}|${freeCardStr}|${premiumCardsStr}`;
}

function fnv1aHash(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

class DeterministicPRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  nextFloat(): number {
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 4294967296;
  }

  nextIntRange(min: number, max: number): number {
    const range = max - min + 1;
    return min + Math.floor(this.nextFloat() * range);
  }

  pick<T>(arr: T[]): T {
    return arr[this.nextIntRange(0, arr.length - 1)];
  }
}

// Symbolic phrases catalog categorized by ritualType and entryType (No occult/gambling/guaranteed outcome wording)
const TALISMAN_PHRASES = {
  blessing: {
    radiant: {
      ko: ['빛의 온기가 조용히 퍼져나갑니다', '마음속 가득 기대의 씨앗을 품어보세요', '밝은 확신이 앞으로 걸어갈 길을 비춥니다'],
      en: ['A subtle warmth of light quietly unfolds', 'Cultivate seeds of hope within your heart', 'Gentle clarity illuminates your path forward'],
    },
    guardian: {
      ko: ['소중한 첫 마음을 조용히 지켜냅니다', '흔들리지 않는 단단함이 깊어집니다', '마음의 평온이 따뜻한 울타리가 됩니다'],
      en: ['Quietly protect your earnest beginning', 'A steady inner strength grows deeper', 'Inner peace becomes a comforting boundary'],
    },
    mirror: {
      ko: ['이미 당신 안에 밝은 정답이 피어납니다', '서두르지 않는 조화 속에 길이 보입니다', '맑은 시선으로 소중한 가능성을 마주하세요'],
      en: ['The clear truth blooms already within you', 'Direction emerges through unhurried balance', 'Face gentle possibilities with clear eyes'],
    },
  },
  release: {
    radiant: {
      ko: ['무거운 짐을 내려놓을 때 새로운 빛이 피어납니다', '불안의 억지를 거두고 가벼운 숨을 쉽니다', '비워진 공간에 자유로운 소망을 담습니다'],
      en: ['A fresh light rises as heavy burdens rest', 'Set down anxious pressure and breathe freely', 'Fill open quiet space with lighter hope'],
    },
    guardian: {
      ko: ['지나가는 불안이 마음에 머물지 못하게 감쌉니다', '지금은 굳건히 스스로를 보살필 때입니다', '외부의 소음으로부터 내면의 조용함을 지킵니다'],
      en: ['Shield your mind from passing apprehensions', 'Now is the moment for firm self-care', 'Guard inner calm away from external noise'],
    },
    mirror: {
      ko: ['찝찝했던 순간도 가만히 비워 흘려보냅니다', '치우침 없는 고요 속에서 진짜 답을 봅니다', '마음의 수면이 차분하게 정돈됩니다'],
      en: ['Gently release moments of discomfort', 'See true perspective in balanced stillness', 'Allow the surface of your mind to settle'],
    },
  },
  reflection: {
    radiant: {
      ko: ['조용히 빛나는 시선으로 나를 바라봅니다', '서두르지 않고 성장의 순서를 기다립니다', '오늘 하루의 작은 배움이 빛이 됩니다'],
      en: ['Reflect quietly with gentle self-awareness', 'Trust the natural order of your growth', 'Small insights today illuminate tomorrow'],
    },
    guardian: {
      ko: ['마음의 경계를 세우고 나만의 속도를 지킵니다', '내면의 직관이 흔들리지 않는 가이드가 됩니다', '스스로를 온전히 믿어주는 안식처를 만듭니다'],
      en: ['Maintain your personal pace and boundary', 'Inner intuition serves as a steady guide', 'Create a quiet sanctuary within yourself'],
    },
    mirror: {
      ko: ['답을 조급히 구하기보다 마음을 들여다봅니다', '선명한 기준이 내면 깊은 곳에서 살아납니다', '고요함 속에서 비로소 길을 발견합니다'],
      en: ['Look within before demanding immediate answers', 'Clear personal standards come alive inside', 'Discover direction through quiet presence'],
    },
  },
};

export function generateDigitalTalismanOptions(request: DigitalTalismanRequest): DigitalTalismanResult {
  const seedSource = createTalismanSeedSource(request);
  const initialSeed = fnv1aHash(seedSource);
  const prng = new DeterministicPRNG(initialSeed);

  const { ritualType, entryType, freeCardId } = request;

  // Visual Motif bias based on Entry Type & Free Card
  let motif1: 'sun' | 'star' | 'moon' | 'shield' | 'compass' | 'lotus' = 'star';
  let motif2: 'sun' | 'star' | 'moon' | 'shield' | 'compass' | 'lotus' = 'shield';
  let motif3: 'sun' | 'star' | 'moon' | 'shield' | 'compass' | 'lotus' = 'moon';

  if (entryType === 'DREAM') {
    motif1 = 'star'; motif2 = 'shield'; motif3 = 'moon';
  } else if (entryType === 'CONCERN') {
    motif1 = 'sun'; motif2 = 'shield'; motif3 = 'compass';
  } else if (entryType === 'WISH') {
    motif1 = 'sun'; motif2 = 'star'; motif3 = 'lotus';
  } else if (entryType === 'RELATIONSHIP') {
    motif1 = 'lotus'; motif2 = 'shield'; motif3 = 'moon';
  } else if (entryType === 'UNEASY') {
    motif1 = 'shield'; motif2 = 'compass'; motif3 = 'moon';
  }

  if (freeCardId === 'sun') motif1 = 'sun';
  if (freeCardId === 'moon') motif3 = 'moon';
  if (freeCardId === 'star') motif1 = 'star';

  // Phrase selection
  const phrases = TALISMAN_PHRASES[ritualType] || TALISMAN_PHRASES.reflection;
  const p1Idx = prng.nextIntRange(0, phrases.radiant.ko.length - 1);
  const p2Idx = prng.nextIntRange(0, phrases.guardian.ko.length - 1);
  const p3Idx = prng.nextIntRange(0, phrases.mirror.ko.length - 1);

  // Candidate 1: RADIANT
  const option1: DigitalTalismanOption = {
    id: `talisman-radiant-${initialSeed.toString(16)}`,
    style: 'radiant',
    titleKo: '빛을 담은 부적',
    titleEn: 'A Light to Carry',
    subtitleKo: '확장과 명료함의 상징',
    subtitleEn: 'Symbol of Expansion & Clarity',
    symbolMotif: motif1,
    phraseKo: phrases.radiant.ko[p1Idx],
    phraseEn: phrases.radiant.en[p1Idx],
    frameType: 'radial_star',
    primaryColor: '#c5a059',
    accentColor: '#f3e5ab',
    seedFingerprint: `radiant-${initialSeed.toString(16)}`,
  };

  // Candidate 2: GUARDIAN
  const option2: DigitalTalismanOption = {
    id: `talisman-guardian-${initialSeed.toString(16)}`,
    style: 'guardian',
    titleKo: '마음을 지키는 부적',
    titleEn: 'A Quiet Guard',
    subtitleKo: '안정과 경계의 상징',
    subtitleEn: 'Symbol of Protection & Boundary',
    symbolMotif: motif2,
    phraseKo: phrases.guardian.ko[p2Idx],
    phraseEn: phrases.guardian.en[p2Idx],
    frameType: 'layered_circle',
    primaryColor: '#b8860b',
    accentColor: '#d4af37',
    seedFingerprint: `guardian-${initialSeed.toString(16)}`,
  };

  // Candidate 3: MIRROR
  const option3: DigitalTalismanOption = {
    id: `talisman-mirror-${initialSeed.toString(16)}`,
    style: 'mirror',
    titleKo: '고요를 담은 부적',
    titleEn: 'A Moment of Balance',
    subtitleKo: '균형과 성찰의 상징',
    subtitleEn: 'Symbol of Reflection & Balance',
    symbolMotif: motif3,
    phraseKo: phrases.mirror.ko[p3Idx],
    phraseEn: phrases.mirror.en[p3Idx],
    frameType: 'vertical_axis',
    primaryColor: '#e0c068',
    accentColor: '#ffffff',
    seedFingerprint: `mirror-${initialSeed.toString(16)}`,
  };

  const disclaimerKo =
    '이 디지털 부적은 당신의 이야기와 카드 선택에서 영감을 받아 만든 상징적 이미지입니다. 실제 행운, 보호, 금전적 결과 또는 특정 사건을 보장하지 않으며, 자기 성찰과 엔터테인먼트를 위한 디지털 이미지입니다.';

  const disclaimerEn =
    'This digital talisman is a symbolic image inspired by your story and card choices. It does not guarantee luck, protection, financial outcomes, or specific events, and is provided for reflection and entertainment.';

  return {
    options: [option1, option2, option3],
    disclaimerKo,
    disclaimerEn,
  };
}
