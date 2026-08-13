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
      '카드 3장 역할별 해석',
      '세 카드가 이어지는 이야기',
      '종합 심층 리딩',
      '현실 행동 제안 3가지',
    ],
    featuresEn: [
      'Three role-based card interpretations',
      'How the three cards connect',
      'Deeper personalized reading',
      'Three practical real-world actions',
    ],
    ctaKo: '3장 리딩 선택',
    ctaEn: 'Choose 3-Card Reading',
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
      '1~45 중 6개 상징 숫자',
      '같은 이야기에는 같은 숫자',
      '상징적 엔터테인먼트 경험',
    ],
    featuresEn: [
      'Six symbolic numbers from 1 to 45',
      'Same context, same set',
      'Symbolic entertainment experience',
    ],
    ctaKo: '행운 숫자 선택',
    ctaEn: 'Choose Lucky Numbers',
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
      '마음에 와닿는 1개 선택',
      '9:16 portrait SVG 저장',
      'ARCANA by H.O.S 워터마크',
    ],
    featuresEn: [
      'Three distinct designs',
      'Choose the one that speaks to you',
      '9:16 portrait SVG download',
      'ARCANA by H.O.S watermark',
    ],
    ctaKo: '디지털 부적 선택',
    ctaEn: 'Choose Digital Talisman',
  },
  arcana_bundle: {
    id: 'arcana_bundle',
    priceKRW: 3900,
    priceUSD: 2.99,
    titleKo: 'ARCANA 전체 보기',
    titleEn: 'ARCANA Bundle',
    descriptionKo: '3장 심층 리딩, 나만의 행운 숫자, 나만의 디지털 부적을 모두 이어서 경험합니다.',
    descriptionEn: 'Continue with the 3-card reading, symbolic lucky numbers, and personalized digital talisman.',
    featuresKo: [
      '3장 심층 리딩 포함',
      '나만의 행운 숫자 포함',
      '디지털 부적 3개 중 1개 선택 포함',
      '세 가지 추가 경험 모두 포함',
    ],
    featuresEn: [
      '3-Card Deep Reading included',
      'Symbolic Lucky Numbers included',
      'One Personalized Digital Talisman included',
      'All three premium experiences included',
    ],
    savingsBadgeKo: '개별 선택보다 800원 절약',
    savingsBadgeEn: 'Save $0.98 compared with individual options',
    ctaKo: '전체 보기 선택',
    ctaEn: 'Choose Bundle',
    isBundle: true,
  },
};
