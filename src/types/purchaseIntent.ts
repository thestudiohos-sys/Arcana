import { ProductId } from '../config/products';

export type PurchaseIntentEventName =
  | 'premium_product_clicked'
  | 'checkout_opened'
  | 'payment_intent_clicked'
  | 'coming_soon_viewed'
  | 'launch_interest_clicked';

export type ProductFunnelEventName = 'reading_started' | 'free_reading_completed';

export type AnalyticsEventName = PurchaseIntentEventName | ProductFunnelEventName;

export type AnalyticsSource = 'pricing' | 'free_result' | 'free_reading';

export interface AnalyticsEvent {
  id: string;
  event: AnalyticsEventName;
  productId?: ProductId;
  language: 'ko' | 'en';
  sessionId: string;
  timestamp: string;
  source: AnalyticsSource;
  priceKRW?: number;
  priceUSD?: number;
}

export interface PurchaseIntentEvent extends AnalyticsEvent {
  event: PurchaseIntentEventName;
  productId: ProductId;
  source: 'pricing' | 'free_result';
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
