import { cn } from "@/lib/constants";

type ScoreGaugeProps = {
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  tone?: "cyan" | "green" | "orange" | "purple";
};

const sizeMap = {
  sm: {
    box: "h-24 w-24",
    text: "text-2xl",
    radius: 38,
    stroke: 7,
  },
  md: {
    box: "h-36 w-36",
    text: "text-4xl",
    radius: 54,
    stroke: 8,
  },
  lg: {
    box: "h-48 w-48",
    text: "text-6xl",
    radius: 74,
    stroke: 10,
  },
};

const toneMap = {
  cyan: {
    stroke: "#22d3ee",
    text: "text-cyan-200",
    glow: "shadow-[0_0_30px_rgba(34,211,238,.35)]",
  },
  green: {
    stroke: "#34d399",
    text: "text-emerald-200",
    glow: "shadow-[0_0_30px_rgba(52,211,153,.28)]",
  },
  orange: {
    stroke: "#fb923c",
    text: "text-orange-200",
    glow: "shadow-[0_0_30px_rgba(251,146,60,.25)]",
  },
  purple: {
    stroke: "#a78bfa",
    text: "text-violet-200",
    glow: "shadow-[0_0_30px_rgba(167,139,250,.25)]",
  },
};

export function ScoreGauge({
  value,
  label = "/100",
  size = "md",
  tone = "cyan",
}: ScoreGaugeProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  const config = sizeMap[size];
  const toneConfig = toneMap[tone];

  const circumference = 2 * Math.PI * config.radius;
  const dashOffset = circumference - (safeValue / 100) * circumference;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full",
        config.box,
        toneConfig.glow
      )}
    >
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={config.radius}
          fill="none"
          stroke="rgba(148,163,184,.16)"
          strokeWidth={config.stroke}
        />

        <circle
          cx="80"
          cy="80"
          r={config.radius}
          fill="none"
          stroke={toneConfig.stroke}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700"
        />
      </svg>

      <div className="relative text-center">
        <div className={cn("font-light text-white", config.text)}>{safeValue}</div>
        <div className={cn("text-xs font-semibold uppercase tracking-[0.18em]", toneConfig.text)}>
          {label}
        </div>
      </div>
    </div>
  );
}