import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Language, ReadingResult } from '../types/reading';
import { DICTIONARY } from '../config/dictionary';
import { SITE_CONFIG } from '../config/content';
import { getShareSiteHost, renderShareCardPng } from '../services/shareCard';

interface ShareCardModalProps {
  language: Language;
  result: ReadingResult;
  onClose: () => void;
}

/**
 * Shows a preview of the 9:16 share image before anything leaves the device,
 * then lets the viewer share it (Web Share API) or save it as a PNG.
 */
export function ShareCardModal({ language, result, onClose }: ShareCardModalProps) {
  const t = DICTIONARY[language].resultView.shareCard;
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const { selectedCard } = result;
  const isKo = language === 'ko';
  const fileName = `arcana-${selectedCard.id}.png`;

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;
    setBlob(null);
    setPreviewUrl(null);
    setFailed(false);

    renderShareCardPng({
      cardSymbol: selectedCard.symbol,
      cardName: isKo && selectedCard.nameKo ? selectedCard.nameKo : selectedCard.name,
      cardSubtitle: isKo && selectedCard.subtitleKo ? selectedCard.subtitleKo : selectedCard.subtitle,
      eyebrow: DICTIONARY[language].resultView.closingTitle,
      message: result.talismanMessage,
      brand: SITE_CONFIG.brandName,
      siteHost: getShareSiteHost(),
    })
      .then((png) => {
        if (cancelled) return;
        url = URL.createObjectURL(png);
        setBlob(png);
        setPreviewUrl(url);
      })
      .catch((err) => {
        console.error('Share card rendering failed:', err);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [language, result, selectedCard, isKo]);

  const file = blob ? new File([blob], fileName, { type: 'image/png' }) : null;
  const canShareFile = Boolean(
    file && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] }),
  );

  const handleSave = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatus(t.saved);
  };

  const handleShare = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], title: SITE_CONFIG.brandName });
    } catch (err) {
      // AbortError = the viewer closed the share sheet; nothing to report.
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        console.error('Share failed:', err);
        handleSave();
      }
    }
  };

  // Portal to <body>: the result card's transform/backdrop-filter would otherwise
  // turn `position: fixed` into "fixed to the card" instead of the viewport.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm max-h-[92vh] overflow-y-auto p-5 sm:p-6 rounded-2xl border border-[#c5a059]/40 bg-gradient-to-b from-[#12131c] via-[#090a10] to-[#040406] text-center relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white text-xl p-2 cursor-pointer transition-colors"
          aria-label={t.close}
        >
          ✕
        </button>

        <h3 className="text-white text-[18px] font-light mb-1 pr-6">{t.title}</h3>
        <p className="text-white/50 text-[11px] font-light leading-relaxed mb-4">{t.privacyNote}</p>

        <div className="mx-auto w-[200px] sm:w-[220px] aspect-[9/16] rounded-lg overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center mb-5">
          {previewUrl ? (
            <img src={previewUrl} alt={t.previewAlt} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white/40 text-[11px] px-3">{failed ? t.failed : t.generating}</span>
          )}
        </div>

        <div className="space-y-2.5">
          {canShareFile && (
            <button
              type="button"
              onClick={handleShare}
              className="w-full py-3 rounded-full border border-[#c5a059] bg-[#c5a059] text-black hover:bg-[#d4b06a] transition-all duration-300 text-[12px] tracking-[0.15em] uppercase font-medium cursor-pointer"
            >
              {t.share}
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!previewUrl}
            className={`w-full py-3 rounded-full border text-[12px] tracking-[0.15em] uppercase font-medium transition-all duration-300 ${
              canShareFile
                ? 'border-white/20 text-white/70 hover:text-white hover:border-white/40'
                : 'border-[#c5a059] bg-[#c5a059] text-black hover:bg-[#d4b06a]'
            } ${previewUrl ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
          >
            {t.save}
          </button>
          {status && <p className="text-emerald-300/80 text-[11px] font-light">{status}</p>}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
