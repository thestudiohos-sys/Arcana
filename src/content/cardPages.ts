// ============================================================
// Static Card Meaning Pages — HTML generator
// ============================================================
// Renders crawlable HTML for the card library (no React, no client JS):
//   EN: /cards/            and /cards/{slug}/
//   KO: /ko/cards/         and /ko/cards/{slug}/
// Called by the Vite plugin in vite.config.ts, which serves these pages
// in dev and writes them into dist/ at build time.
// ============================================================

import { CARD_LIBRARY, CardLibraryEntry } from './cardLibrary';

type Lang = 'en' | 'ko';

export interface StaticPage {
  /** Output file path inside dist/, e.g. "ko/cards/the-fool/index.html". */
  fileName: string;
  /** Public URL path, e.g. "/ko/cards/the-fool/". */
  urlPath: string;
  html: string;
}

const BRAND = 'Arcana by H.O.S';

const UI: Record<Lang, {
  libraryTitle: string;
  libraryHeading: string;
  libraryIntro: string;
  cardTitle: (name: string) => string;
  meaningHeading: string;
  questionsHeading: string;
  practiceHeading: string;
  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
  backToLibrary: string;
  previous: string;
  next: string;
  otherLanguage: string;
  disclaimer: string;
  home: string;
}> = {
  en: {
    libraryTitle: `Tarot Card Meanings: The 22 Major Arcana | ${BRAND}`,
    libraryHeading: 'Tarot Card Meanings',
    libraryIntro:
      'Gentle, reflection-focused meanings for the 22 Major Arcana. Each card offers questions to sit with and a small step for today, not predictions.',
    cardTitle: (name) => `${name} Tarot Card Meaning | ${BRAND}`,
    meaningHeading: 'What this card reflects',
    questionsHeading: 'Questions to sit with',
    practiceHeading: 'A small step for today',
    ctaHeading: 'Reflect on what is on your mind',
    ctaBody: 'Write a few lines about a dream, worry or wish, take a quiet moment, and draw one card. Your 1-card reading is free and complete.',
    ctaButton: 'Start a Free Reading',
    backToLibrary: 'All card meanings',
    previous: 'Previous',
    next: 'Next',
    otherLanguage: '한국어',
    disclaimer:
      'Arcana readings are symbolic content for reflection and entertainment. They do not predict the future or replace professional medical, legal or financial advice.',
    home: 'Home',
  },
  ko: {
    libraryTitle: `타로 카드 의미: 메이저 아르카나 22장 | ${BRAND}`,
    libraryHeading: '타로 카드 의미',
    libraryIntro:
      '메이저 아르카나 22장의 의미를 성찰 중심으로 담았습니다. 예언 대신, 스스로에게 던져 볼 질문과 오늘 해 볼 작은 행동을 함께 전합니다.',
    cardTitle: (name) => `타로 ${name} 카드 의미 | ${BRAND}`,
    meaningHeading: '이 카드가 비추는 것',
    questionsHeading: '스스로에게 물어보기',
    practiceHeading: '오늘 해 볼 작은 행동',
    ctaHeading: '마음에 남은 일을 정리해 보세요',
    ctaBody: '꿈이나 고민, 소망을 몇 줄 적고 잠시 마음을 가다듬은 뒤 카드 한 장을 뽑아 보세요. 1장 리딩은 무료이며, 그 자체로 완성됩니다.',
    ctaButton: '무료 리딩 시작하기',
    backToLibrary: '전체 카드 의미',
    previous: '이전 카드',
    next: '다음 카드',
    otherLanguage: 'English',
    disclaimer:
      'Arcana의 리딩은 성찰과 즐거움을 위한 상징적 콘텐츠이며, 미래를 예측하거나 의료·법률·재정 분야의 전문적인 조언을 대신하지 않습니다.',
    home: '홈',
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function libraryPath(lang: Lang): string {
  return lang === 'ko' ? '/ko/cards/' : '/cards/';
}

function cardPath(lang: Lang, slug: string): string {
  return `${libraryPath(lang)}${slug}/`;
}

/** Link back into the app's free reading, opening it in the page's language. */
function readingLink(lang: Lang): string {
  return lang === 'ko' ? '/?lang=ko#reading' : '/?lang=en#reading';
}

function normalizeSiteUrl(siteUrl?: string): string | undefined {
  const trimmed = siteUrl?.trim().replace(/\/+$/, '');
  return trimmed ? trimmed : undefined;
}

const STYLES = `
*{margin:0;padding:0;box-sizing:border-box}
:root{--gold:#c5a059;--gold-soft:rgba(197,160,89,.4);--text:#f4f1ea;--muted:rgba(244,241,234,.62);--faint:rgba(244,241,234,.38)}
html{background:#000}
body{background:radial-gradient(ellipse at top,#16140f 0%,#050506 55%,#000 100%) fixed;color:var(--text);font-family:"Space Mono","Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",monospace;line-height:1.75;min-height:100vh}
a{color:inherit}
.wrap{max-width:760px;margin:0 auto;padding:28px 16px 64px}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:13px;margin-bottom:40px}
.brand{text-decoration:none;color:var(--text);letter-spacing:.04em}
.brand span{color:var(--gold)}
.lang{color:var(--muted);text-decoration:none;border:1px solid rgba(255,255,255,.15);border-radius:999px;padding:4px 12px}
.crumb{font-size:12px;color:var(--faint);margin-bottom:24px}
.crumb a{color:var(--muted);text-decoration:none}
.eyebrow{color:var(--gold);font-size:12px;letter-spacing:.25em;text-transform:uppercase}
h1{font-weight:300;font-size:clamp(28px,6vw,44px);line-height:1.25;margin:8px 0 12px}
h2{font-weight:400;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
.intro{color:var(--muted);font-size:15px;max-width:620px}
.hero{display:flex;gap:28px;align-items:center;flex-wrap:wrap;margin-bottom:36px}
.card{width:150px;aspect-ratio:2/3;border:1px solid var(--gold);border-radius:14px;background:linear-gradient(#1a1710,#000);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 40px rgba(197,160,89,.18);flex-shrink:0}
.card .sym{font-size:38px;color:var(--gold);margin-bottom:8px}
.card .num{font-size:11px;color:var(--muted);letter-spacing:.2em}
.hero-text{flex:1;min-width:220px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.chip{font-size:12px;color:var(--gold);border:1px solid var(--gold-soft);border-radius:999px;padding:2px 10px}
.summary{font-size:16px;color:var(--text)}
section{border-top:1px solid rgba(255,255,255,.08);padding:24px 0}
section p,section li{color:rgba(244,241,234,.85);font-size:15px}
ul{list-style:none}
li{padding-left:18px;position:relative;margin-bottom:8px}
li::before{content:"✦";position:absolute;left:0;color:var(--gold);font-size:11px;top:5px}
.cta{margin-top:12px;border:1px solid var(--gold-soft);border-radius:16px;padding:24px;background:rgba(197,160,89,.05);text-align:center}
.cta p{color:var(--muted);font-size:14px;margin:8px 0 18px}
.btn{display:inline-block;text-decoration:none;border:1px solid var(--gold);color:#000;background:var(--gold);border-radius:999px;padding:12px 24px;font-size:13px;letter-spacing:.12em;text-transform:uppercase}
.pager{display:flex;justify-content:space-between;gap:12px;margin-top:32px;font-size:13px}
.pager a{color:var(--muted);text-decoration:none;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:10px 14px;max-width:48%}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin-top:32px}
.tile{display:block;text-decoration:none;border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:18px;background:rgba(255,255,255,.02)}
.tile:hover{border-color:var(--gold-soft)}
.tile .sym{color:var(--gold);font-size:22px}
.tile .name{display:block;font-size:15px;margin:6px 0 4px}
.tile .num{display:block;font-size:11px;color:var(--faint);letter-spacing:.1em;line-height:1.5;margin-bottom:8px}
.tile p{font-size:13px;color:var(--muted);line-height:1.6}
.disclaimer{margin-top:48px;font-size:11px;color:var(--faint);text-align:center}
`;

function headTags(params: {
  lang: Lang;
  title: string;
  description: string;
  urlPathEn: string;
  urlPathKo: string;
  siteUrl?: string;
}): string {
  const { lang, title, description, urlPathEn, urlPathKo, siteUrl } = params;
  const ownPath = lang === 'ko' ? urlPathKo : urlPathEn;
  const absolute = siteUrl
    ? `
    <link rel="canonical" href="${escapeHtml(siteUrl + ownPath)}" />
    <link rel="alternate" hreflang="en" href="${escapeHtml(siteUrl + urlPathEn)}" />
    <link rel="alternate" hreflang="ko" href="${escapeHtml(siteUrl + urlPathKo)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(siteUrl + urlPathEn)}" />
    <meta property="og:url" content="${escapeHtml(siteUrl + ownPath)}" />`
    : '';
  return `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${BRAND}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:locale" content="${lang === 'ko' ? 'ko_KR' : 'en_US'}" />${absolute}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
    <style>${STYLES}</style>`;
}

function topBar(lang: Lang, otherLangHref: string): string {
  const t = UI[lang];
  return `<header class="top">
      <a class="brand" href="/${lang === 'ko' ? '?lang=ko' : ''}"><span>✦</span> ${BRAND}</a>
      <a class="lang" href="${otherLangHref}" hreflang="${lang === 'ko' ? 'en' : 'ko'}">${t.otherLanguage}</a>
    </header>`;
}

function renderCardPage(card: CardLibraryEntry, index: number, lang: Lang, siteUrl?: string): string {
  const t = UI[lang];
  const text = card[lang];
  const prev = CARD_LIBRARY[index - 1];
  const next = CARD_LIBRARY[index + 1];
  const otherLang: Lang = lang === 'ko' ? 'en' : 'ko';

  return `<!doctype html>
<html lang="${lang}">
  <head>
    ${headTags({
      lang,
      title: t.cardTitle(text.name),
      description: `${text.summary} ${text.keywords.join(' · ')}`,
      urlPathEn: cardPath('en', card.slug),
      urlPathKo: cardPath('ko', card.slug),
      siteUrl,
    })}
  </head>
  <body>
    <main class="wrap">
      ${topBar(lang, cardPath(otherLang, card.slug))}
      <nav class="crumb"><a href="${libraryPath(lang)}">${t.libraryHeading}</a> / ${escapeHtml(text.name)}</nav>

      <div class="hero">
        <div class="card" aria-hidden="true">
          <span class="sym">${card.symbol}</span>
          <span class="num">${card.numeral}</span>
        </div>
        <div class="hero-text">
          <p class="eyebrow">Major Arcana · ${card.numeral}</p>
          <h1>${escapeHtml(text.name)}</h1>
          <p class="summary">${escapeHtml(text.summary)}</p>
          <div class="chips">${text.keywords.map((k) => `<span class="chip">${escapeHtml(k)}</span>`).join('')}</div>
        </div>
      </div>

      <section>
        <h2>${t.meaningHeading}</h2>
        <p>${escapeHtml(text.meaning)}</p>
      </section>
      <section>
        <h2>${t.questionsHeading}</h2>
        <ul>${text.questions.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}</ul>
      </section>
      <section>
        <h2>${t.practiceHeading}</h2>
        <p>${escapeHtml(text.practice)}</p>
      </section>

      <div class="cta">
        <h2>${t.ctaHeading}</h2>
        <p>${t.ctaBody}</p>
        <a class="btn" href="${readingLink(lang)}">${t.ctaButton}</a>
      </div>

      <nav class="pager">
        ${prev ? `<a href="${cardPath(lang, prev.slug)}">← ${t.previous}: ${escapeHtml(prev[lang].name)}</a>` : `<a href="${libraryPath(lang)}">← ${t.backToLibrary}</a>`}
        ${next ? `<a href="${cardPath(lang, next.slug)}">${t.next}: ${escapeHtml(next[lang].name)} →</a>` : `<a href="${libraryPath(lang)}">${t.backToLibrary} →</a>`}
      </nav>

      <p class="disclaimer">${t.disclaimer}</p>
    </main>
  </body>
</html>
`;
}

function renderLibraryPage(lang: Lang, siteUrl?: string): string {
  const t = UI[lang];
  const otherLang: Lang = lang === 'ko' ? 'en' : 'ko';
  const tiles = CARD_LIBRARY.map((card) => {
    const text = card[lang];
    return `<a class="tile" href="${cardPath(lang, card.slug)}">
          <span class="sym" aria-hidden="true">${card.symbol}</span>
          <span class="name">${escapeHtml(text.name)}</span>
          <span class="num">${card.numeral} · ${escapeHtml(text.keywords.join(' · '))}</span>
          <p>${escapeHtml(text.summary)}</p>
        </a>`;
  }).join('\n        ');

  return `<!doctype html>
<html lang="${lang}">
  <head>
    ${headTags({
      lang,
      title: t.libraryTitle,
      description: t.libraryIntro,
      urlPathEn: libraryPath('en'),
      urlPathKo: libraryPath('ko'),
      siteUrl,
    })}
  </head>
  <body>
    <main class="wrap">
      ${topBar(lang, libraryPath(otherLang))}
      <p class="eyebrow">Major Arcana</p>
      <h1>${t.libraryHeading}</h1>
      <p class="intro">${t.libraryIntro}</p>
      <div class="grid">
        ${tiles}
      </div>
      <div class="cta" style="margin-top:40px">
        <h2>${t.ctaHeading}</h2>
        <p>${t.ctaBody}</p>
        <a class="btn" href="${readingLink(lang)}">${t.ctaButton}</a>
      </div>
      <p class="disclaimer">${t.disclaimer}</p>
    </main>
  </body>
</html>
`;
}

function renderSitemap(siteUrl: string, pages: StaticPage[]): string {
  const urls = ['/', ...pages.map((p) => p.urlPath)]
    .map((path) => `  <url><loc>${escapeHtml(siteUrl + path)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * All static card pages. Pass the public site URL (e.g. https://example.com)
 * to add canonical/hreflang tags plus sitemap.xml and robots.txt; without it,
 * only the HTML pages are produced.
 */
export function buildCardPages(options: { siteUrl?: string } = {}): {
  pages: StaticPage[];
  extraFiles: { fileName: string; source: string }[];
} {
  const siteUrl = normalizeSiteUrl(options.siteUrl);
  const pages: StaticPage[] = [];

  for (const lang of ['en', 'ko'] as const) {
    const libPath = libraryPath(lang);
    pages.push({ fileName: `${libPath.slice(1)}index.html`, urlPath: libPath, html: renderLibraryPage(lang, siteUrl) });
    CARD_LIBRARY.forEach((card, index) => {
      const path = cardPath(lang, card.slug);
      pages.push({ fileName: `${path.slice(1)}index.html`, urlPath: path, html: renderCardPage(card, index, lang, siteUrl) });
    });
  }

  const extraFiles = siteUrl
    ? [
        { fileName: 'sitemap.xml', source: renderSitemap(siteUrl, pages) },
        { fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` },
      ]
    : [];

  return { pages, extraFiles };
}

/** Public URL of a card's meaning page in the given language. */
export function cardMeaningUrl(lang: Lang, slug: string): string {
  return cardPath(lang, slug);
}

export function cardLibraryUrl(lang: Lang): string {
  return libraryPath(lang);
}
