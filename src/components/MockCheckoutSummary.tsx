import { Language } from '../types/reading';
import { ArcanaProduct } from '../config/products';

interface MockCheckoutSummaryProps {
  language: Language;
  product: ArcanaProduct;
  onClose: () => void;
}

export function MockCheckoutSummary({ language, product, onClose }: MockCheckoutSummaryProps) {
  const isKo = language === 'ko';
  const priceDisplay = isKo ? `₩${product.priceKRW.toLocaleString()}` : `$${product.priceUSD.toFixed(2)}`;
  const title = isKo ? product.titleKo : product.titleEn;
  const description = isKo ? product.descriptionKo : product.descriptionEn;
  const features = isKo ? product.featuresKo : product.featuresEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-[#c5a059]/40 bg-gradient-to-b from-[#12131c] via-[#090a10] to-[#040406] shadow-[0_0_60px_rgba(197,160,89,0.2)] text-left relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white text-xl p-2 cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/[0.06] mb-3">
            <span className="text-[#c5a059] text-[11px]">✦</span>
            <span className="text-[#c5a059] text-[11px] tracking-[0.2em] uppercase font-medium">
              {isKo ? '선택한 내용 확인' : 'REVIEW YOUR SELECTION'}
            </span>
          </div>
          <h3 className="text-white text-[22px] sm:text-[26px] font-light mb-1">
            {title}
          </h3>
          <p className="text-white/60 text-[13px] sm:text-[14px] font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Features */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] mb-6">
          <div className="flex items-baseline justify-between mb-4 border-b border-white/10 pb-3">
            <span className="text-white/60 text-[13px] font-medium">
              {isKo ? '결제 금액' : 'Total Amount'}
            </span>
            <span className="text-[#c5a059] text-[28px] sm:text-[32px] font-light tracking-tight">
              {priceDisplay}
            </span>
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

        {/* Development Notice */}
        <div className="p-4 rounded-xl border border-[#c5a059]/30 bg-[#c5a059]/[0.04] mb-6 text-center">
          <p className="text-[#c5a059] text-[12px] font-medium mb-0.5">
            {isKo ? '💡 개발용 미리보기 단계' : '💡 Development Preview Notice'}
          </p>
          <p className="text-white/70 text-[12px] font-light leading-relaxed">
            {isKo
              ? '현재는 상품 및 가격 UX를 검증하는 미리보기 단계입니다. 실제 결제 및 대금 청구는 진행되지 않습니다.'
              : 'This is a development preview of the checkout UX. No real payments or charges will be processed.'}
          </p>
        </div>

        {/* Disabled CTA & Close */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={true}
            className="w-full py-3.5 rounded-full border border-white/20 bg-white/5 text-white/40 text-[12px] tracking-[0.2em] uppercase font-medium cursor-not-allowed text-center"
          >
            {isKo ? '결제 연결 준비 중' : 'PAYMENT COMING SOON'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-white/50 hover:text-white text-[12px] tracking-wider transition-colors cursor-pointer text-center"
          >
            {isKo ? '닫기' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
