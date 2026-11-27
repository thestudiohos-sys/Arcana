// ============================================================
// PayPal Configuration — @paypal/react-paypal-js 기반
// ============================================================
//
// 설정 방법:
// 1. https://developer.paypal.com/dashboard 에서 앱 생성
// 2. Client ID를 .env 파일에 넣기:
//    VITE_PAYPAL_CLIENT_ID=실제_클라이언트_ID
// 3. 프로덕션: VITE_PAYPAL_CLIENT_ID에 Live Client ID 사용
//
// 상품 정보(이름·가격)는 src/config/products.ts 한 곳에서 관리합니다.
// ============================================================

import { ARCANA_PRODUCTS } from '../config/products';

export const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
  currency: 'USD',
  intent: 'capture' as const,
  brandName: 'Arcana by H.O.S',
};

// ── 상품 타입 정의 ──

export interface PayPalProduct {
  id: string;
  name: string;
  description: string;
  price: string; // '1.49' 형식
  currency: string;
}

// ── ARCANA Premium Ritual 상품 (USD) ──

export const PRODUCTS: PayPalProduct[] = Object.values(ARCANA_PRODUCTS).map((product) => ({
  id: product.id,
  name: product.titleEn,
  description: product.descriptionEn,
  price: product.priceUSD.toFixed(2),
  currency: 'USD',
}));
