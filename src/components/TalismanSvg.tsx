import { DigitalTalismanOption, Language } from '../types/reading';

interface TalismanSvgProps {
  option: DigitalTalismanOption;
  language: Language;
  isThumbnail?: boolean;
}

export function TalismanSvg({ option, language, isThumbnail = false }: TalismanSvgProps) {
  const isKo = language === 'ko';
  const phrase = isKo ? option.phraseKo : option.phraseEn;
  const title = isKo ? option.titleKo : option.titleEn;

  const { style, symbolMotif, primaryColor, accentColor } = option;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1080 1920"
      className="w-full h-full select-none"
      aria-hidden="true"
    >
      <defs>
        {/* Background Gradients */}
        <linearGradient id={`bg-grad-${option.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0c0d14" />
          <stop offset="50%" stopColor="#06070a" />
          <stop offset="100%" stopColor="#020204" />
        </linearGradient>

        {/* Gold Metallic Accent Gradient */}
        <linearGradient id={`gold-grad-${option.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e5ab" />
          <stop offset="50%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#8a6d3b" />
        </linearGradient>

        {/* Radial Glow Filter */}
        <filter id={`glow-${option.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ── BACKGROUND CANVAS ── */}
      <rect width="1080" height="1920" fill={`url(#bg-grad-${option.id})`} />

      {/* Background Radial Glow */}
      <circle
        cx="540"
        cy="900"
        r="420"
        fill={primaryColor}
        opacity="0.08"
        filter={`url(#glow-${option.id})`}
      />

      {/* ── OUTER BORDER FRAME (ARCANA 9:16 WALLPAPER FRAME) ── */}
      <rect
        x="60"
        y="60"
        width="960"
        height="1800"
        rx="24"
        fill="none"
        stroke={`url(#gold-grad-${option.id})`}
        strokeWidth="4"
        opacity="0.4"
      />
      <rect
        x="80"
        y="80"
        width="920"
        height="1760"
        rx="16"
        fill="none"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeDasharray="12 6"
        opacity="0.25"
      />

      {/* Four Corner Decorative Elements */}
      <g stroke={`url(#gold-grad-${option.id})`} strokeWidth="3" fill="none" opacity="0.7">
        {/* Top Left */}
        <path d="M 90 140 L 90 90 L 140 90" />
        <circle cx="105" cy="105" r="4" fill={primaryColor} />
        {/* Top Right */}
        <path d="M 990 140 L 990 90 L 940 90" />
        <circle cx="975" cy="105" r="4" fill={primaryColor} />
        {/* Bottom Left */}
        <path d="M 90 1780 L 90 1830 L 140 1830" />
        <circle cx="105" cy="1815" r="4" fill={primaryColor} />
        {/* Bottom Right */}
        <path d="M 990 1780 L 990 1830 L 940 1830" />
        <circle cx="975" cy="1815" r="4" fill={primaryColor} />
      </g>

      {/* Header Emblem */}
      <text
        x="540"
        y="220"
        fill={accentColor}
        fontSize="24"
        fontFamily="serif"
        letterSpacing="12"
        textAnchor="middle"
        opacity="0.6"
      >
        ✦  A R C A N A  ✦
      </text>

      {/* ── VISUAL FAMILY GEOMETRY ── */}
      <g transform="translate(540, 850)">
        {style === 'radiant' && (
          <g>
            {/* 12 Outer Radial Rays */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12;
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-380"
                  stroke={`url(#gold-grad-${option.id})`}
                  strokeWidth={i % 3 === 0 ? '3' : '1.5'}
                  opacity={i % 3 === 0 ? '0.6' : '0.3'}
                  transform={`rotate(${angle})`}
                />
              );
            })}

            {/* Concentric Rays Rings */}
            <circle r="340" fill="none" stroke={primaryColor} strokeWidth="2" strokeDasharray="8 8" opacity="0.35" />
            <circle r="260" fill="none" stroke={primaryColor} strokeWidth="3" opacity="0.5" />
            <polygon
              points="0,-220 155,-155 220,0 155,155 0,220 -155,155 -220,0 -155,-155"
              fill="none"
              stroke={`url(#gold-grad-${option.id})`}
              strokeWidth="2.5"
              opacity="0.6"
            />
            <circle r="140" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.8" />
          </g>
        )}

        {style === 'guardian' && (
          <g>
            {/* Concentric Layered Shields & Rings */}
            <circle r="360" fill="none" stroke={`url(#gold-grad-${option.id})`} strokeWidth="3" opacity="0.5" />
            <circle r="330" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="6 6" opacity="0.4" />
            <circle r="280" fill="none" stroke={primaryColor} strokeWidth="3" opacity="0.6" />

            {/* Octagonal Shield Frame */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 360) / 8;
              return (
                <g key={i} transform={`rotate(${angle})`}>
                  <line x1="0" y1="-280" x2="0" y2="-360" stroke={primaryColor} strokeWidth="2" opacity="0.5" />
                  <circle cx="0" cy="-280" r="6" fill={accentColor} opacity="0.8" />
                </g>
              );
            })}

            <polygon
              points="0,-220 155,-155 220,0 155,155 0,220 -155,155 -220,0 -155,-155"
              fill="none"
              stroke={primaryColor}
              strokeWidth="2"
              opacity="0.4"
            />
            <circle r="160" fill="none" stroke={`url(#gold-grad-${option.id})`} strokeWidth="4" opacity="0.8" />
          </g>
        )}

        {style === 'mirror' && (
          <g>
            {/* Vertical Symmetry Axis & Diamond Gate */}
            <line x1="0" y1="-420" x2="0" y2="420" stroke={`url(#gold-grad-${option.id})`} strokeWidth="2" opacity="0.4" />
            <line x1="-300" y1="0" x2="300" y2="0" stroke={primaryColor} strokeWidth="1.5" opacity="0.3" />

            {/* Oval Mirror Aperture */}
            <ellipse rx="240" ry="340" fill="none" stroke={`url(#gold-grad-${option.id})`} strokeWidth="3" opacity="0.6" />
            <ellipse rx="200" ry="290" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="10 5" opacity="0.4" />

            {/* Dual Balanced Arcs */}
            <path d="M -240 0 A 240 240 0 0 1 240 0" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.5" />
            <path d="M -240 0 A 240 240 0 0 0 240 0" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.5" />

            <circle r="130" fill="none" stroke={primaryColor} strokeWidth="2.5" opacity="0.7" />
          </g>
        )}

        {/* ── CENTRAL SYMBOL MOTIF ── */}
        <g stroke={`url(#gold-grad-${option.id})`} fill="none" strokeWidth="3">
          {symbolMotif === 'sun' && (
            <g>
              <circle r="70" fill={primaryColor} opacity="0.15" />
              <circle r="70" stroke={accentColor} strokeWidth="3" />
              <circle r="30" fill={accentColor} opacity="0.9" />
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1="-75"
                  x2="0"
                  y2="-105"
                  stroke={accentColor}
                  strokeWidth="3"
                  transform={`rotate(${i * 45})`}
                />
              ))}
            </g>
          )}

          {symbolMotif === 'star' && (
            <g>
              <path
                d="M 0 -95 L 25 -30 L 90 -30 L 38 10 L 58 75 L 0 35 L -58 75 L -38 10 L -90 -30 L -25 -30 Z"
                fill={primaryColor}
                fillOpacity="0.2"
                stroke={accentColor}
                strokeWidth="3"
              />
              <circle r="16" fill={accentColor} />
            </g>
          )}

          {symbolMotif === 'moon' && (
            <g transform="translate(-10, -5)">
              <path
                d="M 20 -70 A 65 65 0 1 0 20 70 A 50 50 0 1 1 20 -70 Z"
                fill={`url(#gold-grad-${option.id})`}
                stroke={accentColor}
                strokeWidth="2"
              />
              <circle cx="-40" cy="0" r="8" fill={accentColor} opacity="0.8" />
            </g>
          )}

          {symbolMotif === 'shield' && (
            <g>
              <path
                d="M 0 -80 C 50 -80 70 -50 70 0 C 70 60 0 95 0 95 C 0 95 -70 60 -70 0 C -70 -50 -50 -80 0 -80 Z"
                fill={primaryColor}
                fillOpacity="0.2"
                stroke={accentColor}
                strokeWidth="3"
              />
              <line x1="0" y1="-60" x2="0" y2="70" stroke={accentColor} strokeWidth="2" />
              <line x1="-50" y1="0" x2="50" y2="0" stroke={accentColor} strokeWidth="2" />
            </g>
          )}

          {symbolMotif === 'compass' && (
            <g>
              <circle r="75" stroke={accentColor} strokeWidth="2" />
              <polygon points="0,-85 15,0 0,85 -15,0" fill={`url(#gold-grad-${option.id})`} />
              <polygon points="-85,0 0,15 85,0 0,-15" fill={primaryColor} opacity="0.6" />
              <circle r="12" fill="#000" stroke={accentColor} strokeWidth="2" />
            </g>
          )}

          {symbolMotif === 'lotus' && (
            <g>
              <path d="M 0 60 C -80 20 -70 -60 0 -80 C 70 -60 80 20 0 60 Z" fill={primaryColor} fillOpacity="0.25" stroke={accentColor} strokeWidth="2.5" />
              <path d="M -20 60 C -100 0 -50 -70 0 -80 C -40 -30 -30 30 -20 60 Z" fill="none" stroke={accentColor} strokeWidth="2" />
              <path d="M 20 60 C 100 0 50 -70 0 -80 C 40 -30 30 30 20 60 Z" fill="none" stroke={accentColor} strokeWidth="2" />
              <circle cx="0" cy="-20" r="10" fill={accentColor} />
            </g>
          )}
        </g>
      </g>

      {/* ── TALISMAN TITLE ── */}
      <text
        x="540"
        y="1420"
        fill="#ffffff"
        fontSize={isThumbnail ? '48' : '44'}
        fontFamily="sans-serif"
        fontWeight="300"
        letterSpacing="6"
        textAnchor="middle"
      >
        {title}
      </text>

      {/* Divider */}
      <line x1="440" y1="1470" x2="640" y2="1470" stroke={`url(#gold-grad-${option.id})`} strokeWidth="2" opacity="0.6" />

      {/* ── SYMBOLIC REFLECTION PHRASE ── */}
      <text
        x="540"
        y="1540"
        fill={accentColor}
        fontSize="30"
        fontFamily="sans-serif"
        fontWeight="300"
        letterSpacing="2"
        textAnchor="middle"
        opacity="0.9"
      >
        "{phrase}"
      </text>

      {/* ── FOOTER BRANDING WATERMARK ── */}
      <g transform="translate(540, 1750)">
        <text
          x="0"
          y="0"
          fill={primaryColor}
          fontSize="20"
          fontFamily="serif"
          letterSpacing="8"
          textAnchor="middle"
          opacity="0.5"
        >
          ARCANA BY H.O.S
        </text>
        <text
          x="0"
          y="28"
          fill="#ffffff"
          fontSize="14"
          fontFamily="monospace"
          letterSpacing="4"
          textAnchor="middle"
          opacity="0.3"
        >
          DIGITAL TALISMAN COLLECTION
        </text>
      </g>
    </svg>
  );
}
