"use client";

import {
  Brain,
  Flame,
  Moon,
  Target,
  TimerReset,
  Waves,
  Zap,
} from "lucide-react";
import { DEFAULT_HEALTH_INPUT } from "@/lib/constants";
import { calculateScores } from "@/lib/health/scoring";
import { MetricCard } from "@/components/ui/MetricCard";
import { HUDCard } from "@/components/ui/HUDCard";

export function Sidebar() {
  const scores = calculateScores(DEFAULT_HEALTH_INPUT);

  return (
    <aside className="hidden w-[420px] shrink-0 space-y-3 xl:block">
      <MetricCard
        icon={Zap}
        label="Energy Score"
        value={scores.energy}
        status="Strong"
        tone="green"
      />

      <MetricCard
        icon={Target}
        label="Focus Score"
        value={scores.focus}
        status="Sharp"
        tone="cyan"
      />

      <MetricCard
        icon={Brain}
        label="Burnout Risk"
        value={scores.burnout}
        status="Low Risk"
        tone="green"
      />

      <MetricCard
        icon={Flame}
        label="Metabolic Score"
        value={scores.metabolic}
        status="Efficient"
        tone="orange"
      />

      <MetricCard
        icon={TimerReset}
        label="Recovery Score"
        value={scores.recovery}
        status="Good"
        tone="green"
      />

      <MetricCard
        icon={Moon}
        label="Sleep Debt"
        value="1.6"
        unit="hrs"
        status="Minor"
        tone="purple"
      />

      <MetricCard
        icon={Waves}
        label="Stress Load"
        value="34"
        status="Moderate"
        tone="orange"
      />

      <HUDCard className="p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Last Sync
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="text-sm text-cyan-300">2 min ago</div>
            <div className="mt-1 text-xs text-slate-500">
              12 sources connected
            </div>
          </div>

          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-8 rounded-full border border-cyan-300/20 bg-cyan-400/10"
              />
            ))}
          </div>
        </div>
      </HUDCard>
    </aside>
  );
}