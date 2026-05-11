"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Brain,
  CircleDot,
  Flame,
  HeartPulse,
  Play,
  ShieldPlus,
} from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { defaultHealthInput } from "@/lib/health/defaults";
import { calculateHealthScores, getBodySystems } from "@/lib/health/scoring";
import { getInterventionImpact } from "@/lib/health/interventions";
import {
  getStoredDashboardAvatar,
  getStoredHealthInput,
  getStoredSimulationScenario,
} from "@/lib/health/storage";
import type { HealthInput } from "@/types/health";

const assets = {
  logo: "/assets/logo-b.png",
  body: "/assets/body-hologram.png",
  bodySmall: "/assets/body-hologram-small.png",

  energy: "/assets/icon-energy.png",
  focus: "/assets/icon-focus.png",
  brain: "/assets/icon-brain.png",
  metabolic: "/assets/icon-metabolic.png",
  recovery: "/assets/icon-recovery.png",
  sleep: "/assets/icon-sleep.png",
  stress: "/assets/icon-stress.png",
  inflammation: "/assets/icon-inflammation.png",
};

type ScoreCardItem = {
  label: string;
  value: string;
  unit: string;
  status: string;
  icon: string;
  statusClass: string;
  line: string;
};

function statusFromScore(score: number) {
  if (score >= 85) return "Strong";
  if (score >= 72) return "Good";
  if (score >= 60) return "Moderate";
  return "Watch";
}

function riskStatus(score: number) {
  if (score <= 30) return "Low Risk";
  if (score <= 55) return "Moderate";
  return "Elevated";
}

export function DashboardClient() {
  const [input, setInput] = useState<HealthInput>(defaultHealthInput);
  const [scenarioLabel, setScenarioLabel] = useState("Baseline Active");
  const [projectedReadiness, setProjectedReadiness] = useState<number | null>(
    null
  );

  const [dashboardAvatarUrl, setDashboardAvatarUrl] = useState("");
  const [dashboardAvatarScenario, setDashboardAvatarScenario] = useState("");

  useEffect(() => {
    const storedAvatar = getStoredDashboardAvatar();

    if (storedAvatar) {
      setDashboardAvatarUrl(storedAvatar.imageUrl);
      setDashboardAvatarScenario(storedAvatar.scenario);
    }

    const simulation = getStoredSimulationScenario();

    if (simulation) {
      setInput(simulation.input);
      setScenarioLabel("Simulation Loaded");

      const impact = getInterventionImpact(
        simulation.input,
        simulation.intervention
      );

      setProjectedReadiness(impact.improved.readiness);
      return;
    }

    const stored = getStoredHealthInput();
    setInput(stored);
    setScenarioLabel("Baseline Active");
  }, []);

  const scores = useMemo(() => calculateHealthScores(input), [input]);
  const systems = useMemo(() => getBodySystems(input), [input]);

  const scoreCards: ScoreCardItem[] = [
    {
      label: "Energy Score",
      value: String(scores.energy),
      unit: "/100",
      status: statusFromScore(scores.energy),
      icon: assets.energy,
      statusClass: "text-emerald-300",
      line: "0,19 18,18 36,18 54,14 72,16 90,11 108,14 126,8",
    },
    {
      label: "Focus Score",
      value: String(scores.focus),
      unit: "/100",
      status: statusFromScore(scores.focus),
      icon: assets.focus,
      statusClass: "text-cyan-300",
      line: "0,18 18,16 36,15 54,16 72,12 90,13 108,10 126,11",
    },
    {
      label: "Burnout Risk",
      value: String(scores.burnoutRisk),
      unit: "/100",
      status: riskStatus(scores.burnoutRisk),
      icon: assets.brain,
      statusClass:
        scores.burnoutRisk <= 35 ? "text-emerald-300" : "text-orange-300",
      line: "0,8 18,8 36,12 54,12 72,16 90,15 108,18 126,18",
    },
    {
      label: "Metabolic Score",
      value: String(scores.metabolic),
      unit: "/100",
      status: statusFromScore(scores.metabolic),
      icon: assets.metabolic,
      statusClass: "text-orange-300",
      line: "0,18 18,16 36,17 54,13 72,15 90,9 108,13 126,10",
    },
    {
      label: "Recovery Score",
      value: String(scores.recovery),
      unit: "/100",
      status: statusFromScore(scores.recovery),
      icon: assets.recovery,
      statusClass: "text-emerald-300",
      line: "0,20 18,19 36,17 54,17 72,12 90,13 108,9 126,10",
    },
    {
      label: "Sleep Debt",
      value: String(scores.sleepDebt),
      unit: "hrs",
      status: scores.sleepDebt <= 1.5 ? "Minor" : "High",
      icon: assets.sleep,
      statusClass:
        scores.sleepDebt <= 1.5 ? "text-violet-300" : "text-orange-300",
      line: "0,21 18,19 36,20 54,17 72,22 90,10 108,23 126,15",
    },
    {
      label: "Stress Load",
      value: String(input.stress),
      unit: "/100",
      status:
        input.stress <= 45
          ? "Low"
          : input.stress <= 65
            ? "Moderate"
            : "High",
      icon: assets.stress,
      statusClass: input.stress <= 45 ? "text-emerald-300" : "text-orange-300",
      line: "0,21 18,20 36,22 54,16 72,18 90,12 108,20 126,15",
    },
    {
      label: "Inflammation",
      value: String(scores.inflammation),
      unit: "est.",
      status: scores.inflammation <= 2.2 ? "Low" : "Watch",
      icon: assets.inflammation,
      statusClass:
        scores.inflammation <= 2.2 ? "text-emerald-300" : "text-orange-300",
      line: "0,21 18,20 36,17 54,19 72,10 90,16 108,15 126,17",
    },
  ];

  return (
    <main className="w-full overflow-x-hidden px-4 py-4 md:px-6">
      <div className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-3">
          {scoreCards.map((card) => (
            <ScoreCard key={card.label} {...card} />
          ))}
        </aside>

        <section className="relative min-w-0 overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/30 shadow-[0_0_40px_rgba(8,145,178,.12)]">
          <ScanLines />

          <div className="relative z-10 border-b border-cyan-300/10 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src={assets.logo}
                  alt="FutureBody"
                  width={46}
                  height={46}
                  className="h-10 w-10 object-contain drop-shadow-[0_0_14px_rgba(34,211,238,.8)]"
                />

                <div>
                  <div className="text-2xl font-bold tracking-wide text-white">
                    FutureBody
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    Predictive Health OS
                  </div>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,.9)]" />
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
                  {scenarioLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 p-4 2xl:grid-cols-[250px_minmax(0,1fr)_250px]">
            <div className="hidden min-w-0 space-y-4 2xl:block">
              <VitalsPanel input={input} />
              <PhysAgePanel value={scores.biologicalAge} />
            </div>

            <div className="relative min-h-[880px] min-w-0 overflow-hidden rounded-[26px] border border-cyan-300/10 bg-slate-950/25">
              <ScanNoise />

              <div className="absolute left-6 top-6 z-20">
                <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
                  Dashboard
                </h1>
                <p className="mt-2 text-slate-400">
                  Your body. Your choices. Your future.
                </p>
              </div>

              <div className="absolute right-6 top-6 z-20 rounded-full border border-emerald-300/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Ready
              </div>

              {dashboardAvatarUrl ? (
                <div className="absolute right-6 top-20 z-20 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Avatar: {dashboardAvatarScenario}
                </div>
              ) : null}

              <FloatingTelemetry
                hrv={Math.max(45, 100 - input.stress)}
                temp="36.7"
                readiness={scores.readiness}
              />

              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <Image
                    key={dashboardAvatarUrl || assets.body}
                    src={dashboardAvatarUrl || assets.body}
                    alt="FutureBody avatar"
                    width={dashboardAvatarUrl ? 1024 : 1000}
                    height={dashboardAvatarUrl ? 1536 : 1300}
                    priority
                    unoptimized={Boolean(dashboardAvatarUrl)}
                    className={[
                        "h-[880px] w-auto object-contain",
                        dashboardAvatarUrl
                        ? "scale-[1.02] rounded-[28px] drop-shadow-[0_0_48px_rgba(34,211,238,.55)]"
                        : "scale-[1.16] drop-shadow-[0_0_60px_rgba(34,211,238,.98)]",
                    ].join(" ")}
                    />
              </div>
            </div>

            <div className="hidden min-w-0 space-y-4 2xl:block">
              <TodayOverview input={input} />
              <ReadinessPanel
                readiness={scores.readiness}
                projected={projectedReadiness}
              />
            </div>

            <div className="grid gap-4 2xl:hidden">
              <VitalsPanel input={input} />
              <TodayOverview input={input} />
              <ReadinessPanel
                readiness={scores.readiness}
                projected={projectedReadiness}
              />
              <PhysAgePanel value={scores.biologicalAge} />
            </div>
          </div>

          <div className="relative z-10 grid gap-4 px-4 pb-4 xl:grid-cols-[1.2fr_1fr]">
            <BodySystemsPanel systems={systems} />
            <InflammationPanel value={scores.inflammation} />
          </div>

          <div className="relative z-10 grid gap-4 px-4 pb-4 xl:grid-cols-[1fr_1.4fr_1fr]">
            <MiniStatusPanel source={scenarioLabel} />
            <RunSimulationPanel />
            <MilestonePanel input={input} />
          </div>
        </section>
      </div>
    </main>
  );
}

function ScoreCard({
  label,
  value,
  unit,
  status,
  icon,
  statusClass,
  line,
}: ScoreCardItem) {
  return (
    <HUDCard className="group p-4">
      <div className="grid grid-cols-[64px_1fr_120px_16px] items-center gap-3">
        <div className="relative h-14 w-14">
          <Image
            src={icon}
            alt=""
            width={64}
            height={64}
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {label}
          </div>
          <div className="mt-1 flex items-end gap-1">
            <span className="text-3xl font-light text-white">{value}</span>
            <span className="mb-1 text-xs text-slate-500">{unit}</span>
          </div>
          <div className={`mt-1 text-xs font-bold uppercase ${statusClass}`}>
            {status}
          </div>
        </div>

        <Sparkline points={line} />

        <div className="text-slate-500 transition group-hover:text-cyan-300">
          ›
        </div>
      </div>
    </HUDCard>
  );
}

function VitalsPanel({ input }: { input: HealthInput }) {
  const vitals = [
    ["Sleep", input.sleep.toFixed(1), "hrs"],
    ["Steps", input.steps.toLocaleString(), "steps"],
    ["Stress", String(input.stress), "/100"],
    ["Diet", String(input.diet), "/100"],
    ["Weight", String(input.weight), "kg"],
  ];

  return (
    <HUDCard className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
          Real-Time Inputs
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
          ● Live
        </span>
      </div>

      <div className="space-y-3">
        {vitals.map(([label, value, unit]) => (
          <div
            key={label}
            className="border-b border-cyan-300/10 pb-3 last:border-0 last:pb-0"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {label}
            </div>

            <div className="mt-1 flex items-end justify-between gap-2">
              <div>
                <span className="text-2xl font-light text-white">{value}</span>
                <span className="ml-2 text-xs text-slate-500">{unit}</span>
              </div>

              <Sparkline points="0,19 10,17 20,21 30,8 40,18 50,14 60,20 70,9 80,17 90,12 100,19 110,7 120,11" />
            </div>
          </div>
        ))}
      </div>
    </HUDCard>
  );
}

function TodayOverview({ input }: { input: HealthInput }) {
  const rows = [
    ["Calories", "2,341", "kcal"],
    ["Steps", input.steps.toLocaleString(), "steps"],
    ["Sleep", input.sleep.toFixed(1), "hrs"],
    ["Cardio", String(input.cardio), "min/wk"],
    ["Strength", String(input.strength), "days/wk"],
  ];

  return (
    <HUDCard className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
          Today Overview
        </h3>
        <span className="text-slate-500">ⓘ</span>
      </div>

      <div className="space-y-4">
        {rows.map(([label, value, unit]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-cyan-300/10 pb-3 last:border-0"
          >
            <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {label}
            </span>
            <span className="text-sm text-white">
              {value} <span className="text-xs text-slate-500">{unit}</span>
            </span>
          </div>
        ))}
      </div>
    </HUDCard>
  );
}

function ReadinessPanel({
  readiness,
  projected,
}: {
  readiness: number;
  projected: number | null;
}) {
  return (
    <HUDCard className="p-4">
      <div className="mb-4 text-center">
        <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-white">
          Readiness
        </h3>
      </div>

      <div className="flex justify-center">
        <ScoreGauge value={readiness} size="lg" tone="cyan" />
      </div>

      <div className="mt-3 text-center text-lg font-semibold uppercase tracking-[0.18em] text-emerald-300">
        {readiness >= 80 ? "Ready" : readiness >= 65 ? "Stable" : "Watch"}
      </div>

      {projected !== null ? (
        <div className="mt-4 rounded-xl border border-cyan-300/10 bg-slate-950/45 p-3 text-center">
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Scenario Readiness
          </div>
          <div className="mt-1 text-2xl font-light text-cyan-300">
            {projected}
          </div>
        </div>
      ) : null}
    </HUDCard>
  );
}

function PhysAgePanel({ value }: { value: number }) {
  return (
    <HUDCard className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
          Physiological Age
        </h3>
        <span className="text-slate-500">ⓘ</span>
      </div>

      <div className="flex justify-center">
        <ScoreGauge value={82} size="lg" tone="cyan" />
      </div>

      <div className="mt-3 text-center">
        <div className="text-4xl font-light text-white">{value}</div>
        <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
          Years
        </div>
      </div>
    </HUDCard>
  );
}

function BodySystemsPanel({
  systems,
}: {
  systems: {
    id: string;
    name: string;
    score: number;
    status: string;
    description: string;
  }[];
}) {
  const icons: Record<string, LucideIcon> = {
    cardiovascular: HeartPulse,
    neurological: Brain,
    respiratory: Activity,
    digestive: CircleDot,
    immune: ShieldPlus,
    metabolic: Flame,
  };

  return (
    <HUDCard className="overflow-hidden p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
            Body Systems
          </h3>
          <p className="mt-1 text-xs text-slate-500">Core system readiness</p>
        </div>

        <Link
          href="/body"
          className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300"
        >
          View All
        </Link>
      </div>

      <div className="grid gap-2 lg:grid-cols-[1fr_170px_1fr]">
        <div className="space-y-2">
          {systems.slice(0, 3).map((system) => (
            <SystemRow
              key={system.id}
              name={system.name}
              value={`${system.score}%`}
              status={system.status}
              icon={icons[system.id] || Activity}
            />
          ))}
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <Image
            src={assets.bodySmall}
            alt=""
            width={220}
            height={360}
            className="h-[285px] w-auto object-contain drop-shadow-[0_0_30px_rgba(34,211,238,.9)]"
          />
        </div>

        <div className="space-y-2">
          {systems.slice(3).map((system) => (
            <SystemRow
              key={system.id}
              name={system.name}
              value={`${system.score}%`}
              status={system.status}
              icon={icons[system.id] || Activity}
            />
          ))}
        </div>
      </div>
    </HUDCard>
  );
}

function SystemRow({
  name,
  value,
  status,
  icon: Icon,
}: {
  name: string;
  value: string;
  status: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-cyan-300/10 bg-slate-950/45 p-2.5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 text-cyan-300">
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <div className="truncate text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {name}
          </div>
          <div className="mt-0.5 text-xl font-light text-white">{value}</div>
          <div className="text-[10px] font-bold uppercase text-emerald-300">
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}

function InflammationPanel({ value }: { value: number }) {
  return (
    <HUDCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
          Inflammation Trend
        </h3>

        <div className="flex rounded-lg border border-cyan-300/15 bg-slate-950/50 p-1">
          <button className="rounded-md bg-cyan-400/15 px-3 py-1 text-xs text-cyan-200">
            7D
          </button>
          <button className="px-3 py-1 text-xs text-slate-500">30D</button>
          <button className="px-3 py-1 text-xs text-slate-500">90D</button>
        </div>
      </div>

      <div className="relative h-44 overflow-hidden rounded-xl border border-cyan-300/10 bg-slate-950/40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.05)_1px,transparent_1px)] bg-[size:34px_34px]" />

        <svg
          viewBox="0 0 500 160"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,105 70,95 140,75 210,90 280,96 350,98 420,100 500,108"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute right-4 top-1/2 text-2xl font-light text-cyan-300">
          {value}
        </div>
      </div>
    </HUDCard>
  );
}

function MiniStatusPanel({ source }: { source: string }) {
  return (
    <HUDCard className="p-5">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        Simulation Status
      </div>
      <div className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
        {source}
      </div>
      <div className="mt-1 text-sm text-slate-400">Updated from local model</div>
    </HUDCard>
  );
}

function RunSimulationPanel() {
  return (
    <Link
      href="/simulate"
      className="relative block overflow-hidden rounded-2xl border border-cyan-300/40 bg-cyan-400/10 p-5 text-left shadow-[0_0_28px_rgba(34,211,238,.2)]"
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
            Project outcomes and explore scenarios
          </div>
        </div>

        <div className="ml-auto text-4xl text-slate-400">›</div>
      </div>
    </Link>
  );
}

function MilestonePanel({ input }: { input: HealthInput }) {
  const title =
    input.sleep < 7
      ? "Sleep Recovery"
      : input.steps < 8000
        ? "Movement Target"
        : "VO₂ Max Improvement";

  return (
    <HUDCard className="p-5">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        Next Milestone
      </div>
      <div className="mt-3 text-white">{title}</div>
      <div className="mt-1 text-sm text-slate-400">next 15 days</div>
    </HUDCard>
  );
}

function Sparkline({ points }: { points: string }) {
  return (
    <svg viewBox="0 0 126 28" className="h-8 w-full">
      <polyline
        points={points}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FloatingTelemetry({
  hrv,
  temp,
  readiness,
}: {
  hrv: number;
  temp: string;
  readiness: number;
}) {
  return (
    <>
      <div className="absolute left-8 top-[170px] z-20 hidden rounded-xl border border-cyan-300/10 bg-slate-950/35 px-4 py-3 text-cyan-300 backdrop-blur-sm 2xl:block">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
          Ready
        </div>
        <div className="mt-1 text-2xl font-light text-cyan-300">
          {readiness}
        </div>
      </div>

      <div className="absolute right-8 top-[310px] z-20 hidden rounded-xl border border-cyan-300/10 bg-slate-950/35 px-4 py-3 text-cyan-300 backdrop-blur-sm 2xl:block">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
          HRV
        </div>
        <div className="mt-1 text-2xl font-light text-cyan-300">{hrv}</div>
        <div className="text-xs text-slate-500">ms</div>
      </div>

      <div className="absolute right-8 top-[470px] z-20 hidden rounded-xl border border-cyan-300/10 bg-slate-950/35 px-4 py-3 text-cyan-300 backdrop-blur-sm 2xl:block">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
          Temp
        </div>
        <div className="mt-1 text-2xl font-light text-cyan-300">{temp}</div>
        <div className="text-xs text-slate-500">°C</div>
      </div>
    </>
  );
}

function ScanLines() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(14,165,233,.16),transparent_48%)]" />
    </>
  );
}

function ScanNoise() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <svg
        className="absolute inset-0 h-full w-full opacity-50"
        viewBox="0 0 1000 800"
        preserveAspectRatio="none"
      >
        <circle
          cx="500"
          cy="400"
          r="260"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity=".18"
        />
        <circle
          cx="500"
          cy="400"
          r="180"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity=".15"
        />
        <circle
          cx="500"
          cy="400"
          r="110"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity=".12"
        />

        <path
          d="M70 120 H190 L250 180"
          stroke="#22d3ee"
          strokeOpacity=".22"
          fill="none"
        />
        <path
          d="M930 160 H780 L710 230"
          stroke="#22d3ee"
          strokeOpacity=".22"
          fill="none"
        />
        <path
          d="M80 610 H230 L310 540"
          stroke="#22d3ee"
          strokeOpacity=".22"
          fill="none"
        />
        <path
          d="M940 620 H760 L690 560"
          stroke="#22d3ee"
          strokeOpacity=".22"
          fill="none"
        />

        {Array.from({ length: 28 }).map((_, index) => {
          const x = 80 + ((index * 73) % 850);
          const y = 90 + ((index * 127) % 640);

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={index % 3 === 0 ? 3 : 1.5}
              fill="#22d3ee"
              opacity={index % 4 === 0 ? ".75" : ".35"}
            />
          );
        })}
      </svg>

      <div className="absolute bottom-0 left-1/2 h-28 w-[70%] -translate-x-1/2 rounded-full border border-cyan-300/20 bg-cyan-400/5 blur-[1px]" />
    </>
  );
}