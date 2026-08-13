export type Language = 'en' | 'ko';

export type MajorArcanaCardId =
  | 'fool'
  | 'magician'
  | 'high_priestess'
  | 'empress'
  | 'emperor'
  | 'lovers'
  | 'chariot'
  | 'strength'
  | 'hermit'
  | 'wheel_of_fortune'
  | 'star'
  | 'moon'
  | 'sun';

export interface TarotCardData {
  id: MajorArcanaCardId;
  name: string;
  nameKo?: string;
  symbol: string;
  subtitle: string;
  subtitleKo?: string;
  description: string;
  descriptionKo?: string;
  keywords?: string[];
  keywordsKo?: string[];
}

export type ReadingMode = 'free' | 'premium';

export type EntryType =
  | 'DREAM'
  | 'CONCERN'
  | 'WISH'
  | 'RELATIONSHIP'
  | 'UNEASY'
  | 'CUSTOM';

export type RitualType = 'blessing' | 'release' | 'reflection';

export type TopicType = EntryType;


export interface ReadingResult {
  readingId: string;
  selectedCard: TarotCardData;
  headline: string;
  currentSituation: string;
  possibility: string;
  signals: string;
  action: string;
  luckyNumbers?: number[];
  talismanMessage: string;
  disclaimer: string;
}

export type PremiumCardRole = 'currentFlow' | 'hiddenMeaning' | 'carryForward';

export interface PremiumReadingRequest {
  entryType: EntryType;
  storyText: string;
  ritualType: RitualType;
  cards: [TarotCardData, TarotCardData, TarotCardData];
  language: Language;
}

export interface PremiumCardInterpretation {
  role: PremiumCardRole;
  roleTitle: string;
  card: TarotCardData;
  headline: string;
  interpretation: string;
}

export interface PremiumReadingResult {
  readingId: string;
  cards: [
    PremiumCardInterpretation,
    PremiumCardInterpretation,
    PremiumCardInterpretation
  ];
  connectionHeadline: string;
  cardConnection: string;
  deepReadingHeadline: string;
  deepReadingParagraphs: string[];
  emotionalPattern?: string;
  watchFor?: string;
  actions: [string, string, string];
  closingMessage: string;
  disclaimer: string;
}

export type NumberGameType = 'kr_lotto_645' | 'us_powerball';

export interface SymbolicNumberRequest {
  gameType: NumberGameType;
  entryType: EntryType;
  storyText: string;
  ritualType: RitualType;
  freeCardId?: string;
  premiumCardIds?: string[];
}

export type SymbolicNumberSet =
  | {
      gameType: 'kr_lotto_645';
      mainNumbers: number[];
    }
  | {
      gameType: 'us_powerball';
      mainNumbers: number[];
      specialNumber: number;
    };

export interface SymbolicNumberResult {
  gameType: NumberGameType;
  numberSet: SymbolicNumberSet;
  generatedFrom: {
    entryType: EntryType;
    cardIds: string[];
  };
  seedFingerprint?: string;
  disclaimerKo: string;
  disclaimerEn: string;
}

export type TalismanStyle = 'radiant' | 'guardian' | 'mirror';

export interface DigitalTalismanRequest {
  entryType: EntryType;
  storyText: string;
  ritualType: RitualType;
  freeCardId?: string;
  premiumCardIds?: string[];
}

export interface DigitalTalismanOption {
  id: string;
  style: TalismanStyle;
  titleKo: string;
  titleEn: string;
  subtitleKo: string;
  subtitleEn: string;
  symbolMotif: 'sun' | 'star' | 'moon' | 'shield' | 'compass' | 'lotus';
  phraseKo: string;
  phraseEn: string;
  frameType: 'radial_star' | 'layered_circle' | 'vertical_axis';
  primaryColor: string;
  accentColor: string;
  seedFingerprint: string;
}

export interface DigitalTalismanResult {
  options: [DigitalTalismanOption, DigitalTalismanOption, DigitalTalismanOption];
  disclaimerKo: string;
  disclaimerEn: string;
}
