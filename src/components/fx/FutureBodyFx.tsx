"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Tone = "cyan" | "emerald" | "violet" | "orange";
type Size = "sm" | "md" | "lg" | "xl";

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

const sizeMap = {
  sm: "h-24 w-24",
  md: "h-40 w-40",
  lg: "h-60 w-60",
  xl: "h-80 w-80",
};

const toneMap = {
  cyan: { node: "#22d3ee", soft: "rgba(34,211,238,.22)" },
  emerald: { node: "#34d399", soft: "rgba(52,211,153,.22)" },
  violet: { node: "#a78bfa", soft: "rgba(167,139,250,.22)" },
  orange: { node: "#fb923c", soft: "rgba(251,146,60,.22)" },
};

function fxStyle(tone: Tone): CSSProperties {
  const colors = toneMap[tone];

  return {
    "--fx-node": colors.node,
    "--fx-soft": colors.soft,
  } as CSSProperties;
}

export function FloatingScanParticles({
  count = 32,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className={["pointer-events-none absolute inset-0 overflow-hidden", className].join(" ")}>
      {Array.from({ length: count }).map((_, index) => {
        const left = 4 + ((index * 37) % 92);
        const top = 5 + ((index * 61) % 90);
        const size = index % 5 === 0 ? 4 : index % 3 === 0 ? 3 : 2;

        return (
          <span
            key={index}
            className="futurebody-floating-particle absolute rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,.95)]"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: index % 4 === 0 ? 0.8 : 0.38,
              animationDelay: `${index * 0.18}s`,
              animationDuration: `${5 + (index % 7)}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function OrbitalAvatarHalo({
  className = "",
}: {
  className?: string;
}) {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className={["pointer-events-none absolute inset-0 flex items-center justify-center", className].join(" ")}>
      <div className="futurebody-orbital-halo relative h-[72%] w-[72%] max-w-[720px] rounded-full border border-cyan-300/20">
        <div className="absolute inset-[8%] rounded-full border border-cyan-300/15" />
        <div className="absolute inset-[18%] rounded-full border border-cyan-300/15" />
        <div className="absolute inset-[28%] rounded-full border border-cyan-300/15" />

        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,.95)]" />
        <span className="absolute bottom-[10%] left-[18%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,.9)]" />
        <span className="absolute right-[16%] top-[22%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,.9)]" />
      </div>
    </div>
  );
}

/* Kept as safe exports, but we do not render these in the updated pages. */
export function LiveMolecule({
  size = "md",
  tone = "cyan",
  className = "",
}: {
  size?: Size;
  tone?: Tone;
  className?: string;
}) {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className={["futurebody-live-molecule pointer-events-none relative", sizeMap[size], className].join(" ")} style={fxStyle(tone)}>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--fx-soft),transparent_62%)] blur-xl" />
      <svg viewBox="0 0 100 100" className="relative z-10 h-full w-full overflow-visible">
        <g className="futurebody-molecule-spin">
          <ellipse cx="50" cy="50" rx="47" ry="17" fill="none" stroke="var(--fx-node)" strokeOpacity=".35" strokeWidth="1" />
          <ellipse cx="50" cy="50" rx="47" ry="17" fill="none" stroke="var(--fx-node)" strokeOpacity=".2" strokeWidth="1" transform="rotate(58 50 50)" />
          <ellipse cx="50" cy="50" rx="47" ry="17" fill="none" stroke="var(--fx-node)" strokeOpacity=".2" strokeWidth="1" transform="rotate(-58 50 50)" />
          {[10, 25, 40, 55, 70, 85].map((x, index) => (
            <circle key={index} cx={x} cy={50 + (index % 2 === 0 ? -18 : 18)} r="4" fill="var(--fx-node)" opacity=".7" />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function RotatingBrain(props: { size?: Size; tone?: Tone; className?: string }) {
  return <LiveMolecule {...props} />;
}

export function DNAHelix({
  size = "md",
  tone = "cyan",
  className = "",
}: {
  size?: Size;
  tone?: Tone;
  className?: string;
}) {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className={["pointer-events-none relative", sizeMap[size], className].join(" ")} style={fxStyle(tone)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle,var(--fx-soft),transparent_65%)] blur-xl" />
      <svg viewBox="0 0 100 160" className="relative z-10 h-full w-full overflow-visible">
        <g className="futurebody-dna-float">
          {Array.from({ length: 14 }).map((_, index) => {
            const y = 12 + index * 10;
            const leftX = Number((50 + Math.sin(index * 0.75) * 28).toFixed(3));
            const rightX = Number((50 + Math.sin(index * 0.75 + Math.PI) * 28).toFixed(3));

            return (
              <g key={index} className="futurebody-dna-step" style={{ animationDelay: `${index * 0.07}s` }}>
                <line x1={leftX} y1={y} x2={rightX} y2={y} stroke="var(--fx-node)" strokeOpacity=".42" strokeWidth="1" />
                <circle cx={leftX} cy={y} r="3" fill="var(--fx-node)" opacity=".9" />
                <circle cx={rightX} cy={y} r="3" fill="var(--fx-node)" opacity=".55" />
              </g>
            );
          })}
          <path d="M50 8 C10 38 90 60 50 88 C10 115 90 130 50 152" fill="none" stroke="var(--fx-node)" strokeWidth="2.2" strokeOpacity=".75" />
          <path d="M50 8 C90 38 10 60 50 88 C90 115 10 130 50 152" fill="none" stroke="var(--fx-node)" strokeWidth="2.2" strokeOpacity=".36" />
        </g>
      </svg>
    </div>
  );
}

export function PulsingHeart({
  size = "sm",
  className = "",
}: {
  size?: Size;
  className?: string;
}) {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className={["futurebody-heart-pulse pointer-events-none relative", sizeMap[size], className].join(" ")}>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,.35),transparent_62%)] blur-xl" />
      <svg viewBox="0 0 100 100" className="relative z-10 h-full w-full overflow-visible">
        <path d="M50 82 C25 60 15 45 18 30 C21 16 38 15 50 29 C62 15 79 16 82 30 C85 45 75 60 50 82 Z" fill="#fb7185" fillOpacity=".78" stroke="#fda4af" strokeWidth="2" className="futurebody-heart-shape" />
        <path d="M33 50 H43 L48 39 L55 62 L61 50 H70" fill="none" stroke="#fecdd3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity=".95" />
      </svg>
    </div>
  );
}
