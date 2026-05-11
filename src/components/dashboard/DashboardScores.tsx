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
import { calculateHealthScores } from "@/lib/health/scoring";
import { MetricCard } from "@/components/ui/MetricCard";

export function DashboardScores() {
  const scores = calculateHealthScores(DEFAULT_HEALTH_INPUT);

  return (
    <section className="space-y-3">
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
    </section>
  );
}