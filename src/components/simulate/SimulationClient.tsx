"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Bed,
  Brain,
  Flame,
  Footprints,
  GlassWater,
  Leaf,
  Play,
  Scale,
  Sparkles,
  Zap,
} from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { defaultHealthInput } from "@/lib/health/defaults";
import {
  getStoredHealthInput,
  saveStoredHealthInput,
  saveStoredSimulationScenario,
} from "@/lib/health/storage";
import {
  applyIntervention,
  getInterventionImpact,
  type InterventionInput,
} from "@/lib/health/interventions";
import { getRecommendations } from "@/lib/health/recommendations";

type SliderConfig = {
  key: keyof InterventionInput;
  label: string;
  valueLabel: string;
  minLabel: string;
  maxLabel: string;
  min: number;
  max: number;
  step: number;
  icon: LucideIcon;
};

const sliderConfigs: SliderConfig[] = [
  {
    key: "sleep",
    label: "Sleep",
    valueLabel: "hrs",
    minLabel: "4",
    maxLabel: "10",
    min: 4,
    max: 10,
    step: 0.5,
    icon: Bed,
  },
  {
    key: "steps",
    label: "Walking",
    valueLabel: "steps",
    minLabel: "1K",
    maxLabel: "15K",
    min: 1000,
    max: 15000,
    step: 500,
    icon: Footprints,
  },
  {
    key: "stress",
    label: "Stress",
    valueLabel: "/100",
    minLabel: "0",
    maxLabel: "100",
    min: 0,
    max: 100,
    step: 1,
    icon: Brain,
  },
  {
    key: "diet",
    label: "Diet Quality",
    valueLabel: "/100",
    minLabel: "0",
    maxLabel: "100",
    min: 0,
    max: 100,
    step: 1,
    icon: Leaf,
  },
  {
    key: "alcohol",
    label: "Alcohol",
    valueLabel: "/week",
    minLabel: "0",
    maxLabel: "14",
    min: 0,
    max: 14,
    step: 1,
    icon: GlassWater,
  },
  {
    key: "weight",
    label: "Weight",
    valueLabel: "kg",
    minLabel: "45",
    maxLabel: "130",
    min: 45,
    max: 130,
    step: 1,
    icon: Scale,
  },
];

function formatValue(key: keyof InterventionInput, value?: number) {
  if (value === undefined) return "-";

  if (key === "steps") {
    return value.toLocaleString();
  }

  if (key === "sleep") {
    return value.toFixed(1);
  }

  return String(value);
}

function getProgress(config: SliderConfig, value?: number) {
  if (value === undefined) return 0;

  return ((value - config.min) / (config.max - config.min)) * 100;
}

export function SimulationClient() {
  const router = useRouter();

  const [input, setInput] = useState(defaultHealthInput);

  const [intervention, setIntervention] = useState<InterventionInput>({
    sleep: 7.5,
    steps: 8000,
    stress: 40,
    diet: 82,
    alcohol: 2,
    weight: 68,
    strength: 3,
    cardio: 150,
  });

  useEffect(() => {
    const stored = getStoredHealthInput();
    setInput(stored);

    setIntervention((current) => ({
      ...current,
      weight: stored.goalWeight || stored.weight,
    }));
  }, []);

  const improvedInput = useMemo(
    () => applyIntervention(input, intervention),
    [input, intervention]
  );

  const impact = useMemo(
    () => getInterventionImpact(input, intervention),
    [input, intervention]
  );

  const recommendations = useMemo(
    () => getRecommendations(input),
    [input]
  );

  const outcomeCards = [
    {
      label: "Energy Score",
      current: impact.current.energy,
      improved: impact.improved.energy,
      delta: impact.delta.energy,
      icon: Zap,
    },
    {
      label: "Focus Score",
      current: impact.current.focus,
      improved: impact.improved.focus,
      delta: impact.delta.focus,
      icon: Brain,
    },
    {
      label: "Recovery",
      current: impact.current.recovery,
      improved: impact.improved.recovery,
      delta: impact.delta.recovery,
      icon: Flame,
    },
    {
      label: "Metabolic",
      current: impact.current.metabolic,
      improved: impact.improved.metabolic,
      delta: impact.delta.metabolic,
      icon: Leaf,
    },
    {
      label: "Readiness",
      current: impact.current.readiness,
      improved: impact.improved.readiness,
      delta: impact.delta.readiness,
      icon: Sparkles,
    },
  ];

  function updateIntervention(key: keyof InterventionInput, value: number) {
    setIntervention((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function saveBaseline() {
    setInput(improvedInput);
    saveStoredHealthInput(improvedInput);
  }

  function runSimulation() {
    saveStoredSimulationScenario(input, intervention);
    router.push("/timeline");
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5">
      <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/35 p-6">
        <ScanBackground />

        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
              Intervention Simulator
            </h1>
            <p className="mt-2 max-w-3xl text-slate-400">
              Adjust lifestyle factors and instantly preview how your projected
              health trajectory changes.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                setIntervention({
                  sleep: 7.5,
                  steps: 8000,
                  stress: 40,
                  diet: 82,
                  alcohol: 2,
                  weight: input.goalWeight || input.weight,
                  strength: 3,
                  cardio: 150,
                })
              }
              className="flex h-12 w-fit items-center gap-3 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-5 text-sm font-bold uppercase tracking-[0.16em] text-cyan-200"
            >
              Reset Scenario
            </button>

            <button
              type="button"
              onClick={saveBaseline}
              className="flex h-12 w-fit items-center gap-3 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-5 text-sm font-bold uppercase tracking-[0.16em] text-emerald-200"
            >
              Save As Baseline
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_520px]">
        <HUDCard className="p-6">
          <div className="mb-6 text-lg font-bold uppercase tracking-[0.18em] text-white">
            Lifestyle Interventions
          </div>

          <div className="space-y-4">
            {sliderConfigs.map((config) => {
              const Icon = config.icon;
              const value = Number(intervention[config.key] ?? config.min);
              const progress = getProgress(config, value);

              return (
                <div
                  key={config.key}
                  className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
                        <Icon size={24} />
                      </div>

                      <div>
                        <div className="font-bold uppercase tracking-[0.16em] text-white">
                          {config.label}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Current scenario adjustment
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-light text-cyan-300">
                        {formatValue(config.key, value)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {config.valueLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="w-10 text-sm text-slate-500">
                      {config.minLabel}
                    </span>

                    <div className="flex-1">
  <input
    type="range"
    min={config.min}
    max={config.max}
    step={config.step}
    value={value}
    onChange={(event) =>
      updateIntervention(config.key, Number(event.target.value))
    }
    className="future-slider"
    style={
      {
        "--progress": `${progress}%`,
      } as React.CSSProperties
    }
  />
</div>

                    <span className="w-12 text-right text-sm text-slate-500">
                      {config.maxLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </HUDCard>

        <aside className="space-y-5">
          <HUDCard className="relative min-h-[520px] overflow-hidden p-6">
            <ScanBackground />

            <div className="relative z-10 mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-white">
                Live Impact Preview
              </h2>
              <span className="text-xs uppercase tracking-[0.16em] text-emerald-300">
                Active
              </span>
            </div>

            <div className="relative z-10 grid gap-5 md:grid-cols-[1fr_220px] xl:grid-cols-1">
              <div className="flex justify-center">
                <Image
                  src="/assets/body-hologram-small.png"
                  alt="Impact body"
                  width={360}
                  height={560}
                  className="h-[390px] w-auto object-contain drop-shadow-[0_0_42px_rgba(34,211,238,.9)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MiniMetric
                  label="Current"
                  value={impact.current.readiness}
                  tone="text-slate-300"
                />
                <MiniMetric
                  label="Projected"
                  value={impact.improved.readiness}
                  tone="text-cyan-300"
                />
                <MiniMetric
                  label="Burnout"
                  value={impact.improved.burnoutRisk}
                  tone="text-orange-300"
                />
                <MiniMetric
                  label="Inflamm."
                  value={impact.improved.inflammation}
                  tone="text-emerald-300"
                />
              </div>
            </div>
          </HUDCard>

          <HUDCard className="p-6">
            <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-white">
              Top Recommended Actions
            </h2>

            <div className="mt-5 space-y-3">
              {recommendations.length ? (
                recommendations.slice(0, 3).map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 text-cyan-300">
                        {index + 1}
                      </div>

                      <div>
                        <div className="text-white">{item.title}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-500">
                          {item.description}
                        </div>
                        <div className="mt-2 text-sm text-emerald-300">
                          {item.impact}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-emerald-300/10 bg-emerald-400/5 p-4 text-sm text-emerald-200">
                  Your current scenario already looks strong.
                </div>
              )}
            </div>
          </HUDCard>
        </aside>
      </div>

      <HUDCard className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Sparkles className="text-cyan-300" size={24} />
          <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-white">
            Projected Outcome Impact
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {outcomeCards.map((item) => {
            const Icon = item.icon;
            const positive = item.delta >= 0;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 text-cyan-300">
                    <Icon size={20} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    {item.label}
                  </div>
                </div>

                <div
                  className={[
                    "text-3xl font-light",
                    positive ? "text-emerald-300" : "text-orange-300",
                  ].join(" ")}
                >
                  {positive ? "+" : ""}
                  {item.delta}
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  from {item.current} → {item.improved}
                </div>

                <svg viewBox="0 0 160 40" className="mt-4 h-10 w-full">
                  <polyline
                    points={
                      positive
                        ? "0,32 18,28 36,30 54,20 72,24 90,14 108,18 126,11 144,14 160,8"
                        : "0,12 18,15 36,13 54,22 72,20 90,28 108,26 126,31 144,29 160,34"
                    }
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            );
          })}
        </div>
      </HUDCard>

      <button
        type="button"
        onClick={runSimulation}
        className="relative w-full overflow-hidden rounded-2xl border border-cyan-300/40 bg-cyan-400/10 p-5 text-left shadow-[0_0_28px_rgba(34,211,238,.2)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,211,238,.18),transparent_30%)]" />

        <div className="relative flex items-center gap-6">
          <div className="flex h-16 w-20 items-center justify-center border border-cyan-300/40 bg-cyan-400/10 text-cyan-300 [clip-path:polygon(20%_0,80%_0,100%_50%,80%_100%,20%_100%,0_50%)]">
            <Play size={30} />
          </div>

          <div>
            <div className="text-2xl font-bold uppercase tracking-[0.18em] text-cyan-300">
              Run Simulation
            </div>
            <div className="mt-1 text-slate-400">
              Save this scenario and open the future timeline.
            </div>
          </div>

          <div className="ml-auto hidden md:block">
            <ScoreGauge value={impact.improved.readiness} size="md" tone="cyan" />
          </div>
        </div>
      </button>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-light ${tone}`}>{value}</div>
    </div>
  );
}

function ScanBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,.16),transparent_48%)]" />
    </>
  );
}