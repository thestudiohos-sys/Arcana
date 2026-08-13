import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArcanaProduct } from '../config/products';
import { Language } from '../types/reading';
import { trackPurchaseIntent } from '../services/purchaseIntentAnalytics';

interface PaymentComingSoonProps {
  product: ArcanaProduct;
  language: Language;
  onBackToOptions: () => void;
  onClose: () => void;
}

export function PaymentComingSoon({
  product,
  language,
  onBackToOptions,
  onClose,
}: PaymentComingSoonProps) {
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const isKo = language === 'ko';

  const title = isKo ? product.titleKo : product.titleEn;

  const handleLaunchInterest = () => {
    trackPurchaseIntent({
      event: 'launch_interest_clicked',
      productId: product.id,
      language,
    });
    setHasExpressedInterest(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-[#c5a059]/40 bg-gradient-to-b from-[#121018] via-[#0a0810] to-black text-center shadow-[0_0_60px_rgba(197,160,89,0.2)] relative overflow-hidden"
      >
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-[#c5a059]/10 blur-3xl" />
        </div>

        {/* EYEBROW */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/[0.05] mb-4 relative z-10">
          <span className="text-[#c5a059] text-[11px]">✦✦✦</span>
          <span className="text-[#c5a059] text-[11px] tracking-[0.2em] uppercase font-medium">
            ARCANA PREVIEW
          </span>
        </div>

        {/* HEADLINE */}
        <h2 className="text-white text-[22px] sm:text-[26px] font-light leading-snug mb-3 relative z-10">
          {isKo ? '결제 기능을 준비하고 있습니다' : 'PAYMENTS ARE COMING SOON'}
        </h2>

        {/* BODY */}
        <p className="text-white/70 text-[14px] sm:text-[15px] font-light leading-relaxed max-w-md mx-auto mb-6 relative z-10">
          {isKo
            ? 'ARCANA의 첫 공개 버전을 테스트하고 있습니다. 결제 기능은 조금 더 준비한 뒤 열 예정입니다.'
            : "We're testing the first public version of ARCANA. Payments will become available after this early preview."}
        </p>

        {/* PROMINENT NON-PROCESSED REASSURANCE MESSAGE */}
        <div className="p-4 rounded-xl border border-[#c5a059]/40 bg-[#c5a059]/[0.08] mb-6 text-center relative z-10">
          <p className="text-[#c5a059] text-[13px] sm:text-[14px] font-medium tracking-wide">
            ✦ {isKo ? '실제 결제는 진행되지 않았습니다.' : 'No payment has been processed.'}
          </p>
          <span className="text-white/40 text-[11px] font-light block mt-1">
            {isKo ? `선택하신 상품: ${title}` : `Selected Item: ${title}`}
          </span>
        </div>

        {/* SECONDARY LAUNCH INTEREST ACTION */}
        <div className="mb-8 relative z-10">
          {!hasExpressedInterest ? (
            <button
              type="button"
              onClick={handleLaunchInterest}
              className="w-full py-3.5 px-6 rounded-full border border-[#c5a059] bg-[#c5a059]/20 hover:bg-[#c5a059] text-[#c5a059] hover:text-black transition-all duration-300 text-[13px] tracking-[0.2em] uppercase font-medium cursor-pointer shadow-[0_0_20px_rgba(197,160,89,0.15)]"
            >
              {isKo ? '출시 관심 남기기' : "I'm Interested"}
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-[13px] font-light"
            >
              ✓ {isKo ? '관심을 남겨주셔서 감사합니다.' : 'Thanks for your interest.'}
            </motion.div>
          )}
        </div>

        {/* NAVIGATION ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-white/10 relative z-10">
          <button
            type="button"
            onClick={onBackToOptions}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300 text-[12px] tracking-wider uppercase font-light cursor-pointer"
          >
            ← {isKo ? '상품 다시 보기' : 'Back to Options'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-transparent text-white/40 hover:text-white/80 transition-colors text-[12px] tracking-wider uppercase font-light cursor-pointer"
          >
            {isKo ? '리딩으로 돌아가기' : 'Back to My Reading'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
