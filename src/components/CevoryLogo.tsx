interface CevoryLogoProps {
  size?: number;
  className?: string;
}

export function CevoryLogo({ size = 96, className = "" }: CevoryLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      role="img"
      aria-label="Cevory"
    >
      <circle cx="50" cy="50" r="48" stroke="var(--color-accent)" strokeWidth="2.5" />
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="color-mix(in oklch, var(--color-accent), #8b5cf6)"
        strokeWidth="1"
        strokeDasharray="6 4"
      />

      {/* Document */}
      <rect x="30" y="25" width="40" height="50" rx="4" fill="var(--color-accent-dim)" />
      <rect
        x="30"
        y="25"
        width="40"
        height="50"
        rx="4"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1"
      />

      {/* Corner fold */}
      <path d="M58 25 L70 25 L70 37 Z" fill="var(--color-accent-dim)" />
      <path d="M58 25 L70 37" fill="none" stroke="var(--color-accent)" strokeWidth="1" />
      <path
        d="M58 25 L58 37 L70 37"
        fill="none"
        stroke="color-mix(in oklch, var(--color-accent), #8b5cf6)"
        strokeWidth="0.8"
      />

      {/* Lines */}
      <rect x="36" y="35" width="18" height="3" rx="1.5" fill="var(--color-accent)" opacity={0.5} />
      <rect
        x="36"
        y="42"
        width="26"
        height="2.5"
        rx="1.25"
        fill="color-mix(in oklch, var(--color-accent), #8b5cf6)"
        opacity={0.35}
      />
      <rect
        x="36"
        y="48"
        width="22"
        height="2.5"
        rx="1.25"
        fill="color-mix(in oklch, var(--color-accent), #8b5cf6)"
        opacity={0.35}
      />
      <rect
        x="36"
        y="54"
        width="26"
        height="2.5"
        rx="1.25"
        fill="color-mix(in oklch, var(--color-accent), #8b5cf6)"
        opacity={0.35}
      />
      <rect
        x="36"
        y="60"
        width="14"
        height="2.5"
        rx="1.25"
        fill="color-mix(in oklch, var(--color-accent), #8b5cf6)"
        opacity={0.35}
      />

      {/* Check badge */}
      <circle cx="62" cy="68" r="10" fill="var(--color-accent)" />
      <path
        d="M57 68 L60.5 71.5 L67 64"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sparkles */}
      <circle cx="8" cy="20" r="2.5" fill="color-mix(in oklch, var(--color-accent), #8b5cf6)" opacity={0.6} />
      <circle cx="92" cy="30" r="2" fill="var(--color-accent)" opacity={0.5} />
      <circle cx="15" cy="75" r="1.8" fill="var(--color-accent)" opacity={0.4} />
      <circle cx="88" cy="78" r="2.2" fill="color-mix(in oklch, var(--color-accent), #8b5cf6)" opacity={0.5} />
    </svg>
  );
}
