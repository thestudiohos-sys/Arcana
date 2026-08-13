export type ProductId = 'deep_reading' | 'lucky_numbers' | 'digital_talisman' | 'arcana_bundle';

export interface ArcanaProduct {
  id: ProductId;
  priceKRW: number;
  priceUSD: number;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  featuresKo: string[];
  featuresEn: string[];
  savingsBadgeKo?: string;
  savingsBadgeEn?: string;
  ctaKo: string;
  ctaEn: string;
  isBundle?: boolean;
}

export const ARCANA_PRODUCTS: Record<ProductId, ArcanaProduct> = {
  deep_reading: {
    id: 'deep_reading',
    priceKRW: 1900,
    priceUSD: 1.49,
    titleKo: '3장 심층 리딩',
    titleEn: '3-Card Deep Reading',
    descriptionKo: '지금의 흐름, 숨겨진 의미, 앞으로 가져갈 메시지를 세 장의 카드로 더 깊게 살펴봅니다.',
    descriptionEn: 'Explore your current flow, hidden meaning, and what to carry forward through three cards.',
    featuresKo: [
      '세 카드의 역할별 해석',
      '세 카드가 이어지는 이야기',
      '종합 심층 리딩',
      '지금 해볼 수 있는 3가지',
    ],
    featuresEn: [
      'Three role-based card interpretations',
      'How the three cards connect',
      'Deeper personalized reading',
      'Three practical next steps',
    ],
    ctaKo: '3장 리딩 이어가기',
    ctaEn: 'Continue with 3 Cards',
  },
  lucky_numbers: {
    id: 'lucky_numbers',
    priceKRW: 900,
    priceUSD: 0.99,
    titleKo: '나만의 행운 숫자',
    titleEn: 'Symbolic Lucky Numbers',
    descriptionKo: '당신의 이야기와 카드 선택에서 영감을 받아 만든 상징적인 여섯 숫자입니다.',
    descriptionEn: 'Six symbolic numbers inspired by your story and card choices.',
    featuresKo: [
      '1~45 중 여섯 개의 상징 숫자',
      '당신의 이야기에서 이어지는 숫자 세트',
      '가볍게 즐기는 상징 숫자 경험',
    ],
    featuresEn: [
      'Six symbolic numbers from 1 to 45',
      'A number set inspired by your story',
      'A light symbolic experience',
    ],
    ctaKo: '행운 숫자 보기',
    ctaEn: 'Reveal My Numbers',
  },
  digital_talisman: {
    id: 'digital_talisman',
    priceKRW: 1900,
    priceUSD: 1.49,
    titleKo: '나만의 디지털 부적',
    titleEn: 'Personalized Digital Talisman',
    descriptionKo: '당신의 이야기와 카드에서 영감을 받아 만든 서로 다른 3개의 상징적 이미지 중 하나를 선택합니다.',
    descriptionEn: 'Choose one symbolic visual from three designs inspired by your story and card choices.',
    featuresKo: [
      '서로 다른 디자인 3개',
      '가장 마음에 와닿는 하나 선택',
      '세로형 9:16 SVG 파일 저장',
    ],
    featuresEn: [
      'Three distinct designs',
      'Choose the one that speaks to you',
      '9:16 portrait SVG download',
    ],
    ctaKo: '디지털 부적 만나보기',
    ctaEn: 'Explore My Talismans',
  },
  arcana_bundle: {
    id: 'arcana_bundle',
    priceKRW: 3900,
    priceUSD: 2.99,
    titleKo: 'ARCANA 전체 경험',
    titleEn: 'ARCANA Bundle',
    descriptionKo: '3장 심층 리딩, 나만의 행운 숫자, 나만의 디지털 부적 세 가지 경험을 모두 포함합니다.',
    descriptionEn: 'Includes the 3-card deep reading, symbolic lucky numbers, and personalized digital talisman.',
    featuresKo: [
      '3장 심층 리딩',
      '나만의 행운 숫자',
      '디지털 부적 3개 중 1개 선택',
      '세 가지 추가 경험 모두 포함',
    ],
    featuresEn: [
      '3-Card Deep Reading',
      'Symbolic Lucky Numbers',
      'One Personalized Digital Talisman',
      'All three premium experiences included',
    ],
    savingsBadgeKo: '개별 선택보다 800원 절약',
    savingsBadgeEn: 'Save $0.98 compared with individual options',
    ctaKo: '전체 경험 이어가기',
    ctaEn: 'Choose Bundle',
    isBundle: true,
  },
};
