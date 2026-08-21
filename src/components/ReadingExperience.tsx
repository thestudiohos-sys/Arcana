import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard } from './TarotCard';
import { ReadingResultView } from './ReadingResultView';
import { SymbolicNumbersView } from './SymbolicNumbersView';
import { DigitalTalismanView } from './DigitalTalismanView';
import { FREE_TAROT_CARDS_I18N, PREMIUM_TAROT_CARDS_I18N } from '../config/tarotCards';
import { EntryType, TarotCardData, ReadingResult, Language, RitualType, PremiumReadingResult, SymbolicNumberResult, DigitalTalismanResult } from '../types/reading';
import { generateMockReading } from '../services/mockReadingService';
import { generateMockPremiumReading } from '../services/mockPremiumReadingService';
import { generateSymbolicNumbers } from '../services/symbolicNumberService';
import { generateDigitalTalismanOptions } from '../services/digitalTalismanService';
import {
  READING_PROVIDER,
  fetchFreeReadingApi,
  fetchPremiumReadingApi,
  fetchSymbolicNumbersApi,
  fetchDigitalTalismanOptionsApi,
} from '../services/arcanaApi';
import { determineRitualType } from '../services/ritualDeterminer';
import { DICTIONARY } from '../config/dictionary';
import { trackProductFunnel } from '../services/purchaseIntentAnalytics';
import { ReadingAnalyticsCycle } from '../services/readingAnalyticsCycle';

export type ExperienceViewMode = 'free' | 'premium' | 'symbolicNumbers' | 'digitalTalisman';

// Premium Reading Result Component
interface PremiumReadingResultViewProps {
  language: Language;
  result: PremiumReadingResult;
  onReSelectThreeCards: () => void;
  onStartOver: () => void;
  onStartSymbolicNumbers?: () => void;
}

function PremiumReadingResultView({
  language,
  result,
  onReSelectThreeCards,
  onStartOver,
}: PremiumReadingResultViewProps) {
  const isKo = language === 'ko';
  const {
    cards,
    connectionHeadline,
    cardConnection,
    deepReadingHeadline,
    deepReadingParagraphs,
    emotionalPattern,
    watchFor,
    actions,
    closingMessage,
    disclaimer,
  } = result;

  const pDict = DICTIONARY[language].premiumExperience.resultView;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-3xl mx-auto mt-8 p-6 sm:p-10 rounded-2xl border border-[#c5a059]/40 bg-gradient-to-b from-[#11121a]/95 via-[#08090f]/95 to-[#040406]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(197,160,89,0.15)] text-left"
    >
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#c5a059] text-[11px]">✦✦✦</span>
            <span className="text-[#c5a059] text-[11px] sm:text-[12px] tracking-[0.25em] uppercase font-medium">
              {pDict.eyebrow}
            </span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/[0.05] text-[#c5a059] text-[11px] tracking-wider uppercase font-medium">
          {pDict.badge}
        </div>
      </div>

      {/* ── 3-CARD VISUAL SPREAD HEADER ── */}
      <div className="mb-10">
        <h4 className="text-[#c5a059] text-[11px] tracking-[0.25em] uppercase font-medium mb-4 text-center sm:text-left">
          ✦ {pDict.cardsHeadline}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((item) => (
            <div
              key={item.role}
              className="p-4 rounded-xl border border-[#c5a059]/30 bg-[#c5a059]/[0.04] flex flex-col justify-between"
            >
              <div>
                <span className="text-[#c5a059] text-[10px] tracking-[0.2em] uppercase font-medium block mb-1">
                  {item.roleTitle}
                </span>
                <div className="flex items-center gap-2 my-1">
                  <span className="text-[#c5a059] text-[16px]">{item.card.symbol}</span>
                  <span className="text-white text-[15px] font-medium tracking-wide">
                    {isKo && item.card.nameKo ? item.card.nameKo : item.card.name}
                  </span>
                </div>
                <span className="text-[#c5a059]/80 text-[11px] font-light block mb-2">
                  {isKo && item.card.subtitleKo ? item.card.subtitleKo : item.card.subtitle}
                </span>
              </div>
              <p className="text-white/60 text-[11px] font-light italic border-t border-white/10 pt-2 mt-2">
                "{item.headline}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── INDIVIDUAL CARD INTERPRETATIONS ── */}
      <div className="space-y-6 mb-10 border-b border-white/10 pb-10">
        <h4 className="text-[#c5a059] text-[11px] tracking-[0.25em] uppercase font-medium mb-2">
          ✦ {pDict.rolesHeadline}
        </h4>
        {cards.map((item) => (
          <div
            key={item.role}
            className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[#c5a059] text-[12px] tracking-[0.2em] uppercase font-medium">
                {item.roleTitle}
              </span>
              <span className="text-white/40 text-[12px] font-mono">
                {item.card.name}
              </span>
            </div>
            <h5 className="text-white text-[16px] font-light leading-snug">
              "{item.headline}"
            </h5>
            <p className="text-white/80 text-[14px] leading-relaxed font-light pl-3 border-l-2 border-[#c5a059]/40">
              {item.interpretation}
            </p>
          </div>
        ))}
      </div>

      {/* ── CARD CONNECTION NARRATIVE (CORE VALUE) ── */}
      <div className="my-10 p-6 rounded-xl border border-[#c5a059]/40 bg-gradient-to-r from-[#c5a059]/[0.08] via-transparent to-[#c5a059]/[0.05] relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#c5a059] text-[14px]">✦</span>
          <span className="text-[#c5a059] text-[12px] tracking-[0.25em] uppercase font-medium">
            {isKo ? '세 카드가 이어지는 이야기' : 'HOW THE THREE CARDS CONNECT'}
          </span>
        </div>
        <h3 className="text-white text-[18px] sm:text-[20px] font-light mb-4 leading-snug">
          "{connectionHeadline}"
        </h3>
        <p className="text-white/90 text-[14px] sm:text-[15px] leading-relaxed font-light">
          {cardConnection}
        </p>
      </div>

      {/* ── MULTI-PARAGRAPH DEEP READING ── */}
      <div className="my-10 space-y-4 border-b border-white/10 pb-10">
        <h4 className="text-[#c5a059] text-[11px] tracking-[0.25em] uppercase font-medium mb-3">
          ✦ {deepReadingHeadline}
        </h4>
        <div className="space-y-4 text-white/85 text-[14px] sm:text-[15px] leading-relaxed font-light">
          {deepReadingParagraphs.map((para, idx) => (
            <p key={idx} className="bg-white/[0.015] p-4 rounded-xl border border-white/5">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* ── INSIGHT CARDS: EMOTIONAL PATTERN & WATCH FOR ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
        {emotionalPattern && (
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
            <span className="text-[#c5a059] text-[11px] tracking-[0.2em] uppercase font-medium block mb-2">
              ✦ {isKo ? '반복되는 마음의 패턴' : 'PATTERN WORTH NOTICING'}
            </span>
            <p className="text-white/80 text-[13px] sm:text-[14px] leading-relaxed font-light">
              {emotionalPattern}
            </p>
          </div>
        )}
        {watchFor && (
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
            <span className="text-[#c5a059] text-[11px] tracking-[0.2em] uppercase font-medium block mb-2">
              ✦ {isKo ? '지금 눈여겨볼 부분' : 'WHAT TO WATCH FOR'}
            </span>
            <p className="text-white/80 text-[13px] sm:text-[14px] leading-relaxed font-light">
              {watchFor}
            </p>
          </div>
        )}
      </div>

      {/* ── 3 PRACTICAL REAL-WORLD ACTIONS ── */}
      <div className="my-10 p-6 rounded-xl border border-[#c5a059]/30 bg-[#c5a059]/[0.03]">
        <h4 className="text-[#c5a059] text-[11px] tracking-[0.25em] uppercase font-medium mb-4 text-center sm:text-left">
          ✦ {pDict.actionsHeadline}
        </h4>
        <ol className="space-y-3 text-left">
          {actions.map((act, idx) => (
            <li key={idx} className="flex items-start gap-3 text-white/90 text-[13px] sm:text-[14px] font-light leading-relaxed">
              <span className="w-5 h-5 rounded-full border border-[#c5a059]/60 text-[#c5a059] text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">
                {idx + 1}
              </span>
              <span>{act}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── CLOSING MESSAGE BANNER ── */}
      <div className="p-6 rounded-xl border border-[#c5a059]/40 bg-[#c5a059]/[0.05] text-center my-8 shadow-[0_0_30px_rgba(197,160,89,0.1)]">
        <span className="text-[#c5a059] text-[11px] tracking-[0.25em] uppercase font-medium block mb-2">
          {isKo ? '오늘 마음에 가져갈 한 문장' : 'MESSAGE TO CARRY FORWARD'}
        </span>
        <p className="text-white text-[16px] sm:text-[17px] italic font-light">
          "{closingMessage}"
        </p>
      </div>

      {/* ── DISCLAIMER ── */}
      <p className="text-white/35 text-[11px] leading-relaxed text-center my-6 font-light">
        {disclaimer}
      </p>

      {/* ── ACTION BUTTONS ── */}
      <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={onReSelectThreeCards}
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all duration-300 text-[12px] tracking-[0.2em] uppercase font-medium text-center cursor-pointer"
        >
          {pDict.reSelectThreeCta}
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#ffffff]/20 bg-transparent text-white/60 hover:border-white/40 hover:text-white transition-all duration-300 text-[12px] tracking-[0.2em] uppercase font-medium text-center cursor-pointer"
        >
          {isKo ? '처음부터 다시' : 'START OVER'}
        </button>
      </div>
    </motion.div>
  );
}

// Inline Premium 3-card sequential selection & result view
interface PremiumReadingViewProps {
  language: Language;
  selectedEntryType: EntryType | null;
  storyText: string;
  ritualType: RitualType;
  onReturnToFree: () => void;
}

function PremiumReadingView({
  language,
  selectedEntryType,
  storyText,
  ritualType,
  onReturnToFree,
}: PremiumReadingViewProps) {
  // 3-card selection state
  const [selectedCards, setSelectedCards] = useState<TarotCardData[]>([]);
  const [flippedCardId, setFlippedCardId] = useState<TarotCardData['id'] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [premiumResult, setPremiumResult] = useState<import('../types/reading').PremiumReadingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dict = DICTIONARY[language].premiumExperience;
  const tarotCards = PREMIUM_TAROT_CARDS_I18N[language] || PREMIUM_TAROT_CARDS_I18N.en;

  const currentStepIndex = selectedCards.length; // 0, 1, 2, or 3
  const isComplete = currentStepIndex === 3;
  const currentStepConfig = dict.steps[Math.min(currentStepIndex, 2)];

  // Automatically regenerate premium result when language switches if a result exists
  useEffect(() => {
    if (selectedCards.length === 3 && premiumResult) {
      generateMockPremiumReading({
        language,
        entryType: selectedEntryType || 'CUSTOM',
        storyText,
        ritualType,
        cards: selectedCards as [TarotCardData, TarotCardData, TarotCardData],
      }).then((newRes: import('../types/reading').PremiumReadingResult) => {
        setPremiumResult(newRes);
      });
    }
  }, [language]);

  // Select card for current step
  const handleCardClick = (cardId: TarotCardData['id']) => {
    if (isProcessing || isComplete || premiumResult) return;

    if (selectedCards.some((c) => c.id === cardId)) return;

    const chosenCard = tarotCards.find((c) => c.id === cardId);
    if (!chosenCard) return;

    setIsProcessing(true);
    setFlippedCardId(cardId);

    setTimeout(() => {
      setSelectedCards((prev) => [...prev, chosenCard]);
      setFlippedCardId(null);
      setIsProcessing(false);
    }, 750);
  };

  // Back step handler
  const handleStepBack = () => {
    if (selectedCards.length === 0 || isProcessing) return;
    setSelectedCards((prev) => prev.slice(0, prev.length - 1));
    setPremiumResult(null);
  };

  // Reset deck
  const handleResetDeck = () => {
    setSelectedCards([]);
    setFlippedCardId(null);
    setPremiumResult(null);
  };

  // Trigger Mock Premium Reading Generation
  const handleGenerateReading = async () => {
    if (selectedCards.length !== 3 || isLoadingResult) return;

    setIsLoadingResult(true);
    setErrorMessage(null);
    try {
      let result: import('../types/reading').PremiumReadingResult;
      if (READING_PROVIDER === 'api') {
        result = await fetchPremiumReadingApi({
          language,
          entryType: selectedEntryType || 'CUSTOM',
          storyText,
          ritualType,
          cardIds: selectedCards.map((c) => c.id),
        });
      } else {
        result = await generateMockPremiumReading({
          language,
          entryType: selectedEntryType || 'CUSTOM',
          storyText,
          ritualType,
          cards: selectedCards as [TarotCardData, TarotCardData, TarotCardData],
        });
      }
      setPremiumResult(result);
    } catch (err: any) {
      console.error('Error generating premium reading:', err);
      setErrorMessage(language === 'ko'
        ? '3장 심층 리딩을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
        : "We couldn't load your 3-card deep reading right now.");
    } finally {
      setIsLoadingResult(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl mx-auto pt-6 pb-16 px-4 text-center"
    >
      {/* Premium Header */}
      {!premiumResult && (
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/[0.06] mb-4">
            <span className="text-[#c5a059] text-[11px]">✦✦✦</span>
            <span className="text-[#c5a059] text-[11px] tracking-[0.2em] uppercase font-medium">
              {dict.eyebrow}
            </span>
          </div>
          <h2
            className="text-white font-light leading-snug tracking-[-0.01em] mb-4 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
          >
            {dict.headline}
          </h2>
          <p className="text-white/60 text-[14px] sm:text-[16px] leading-relaxed max-w-xl mx-auto font-light">
            {dict.subhead}
          </p>
        </div>
      )}

      {/* Retained Story Context Badge */}
      {storyText && !premiumResult && (
        <div className="mb-10 max-w-xl mx-auto p-4 rounded-xl border border-white/10 bg-white/[0.02] text-left backdrop-blur-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[#c5a059] text-[10px] tracking-[0.2em] uppercase font-medium">
              {dict.contextSummaryTitle}
            </span>
            <span className="text-white/40 text-[10px] uppercase font-mono">
              {selectedEntryType ? ((DICTIONARY[language].reading.topics as Record<string, string>)[selectedEntryType] || selectedEntryType) : ''}
            </span>
          </div>
          <p className="text-white/80 text-[13px] font-light line-clamp-2 italic">
            "{storyText}"
          </p>
        </div>
      )}

      {/* ── 3 SELECTED CARD SLOTS BAR ── */}
      {!premiumResult && (
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {dict.steps.map((step, idx) => {
              const selectedCardData = selectedCards[idx];
              const isCurrentStepSlot = currentStepIndex === idx;

              return (
                <div
                  key={step.stepNumber}
                  className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[160px] text-left relative overflow-hidden ${selectedCardData
                      ? 'border-[#c5a059] bg-[#c5a059]/[0.05] shadow-[0_0_20px_rgba(197,160,89,0.15)]'
                      : isCurrentStepSlot
                        ? 'border-[#c5a059]/60 bg-white/[0.03] ring-1 ring-[#c5a059]/30'
                        : 'border-white/10 bg-white/[0.01] opacity-60'
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#c5a059] text-[11px] tracking-[0.2em] uppercase font-medium">
                        {language === 'ko' ? `카드 ${step.stepNumber}` : `CARD ${step.stepNumber}`}
                      </span>
                      {selectedCardData && (
                        <span className="text-[#c5a059] text-[12px]">✦</span>
                      )}
                    </div>
                    <h4 className="text-white text-[15px] font-medium mb-1">
                      {step.roleName}
                    </h4>
                    <p className="text-white/50 text-[11px] font-light leading-relaxed mb-3">
                      {step.description}
                    </p>
                  </div>

                  {/* Slot Content */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    {selectedCardData ? (
                      <div>
                        <span className="text-white text-[13px] font-normal tracking-wide block">
                          {language === 'ko' && selectedCardData.nameKo ? selectedCardData.nameKo : selectedCardData.name}
                        </span>
                        <span className="text-[#c5a059]/80 text-[10px] tracking-wider uppercase font-light">
                          {language === 'ko' && selectedCardData.subtitleKo ? selectedCardData.subtitleKo : selectedCardData.subtitle}
                        </span>
                      </div>
                    ) : (
                      <span className="text-white/30 text-[11px] font-light italic">
                        {isCurrentStepSlot ? `← ${dict.choosePrompt.replace('{{role}}', step.roleName)}` : language === 'ko' ? '아직 선택하지 않았습니다' : 'Empty Slot'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROGRESS INDICATOR & STEP BACK ACTION ── */}
      {!isComplete && !premiumResult && (
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto border-b border-white/10 pb-4 px-2">
          {/* Muted Gold Progress Dots Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-[#c5a059] text-[12px] tracking-[0.2em] uppercase font-medium">
              {dict.progressText.replace('{{step}}', String(currentStepIndex + 1))}
            </span>
            <div className="flex gap-1.5 items-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${i < currentStepIndex
                      ? 'w-6 bg-[#c5a059]'
                      : i === currentStepIndex
                        ? 'w-6 bg-[#c5a059]/60 animate-pulse'
                        : 'w-2 bg-white/20'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Current Step Focus Label */}
          <div className="text-center sm:text-right">
            <p className="text-white/80 text-[13px] font-light">
              <span className="text-[#c5a059] font-medium">{currentStepConfig.roleName}</span>: {currentStepConfig.description}
            </p>
          </div>

          {/* Step Back Button */}
          {selectedCards.length > 0 && (
            <button
              type="button"
              onClick={handleStepBack}
              disabled={isProcessing}
              className="text-[#c5a059]/80 hover:text-[#c5a059] text-[12px] tracking-wider transition-colors cursor-pointer underline underline-offset-4 disabled:opacity-40"
            >
              ← {dict.backCta}
            </button>
          )}
        </div>
      )}

      {/* ── 13 TAROT CARD DECK GRID ── */}
      {!isComplete && !premiumResult && (
        <div className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4 items-center justify-center max-w-4xl mx-auto">
            {tarotCards.map((card) => {
              const isSelectedInDeck = selectedCards.some((c) => c.id === card.id);
              const isFlippedNow = flippedCardId === card.id;

              return (
                <div key={card.id} className="w-full">
                  <TarotCard
                    card={card}
                    isSelected={isSelectedInDeck || isFlippedNow}
                    isFlipped={isSelectedInDeck || isFlippedNow}
                    isDisabled={isSelectedInDeck || isProcessing}
                    onSelect={handleCardClick}
                    language={language}
                  />
                  <div className="mt-1 text-center">
                    <span
                      className={`text-[10px] tracking-tight block truncate ${isSelectedInDeck
                          ? 'text-[#c5a059] font-medium'
                          : 'text-white/40 font-light'
                        }`}
                    >
                      {language === 'ko' && card.nameKo ? card.nameKo : card.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3 CARDS COMPLETED REVEALED STATE / TRIGGER READING ── */}
      {isComplete && !premiumResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-2xl border border-[#c5a059]/40 bg-gradient-to-b from-[#121018]/90 via-[#0a0810]/95 to-black/95 backdrop-blur-xl shadow-[0_0_50px_rgba(197,160,89,0.15)] text-center my-8 max-w-3xl mx-auto"
        >
          <div className="inline-block text-[#c5a059] text-2xl mb-3">✦ ✦ ✦</div>
          <h3 className="text-white text-[22px] sm:text-[26px] font-light leading-snug mb-3">
            {dict.completedTitle}
          </h3>
          <p className="text-white/70 text-[14px] sm:text-[15px] font-light max-w-md mx-auto mb-8 leading-relaxed">
            {dict.completedSubhead}
          </p>

          {/* 3 Cards Display Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            {selectedCards.map((card, idx) => (
              <div
                key={card.id}
                className="p-4 rounded-xl border border-[#c5a059]/30 bg-[#c5a059]/[0.04]"
              >
                <span className="text-[#c5a059] text-[10px] tracking-[0.2em] uppercase font-medium block mb-1">
                  {dict.steps[idx].roleName}
                </span>
                <span className="text-white text-[15px] font-medium block">
                  {language === 'ko' && card.nameKo ? card.nameKo : card.name}
                </span>
                <span className="text-[#c5a059]/80 text-[11px] font-light block mt-0.5">
                  {language === 'ko' && card.subtitleKo ? card.subtitleKo : card.subtitle}
                </span>
              </div>
            ))}
          </div>

          {/* Main CTA: Reveal 3-Card Reading */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGenerateReading}
              disabled={isLoadingResult}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#c5a059] bg-[#c5a059] text-black hover:bg-[#d4b06a] transition-all duration-300 text-[13px] tracking-[0.25em] uppercase font-medium shadow-[0_0_25px_rgba(197,160,89,0.3)] cursor-pointer disabled:opacity-50"
            >
              {isLoadingResult
                ? language === 'ko'
                  ? '세 카드의 이야기를 읽고 있어요...'
                  : 'Reading the story between your three cards...'
                : dict.viewReadingCta}
            </button>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto px-4 py-3 rounded-xl border border-red-400/25 bg-red-400/[0.04]"
              >
                <p className="text-red-300/80 text-[12px] sm:text-[13px] font-light">
                  {errorMessage}
                </p>
              </motion.div>
            )}

            {/* Step Back & Reset options */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                onClick={handleStepBack}
                disabled={isLoadingResult}
                className="text-white/60 hover:text-white text-[12px] tracking-wider transition-colors cursor-pointer underline underline-offset-4 disabled:opacity-40"
              >
                ← {dict.backCta}
              </button>
              <button
                type="button"
                onClick={handleResetDeck}
                disabled={isLoadingResult}
                className="text-white/40 hover:text-white/80 text-[12px] tracking-wider transition-colors cursor-pointer disabled:opacity-40"
              >
                {language === 'ko' ? '세 장 모두 다시 선택' : 'Re-select All 3 Cards'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── PREMIUM READING RESULT VIEW (AFTER GENERATION) ── */}
      {premiumResult && (
        <PremiumReadingResultView
          language={language}
          result={premiumResult}
          onReSelectThreeCards={handleResetDeck}
          onStartOver={onReturnToFree}
        />
      )}

      {/* Return to Free Flow Link */}
      {!premiumResult && (
        <div className="mt-8">
          <button
            type="button"
            onClick={onReturnToFree}
            className="text-white/40 hover:text-white/80 text-[12px] tracking-wider transition-colors cursor-pointer uppercase"
          >
            ← {dict.returnToFreeCta}
          </button>
        </div>
      )}
    </motion.div>
  );
}

const ENTRY_TYPES: EntryType[] = [
  'DREAM',
  'CONCERN',
  'WISH',
  'RELATIONSHIP',
  'UNEASY',
  'CUSTOM',
];

interface ReadingExperienceProps {
  language: Language;
}

export function ReadingExperience({ language }: ReadingExperienceProps) {
  // Mode State: 'free' | 'premium' | 'symbolicNumbers'
  const [viewMode, setViewMode] = useState<ExperienceViewMode>('free');

  const [selectedEntryType, setSelectedEntryType] = useState<EntryType | null>('DREAM');
  const [customTopic, setCustomTopic] = useState('');
  const [storyText, setStoryText] = useState('');
  const [selectedCard, setSelectedCard] = useState<TarotCardData['id'] | null>(null);

  // Flow State
  const [ritualType, setRitualType] = useState<RitualType>('reflection');
  const [isReflecting, setIsReflecting] = useState(false);
  const [pauseStep, setPauseStep] = useState<1 | 2 | 3>(1);
  const [hasCompletedPause, setHasCompletedPause] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [readingResult, setReadingResult] = useState<ReadingResult | null>(null);
  const [symbolicResult, setSymbolicResult] = useState<SymbolicNumberResult | null>(null);
  const [talismanResult, setTalismanResult] = useState<DigitalTalismanResult | null>(null);
  const [hasPremiumCardsForSymbolic, setHasPremiumCardsForSymbolic] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const premiumRef = useRef<HTMLDivElement>(null);
  const symbolicRef = useRef<HTMLDivElement>(null);
  const talismanRef = useRef<HTMLDivElement>(null);
  const readingAnalyticsCycleRef = useRef(new ReadingAnalyticsCycle());

  const t = DICTIONARY[language].reading;
  const tarotCards = FREE_TAROT_CARDS_I18N[language] || FREE_TAROT_CARDS_I18N.en;

  // Automatically regenerate reading result when language switches if a result exists
  useEffect(() => {
    if (selectedCard && readingResult) {
      generateMockReading({
        language,
        topic: selectedEntryType || 'CUSTOM',
        customTopic,
        userText: storyText,
        ritualType,
        cardId: selectedCard,
      }).then((newResult) => {
        setReadingResult(newResult);
      });
    }
  }, [language]);

  // Handle Pause Stepper (5-8 seconds overall, skip button after 2s)
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;
    let skipTimer: NodeJS.Timeout;

    if (isReflecting) {
      setPauseStep(1);
      setShowSkipButton(false);

      // Show skip button after 2s for accessibility & convenience
      skipTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 2000);

      // Step 1 -> Step 2 at 2.5s
      timer1 = setTimeout(() => {
        setPauseStep(2);
      }, 2500);

      // Step 2 -> Step 3 at 5s
      timer2 = setTimeout(() => {
        setPauseStep(3);
      }, 5000);

      // Complete Pause at 7s
      timer3 = setTimeout(() => {
        finishPause();
      }, 7000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(skipTimer);
    };
  }, [isReflecting]);

  const startQuietMoment = () => {
    if (storyText.trim().length < 3) return;

    readingAnalyticsCycleRef.current.start((event) => trackProductFunnel({ event, language }));

    // Determine RitualType based on local mock rules
    const determined = determineRitualType(selectedEntryType, storyText);
    setRitualType(determined);
    setIsReflecting(true);
  };

  const finishPause = () => {
    setIsReflecting(false);
    setHasCompletedPause(true);
    setTimeout(() => {
      cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handleCardSelect = (id: TarotCardData['id']) => {
    setSelectedCard(id);
  };

  const handleReveal = async () => {
    if (!selectedCard || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      let result: ReadingResult;
      if (READING_PROVIDER === 'api') {
        result = await fetchFreeReadingApi({
          language,
          entryType: selectedEntryType || 'CUSTOM',
          storyText,
          ritualType,
          selectedCardId: selectedCard,
        });
      } else {
        result = await generateMockReading({
          language,
          topic: selectedEntryType || 'CUSTOM',
          customTopic,
          userText: storyText,
          ritualType,
          cardId: selectedCard,
        });
      }

      readingAnalyticsCycleRef.current.complete((event) => trackProductFunnel({ event, language }));
      setReadingResult(result);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Error generating reading:', err);
      setErrorMessage(language === 'ko'
        ? '지금은 결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
        : "We couldn't load your result right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawAgain = () => {
    setReadingResult(null);
    setSelectedCard(null);
    setTimeout(() => {
      cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleStartOver = () => {
    readingAnalyticsCycleRef.current.reset();
    setReadingResult(null);
    setSelectedCard(null);
    setSelectedEntryType('DREAM');
    setCustomTopic('');
    setStoryText('');
    setHasCompletedPause(false);
    setIsReflecting(false);
    setRitualType('reflection');
    setSymbolicResult(null);
    setTalismanResult(null);
    setViewMode('free');
    setTimeout(() => {
      document.getElementById('reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleStartPremiumReading = () => {
    setViewMode('premium');
    setTimeout(() => {
      document.getElementById('reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleStartSymbolicNumbers = async (premiumCardIds?: string[]) => {
    setErrorMessage(null);
    try {
      let res: SymbolicNumberResult;
      if (READING_PROVIDER === 'api') {
        res = await fetchSymbolicNumbersApi({
          gameType: 'kr_lotto_645',
          entryType: selectedEntryType || 'CUSTOM',
          storyText,
          ritualType,
          freeCardId: selectedCard || undefined,
          premiumCardIds,
        });
      } else {
        res = generateSymbolicNumbers({
          gameType: 'kr_lotto_645',
          entryType: selectedEntryType || 'CUSTOM',
          storyText,
          ritualType,
          freeCardId: selectedCard || undefined,
          premiumCardIds,
        });
      }

      setSymbolicResult(res);
      setHasPremiumCardsForSymbolic(Boolean(premiumCardIds && premiumCardIds.length === 3));
      setViewMode('symbolicNumbers');

      setTimeout(() => {
        document.getElementById('reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Error generating symbolic numbers:', err);
      setErrorMessage(language === 'ko'
        ? '숫자를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
        : "We couldn't load your symbolic numbers right now.");
    }
  };

  const handleStartDigitalTalisman = async (premiumCardIds?: string[]) => {
    setErrorMessage(null);
    try {
      let res: DigitalTalismanResult;
      if (READING_PROVIDER === 'api') {
        res = await fetchDigitalTalismanOptionsApi({
          entryType: selectedEntryType || 'CUSTOM',
          storyText,
          ritualType,
          freeCardId: selectedCard || undefined,
          premiumCardIds,
          language,
        });
      } else {
        res = generateDigitalTalismanOptions({
          entryType: selectedEntryType || 'CUSTOM',
          storyText,
          ritualType,
          freeCardId: selectedCard || undefined,
          premiumCardIds,
        });
      }

      setTalismanResult(res);
      setHasPremiumCardsForSymbolic(Boolean(premiumCardIds && premiumCardIds.length === 3));
      setViewMode('digitalTalisman');

      setTimeout(() => {
        document.getElementById('reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Error generating digital talisman:', err);
      setErrorMessage(language === 'ko'
        ? '부적을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
        : "We couldn't load your talisman options right now.");
    }
  };

  const handleReturnToFree = () => {
    setViewMode('free');
    setTimeout(() => {
      document.getElementById('reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Determine current placeholder based on selected Entry Type
  const currentPlaceholder =
    (selectedEntryType && (t.placeholders as Record<string, string>)[selectedEntryType]) ||
    t.textareaPlaceholder;

  // Determine current helper description
  const currentDescription =
    selectedEntryType && (t.descriptions as Record<string, string>)[selectedEntryType];

  // Determine current quietMomentSub text dynamically
  const activeRitualForSub = determineRitualType(selectedEntryType, storyText);
  const currentQuietMomentSub =
    typeof t.quietMomentSub === 'object'
      ? t.quietMomentSub[activeRitualForSub]
      : t.quietMomentSub;

  // Determine active ritual pause steps
  const activeRitualSteps = t.ritual[ritualType] || t.ritual.reflection;

  return (
    <section
      id="reading"
      className="min-h-screen flex items-center justify-center bg-black py-24 sm:py-32 px-4 sm:px-6 scroll-snap-start"
    >
      <div className="max-w-4xl mx-auto w-full text-center">
        {viewMode === 'premium' ? (
          <div ref={premiumRef}>
            <PremiumReadingView
              language={language}
              selectedEntryType={selectedEntryType}
              storyText={storyText}
              ritualType={ritualType}
              onReturnToFree={handleReturnToFree}
            />
          </div>
        ) : viewMode === 'symbolicNumbers' && symbolicResult ? (
          <div ref={symbolicRef}>
            <SymbolicNumbersView
              language={language}
              result={symbolicResult}
              hasPremiumCards={hasPremiumCardsForSymbolic}
              onBackToReading={handleReturnToFree}
              onStartOver={handleStartOver}
            />
          </div>
        ) : viewMode === 'digitalTalisman' && talismanResult ? (
          <div ref={talismanRef}>
            <DigitalTalismanView
              language={language}
              result={talismanResult}
              hasPremiumCards={hasPremiumCardsForSymbolic}
              onBackToReading={handleReturnToFree}
              onStartOver={handleStartOver}
            />
          </div>
        ) : (
          <>
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="text-[#c5a059]/75 text-[12px] sm:text-[14px] tracking-[0.25em] uppercase mb-4 font-medium">
                {t.eyebrow}
              </p>
              <h2
                className="text-white font-light leading-[1.15] tracking-[-0.02em] mb-6 whitespace-pre-line"
                style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}
              >
                {t.headline}
              </h2>
              <p className="text-white/60 text-[15px] sm:text-[17px] leading-relaxed max-w-lg mx-auto font-light mb-12">
                {t.description}
              </p>
            </motion.div>

            {/* Interactive Workspace Container */}
            <motion.div
              ref={selectionRef}
              className="space-y-8 text-left max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* 1. Entry Type Compact Pills / Chips */}
              <div>
                <label className="block text-[#c5a059]/80 text-[11px] sm:text-[12px] tracking-[0.2em] uppercase font-medium mb-3 text-center sm:text-left">
                  {t.step1}
                </label>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {ENTRY_TYPES.map((entryType) => {
                    const isSelected = selectedEntryType === entryType;
                    return (
                      <button
                        key={entryType}
                        type="button"
                        onClick={() => setSelectedEntryType(entryType)}
                        className={`px-3.5 py-1.5 rounded-full text-[12px] sm:text-[13px] tracking-wider transition-all duration-300 font-light focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] cursor-pointer ${isSelected
                            ? 'border border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.15)] font-normal'
                            : 'border border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30 hover:text-white/90'
                          }`}
                      >
                        {(t.topics as Record<string, string>)[entryType] || entryType}
                      </button>
                    );
                  })}
                </div>

                {/* Helper description for selected entry type */}
                {currentDescription && (
                  <p className="mt-2.5 text-[12px] text-white/40 font-light italic px-1 text-center sm:text-left">
                    {currentDescription}
                  </p>
                )}
              </div>

              {/* 2. Story / Situation Textarea (Core UI) */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[#c5a059]/80 text-[11px] sm:text-[12px] tracking-[0.2em] uppercase font-medium">
                    {t.step2}
                  </label>
                  <span className="text-white/40 text-[12px] font-mono">
                    {storyText.length} / 500
                  </span>
                </div>
                <textarea
                  maxLength={500}
                  rows={4}
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder={currentPlaceholder}
                  className="w-full bg-white/[0.02] backdrop-blur-md border border-white/10 focus:border-[#c5a059]/50 focus:bg-white/[0.04] focus:outline-none rounded-xl p-4 text-white text-[14px] sm:text-[15px] leading-relaxed placeholder-white/30 transition-all duration-300 resize-none font-light shadow-inner"
                />
              </div>

              {/* 3. Take a Quiet Moment Transition Button */}
              {!hasCompletedPause && !isReflecting && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={startQuietMoment}
                    disabled={storyText.trim().length < 3}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#c5a059]/60 bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all duration-300 text-[12px] sm:text-[13px] tracking-[0.2em] uppercase font-medium shadow-[0_0_20px_rgba(197,160,89,0.15)] disabled:opacity-40 disabled:hover:bg-[#c5a059]/10 disabled:hover:text-[#c5a059] disabled:cursor-not-allowed cursor-pointer"
                  >
                    {t.quietMomentCta}
                  </button>
                  <p className="mt-3 text-[12px] text-white/40 font-light leading-relaxed whitespace-pre-line max-w-md mx-auto">
                    {currentQuietMomentSub}
                  </p>
                </div>
              )}

              {/* 4. Pause / Reflection Meditation Modal / Overlay State */}
              <AnimatePresence>
                {isReflecting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="my-6 p-8 rounded-2xl border border-[#c5a059]/30 bg-gradient-to-b from-[#12100b] to-black/90 text-center relative overflow-hidden backdrop-blur-xl shadow-[0_0_50px_rgba(197,160,89,0.1)]"
                  >
                    {/* Subtle Radial Glow & Slow Breathing Circle */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-64 h-64 rounded-full bg-[#c5a059]/20 blur-3xl"
                      />
                      <motion.div
                        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-40 h-40 rounded-full border border-[#c5a059]/30"
                      />
                    </div>

                    {/* Quiet Arcana Symbol Icon */}
                    <div className="relative z-10 mb-6">
                      <span className="text-2xl text-[#c5a059]/80 font-serif tracking-widest">
                        ✦ ☾ ✦
                      </span>
                    </div>

                    {/* Sequential Personalized Ritual Steps */}
                    <div className="relative z-10 min-h-[70px] flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {pauseStep === 1 && (
                          <motion.p
                            key="step1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.8 }}
                            className="text-white/90 text-[15px] sm:text-[17px] font-light leading-relaxed max-w-md"
                          >
                            {activeRitualSteps.step1}
                          </motion.p>
                        )}
                        {pauseStep === 2 && (
                          <motion.p
                            key="step2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.8 }}
                            className="text-[#c5a059] text-[15px] sm:text-[17px] font-light leading-relaxed max-w-md"
                          >
                            {activeRitualSteps.step2}
                          </motion.p>
                        )}
                        {pauseStep === 3 && (
                          <motion.p
                            key="step3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.8 }}
                            className="text-white/90 text-[15px] sm:text-[17px] font-light leading-relaxed max-w-md"
                          >
                            {activeRitualSteps.step3}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Optional Skip / Secondary CTA after 2s */}
                    {showSkipButton && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10 mt-6"
                      >
                        <button
                          type="button"
                          onClick={finishPause}
                          className="px-5 py-2 rounded-full border border-white/20 bg-white/5 hover:border-[#c5a059] text-white/70 hover:text-[#c5a059] text-[12px] tracking-wider transition-all duration-300 cursor-pointer font-light"
                        >
                          {t.skipPauseCta} ↓
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 5. Tarot Cards Selection Grid (Unlocked after Pause) */}
              {hasCompletedPause && (
                <motion.div
                  ref={cardsRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="pt-6"
                >
                  <div className="text-center mb-8">
                    <p className="text-[#c5a059] text-[13px] tracking-[0.2em] uppercase font-medium mb-1">
                      {t.cardSelectionTitle}
                    </p>
                    <p className="text-white/50 text-[13px] font-light">
                      {t.cardSelectionSub}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 items-center max-w-2xl mx-auto">
                    {tarotCards.map((card) => {
                      const isSelected = selectedCard === card.id;
                      const isDisabled = selectedCard !== null && !isSelected;
                      return (
                        <TarotCard
                          key={card.id}
                          card={card}
                          isSelected={isSelected}
                          isFlipped={isSelected}
                          isDisabled={isDisabled}
                          onSelect={handleCardSelect}
                          language={language}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* 6. Reveal My Reading CTA Button */}
              {selectedCard && !readingResult && (
                <motion.div
                  className="pt-8 text-center"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <button
                    type="button"
                    onClick={handleReveal}
                    disabled={isLoading}
                    className="px-8 py-4 rounded-full border border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all duration-300 text-[13px] tracking-[0.25em] uppercase font-medium shadow-[0_0_25px_rgba(197,160,89,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? t.loading : t.cta}
                  </button>

                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 max-w-md mx-auto px-4 py-3 rounded-xl border border-red-400/25 bg-red-400/[0.04]"
                    >
                      <p className="text-red-300/80 text-[12px] sm:text-[13px] font-light">
                        {errorMessage}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* 7. Reading Result Container */}
            {readingResult && (
              <div ref={resultRef}>
                <ReadingResultView
                  language={language}
                  result={readingResult}
                  onDrawAgain={handleDrawAgain}
                  onStartOver={handleStartOver}
                  onStartPremiumReading={handleStartPremiumReading}
                  onStartSymbolicNumbers={() => handleStartSymbolicNumbers()}
                  onStartDigitalTalisman={() => handleStartDigitalTalisman()}
                />
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 max-w-md mx-auto px-4 py-3 rounded-xl border border-red-400/25 bg-red-400/[0.04]"
                  >
                    <p className="text-red-300/80 text-[12px] sm:text-[13px] font-light text-center">
                      {errorMessage}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
