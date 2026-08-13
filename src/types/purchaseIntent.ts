import { ProductId } from '../config/products';

export type PurchaseIntentEventName =
  | 'premium_product_clicked'
  | 'checkout_opened'
  | 'payment_intent_clicked'
  | 'coming_soon_viewed'
  | 'launch_interest_clicked';

export interface PurchaseIntentEvent {
  id: string;
  event: PurchaseIntentEventName;
  productId: ProductId;
  language: 'ko' | 'en';
  sessionId: string;
  timestamp: string;
  source: 'pricing' | 'free_result';
  priceKRW?: number;
  priceUSD?: number;
}

export interface PurchaseIntentSummary {
  totalProductClicks: number;
  productClicksByProduct: Record<ProductId, number>;
  checkoutOpened: number;
  paymentIntentClicks: number;
  paymentIntentByProduct: Record<ProductId, number>;
  launchInterestClicks: number;
  launchInterestByProduct: Record<ProductId, number>;
  paymentIntentRate: number;
  launchInterestRate: number;
}
