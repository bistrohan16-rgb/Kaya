// KAYA — Life Force Glyph
// A vertical stem with two curved branches rising outward — 
// the Sanskrit energy symbol, the fish cutting upstream, the body in motion

export function KayaMark({ size = 40, className = "", pulse = false }) {
  const s = size;
  const cx = s / 2;

  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${pulse ? "owl-pulse" : ""} ${className}`}>

      {/* Vertical life force stem */}
      <line x1="20" y1="34" x2="20" y2="8"
        stroke="#1B7A4A" strokeWidth="2" strokeLinecap="round" />

      {/* Left branch — curves up and outward */}
      <path d="M20 22 C16 19 10 17 8 13"
        stroke="#1B7A4A" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Right branch — mirrors left */}
      <path d="M20 22 C24 19 30 17 32 13"
        stroke="#1B7A4A" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Upper left branch — lighter, higher */}
      <path d="M20 15 C17 13 13 11 11 8"
        stroke="#1B7A4A" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Upper right branch — mirrors */}
      <path d="M20 15 C23 13 27 11 29 8"
        stroke="#1B7A4A" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Root dot — the source */}
      <circle cx="20" cy="34" r="2" fill="#1B7A4A" />

      {/* Apex dot — the reaching point */}
      <circle cx="20" cy="8" r="1.5" fill="#1B7A4A" opacity="0.7" />
    </svg>
  );
}

export function KayaWordmark({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <KayaMark size={32} />
      <span className="font-display text-2xl font-semibold tracking-[0.2em] text-[var(--text)] uppercase">Kaya</span>
    </div>
  );
}

// Aliases so all existing components still work without changes
export const StrixOwlEye = KayaMark;
export const StrixEyeArc = KayaMark;
export const StrixWordmark = KayaWordmark;
