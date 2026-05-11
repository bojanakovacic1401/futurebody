"use client";

type LiveMoleculeProps = {
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "cyan" | "emerald" | "violet";
  className?: string;
};

const sizeMap = {
  sm: "h-28 w-28",
  md: "h-44 w-44",
  lg: "h-64 w-64",
  xl: "h-80 w-80",
};

const toneMap = {
  cyan: {
    node: "#22d3ee",
    glow: "rgba(34,211,238,.7)",
    soft: "rgba(34,211,238,.18)",
  },
  emerald: {
    node: "#34d399",
    glow: "rgba(52,211,153,.7)",
    soft: "rgba(52,211,153,.18)",
  },
  violet: {
    node: "#a78bfa",
    glow: "rgba(167,139,250,.7)",
    soft: "rgba(167,139,250,.18)",
  },
};

const points = [
  { x: 50, y: 15, r: 5 },
  { x: 76, y: 28, r: 7 },
  { x: 84, y: 56, r: 4 },
  { x: 65, y: 78, r: 8 },
  { x: 36, y: 74, r: 6 },
  { x: 19, y: 50, r: 5 },
  { x: 31, y: 25, r: 4 },
  { x: 52, y: 48, r: 11 },
  { x: 43, y: 35, r: 4 },
  { x: 60, y: 33, r: 4 },
  { x: 47, y: 63, r: 5 },
];

const links = [
  [0, 1],
  [0, 6],
  [0, 8],
  [1, 2],
  [1, 9],
  [2, 3],
  [2, 7],
  [3, 4],
  [3, 10],
  [4, 5],
  [4, 7],
  [5, 6],
  [5, 7],
  [6, 8],
  [7, 8],
  [7, 9],
  [7, 10],
  [8, 9],
  [9, 2],
  [10, 4],
];

export function LiveMolecule({
  size = "md",
  tone = "cyan",
  className = "",
}: LiveMoleculeProps) {
  const colors = toneMap[tone];

  return (
    <div
      className={[
        "futurebody-live-molecule pointer-events-none relative",
        sizeMap[size],
        className,
      ].join(" ")}
      style={
        {
          "--molecule-node": colors.node,
          "--molecule-glow": colors.glow,
          "--molecule-soft": colors.soft,
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,.18),transparent_62%)] blur-xl" />

      <svg
        viewBox="0 0 100 100"
        className="relative z-10 h-full w-full overflow-visible"
      >
        <defs>
          <filter id="moleculeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="moleculeNodeGradient" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="var(--molecule-node)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--molecule-node)" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        <g className="futurebody-molecule-spin">
          <ellipse
            cx="50"
            cy="50"
            rx="47"
            ry="17"
            fill="none"
            stroke="var(--molecule-node)"
            strokeOpacity=".28"
            strokeWidth=".8"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="47"
            ry="17"
            fill="none"
            stroke="var(--molecule-node)"
            strokeOpacity=".16"
            strokeWidth=".8"
            transform="rotate(58 50 50)"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="47"
            ry="17"
            fill="none"
            stroke="var(--molecule-node)"
            strokeOpacity=".16"
            strokeWidth=".8"
            transform="rotate(-58 50 50)"
          />

          {links.map(([from, to], index) => {
            const a = points[from];
            const b = points[to];

            return (
              <line
                key={`${from}-${to}-${index}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--molecule-node)"
                strokeOpacity=".34"
                strokeWidth=".7"
              />
            );
          })}

          {points.map((point, index) => (
            <g
              key={index}
              className="futurebody-molecule-node"
              style={{ animationDelay: `${index * 0.18}s` }}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r={point.r + 3}
                fill="var(--molecule-soft)"
                filter="url(#moleculeGlow)"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r={point.r}
                fill="url(#moleculeNodeGradient)"
                filter="url(#moleculeGlow)"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}