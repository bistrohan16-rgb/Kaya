// KAYA — The K Mark
// A bold geometric K with dynamic diagonals
// The upper diagonal angles upward — energy, aspiration, performance
// The lower diagonal angles outward — strength, stability, grounding
// Clean gold on black — timeless and authoritative

export function AyuMark({ size = 40, className = "", pulse = false }) {
  const s = size;
  const u = s / 100;

  // Stroke weight — bold and confident
  const sw = s * 0.11;
  const half = sw / 2;

  // Vertical stem — left side of K
  const stemX   = 28 * u;
  const stemTop = 14 * u;
  const stemBot = 86 * u;

  // The two diagonals meet at a nexus point on the stem
  // Upper diagonal: from nexus up-right to top-right
  // Lower diagonal: from nexus down-right to bottom-right
  const nexusX  = stemX;
  const nexusY  = s * 0.48; // slightly above centre — creates upward energy

  // Upper arm — angles upward aggressively
  const upperTipX = 78 * u;
  const upperTipY = 14 * u;

  // Lower arm — angles outward and down
  const lowerTipX = 82 * u;
  const lowerTipY = 86 * u;

  // Small notch where diagonals meet stem — classic K detail
  // The two arms meet the stem at a clean point
  const notchY = nexusY;

  return (
    <svg
      width={s} height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${pulse ? "owl-pulse" : ""} ${className}`}
    >
      {/* Vertical stem */}
      <line
        x1={stemX} y1={stemTop}
        x2={stemX} y2={stemBot}
        stroke="#B8960C"
        strokeWidth={sw}
        strokeLinecap="round"
      />

      {/* Upper diagonal — stem to upper right tip */}
      <line
        x1={stemX + half} y1={notchY}
        x2={upperTipX} y2={upperTipY}
        stroke="#B8960C"
        strokeWidth={sw}
        strokeLinecap="round"
      />

      {/* Lower diagonal — from upper diagonal midpoint to lower right tip */}
      {/* Classic K: lower arm starts from mid-upper-arm, not from stem */}
      <line
        x1={(stemX + half + upperTipX) / 2} y1={(notchY + upperTipY) / 2}
        x2={lowerTipX} y2={lowerTipY}
        stroke="#B8960C"
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function KayaWordmark({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <AyuMark size={32} />
      <span className="font-display text-2xl font-semibold tracking-[0.25em] text-[#F8F8F8] uppercase">
        Kaya
      </span>
    </div>
  );
}

export function AyuWordmark({ className = "" }) {
  return <KayaWordmark className={className} />;
}

// Compatibility aliases
export const StrixOwlEye = AyuMark;
export const StrixEyeArc = AyuMark;
export const StrixWordmark = KayaWordmark;
