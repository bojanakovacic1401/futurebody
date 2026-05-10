import { ArrowRight } from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { HologramBody } from "./HologramBody";
import { cn } from "@/lib/constants";

type FutureAvatarProps = {
  title?: string;
  subtitle?: string;
  score?: number;
  variant?: "current" | "future" | "improved";
  className?: string;
};

const variantMap = {
  current: {
    label: "Current Path",
    tone: "cyan" as const,
    intensity: 0.8,
  },
  future: {
    label: "5 Years Out",
    tone: "orange" as const,
    intensity: 0.65,
  },
  improved: {
    label: "Improved Path",
    tone: "green" as const,
    intensity: 1.15,
  },
};

export function FutureAvatar({
  title = "Future Self Preview",
  subtitle = "Projected body state",
  score = 88,
  variant = "improved",
  className,
}: FutureAvatarProps) {
  const config = variantMap[variant];

  return (
    <HUDCard className={cn("overflow-hidden p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-full border border-cyan-300/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
          {config.label}
        </div>
      </div>

      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <HologramBody size="md" intensity={config.intensity} />

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-cyan-300/20 bg-slate-950/80 px-4 py-2 text-xs uppercase tracking-[0.14em] text-cyan-200 backdrop-blur">
            <span>Projected Change</span>
            <ArrowRight size={14} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <ScoreGauge value={score} size="md" tone={config.tone} />

          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Readiness
            </div>

            <div
              className={cn(
                "mt-1 text-sm font-bold uppercase tracking-[0.18em]",
                variant === "improved"
                  ? "text-emerald-300"
                  : variant === "future"
                    ? "text-orange-300"
                    : "text-cyan-300"
              )}
            >
              {variant === "improved"
                ? "Optimized"
                : variant === "future"
                  ? "At Risk"
                  : "Baseline"}
            </div>
          </div>
        </div>
      </div>
    </HUDCard>
  );
}