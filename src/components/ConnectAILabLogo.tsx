interface ConnectAILabLogoProps {
  className?: string;
  size?: number;
}

export function ConnectAILabLogo({ className = '', size = 18 }: ConnectAILabLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      fill="currentColor"
      className={className}
    >
      <g>
        {/* Outer Celestial Seal Circle */}
        <circle cx="0" cy="0" r="44" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.9" />
        {/* Inner Dashed Ring */}
        <circle cx="0" cy="0" r="28" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="4 4" />
        {/* 4-Point Celestial Star */}
        <path d="M 0,-34 Q 0,0 34,0 Q 0,0 0,34 Q 0,0 -34,0 Q 0,0 0,-34 Z" fill="currentColor" />
        {/* Center point */}
        <circle cx="0" cy="0" r="4" fill="#000" />
      </g>
    </svg>
  );
}
