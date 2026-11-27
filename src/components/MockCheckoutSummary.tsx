import { useState, useEffect, useRef } from 'react';
import { Language } from '../types/reading';
import { ArcanaProduct } from '../config/products';
import { DICTIONARY } from '../config/dictionary';
import { trackPurchaseIntent } from '../services/purchaseIntentAnalytics';
import { PaymentComingSoon } from './PaymentComingSoon';

interface MockCheckoutSummaryProps {
  language: Language;
  product: ArcanaProduct;
  onClose: () => void;
}

export function MockCheckoutSummary({ language, product, onClose }: MockCheckoutSummaryProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const isKo = language === 'ko';
  const trackedSessionRef = useRef<string | null>(null);

  // Track checkout_opened event ONCE per modal session (prevents duplicate tracking when toggling KO/EN)
  useEffect(() => {
    if (trackedSessionRef.current !== product.id) {
      trackedSessionRef.current = product.id;
      trackPurchaseIntent({
        event: 'checkout_opened',
        productId: product.id,
        language,
      });
    }
  }, [product.id, language]);

  const priceDisplay = isKo ? `₩${product.priceKRW.toLocaleString()}` : `$${product.priceUSD.toFixed(2)}`;
  const title = isKo ? product.titleKo : product.titleEn;
  const description = isKo ? product.descriptionKo : product.descriptionEn;
  const features = isKo ? product.featuresKo : product.featuresEn;
  const paymentTerms = DICTIONARY[language].paymentTerms;

  const paymentClickedRef = useRef(false);

  const handleContinueToPayment = () => {
    if (paymentClickedRef.current) return;
    paymentClickedRef.current = true;

    // Track core purchase_intent_clicked event
    trackPurchaseIntent({
      event: 'payment_intent_clicked',
      productId: product.id,
      language,
    });

    // Track coming_soon_viewed event
    trackPurchaseIntent({
      event: 'coming_soon_viewed',
      productId: product.id,
      language,
    });

    setShowComingSoon(true);
  };

  const handleBackToOptions = () => {
    paymentClickedRef.current = false;
    setShowComingSoon(false);
  };

  if (showComingSoon) {
    return (
      <PaymentComingSoon
        product={product}
        language={language}
        onBackToOptions={handleBackToOptions}
        onClose={onClose}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-[#c5a059]/40 bg-gradient-to-b from-[#12131c] via-[#090a10] to-[#040406] shadow-[0_0_60px_rgba(197,160,89,0.2)] text-left relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white text-xl p-2 cursor-pointer transition-colors"
          aria-label={isKo ? '창 닫기' : 'Close dialog'}
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/[0.06] mb-3">
            <span className="text-[#c5a059] text-[11px]">✦</span>
            <span className="text-[#c5a059] text-[11px] tracking-[0.2em] uppercase font-medium">
              {isKo ? '결제 전 확인' : 'BEFORE PAYMENT'}
            </span>
          </div>
          <h3 className="text-white text-[22px] sm:text-[26px] font-light mb-1">
            {isKo ? '선택한 경험을 확인해보세요' : 'Review Your Selection'}
          </h3>
          <p className="text-white/60 text-[13px] sm:text-[14px] font-light leading-relaxed mt-1">
            {title} — {description}
          </p>
        </div>

        {/* Price & Features */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] mb-6">
          <div className="mb-4 border-b border-white/10 pb-3">
            <div className="flex items-baseline justify-between">
              <span className="text-white/60 text-[13px] font-medium">
                {isKo ? '결제 금액' : 'Total Amount'}
              </span>
              <span className="text-[#c5a059] text-[28px] sm:text-[32px] font-light tracking-tight">
                {priceDisplay}
              </span>
            </div>
            <p className="text-white/55 text-[12px] font-light leading-relaxed mt-2">
              ✦ {paymentTerms.checkoutNote}
            </p>
          </div>

          <h4 className="text-white/80 text-[12px] tracking-[0.15em] uppercase font-medium mb-3">
            ✦ {isKo ? '포함된 내용' : 'WHAT IS INCLUDED'}
          </h4>
          <ul className="space-y-2">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-white/80 text-[13px] font-light">
                <span className="text-[#c5a059] text-[12px]">✓</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Active Purchase Intent CTA */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleContinueToPayment}
            className="w-full py-4 rounded-full border border-[#c5a059] bg-[#c5a059] text-black hover:bg-[#d4b06a] transition-all duration-300 text-[13px] tracking-[0.2em] uppercase font-medium cursor-pointer text-center shadow-[0_0_20px_rgba(197,160,89,0.25)]"
          >
            {isKo ? '결제하기' : 'Continue to Payment'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-[12px] tracking-wider transition-colors cursor-pointer text-center"
          >
            {paymentTerms.decline}
          </button>
        </div>
      </div>
    </div>
  );
}
