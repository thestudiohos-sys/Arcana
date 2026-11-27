// ============================================================
// 9:16 Share Card Renderer
// ============================================================
// Draws a 1080×1920 PNG for Instagram/TikTok stories using only the
// browser Canvas API (no external libraries).
//
// Privacy rule: the card contains ONLY the drawn card and the closing
// "message to carry forward". The user's own story text is never passed
// in, so it can never end up in a shared image.
// ============================================================

export const SHARE_CARD_WIDTH = 1080;
export const SHARE_CARD_HEIGHT = 1920;

export interface ShareCardContent {
  cardSymbol: string;
  cardName: string;
  cardSubtitle: string;
  eyebrow: string;
  message: string;
  brand: string;
  /** Optional site address shown under the brand (omitted when empty). */
  siteHost?: string;
}

const GOLD = '#c5a059';
const GOLD_SOFT = 'rgba(197, 160, 89, 0.55)';
const WHITE = '#f4f1ea';
const MUTED = 'rgba(244, 241, 234, 0.55)';
const FONT_STACK = '"Space Mono", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", monospace';

/** Splits text into lines that fit maxWidth. Falls back to per-character
 *  breaks for words wider than a line (e.g. long Korean phrases). */
export function wrapText(
  measure: (text: string) => number,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let current = '';

  const pushWord = (word: string) => {
    const candidate = current ? `${current} ${word}` : word;
    if (measure(candidate) <= maxWidth) {
      current = candidate;
      return;
    }
    if (current) {
      lines.push(current);
      current = '';
    }
    if (measure(word) <= maxWidth) {
      current = word;
      return;
    }
    // Word itself is too wide: break by character.
    for (const char of Array.from(word)) {
      if (measure(current + char) > maxWidth && current) {
        lines.push(current);
        current = char;
      } else {
        current += char;
      }
    }
  };

  for (const word of text.trim().split(/\s+/)) {
    if (word) pushWord(word);
  }
  if (current) lines.push(current);
  return lines;
}

export async function renderShareCardPng(content: ShareCardContent): Promise<Blob> {
  // Make sure the page's web font is ready so canvas text uses it.
  try {
    await document.fonts?.load(`400 48px "Space Mono"`);
  } catch {
    // Fall back to system fonts silently.
  }

  const canvas = document.createElement('canvas');
  canvas.width = SHARE_CARD_WIDTH;
  canvas.height = SHARE_CARD_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported in this browser.');

  const W = SHARE_CARD_WIDTH;
  const H = SHARE_CARD_HEIGHT;
  const cx = W / 2;

  // ── Background ──
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#12131c');
  bg.addColorStop(0.5, '#08090f');
  bg.addColorStop(1, '#020204');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(cx, 640, 40, cx, 640, 620);
  glow.addColorStop(0, 'rgba(197, 160, 89, 0.22)');
  glow.addColorStop(1, 'rgba(197, 160, 89, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Outer frame ──
  ctx.strokeStyle = GOLD_SOFT;
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, W - 120, H - 120);
  ctx.lineWidth = 1;
  ctx.strokeRect(80, 80, W - 160, H - 160);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // ── Tarot card ──
  const cardW = 440;
  const cardH = 700;
  const cardX = cx - cardW / 2;
  const cardY = 300;
  ctx.fillStyle = 'rgba(197, 160, 89, 0.06)';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = GOLD_SOFT;
  ctx.lineWidth = 1;
  ctx.strokeRect(cardX + 18, cardY + 18, cardW - 36, cardH - 36);

  ctx.fillStyle = GOLD;
  ctx.font = `160px ${FONT_STACK}`;
  ctx.fillText(content.cardSymbol, cx, cardY + 280);

  ctx.fillStyle = WHITE;
  ctx.font = `500 44px ${FONT_STACK}`;
  ctx.fillText(content.cardName, cx, cardY + 500);

  ctx.fillStyle = GOLD_SOFT;
  ctx.font = `28px ${FONT_STACK}`;
  ctx.fillText(content.cardSubtitle, cx, cardY + 570);

  // ── Eyebrow ──
  ctx.fillStyle = GOLD;
  ctx.font = `30px ${FONT_STACK}`;
  ctx.fillText(`✦  ${content.eyebrow}  ✦`, cx, 1150);

  // ── Message (wrapped, max 6 lines) ──
  ctx.fillStyle = WHITE;
  ctx.font = `44px ${FONT_STACK}`;
  const lines = wrapText((t) => ctx.measureText(t).width, `“${content.message}”`, W - 260).slice(0, 6);
  const lineHeight = 72;
  const blockTop = 1250;
  lines.forEach((line, i) => ctx.fillText(line, cx, blockTop + i * lineHeight));

  // ── Brand footer ──
  ctx.fillStyle = GOLD;
  ctx.font = `36px ${FONT_STACK}`;
  ctx.fillText(`✦ ${content.brand}`, cx, H - 220);
  if (content.siteHost) {
    ctx.fillStyle = MUTED;
    ctx.font = `28px ${FONT_STACK}`;
    ctx.fillText(content.siteHost, cx, H - 165);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not create image.'))), 'image/png');
  });
}

/** Public host to print on the card; hidden for local development hosts. */
export function getShareSiteHost(): string {
  const host = window.location.host;
  return /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) ? '' : host;
}
