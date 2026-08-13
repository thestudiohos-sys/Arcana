import { useState } from 'react';
import { DigitalTalismanResult, Language } from '../types/reading';
import { TalismanSvg } from './TalismanSvg';

interface DigitalTalismanViewProps {
  language: Language;
  result: DigitalTalismanResult;
  hasPremiumCards?: boolean;
  onBackToReading: () => void;
  onStartOver: () => void;
}

export function DigitalTalismanView({
  language,
  result,
  hasPremiumCards = false,
  onBackToReading,
  onStartOver,
}: DigitalTalismanViewProps) {
  const isKo = language === 'ko';
  const { options, disclaimerKo, disclaimerEn } = result;

  // Selected Option State (Defaults to Candidate 1)
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0].id);

  const selectedOption = options.find((opt) => opt.id === selectedOptionId) || options[0];

  // SVG Download Helper (0 external libraries, Native Browser Blob)
  const handleDownloadSvg = () => {
    // Generate SVG string by querying active Large Preview element
    const container = document.getElementById('large-talisman-svg-container');
    if (!container) return;

    const svgElement = container.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `arcana-digital-talisman-${selectedOption.style}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 sm:p-10 rounded-2xl border border-[#c5a059]/40 bg-gradient-to-b from-[#11121a]/95 via-[#08090f]/95 to-[#040406]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(197,160,89,0.15)] text-center">
      {/* ── HEADER & BADGE ── */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/[0.06] mb-4">
          <span className="text-[#c5a059] text-[11px]">✦</span>
          <span className="text-[#c5a059] text-[11px] sm:text-[12px] tracking-[0.25em] uppercase font-medium">
            {isKo ? '나만의 디지털 부적' : 'Personalized Digital Talisman'}
          </span>
        </div>
        <h2 className="text-white text-[24px] sm:text-[34px] font-light leading-snug tracking-[-0.01em] mb-3">
          {isKo ? '당신의 리딩에서 탄생한 세 개의 부적' : 'THREE TALISMANS INSPIRED BY YOUR STORY'}
        </h2>
        <p className="text-white/60 text-[13px] sm:text-[15px] leading-relaxed max-w-lg mx-auto font-light">
          {isKo
            ? '당신이 적은 이야기와 선택한 카드의 상징에서 영감을 받아 만든 디지털 부적입니다. 세 가지 중 가장 마음에 와닿는 하나를 선택해 간직해보세요.'
            : 'Inspired by the symbolism of your story and cards. Choose the one that speaks most strongly to you.'}
        </p>
      </div>

      {/* ── CONTEXT SOURCE BADGE ── */}
      <div className="mb-10 inline-block px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02]">
        <p className="text-white/70 text-[12px] font-light">
          ✦{' '}
          {hasPremiumCards
            ? isKo
              ? '당신의 이야기와 세 장의 카드에서 이어진 부적입니다.'
              : 'Inspired by your story and three-card spread.'
            : isKo
              ? '당신의 이야기와 선택한 카드에서 이어진 부적입니다.'
              : 'Inspired by your story and selected card.'}
        </p>
      </div>

      {/* ── 3 CANDIDATE OPTIONS GRID (COMPARISON & SINGLE SELECTION) ── */}
      <div className="mb-12">
        <h3 className="text-[#c5a059] text-[12px] tracking-[0.25em] uppercase font-medium mb-6 text-center sm:text-left">
          ✦ {isKo ? '마음에 와닿는 부적을 골라보세요' : 'CHOOSE THE ONE THAT SPEAKS TO YOU'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {options.map((opt, idx) => {
            const isSelected = opt.id === selectedOptionId;

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between text-left cursor-pointer group ${isSelected
                    ? 'border-[#c5a059] bg-[#c5a059]/[0.08] ring-1 ring-[#c5a059]/50 shadow-[0_0_30px_rgba(197,160,89,0.2)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-[#c5a059]/50 hover:bg-white/[0.04]'
                  }`}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedOptionId(opt.id);
                  }
                }}
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="w-full aspect-[9/14] rounded-xl overflow-hidden mb-4 border border-white/10 bg-black shadow-inner relative">
                    <TalismanSvg option={opt} language={language} isThumbnail={true} />
                    {isSelected && (
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#c5a059] text-black text-[10px] tracking-wider uppercase font-semibold shadow-md">
                        {isKo ? '선택됨' : 'SELECTED'}
                      </div>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <span className="text-[#c5a059] text-[10px] tracking-[0.2em] uppercase font-medium block mb-1">
                    {isKo ? `부적 ${idx + 1}` : `TALISMAN ${idx + 1}`}
                  </span>
                  <h4 className="text-white text-[16px] font-medium mb-1">
                    {isKo ? opt.titleKo : opt.titleEn}
                  </h4>
                  <p className="text-[#c5a059]/80 text-[11px] font-light mb-3">
                    {isKo ? opt.subtitleKo : opt.subtitleEn}
                  </p>

                  {/* Short Symbolic Phrase */}
                  <p className="text-white/70 text-[12px] italic font-light border-t border-white/10 pt-2 line-clamp-2">
                    "{isKo ? opt.phraseKo : opt.phraseEn}"
                  </p>
                </div>

                {/* Selection Action Button */}
                <div className="mt-5 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOptionId(opt.id);
                    }}
                    className={`w-full py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 cursor-pointer ${isSelected
                        ? 'bg-[#c5a059] text-black shadow-md'
                        : 'border border-white/20 bg-white/5 text-white/70 group-hover:border-[#c5a059] group-hover:text-[#c5a059]'
                      }`}
                  >
                    {isSelected
                      ? isKo
                        ? '✓ 선택됨'
                        : '✓ SELECTED'
                      : isKo
                        ? '이 부적 선택'
                        : 'CHOOSE THIS TALISMAN'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SELECTED TALISMAN LARGE PREVIEW DISPLAY ── */}
      <div className="my-12 pt-10 border-t border-white/10">
        <div className="mb-6">
          <span className="text-[#c5a059] text-[11px] tracking-[0.25em] uppercase font-medium block mb-1">
            ✦ {isKo ? '당신이 선택한 부적' : 'YOUR SELECTED TALISMAN'}
          </span>
          <h3 className="text-white text-[20px] sm:text-[24px] font-light">
            {isKo ? selectedOption.titleKo : selectedOption.titleEn}
          </h3>
        </div>

        {/* Large SVG Preview Container */}
        <div
          id="large-talisman-svg-container"
          className="w-full max-w-sm sm:max-w-md mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-[#c5a059]/60 bg-black shadow-[0_0_50px_rgba(197,160,89,0.2)] mb-8"
        >
          <TalismanSvg option={selectedOption} language={language} isThumbnail={false} />
        </div>

        {/* Selected Phrase Emphasis Banner */}
        <div className="max-w-md mx-auto p-4 rounded-xl border border-[#c5a059]/30 bg-[#c5a059]/[0.04] mb-8">
          <p className="text-white text-[15px] italic font-light">
            "{isKo ? selectedOption.phraseKo : selectedOption.phraseEn}"
          </p>
        </div>

        {/* Download Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-8">
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#c5a059] bg-[#c5a059] text-black hover:bg-[#d4b06a] transition-all duration-300 text-[12px] tracking-[0.2em] uppercase font-medium shadow-[0_0_20px_rgba(197,160,89,0.3)] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>↓</span> {isKo ? 'SVG 파일로 저장' : 'SAVE AS SVG'}
          </button>
        </div>
      </div>

      {/* ── RESPONSIBLE DISCLAIMER ── */}
      <div className="my-6 max-w-lg mx-auto">
        <p className="text-white/35 text-[11px] leading-relaxed font-light">
          {isKo ? disclaimerKo : disclaimerEn}
        </p>
      </div>

      {/* ── NAVIGATION BUTTONS ── */}
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
