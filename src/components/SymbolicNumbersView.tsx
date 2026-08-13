import { Language, SymbolicNumberResult } from '../types/reading';

interface SymbolicNumbersViewProps {
  language: Language;
  result: SymbolicNumberResult;
  hasPremiumCards?: boolean;
  onBackToReading: () => void;
  onStartOver: () => void;
}

export function SymbolicNumbersView({
  language,
  result,
  hasPremiumCards = false,
  onBackToReading,
  onStartOver,
}: SymbolicNumbersViewProps) {
  const isKo = language === 'ko';
  const numbers = result.numberSet.mainNumbers;

  // Zero-padded two digit helper (e.g. 3 -> "03", 17 -> "17")
  const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-6 sm:p-10 rounded-2xl border border-[#c5a059]/40 bg-gradient-to-b from-[#11121a]/95 via-[#08090f]/95 to-[#040406]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(197,160,89,0.15)] text-center">
      {/* ── TOP EYEBROW & BADGE ── */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/[0.06] mb-4">
          <span className="text-[#c5a059] text-[11px]">✦</span>
          <span className="text-[#c5a059] text-[11px] sm:text-[12px] tracking-[0.25em] uppercase font-medium">
            {isKo ? '나만의 행운 숫자' : 'SYMBOLIC LUCKY NUMBERS'}
          </span>
        </div>
        <h2 className="text-white text-[24px] sm:text-[32px] font-light leading-snug tracking-[-0.01em] mb-3">
          {isKo ? '오늘의 이야기에 담긴 여섯 숫자' : 'SIX NUMBERS FROM YOUR STORY'}
        </h2>
        <p className="text-white/60 text-[13px] sm:text-[15px] leading-relaxed max-w-md mx-auto font-light">
          {isKo
            ? '당신이 적은 이야기와 선택한 카드의 상징을 바탕으로 만든 숫자입니다. 가볍게 즐기는 엔터테인먼트용 기능입니다.'
            : 'A symbolic set of numbers inspired by the story you shared and the cards you selected. For entertainment use only.'}
        </p>
      </div>

      {/* ── CONTEXT SOURCE BADGE ── */}
      <div className="mb-10 inline-block px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02]">
        <p className="text-white/70 text-[12px] font-light">
          ✦{' '}
          {hasPremiumCards
            ? isKo
              ? '세 장의 카드와 당신의 이야기를 바탕으로 구성했습니다.'
              : 'Built from your story and three-card spread.'
            : isKo
            ? '당신의 이야기와 선택한 카드를 바탕으로 구성했습니다.'
            : 'Built from your story and selected card.'}
        </p>
      </div>

      {/* ── 6 CIRCULAR NUMBER TOKENS (ARCANA DESIGN) ── */}
      <div className="my-10 max-w-xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 justify-items-center">
          {numbers.map((num, idx) => (
            <div
              key={`${num}-${idx}`}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#c5a059]/60 bg-gradient-to-b from-[#c5a059]/20 via-[#c5a059]/5 to-transparent flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-transform duration-300 hover:scale-105"
              style={{
                animationDelay: `${idx * 120}ms`,
              }}
            >
              <span
                className="text-white text-[20px] sm:text-[24px] font-mono font-medium tracking-widest"
                aria-label={isKo ? `숫자 ${num}` : `Number ${num}`}
              >
                {formatNumber(num)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── EXPLANATION BANNER ── */}
      <div className="my-8 p-5 rounded-xl border border-white/10 bg-white/[0.02] max-w-lg mx-auto text-left">
        <span className="text-[#c5a059] text-[11px] tracking-[0.2em] uppercase font-medium block mb-1.5">
          ✦ {isKo ? '이 숫자에 담긴 상징' : 'SYMBOLIC NATURE'}
        </span>
        <p className="text-white/80 text-[13px] leading-relaxed font-light">
          {isKo
            ? '이 숫자들은 미래 결과를 예측하는 값이 아니라, 당신의 입력과 카드 선택을 하나의 상징적인 숫자 세트로 변환한 결과입니다.'
            : 'These numbers do not predict future outcomes. They are a symbolic transformation of your input and card choices.'}
        </p>
      </div>

      {/* ── RESPONSIBLE DISCLAIMER ── */}
      <div className="my-6 max-w-lg mx-auto">
        <p className="text-white/35 text-[11px] leading-relaxed font-light">
          {isKo ? result.disclaimerKo : result.disclaimerEn}
        </p>
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={onBackToReading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all duration-300 text-[12px] tracking-[0.2em] uppercase font-medium cursor-pointer"
        >
          {isKo ? '리딩으로 돌아가기' : 'BACK TO MY READING'}
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/20 bg-transparent text-white/60 hover:border-white/40 hover:text-white transition-all duration-300 text-[12px] tracking-[0.2em] uppercase font-medium cursor-pointer"
        >
          {isKo ? '처음부터 다시' : 'START OVER'}
        </button>
      </div>
    </div>
  );
}
