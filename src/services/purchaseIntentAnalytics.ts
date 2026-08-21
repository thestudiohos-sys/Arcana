import { ProductId, ARCANA_PRODUCTS, ArcanaProduct } from '../config/products';
import {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsSource,
  ProductFunnelEventName,
  PurchaseIntentEvent,
  PurchaseIntentEventName,
  PurchaseIntentSummary,
} from '../types/purchaseIntent';
import { sendRemoteAnalyticsEvent } from './analyticsTransport';

const STORAGE_KEY = 'arcana_purchase_intent_events';
const SESSION_KEY = 'arcana_session_id';
const MAX_EVENTS = 200;

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        sid = crypto.randomUUID();
      } else {
        sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return 'fallback_session_id';
  }
}

export const ANALYTICS_PROVIDER = (import.meta.env.VITE_ANALYTICS_PROVIDER || 'local').toLowerCase();

const PURCHASE_INTENT_EVENTS = new Set<AnalyticsEventName>([
  'premium_product_clicked',
  'checkout_opened',
  'payment_intent_clicked',
  'coming_soon_viewed',
  'launch_interest_clicked',
]);

function createEvent(params: {
  event: AnalyticsEventName;
  productId?: ProductId;
  language: 'ko' | 'en';
  source: AnalyticsSource;
  priceKRW?: number;
  priceUSD?: number;
}): AnalyticsEvent {
  return {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    event: params.event,
    productId: params.productId,
    language: params.language,
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    source: params.source,
    priceKRW: params.priceKRW,
    priceUSD: params.priceUSD,
  };
}

function storeLocalEvent(newEvent: AnalyticsEvent): void {
  try {
    const storedStr = localStorage.getItem(STORAGE_KEY);
    let events: AnalyticsEvent[] = storedStr ? JSON.parse(storedStr) : [];

    events.push(newEvent);
    if (events.length > MAX_EVENTS) {
      events = events.slice(events.length - MAX_EVENTS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.warn('[PurchaseIntentAnalytics] Local tracking skipped:', err);
  }
}

function getRemoteEndpoint(): string | null {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, '')}/api/analytics/events`;
  }

  if (import.meta.env.PROD) {
    return null;
  }

  return 'http://127.0.0.1:8000/api/analytics/events';
}

function dispatchEvent(event: AnalyticsEvent): void {
  // Keep the existing local history in both modes. Remote mode adds central delivery
  // without making analytics availability part of any user-facing flow.
  storeLocalEvent(event);

  if (ANALYTICS_PROVIDER !== 'remote') return;

  const endpoint = getRemoteEndpoint();
  if (!endpoint) {
    if (import.meta.env.DEV) {
      console.warn('[PurchaseIntentAnalytics] Remote tracking skipped: API base URL is not configured.');
    }
    return;
  }

  void sendRemoteAnalyticsEvent(event, {
    endpoint,
    warn: import.meta.env.DEV
      ? (message) => console.warn('[PurchaseIntentAnalytics]', message)
      : undefined,
  });
}

export function trackPurchaseIntent(params: {
  event: PurchaseIntentEventName;
  productId: ProductId;
  language: 'ko' | 'en';
  source?: 'pricing' | 'free_result';
}): void {
  const product: ArcanaProduct | undefined = ARCANA_PRODUCTS[params.productId];
  dispatchEvent(
    createEvent({
      event: params.event,
      productId: params.productId,
      language: params.language,
      source: params.source || 'pricing',
      priceKRW: product?.priceKRW,
      priceUSD: product?.priceUSD,
    }),
  );
}

export function trackProductFunnel(params: {
  event: ProductFunnelEventName;
  language: 'ko' | 'en';
}): void {
  dispatchEvent(
    createEvent({
      event: params.event,
      language: params.language,
      source: 'free_reading',
    }),
  );
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  try {
    const storedStr = localStorage.getItem(STORAGE_KEY);
    return storedStr ? JSON.parse(storedStr) : [];
  } catch {
    return [];
  }
}

export function getPurchaseIntentEvents(): PurchaseIntentEvent[] {
  return getAnalyticsEvents().filter(
    (event): event is PurchaseIntentEvent =>
      PURCHASE_INTENT_EVENTS.has(event.event) && event.productId !== undefined,
  );
}

export function getPurchaseIntentSummary(): PurchaseIntentSummary {
  const events = getPurchaseIntentEvents();

  const initByProduct = (): Record<ProductId, number> => ({
    deep_reading: 0,
    lucky_numbers: 0,
    digital_talisman: 0,
    arcana_bundle: 0,
  });

  const productClicksByProduct = initByProduct();
  const paymentIntentByProduct = initByProduct();
  const launchInterestByProduct = initByProduct();

  let totalProductClicks = 0;
  let checkoutOpened = 0;
  let paymentIntentClicks = 0;
  let launchInterestClicks = 0;

  for (const ev of events) {
    switch (ev.event) {
      case 'premium_product_clicked':
        totalProductClicks++;
        if (productClicksByProduct[ev.productId] !== undefined) {
          productClicksByProduct[ev.productId]++;
        }
        break;
      case 'checkout_opened':
        checkoutOpened++;
        break;
      case 'payment_intent_clicked':
        paymentIntentClicks++;
        if (paymentIntentByProduct[ev.productId] !== undefined) {
          paymentIntentByProduct[ev.productId]++;
        }
        break;
      case 'launch_interest_clicked':
        launchInterestClicks++;
        if (launchInterestByProduct[ev.productId] !== undefined) {
          launchInterestByProduct[ev.productId]++;
        }
        break;
    }
  }

  const paymentIntentRate = checkoutOpened > 0 ? paymentIntentClicks / checkoutOpened : 0;
  const launchInterestRate = paymentIntentClicks > 0 ? launchInterestClicks / paymentIntentClicks : 0;

  return {
    totalProductClicks,
    productClicksByProduct,
    checkoutOpened,
    paymentIntentClicks,
    paymentIntentByProduct,
    launchInterestClicks,
    launchInterestByProduct,
    paymentIntentRate: Number(paymentIntentRate.toFixed(4)),
    launchInterestRate: Number(launchInterestRate.toFixed(4)),
  };
}

export function clearPurchaseIntentEvents(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[PurchaseIntentAnalytics] Failed to clear events:', err);
  }
}
