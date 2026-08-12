// KAYA — The K Mark
// Bold geometric K — vertical stem, upper diagonal 35° upward,
// lower diagonal from midpoint of upper arm extending outward
// Forest green on dark/light — confident and authoritative

export function AyuMark({ size = 40, className = "", pulse = false }) {
  const s = size;
  const u = s / 100;
  const sw = s * 0.115; // stroke weight — bold
  const half = sw / 2;

  // Vertical stem
  const stemX = 26 * u;
  const stemTop = 12 * u;
  const stemBot = 88 * u;

  // Nexus — where diagonals meet stem (slightly above centre)
  const nexusY = 46 * u;

  // Upper diagonal — sharp upward to top right
  const upTipX = 80 * u;
  const upTipY = 12 * u;

  // Lower diagonal — from midpoint of upper arm to bottom right
  const midX = (stemX + half + upTipX) / 2;
  const midY = (nexusY + upTipY) / 2;
  const lowTipX = 84 * u;
  const lowTipY = 88 * u;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={`${pulse ? "owl-pulse" : ""} ${className}`}>
      <line x1={stemX} y1={stemTop} x2={stemX} y2={stemBot}
        stroke="#1B7A4A" strokeWidth={sw} strokeLinecap="round" />
      <line x1={stemX + half} y1={nexusY} x2={upTipX} y2={upTipY}
        stroke="#1B7A4A" strokeWidth={sw} strokeLinecap="round" />
      <line x1={midX} y1={midY} x2={lowTipX} y2={lowTipY}
        stroke="#1B7A4A" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

export function KayaWordmark({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <AyuMark size={32} />
      <span className="font-display text-2xl font-semibold tracking-[0.25em] uppercase"
        style={{ color: "var(--text)" }}>
        Kaya
      </span>
    </div>
  );
}

export function AyuWordmark({ className = "" }) { return <KayaWordmark className={className} />; }
export const StrixOwlEye = AyuMark;
export const StrixEyeArc = AyuMark;
export const StrixWordmark = KayaWordmark;
