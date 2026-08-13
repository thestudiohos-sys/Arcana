import { Language, TarotCardData } from '../types/reading';

interface TarotCardProps {
  card: TarotCardData;
  isSelected: boolean;
  isFlipped: boolean;
  isDisabled: boolean;
  onSelect: (id: TarotCardData['id']) => void;
  language?: Language;
  className?: string;
}

export function TarotCard({
  card,
  isSelected,
  isFlipped,
  isDisabled,
  onSelect,
  language = 'en',
  className = '',
}: TarotCardProps) {
  const cardName = language === 'ko' && card.nameKo ? card.nameKo : card.name;
  const cardSubtitle = language === 'ko' && card.subtitleKo ? card.subtitleKo : card.subtitle;
  const cardDesc = language === 'ko' && card.descriptionKo ? card.descriptionKo : card.description;

  return (
    <button
      type="button"
      onClick={() => onSelect(card.id)}
      aria-label={`Select ${card.name} tarot card`}
      disabled={isDisabled}
      className={`group relative w-full aspect-[2/3] max-w-[200px] sm:max-w-[220px] mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] rounded-xl transition-all duration-500 ${
        isDisabled ? 'opacity-40 cursor-not-allowed scale-95' : 'cursor-pointer hover:-translate-y-1'
      } ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`w-full h-full relative rounded-xl transition-transform duration-700 shadow-2xl ${
          isSelected ? 'shadow-[0_0_30px_rgba(197,160,89,0.25)] border-[#c5a059]' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── CARD BACK ── */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl border border-[#c5a059]/30 bg-gradient-to-b from-[#0e1017] via-[#050608] to-[#0a0b10] p-4 flex flex-col items-center justify-between overflow-hidden shadow-inner group-hover:border-[#c5a059]/60 transition-colors duration-300"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Decorative Corner Ornaments */}
          <div className="w-full flex justify-between text-[#c5a059]/40 text-[10px]">
            <span>✦</span>
            <span>✦</span>
          </div>

          {/* Centered Arcana Seal */}
          <div className="my-auto flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#c5a059]/30 flex items-center justify-center bg-[#c5a059]/[0.03] text-[#c5a059]/70 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" opacity="0.4" />
                <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
              </svg>
            </div>
            <span className="text-[#c5a059]/50 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-light">
              ARCANA
            </span>
          </div>

          {/* Bottom Ornaments */}
          <div className="w-full flex justify-between text-[#c5a059]/40 text-[10px]">
            <span>✦</span>
            <span>✦</span>
          </div>
        </div>

        {/* ── CARD FRONT (REVEALED) ── */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl border border-[#c5a059] bg-gradient-to-b from-[#16141a] via-[#0c0a10] to-[#070609] p-3 sm:p-5 flex flex-col items-center justify-between text-center overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Top Symbol */}
          <div className="text-[#c5a059] text-[16px] sm:text-[18px] tracking-widest pt-1">
            {card.symbol}
          </div>

          {/* Center Card Title & Subtitle */}
          <div className="my-auto flex flex-col items-center gap-1 sm:gap-2">
            <h4 className="text-white text-[14px] sm:text-[17px] font-light tracking-[0.1em] uppercase">
              {cardName}
            </h4>
            <div className="w-6 sm:w-8 h-[1px] bg-[#c5a059]/40 my-0.5 sm:my-1" />
            <p className="text-[#c5a059]/80 text-[10px] sm:text-[12px] tracking-wider uppercase font-light">
              {cardSubtitle}
            </p>
            <p className="text-white/50 text-[10px] sm:text-[11px] leading-tight sm:leading-relaxed font-light mt-1 sm:mt-2 line-clamp-3">
              {cardDesc}
            </p>
          </div>

          {/* Bottom Symbol */}
          <div className="text-[#c5a059]/50 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase pb-1">
            ARCANA DECK
          </div>
        </div>
      </div>
    </button>
  );
}
