import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Language } from '../types/reading';
import { DICTIONARY } from '../config/dictionary';
import { PREMIUM_TAROT_CARDS_I18N } from '../config/tarotCards';
import { findCardByAppId } from '../content/cardLibrary';
import { cardMeaningUrl } from '../content/cardPages';
import {
  DailyCardState,
  EMPTY_DAILY_CARD_STATE,
  drawDailyCard,
  hasDrawnToday,
  loadDailyCardState,
  localDateKey,
  saveDailyCardState,
} from '../services/dailyCard';

interface DailyCardSectionProps {
  language: Language;
}

function getStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * "Today's card": one card per day, drawn by the viewer, stored only on this
 * device. A soft reflection count replaces streaks, so skipping a day is fine.
 */
export function DailyCardSection({ language }: DailyCardSectionProps) {
  const t = DICTIONARY[language].dailyCard;
  const cards = PREMIUM_TAROT_CARDS_I18N[language];
  const [state, setState] = useState<DailyCardState>(EMPTY_DAILY_CARD_STATE);
  const [today, setToday] = useState(() => localDateKey(new Date()));

  useEffect(() => {
    setState(loadDailyCardState(getStorage()));
    // Pick up a new day if the tab stays open past midnight.
    const onFocus = () => setToday(localDateKey(new Date()));
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const drawn = hasDrawnToday(state, today);
  const card = drawn ? cards.find((c) => c.id === state.cardId) : undefined;
  const keyword = card?.keywords?.[0] ?? '';
  const libraryEntry = card ? findCardByAppId(card.id) : undefined;

  const handleDraw = () => {
    const next = drawDailyCard(state, today, cards.map((c) => c.id));
    setState(next);
    saveDailyCardState(getStorage(), next);
  };

  const goToReading = () => {
    document.getElementById('reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="daily" className="bg-black py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-[#c5a059]/75 text-[12px] sm:text-[14px] tracking-[0.25em] uppercase mb-4 font-medium">
          {t.eyebrow}
        </p>
        <h2
          className="text-white font-light leading-[1.2] tracking-[-0.02em] mb-4"
          style={{ fontSize: 'clamp(26px, 5vw, 44px)' }}
        >
          {t.heading}
        </h2>
        <p className="text-white/60 text-[14px] sm:text-[16px] leading-relaxed font-light mb-10">
          {t.description}
        </p>

        <AnimatePresence mode="wait">
          {!card ? (
            <motion.div
              key="facedown"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center"
            >
              <button
                type="button"
                onClick={handleDraw}
                aria-label={t.drawCta}
                className="w-40 sm:w-44 aspect-[2/3] rounded-xl border border-[#c5a059]/50 bg-gradient-to-b from-[#16140f] to-black flex flex-col items-center justify-center gap-3 shadow-[0_0_40px_rgba(197,160,89,0.15)] hover:border-[#c5a059] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <span className="text-[#c5a059] text-[28px]">✦</span>
                <span className="text-[#c5a059]/60 text-[10px] tracking-[0.3em] uppercase">ARCANA</span>
              </button>
              <button
                type="button"
                onClick={handleDraw}
                className="mt-8 px-7 py-3 rounded-full border border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all duration-300 text-[12px] tracking-[0.2em] uppercase font-medium cursor-pointer"
              >
                {t.drawCta}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`card-${card.id}`}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-40 sm:w-44 aspect-[2/3] rounded-xl border border-[#c5a059] bg-gradient-to-b from-[#1a1710] to-black flex flex-col items-center justify-center px-3 shadow-[0_0_40px_rgba(197,160,89,0.2)]">
                <span className="text-[#c5a059] text-[34px] mb-3">{card.symbol}</span>
                <span className="text-white text-[14px] tracking-wider uppercase">
                  {language === 'ko' && card.nameKo ? card.nameKo : card.name}
                </span>
                <span className="text-[#c5a059]/70 text-[10px] tracking-widest uppercase mt-1">
                  {card.subtitle}
                </span>
              </div>

              <p className="text-white/85 text-[15px] sm:text-[16px] font-light leading-relaxed mt-8">
                {card.description}
              </p>
              {keyword && (
                <p className="text-[#c5a059]/90 text-[13px] sm:text-[14px] font-light leading-relaxed mt-4">
                  ✦ {t.reflectionPrompt.replace('{{keyword}}', keyword)}
                </p>
              )}

              {libraryEntry && (
                <a
                  href={cardMeaningUrl(language, libraryEntry.slug)}
                  className="mt-4 text-white/60 hover:text-[#c5a059] text-[12px] underline underline-offset-4 decoration-white/20"
                >
                  {t.meaningLink} →
                </a>
              )}

              <button
                type="button"
                onClick={goToReading}
                className="mt-8 px-7 py-3 rounded-full border border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all duration-300 text-[12px] tracking-[0.2em] uppercase font-medium cursor-pointer"
              >
                {t.continueCta}
              </button>
              <p className="text-white/40 text-[12px] font-light mt-4">{t.comeBack}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {state.reflectionCount > 0 && (
          <p className="text-white/50 text-[12px] font-light mt-10">
            {t.reflectionCount.replace('{{count}}', String(state.reflectionCount))}
          </p>
        )}
        <p className="text-white/30 text-[11px] font-light mt-2">{t.privacyNote}</p>
      </div>
    </section>
  );
}
