import { ProductId, ARCANA_PRODUCTS, ArcanaProduct } from '../config/products';
import { PurchaseIntentEvent, PurchaseIntentEventName, PurchaseIntentSummary } from '../types/purchaseIntent';

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

export function trackPurchaseIntent(params: {
  event: PurchaseIntentEventName;
  productId: ProductId;
  language: 'ko' | 'en';
  source?: 'pricing' | 'free_result';
}): void {
  if (ANALYTICS_PROVIDER === 'remote') {
    const errorMsg = 'Remote purchase intent analytics is not configured.';
    console.error('[PurchaseIntentAnalytics]', errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const product: ArcanaProduct | undefined = ARCANA_PRODUCTS[params.productId];
    const newEvent: PurchaseIntentEvent = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      event: params.event,
      productId: params.productId,
      language: params.language,
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
      source: params.source || 'pricing',
      priceKRW: product?.priceKRW,
      priceUSD: product?.priceUSD,
    };

    const storedStr = localStorage.getItem(STORAGE_KEY);
    let events: PurchaseIntentEvent[] = storedStr ? JSON.parse(storedStr) : [];
    
    events.push(newEvent);
    if (events.length > MAX_EVENTS) {
      events = events.slice(events.length - MAX_EVENTS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.warn('[PurchaseIntentAnalytics] Local tracking skipped:', err);
  }
}

export function getPurchaseIntentEvents(): PurchaseIntentEvent[] {
  try {
    const storedStr = localStorage.getItem(STORAGE_KEY);
    return storedStr ? JSON.parse(storedStr) : [];
  } catch {
    return [];
  }
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
