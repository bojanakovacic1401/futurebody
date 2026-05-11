"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Brain,
  Clock,
  HeartPulse,
  TrendingUp,
  Zap,
} from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { defaultHealthInput } from "@/lib/health/defaults";
import type { HealthInput } from "@/types/health";
import type { InterventionInput } from "@/lib/health/interventions";
import {
  applyIntervention,
  getDefaultIntervention,
  getInterventionImpact,
} from "@/lib/health/interventions";
import { projectHealthTrajectory } from "@/lib/health/projection";
import {
  getStoredHealthInput,
  getStoredSimulationScenario,
} from "@/lib/health/storage";

type TrajectoryMetric = {
  label: string;
  current: number | string;
  improved: number | string;
  delta: number | string;
  icon: LucideIcon;
  inverse?: boolean;
};

export function TimelineClient() {
  const [input, setInput] = useState<HealthInput>(defaultHealthInput);
  const [intervention, setIntervention] = useState<InterventionInput>(
    getDefaultIntervention(defaultHealthInput)
  );
  const [source, setSource] = useState("Default baseline");

  useEffect(() => {
    const scenario = getStoredSimulationScenario();

    if (scenario) {
      setInput(scenario.input);
      setIntervention(scenario.intervention);
      setSource("Last simulation scenario");
      return;
    }

    const stored = getStoredHealthInput();
    setInput(stored);
    setIntervention(getDefaultIntervention(stored));
    setSource("Saved health baseline");
  }, []);

  const projection = useMemo(
    () => projectHealthTrajectory(input, intervention),
    [input, intervention]
  );

  const impact = useMemo(
    () => getInterventionImpact(input, intervention),
    [input, intervention]
  );

  const improvedInput = useMemo(
    () => applyIntervention(input, intervention),
    [input, intervention]
  );

  const fiveYearPoint = projection.find((point) => point.months === 60) || projection[4];
  const tenYearPoint = projection.find((point) => point.months === 120) || projection[5];

  const metrics: TrajectoryMetric[] = [
    {
      label: "Energy Score",
      current: impact.current.energy,
      improved: impact.improved.energy,
      delta: impact.delta.energy,
      icon: Zap,
    },
    {
      label: "Recovery Score",
      current: impact.current.recovery,
      improved: impact.improved.recovery,
      delta: impact.delta.recovery,
      icon: HeartPulse,
    },
    {
      label: "Burnout Risk",
      current: impact.current.burnoutRisk,
      improved: impact.improved.burnoutRisk,
      delta: impact.delta.burnoutRisk,
      icon: Brain,
      inverse: true,
    },
    {
      label: "Metabolic Score",
      current: impact.current.metabolic,
      improved: impact.improved.metabolic,
      delta: impact.delta.metabolic,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5">
      <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/35 p-6">
        <ScanBackground />

        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              {source}
            </div>

            <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
              Future Timeline
            </h1>

            <p className="mt-2 max-w-3xl text-slate-400">
              Your current path compared with the scenario you built in the
              intervention simulator.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/50 px-5 py-3 text-sm uppercase tracking-[0.16em] text-cyan-300">
            Current Path vs Improved Path
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <HUDCard className="relative min-h-[520px] overflow-hidden p-6">
          <ScanBackground />

          <div className="relative z-10">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Future Self
            </div>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-[0.16em] text-cyan-300">
              5 Years Out
            </h2>

            <div className="mt-8 flex justify-center">
              <Image
                src="/assets/body-hologram-small.png"
                alt="Future body"
                width={320}
                height={520}
                className="h-[360px] w-auto object-contain drop-shadow-[0_0_40px_rgba(34,211,238,.9)]"
              />
            </div>
          </div>
        </HUDCard>

        <HUDCard className="p-6">
          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-6">
              <ScoreGauge value={fiveYearPoint.improved.readiness} size="lg" tone="cyan" />
              <div className="mt-4 text-3xl font-light text-white">
                {fiveYearPoint.improved.readiness}
                <span className="text-base text-slate-500">/100</span>
              </div>
              <div className="mt-2 text-lg font-bold uppercase tracking-[0.18em] text-emerald-300">
                Projected
              </div>
            </div>

            <div className="space-y-4">
              <FutureMetric
                label="Biological Age"
                value={`${fiveYearPoint.improved.biologicalAge} yrs`}
                delta={`${(
                  fiveYearPoint.current.biologicalAge -
                  fiveYearPoint.improved.biologicalAge
                ).toFixed(1)} yrs better`}
              />

              <FutureMetric
                label="Longevity Potential"
                value={`${fiveYearPoint.improved.longevityPotential}%`}
                delta={`+${Math.max(
                  0,
                  fiveYearPoint.improved.longevityPotential -
                    fiveYearPoint.current.longevityPotential
                )}%`}
              />

              <FutureMetric
                label="Healthspan Outlook"
                value={
                  fiveYearPoint.improved.readiness >= 85
                    ? "Excellent"
                    : fiveYearPoint.improved.readiness >= 75
                      ? "Strong"
                      : "Moderate"
                }
                delta="Improved path"
              />

              <FutureMetric
                label="10 Year Readiness"
                value={`${tenYearPoint.improved.readiness}/100`}
                delta={`current path ${tenYearPoint.current.readiness}`}
              />
            </div>
          </div>
        </HUDCard>
      </section>

      <HUDCard className="p-6">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-white">
                Projection Milestones
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Cyan = improved scenario, purple = current path.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
            {projection.map((point) => (
              <div key={point.label} className="text-center">
                <div className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-300">
                  {point.label}
                </div>

                <div className="mx-auto mt-5 h-8 w-8 rounded-full border-4 border-cyan-300 bg-slate-950 shadow-[0_0_22px_rgba(34,211,238,.9)]" />

                <div className="mx-auto mt-5 rounded-xl border border-cyan-300/20 bg-slate-950/70 p-3">
                  <div className="text-2xl font-light text-white">
                    {point.improved.readiness}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-cyan-300">
                    Improved
                  </div>
                </div>

                <div className="mx-auto mt-2 rounded-xl border border-violet-300/15 bg-violet-400/5 p-3">
                  <div className="text-xl font-light text-violet-200">
                    {point.current.readiness}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-violet-300">
                    Current
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </HUDCard>

      <HUDCard className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <Clock className="text-cyan-300" size={24} />
          <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-white">
            Future Trajectories
          </h2>
        </div>

        <div className="space-y-4">
          {metrics.map((item) => {
            const Icon = item.icon;
            const numericDelta =
              typeof item.delta === "number" ? item.delta : Number(item.delta);
            const good = item.inverse ? numericDelta < 0 : numericDelta > 0;

            return (
              <div
                key={item.label}
                className="grid gap-4 rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4 md:grid-cols-[260px_110px_1fr_80px]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 text-cyan-300">
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-1 text-2xl font-light text-white">
                      {item.current}
                    </div>
                  </div>
                </div>

                <div
                  className={[
                    "flex items-center text-2xl font-light",
                    good ? "text-emerald-300" : "text-orange-300",
                  ].join(" ")}
                >
                  {numericDelta > 0 ? "+" : ""}
                  {item.delta}
                </div>

                <MiniTrajectory good={good} />

                <div className="flex items-center justify-start text-3xl font-light text-cyan-300 md:justify-end">
                  {item.improved}
                </div>
              </div>
            );
          })}
        </div>
      </HUDCard>

      <HUDCard className="p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <Image
            src="/assets/body-hologram-small.png"
            alt="Future body"
            width={160}
            height={160}
            className="h-28 w-28 object-contain drop-shadow-[0_0_30px_rgba(34,211,238,.8)]"
          />

          <div className="flex-1">
            <div className="text-xl font-bold uppercase tracking-[0.18em] text-cyan-300">
              Message From Future You
            </div>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">
              If you keep the improved scenario, your 5-year readiness trajectory
              moves from {fiveYearPoint.current.readiness} to{" "}
              {fiveYearPoint.improved.readiness}. The biggest shift comes from
              sleep, stress and daily movement.
            </p>
          </div>

          <ArrowRight className="text-cyan-300" size={34} />
        </div>
      </HUDCard>
    </div>
  );
}

function FutureMetric({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-5">
      <div>
        <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
          {label}
        </div>
        <div className="mt-2 text-2xl font-light text-white">{value}</div>
      </div>

      <div className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
        {delta}
      </div>
    </div>
  );
}

function MiniTrajectory({ good }: { good: boolean }) {
  return (
    <svg viewBox="0 0 420 80" className="h-20 w-full">
      <polyline
        points={
          good
            ? "0,60 40,58 80,54 120,44 160,40 200,34 240,30 280,26 320,25 360,20 420,16"
            : "0,20 40,25 80,24 120,34 160,36 200,42 240,45 280,52 320,50 360,58 420,62"
        }
        fill="none"
        stroke="#22d3ee"
        strokeWidth="3"
      />
      <polyline
        points="0,60 40,61 80,59 120,58 160,57 200,55 240,54 280,53 320,51 360,52 420,49"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="3"
      />
    </svg>
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