import { motion } from 'framer-motion';
import { Language, ReadingResult } from '../types/reading';
import { DICTIONARY } from '../config/dictionary';
import { ARCANA_PRODUCTS } from '../config/products';

// Same KO→KRW / EN→USD display rule already used in the Pricing section (App.tsx)
function formatProductPrice(language: Language, productId: keyof typeof ARCANA_PRODUCTS): string {
  const product = ARCANA_PRODUCTS[productId];
  return language === 'ko'
    ? `₩${product.priceKRW.toLocaleString()}`
    : `$${product.priceUSD.toFixed(2)}`;
}

interface ReadingResultViewProps {
  language: Language;
  result: ReadingResult;
  onDrawAgain: () => void;
  onStartOver: () => void;
  onStartPremiumReading?: () => void;
  onStartSymbolicNumbers?: () => void;
  onStartDigitalTalisman?: () => void;
}

export function ReadingResultView({
  language,
  result,
  onDrawAgain,
  onStartOver,
  onStartPremiumReading,
  onStartSymbolicNumbers,
  onStartDigitalTalisman,
}: ReadingResultViewProps) {
  const {
    selectedCard,
    headline,
    currentSituation,
    possibility,
    signals,
    action,
    talismanMessage,
    disclaimer,
  } = result;

  const t = DICTIONARY[language].resultView;
  const preview = t.premiumPreview;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-3xl mx-auto mt-12 p-6 sm:p-10 rounded-2xl border border-[#c5a059]/30 bg-gradient-to-b from-[#0f1016]/90 via-[#07080c]/95 to-[#040406]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(197,160,89,0.1)] text-left"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[#c5a059] text-[11px] sm:text-[12px] tracking-[0.25em] uppercase font-medium block">
            {t.eyebrow}
          </span>
        </div>

        {/* Selected Card Badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-[#c5a059]/40 bg-[#c5a059]/[0.05]">
          <span className="text-[#c5a059] text-[16px]">{selectedCard.symbol}</span>
          <div>
            <span className="text-white text-[13px] font-light tracking-wider block uppercase">
              {selectedCard.name}
            </span>
            <span className="text-[#c5a059]/70 text-[10px] tracking-widest uppercase block font-light">
              {selectedCard.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Main Headline */}
      <div className="mb-10 text-center sm:text-left">
        <h3 className="text-white text-[22px] sm:text-[28px] font-light leading-snug tracking-[-0.01em]">
          "{headline}"
        </h3>
      </div>

      {/* Structured Reading Content */}
      <div className="space-y-8 text-[14px] sm:text-[15px] leading-relaxed text-white/80 font-light">
        {/* Current Situation */}
        <div className="space-y-2">
          <h4 className="text-[#c5a059] text-[12px] tracking-[0.2em] uppercase font-medium flex items-center gap-2">
            <span>✦</span> {t.situation}
          </h4>
          <p className="pl-4 border-l border-[#c5a059]/20 text-white/90">
            {currentSituation}
          </p>
        </div>

        {/* Possibility */}
        <div className="space-y-2">
          <h4 className="text-[#c5a059] text-[12px] tracking-[0.2em] uppercase font-medium flex items-center gap-2">
            <span>✦</span> {t.possibility}
          </h4>
          <p className="pl-4 border-l border-[#c5a059]/20 text-white/90">
            {possibility}
          </p>
        </div>

        {/* Signals */}
        <div className="space-y-2">
          <h4 className="text-[#c5a059] text-[12px] tracking-[0.2em] uppercase font-medium flex items-center gap-2">
            <span>✦</span> {t.signals}
          </h4>
          <p className="pl-4 border-l border-[#c5a059]/20 text-white/90">
            {signals}
          </p>
        </div>

        {/* Action */}
        <div className="space-y-2">
          <h4 className="text-[#c5a059] text-[12px] tracking-[0.2em] uppercase font-medium flex items-center gap-2">
            <span>✦</span> {t.action}
          </h4>
          <p className="pl-4 border-l border-[#c5a059]/20 text-white/90">
            {action}
          </p>
        </div>
      </div>

      {/* Closing Message Banner */}
      <div className="p-6 rounded-xl border border-[#c5a059]/30 bg-[#c5a059]/[0.03] text-center my-8">
        <span className="text-[#c5a059] text-[11px] tracking-[0.25em] uppercase font-medium block mb-2">
          {t.closingTitle}
        </span>
        <p className="text-white text-[15px] sm:text-[16px] italic font-light">
          "{talismanMessage}"
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-white/35 text-[11px] leading-relaxed text-center my-6 font-light">
        {disclaimer}
      </p>

      {/* Action Buttons: Draw Again & Start Over */}
      <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={onDrawAgain}
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all duration-300 text-[12px] tracking-[0.2em] uppercase font-medium text-center cursor-pointer"
        >
          {t.drawAgain}
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 bg-transparent text-white/60 hover:border-white/40 hover:text-white transition-all duration-300 text-[12px] tracking-[0.2em] uppercase font-medium text-center cursor-pointer"
        >
          {t.startOver}
        </button>
      </div>

      {/* Optional Premium Preview Options Section (After Free Result Complete) */}
      <div className="mt-10 pt-8 border-t border-white/10">
        <div className="text-center mb-6">
          <span className="text-[#c5a059] text-[11px] tracking-[0.25em] uppercase font-medium block mb-1">
            {preview.eyebrow}
          </span>
          <h4 className="text-white text-[18px] sm:text-[20px] font-light mb-2">
            {preview.headline}
          </h4>
          <p className="text-white/50 text-[12px] sm:text-[13px] font-light max-w-lg mx-auto">
            {preview.body}
          </p>
        </div>

        {/* 3 Premium Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          {/* Item 1: Deep Reading */}
          <div className="p-4 rounded-xl border border-[#c5a059]/40 bg-[#c5a059]/[0.03] flex flex-col justify-between text-left hover:border-[#c5a059] transition-colors duration-300 shadow-[0_0_20px_rgba(197,160,89,0.08)]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#c5a059] text-[14px]">✦</span>
                <span className="text-[10px] text-[#c5a059] border border-[#c5a059]/40 px-2 py-0.5 rounded font-mono uppercase">
                  {preview.statusBadge}
                </span>
              </div>
              <h5 className="text-white text-[13px] font-medium mb-1">
                {preview.items.deepReading.title}
              </h5>
              <p className="text-white/60 text-[11px] font-light leading-relaxed">
                {preview.items.deepReading.desc}
              </p>
              <p className="text-[#c5a059] text-[14px] font-medium mt-3">
                {formatProductPrice(language, 'deep_reading')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#c5a059]/20 text-right">
              <button
                type="button"
                onClick={onStartPremiumReading}
                className="text-[#c5a059] text-[11px] sm:text-[12px] font-medium hover:underline cursor-pointer flex items-center justify-end gap-1 ml-auto"
              >
                {preview.items.deepReading.cta} <span>→</span>
              </button>
            </div>
          </div>

          {/* Item 2: Lucky Numbers */}
          <div className="p-4 rounded-xl border border-[#c5a059]/40 bg-[#c5a059]/[0.03] flex flex-col justify-between text-left hover:border-[#c5a059] transition-colors duration-300 shadow-[0_0_20px_rgba(197,160,89,0.08)]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#c5a059] text-[14px]">✦</span>
                <span className="text-[10px] text-[#c5a059] border border-[#c5a059]/40 px-2 py-0.5 rounded font-mono uppercase">
                  {preview.statusBadge}
                </span>
              </div>
              <h5 className="text-white text-[13px] font-medium mb-1">
                {preview.items.luckyNumbers.title}
              </h5>
              <p className="text-white/60 text-[11px] font-light leading-relaxed">
                {preview.items.luckyNumbers.desc}
              </p>
              <p className="text-[#c5a059] text-[14px] font-medium mt-3">
                {formatProductPrice(language, 'lucky_numbers')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#c5a059]/20 text-right">
              <button
                type="button"
                onClick={onStartSymbolicNumbers}
                className="text-[#c5a059] text-[11px] sm:text-[12px] font-medium hover:underline cursor-pointer flex items-center justify-end gap-1 ml-auto"
              >
                {preview.items.luckyNumbers.cta} <span>→</span>
              </button>
            </div>
          </div>

          {/* Item 3: Digital Talisman */}
          <div className="p-4 rounded-xl border border-[#c5a059]/40 bg-[#c5a059]/[0.03] flex flex-col justify-between text-left hover:border-[#c5a059] transition-colors duration-300 shadow-[0_0_20px_rgba(197,160,89,0.08)]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#c5a059] text-[14px]">✦</span>
                <span className="text-[10px] text-[#c5a059] border border-[#c5a059]/40 px-2 py-0.5 rounded font-mono uppercase">
                  {preview.statusBadge}
                </span>
              </div>
              <h5 className="text-white text-[13px] font-medium mb-1">
                {preview.items.digitalTalisman.title}
              </h5>
              <p className="text-white/60 text-[11px] font-light leading-relaxed">
                {preview.items.digitalTalisman.desc}
              </p>
              <p className="text-[#c5a059] text-[14px] font-medium mt-3">
                {formatProductPrice(language, 'digital_talisman')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#c5a059]/20 text-right">
              <button
                type="button"
                onClick={onStartDigitalTalisman}
                className="text-[#c5a059] text-[11px] sm:text-[12px] font-medium hover:underline cursor-pointer flex items-center justify-end gap-1 ml-auto"
              >
                {preview.items.digitalTalisman.cta} <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
