import { NumberGameType } from '../types/reading';

export interface NumberGameConfig {
  id: NumberGameType;
  nameKo: string;
  nameEn: string;
  min: number;
  max: number;
  count: number;
  allowDuplicates: boolean;
  sortAscending: boolean;
}

export const NUMBER_GAMES_CONFIG: Record<NumberGameType, NumberGameConfig> = {
  kr_lotto_645: {
    id: 'kr_lotto_645',
    nameKo: '한국 동행복권 6/45 (상징 번호)',
    nameEn: 'KR Lotto 6/45 (Symbolic Set)',
    min: 1,
    max: 45,
    count: 6,
    allowDuplicates: false,
    sortAscending: true,
  },
  us_powerball: {
    id: 'us_powerball',
    nameKo: '미국 파워볼 (미지원 - 예시용)',
    nameEn: 'US Powerball (Placeholder Config)',
    min: 1,
    max: 69,
    count: 5,
    allowDuplicates: false,
    sortAscending: true,
  },
};
