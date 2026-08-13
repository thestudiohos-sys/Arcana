import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import { Navbar } from './components/Navbar';
import { ScrambleIn } from './components/ScrambleText';
import { ConnectAILabLogo } from './components/ConnectAILabLogo';
import { Language } from './types/reading';
import { ARCANA_PRODUCTS, ProductId } from './config/products';
import { MockCheckoutSummary } from './components/MockCheckoutSummary';
import { VIDEO_URLS } from './config/videos';
import { DICTIONARY } from './config/dictionary';
import { ReadingExperience } from './components/ReadingExperience';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<ProductId | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  /* ── Hero video mouse-scrub & seamless autoplay fallback ── */
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const isScrubbingRef = useRef(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSeeked = useCallback(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    isSeekingRef.current = false;
    if (isScrubbingRef.current && Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      isSeekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (video) {
      video.play().catch(() => {});
    }

    const startAutoplay = () => {
      isScrubbingRef.current = false;
      if (heroVideoRef.current && heroVideoRef.current.paused) {
        heroVideoRef.current.play().catch(() => {});
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const v = heroVideoRef.current;
      if (!v || !v.duration) return;

      // Transition smoothly from autoplay to scrub mode
      if (!isScrubbingRef.current) {
        isScrubbingRef.current = true;
        v.pause();
        targetTimeRef.current = v.currentTime;
      }

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      const deltaX = e.movementX;
      const sensitivity = 0.8;
      const change = (deltaX / window.innerWidth) * v.duration * sensitivity;
      targetTimeRef.current = Math.max(
        0,
        Math.min(v.duration, targetTimeRef.current + change)
      );

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        v.currentTime = targetTimeRef.current;
      }

      // Resume autoplay quickly (600ms) when mouse movement pauses
      inactivityTimerRef.current = setTimeout(startAutoplay, 600);
    };

    const handleMouseLeave = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      startAutoplay();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  /* ── Entrance delay ── */
  useEffect(() => {
    const timer = setTimeout(() => setEntranceComplete(true), 800);
    return () => clearTimeout(timer);
  }, []);

  /* ── Section 2 scroll-driven 3D text ── */
  const section2Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: section2Ref,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 15,
    damping: 32,
    mass: 1.8,
  });
  const yScaleValue = useTransform(smoothProgress, [0, 1], [40, -80]);
  const textOpacity = useTransform(smoothProgress, [0.2, 0.45], [0, 1]);
  const transform3D = useMotionTemplate`rotateX(18deg) translateY(${yScaleValue}px) translateZ(-60px)`;

  /* ── Destructure config for active language ── */
  const currentConfig = DICTIONARY[language];
  const { hero, cinematic, metrics, technology, architecture, pricing, footer } = currentConfig;

  return (
    <div style={{ fontFamily: '"Space Mono", monospace' }}>
      <Navbar entranceComplete={entranceComplete} language={language} setLanguage={setLanguage} />

      {/* ════════════════ SECTION 1: HERO ════════════════ */}
      <section className="relative h-screen h-[100dvh] flex flex-col overflow-hidden">
        {/* Video background (mouse-scrubbed + autoplay fallback) */}
        {VIDEO_URLS.hero && (
          <>
            <video
              ref={heroVideoRef}
              src={VIDEO_URLS.hero}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
              loop
              autoPlay
              preload="auto"
              onSeeked={handleSeeked}
            />
            <div className="arcana-video-dark-overlay" />
            <div className="arcana-video-vignette" />
          </>
        )}

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.05,
          }}
        />

        {/* Watermark text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ paddingTop: 50 }}
        >
          <span
            className="uppercase select-none"
            style={{
              fontFamily: '"Anton SC", sans-serif',
              fontSize: 'clamp(120px, 30vw, 521px)',
              letterSpacing: '-4px',
              opacity: 0.1,
              background:
                'radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              lineHeight: 1,
            }}
          >
            {hero.watermark}
          </span>
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-20 flex flex-col flex-1 px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: entranceComplete ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex-1" />

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              <h1
                className="text-white font-light leading-[0.95] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(40px, 10vw, 100px)' }}
              >
                <ScrambleIn text={hero.titleLeft[0]} delay={200} triggered={entranceComplete} />
                <br />
                <ScrambleIn text={hero.titleLeft[1]} delay={500} triggered={entranceComplete} />
              </h1>

              <motion.p
                className="max-w-sm text-[13px] sm:text-[15px] text-white/60 leading-relaxed"
                initial={{ opacity: 0, y: 25 }}
                animate={entranceComplete ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.9,
                  ease: [0.215, 0.61, 0.355, 1.0],
                  delay: 0.2,
                }}
              >
                {hero.description}
              </motion.p>
            </div>

            {/* Right heading */}
            <h1
              className="text-white font-light leading-[0.95] tracking-[-0.03em] text-left md:text-right"
              style={{ fontSize: 'clamp(40px, 10vw, 100px)' }}
            >
              <ScrambleIn text={hero.titleRight[0]} delay={700} triggered={entranceComplete} />
              <br />
              <ScrambleIn text={hero.titleRight[1]} delay={1000} triggered={entranceComplete} />
            </h1>
          </div>
        </motion.div>
      </section>

      {/* ════════════════ SECTION 2: CINEMATIC TEXT ════════════════ */}
      <section
        ref={section2Ref}
        className="relative h-screen h-[100dvh] flex items-center justify-center overflow-hidden"
      >
        {/* Video background */}
        {VIDEO_URLS.section2 && (
          <>
            <video
              src={VIDEO_URLS.section2}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="arcana-video-dark-overlay" />
            <div className="arcana-video-vignette" />
          </>
        )}

        {/* Top gradient overlay */}
        <div
          className="absolute top-0 left-0 right-0 z-10"
          style={{
            height: 180,
            background: 'linear-gradient(to bottom, #010103, transparent)',
          }}
        />

        {/* 3D text content */}
        <div className="relative z-20 max-w-4xl mx-auto" style={{ perspective: 1000 }}>
          <motion.p
            className="font-sans font-normal text-[16px] sm:text-[22px] md:text-[26px] lg:text-[30px] text-white/90 leading-[1.65] tracking-[-0.01em] select-none px-6 sm:px-12 text-center"
            style={{
              transform: transform3D,
              opacity: textOpacity,
            }}
          >
            {cinematic.text}
          </motion.p>
        </div>
      </section>

      {/* ════════════════ SECTION 3: METRICS ════════════════ */}
      <section className="relative h-screen h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Video background */}
        {VIDEO_URLS.metrics && (
          <>
            <video
              src={VIDEO_URLS.metrics}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <div className="arcana-video-dark-overlay" />
            <div className="arcana-video-vignette" />
          </>
        )}

        <div className="relative z-20 pt-32 pb-32 px-6 max-w-6xl mx-auto w-full">
          <motion.p
            className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-20 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {metrics.subtitle}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center">
            {metrics.items.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div
                  className="text-white font-light tracking-[-0.04em] leading-none"
                  style={{ fontSize: 'clamp(48px, 10vw, 96px)' }}
                >
                  {m.value}
                </div>
                <div className="text-white/40 text-[13px] sm:text-[15px] mt-4 tracking-wide">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 4: TECHNOLOGY ════════════════ */}
      <section className="relative h-screen h-[100dvh] flex flex-col overflow-hidden">
        {/* Video background */}
        {VIDEO_URLS.technology && (
          <>
            <video
              src={VIDEO_URLS.technology}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="arcana-video-dark-overlay" />
            <div className="arcana-video-vignette" />
          </>
        )}

        <div className="relative z-20 flex flex-col flex-1 px-8 sm:px-12 md:px-16 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <motion.h2
              className="text-white font-light leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(36px, 8vw, 72px)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {technology.title[0]}
              <br />
              {technology.title[1]}
            </motion.h2>

            <motion.p
              className="text-white/50 text-[13px] sm:text-[15px] leading-relaxed max-w-xs md:text-right md:pt-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {technology.description}
            </motion.p>
          </div>

          <div className="flex-1" />

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {technology.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <h3 className="text-white text-[14px] sm:text-[16px] font-normal mb-2">
                  {f.title}
                </h3>
                <p className="text-white/40 text-[12px] sm:text-[14px] leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ SECTION 5: ARCHITECTURE ════════════════ */}
      <section className="min-h-screen flex items-center justify-center bg-black py-24 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <p className="text-[#c5a059]/75 text-[12px] sm:text-[14px] tracking-[0.25em] uppercase mb-4 sm:mb-6 font-medium">
              {architecture.subtitle}
            </p>
            <h2
              className="text-white font-light leading-[1.2] tracking-[-0.02em] mb-6 sm:mb-8 whitespace-pre-line"
              style={{ fontSize: 'clamp(28px, 5.5vw, 52px)' }}
            >
              {architecture.heading}
            </h2>
            <p className="text-white/60 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto font-light">
              {architecture.description}
            </p>
          </motion.div>

          <motion.div
            className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative items-stretch"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {architecture.layers.map((l, index) => (
              <div
                key={l.step}
                className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-xl border border-[#c5a059]/20 bg-white/[0.02] backdrop-blur-md transition-all duration-300 hover:border-[#c5a059]/50 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(197,160,89,0.08)] text-left"
              >
                <div>
                  {/* Top row: Step label & subtle icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[#c5a059] text-[11px] sm:text-[12px] tracking-[0.2em] uppercase font-medium">
                      {l.step}
                    </span>
                    <div className="text-[#c5a059]/60 group-hover:text-[#c5a059] transition-colors duration-300">
                      {index === 0 && (
                        /* Step 01: Crescent Moon Icon */
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                      )}
                      {index === 1 && (
                        /* Step 02: Tarot Card / Star Seal Icon */
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="5" y="3" width="14" height="18" rx="2" />
                          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
                        </svg>
                      )}
                      {index === 2 && (
                        /* Step 03: Radiant Star / Arcana Eye Icon */
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-white text-[18px] sm:text-[20px] font-light tracking-wide mb-3">
                    {l.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/80 text-[14px] leading-relaxed mb-4 font-normal">
                    {l.description}
                  </p>
                </div>

                {/* Supporting text */}
                <p className="text-white/45 text-[12px] sm:text-[13px] leading-relaxed border-t border-white/5 pt-4 font-light mt-auto">
                  {l.supportingText}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ SECTION 5.5: READING EXPERIENCE ════════════════ */}
      <ReadingExperience language={language} />

      {/* ════════════════ SECTION 6: PRICING ════════════════ */}
      <section className="min-h-screen bg-black py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Header */}
          <motion.div
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="text-[#c5a059]/75 text-[12px] sm:text-[14px] tracking-[0.25em] uppercase mb-4 font-medium">
              {pricing.subtitle}
            </p>
            <h2
              className="text-white font-light leading-[1.15] tracking-[-0.02em] mb-4"
              style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}
            >
              {pricing.heading}
            </h2>
            <p className="text-white/60 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto font-light mb-4">
              {pricing.description}
            </p>
            {/* Free Boundary Assurance Notice */}
            <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
              <p className="text-white/50 text-[12px] font-light">
                ✦ {pricing.freeBoundaryNotice}
              </p>
            </div>
          </motion.div>

          {/* 4 Single-Item Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {Object.values(ARCANA_PRODUCTS).map((prod, idx) => {
              const isKo = language === 'ko';
              const priceStr = isKo ? `₩${prod.priceKRW.toLocaleString()}` : `$${prod.priceUSD.toFixed(2)}`;
              const title = isKo ? prod.titleKo : prod.titleEn;
              const desc = isKo ? prod.descriptionKo : prod.descriptionEn;
              const features = isKo ? prod.featuresKo : prod.featuresEn;
              const cta = isKo ? prod.ctaKo : prod.ctaEn;
              const badge = isKo ? prod.savingsBadgeKo : prod.savingsBadgeEn;

              return (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    prod.isBundle
                      ? 'border-[#c5a059] bg-[#c5a059]/[0.06] shadow-[0_0_30px_rgba(197,160,89,0.15)] ring-1 ring-[#c5a059]/40'
                      : 'border-white/10 bg-white/[0.02] hover:border-[#c5a059]/40 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Top Badge for Bundle */}
                  {prod.isBundle && (
                    <div className="absolute top-0 right-0 bg-[#c5a059] text-black text-[10px] tracking-[0.15em] uppercase font-semibold px-3 py-1 rounded-bl-xl shadow-md">
                      {isKo ? '세 가지 모두 포함' : 'ALL THREE INCLUDED'}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <span className="text-[#c5a059] text-[10px] tracking-[0.2em] uppercase font-medium block mb-2">
                      OPTION {idx + 1}
                    </span>
                    <h3 className="text-white text-[20px] sm:text-[22px] font-medium mb-1">
                      {title}
                    </h3>

                    {/* Price Display */}
                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-white text-[32px] sm:text-[36px] font-light tracking-tight">
                        {priceStr}
                      </span>
                    </div>

                    {/* Savings Subtext */}
                    {badge && (
                      <p className="text-[#c5a059] text-[11px] font-medium mb-3">
                        ✦ {badge}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-white/60 text-[12px] sm:text-[13px] font-light leading-relaxed mb-6 border-b border-white/10 pb-4">
                      {desc}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2.5 mb-8">
                      {features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2.5 text-white/80 text-[12px] sm:text-[13px] font-light">
                          <span className="text-[#c5a059] text-[11px]">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setSelectedProductId(prod.id)}
                      className={`w-full py-3 rounded-full text-[12px] tracking-[0.15em] uppercase font-medium transition-all duration-300 cursor-pointer text-center ${
                        prod.isBundle
                          ? 'bg-[#c5a059] text-black hover:bg-[#d4b06a] shadow-[0_0_20px_rgba(197,160,89,0.2)]'
                          : 'border border-white/20 bg-white/5 text-white/90 hover:border-[#c5a059] hover:text-[#c5a059]'
                      }`}
                    >
                      {cta}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="bg-black overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Left: Video */}
          <div className="md:w-1/2 h-[300px] md:h-auto relative overflow-hidden">
            {VIDEO_URLS.footer ? (
              <>
                <video
                  src={VIDEO_URLS.footer}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="arcana-video-dark-overlay" />
                <div className="arcana-video-vignette" />
                {/* Seamless Edge Blend (Removes sharp box borders & enlarged center ellipse) */}
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.3) 78%, #000000 100%), linear-gradient(to right, transparent 65%, #000000 100%), linear-gradient(to bottom, #000000 0%, transparent 15%, transparent 85%, #000000 100%)',
                  }}
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-white/5" />
            )}
          </div>

          {/* Right: Content */}
          <div className="md:w-1/2 flex flex-col justify-between p-10 sm:p-16">
            <div>
              <div className="flex items-center gap-2.5 mb-8">
                <ConnectAILabLogo size={18} className="text-white/70" />
                <span className="text-[15px] font-medium text-white/70 tracking-tight">
                  {currentConfig.brandName}
                </span>
              </div>
              <p className="text-white/40 text-[14px] sm:text-[15px] leading-relaxed max-w-sm">
                {footer.tagline}
              </p>
            </div>

            <p className="text-white/25 text-[12px] mt-12">
              {currentConfig.copyright}
            </p>
          </div>
        </div>
      </footer>

      {/* Mock Checkout Summary Modal */}
      {selectedProductId && ARCANA_PRODUCTS[selectedProductId] && (
        <MockCheckoutSummary
          language={language}
          product={ARCANA_PRODUCTS[selectedProductId]}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}
