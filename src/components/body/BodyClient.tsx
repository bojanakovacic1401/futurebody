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
  ShieldPlus,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { calculateHealthScores, getBodySystems } from "@/lib/health/scoring";
import { getStoredDashboardAvatar } from "@/lib/health/storage";
import { useSyncedHealthInput } from "@/lib/health/useSyncedHealthInput";
import { AnimatedAsset } from "@/components/fx/AnimatedAsset";
import { FloatingScanParticles, OrbitalAvatarHalo } from "@/components/fx/FutureBodyFx";
import type { HealthInput } from "@/types/health";

const assets = {
  body: "/assets/body-hologram.png",
  brain: "/assets/brain.png",
};

type BodySystem = {
  id: string;
  name: string;
  score: number;
  status: string;
  description: string;
};

const systemIcons: Record<string, LucideIcon> = {
  cardiovascular: HeartPulse,
  neurological: Brain,
  respiratory: Activity,
  digestive: CircleDot,
  immune: ShieldPlus,
  metabolic: Flame,
};

const fallbackDescriptions: Record<string, string> = {
  cardiovascular: "Movement, cardio, recovery and metabolic pressure.",
  neurological: "Focus, stress load, sleep quality and cognitive recovery.",
  respiratory: "Cardio minutes, daily movement and recovery breathing proxy.",
  digestive: "Nutrition quality, alcohol load and inflammation proxy.",
  immune: "Sleep, stress, recovery and lifestyle inflammation estimate.",
  metabolic: "Body composition, diet, activity and alcohol pattern.",
};

function getStatusClass(score: number) {
  if (score >= 80) return "text-emerald-300";
  if (score >= 65) return "text-cyan-300";
  if (score >= 50) return "text-orange-300";
  return "text-red-300";
}

function getStatusLabel(score: number) {
  if (score >= 80) return "Optimal";
  if (score >= 65) return "Good";
  if (score >= 50) return "Needs Work";
  return "Attention";
}

function getBestMove(input: HealthInput) {
  if (input.sleep < 7) return "Improve Sleep";
  if (input.steps < 8000) return "Increase Steps";
  if (input.stress > 55) return "Reduce Stress";
  if (input.diet < 70) return "Improve Nutrition";
  return "Maintain Momentum";
}

export function BodyClient() {
  const { input } = useSyncedHealthInput();
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const avatar = getStoredDashboardAvatar();

    if (avatar?.imageUrl) {
      setAvatarUrl(avatar.imageUrl);
    }
  }, []);

  const scores = useMemo(() => calculateHealthScores(input), [input]);
  const systems = useMemo(() => getBodySystems(input).slice(0, 6), [input]);

  const overallScore = Math.round(
    systems.reduce((sum, item) => sum + item.score, 0) / Math.max(systems.length, 1)
  );

  const highest = [...systems].sort((a, b) => b.score - a.score)[0];
  const lowest = [...systems].sort((a, b) => a.score - b.score)[0];

  return (
    <main className="w-full overflow-x-hidden px-4 py-3 xl:h-[calc(100vh-72px)] xl:overflow-hidden">
      <section className="mx-auto grid h-full w-full max-w-[1760px] gap-3 xl:grid-cols-[310px_minmax(0,1fr)_420px] xl:grid-rows-[88px_minmax(0,1fr)_96px]">
        <HUDCard className="xl:col-span-3">
          <div className="relative flex h-full items-center justify-between overflow-hidden rounded-[inherit] px-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(34,211,238,.16),transparent_42%)]" />

            <div className="relative">
              <div className="mb-2 inline-flex rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Simulation Loaded
              </div>

              <h1 className="text-2xl font-bold uppercase tracking-[0.28em] text-white md:text-3xl">
                Body Systems
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                System-by-system view of your current body simulation.
              </p>
            </div>

            <Link
              href="/simulate"
              className="relative hidden rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200 transition hover:bg-cyan-400/15 md:block"
            >
              Adjust Simulation
            </Link>
          </div>
        </HUDCard>

        <div className="min-h-0 space-y-3 xl:h-full xl:overflow-hidden">
          <HUDCard className="p-5 xl:h-[38%]">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Overall System Score
            </div>

            <div className="mt-4 flex justify-center">
              <ScoreGauge value={overallScore} size="lg" tone="cyan" />
            </div>

            <div className="mt-3 text-center">
              <div className="text-3xl font-light text-white">
                {overallScore}
                <span className="text-sm text-slate-500">/100</span>
              </div>

              <div className={`mt-1 text-xs font-bold uppercase tracking-[0.18em] ${getStatusClass(overallScore)}`}>
                {getStatusLabel(overallScore)}
              </div>
            </div>
          </HUDCard>

          <HUDCard className="p-5 xl:h-[23%]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Readiness
                </div>
                <div className="mt-3 text-5xl font-light text-cyan-200">
                  {scores.readiness}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Current health state
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-4 text-cyan-300">
                <Sparkles size={34} />
              </div>
            </div>
          </HUDCard>

          <HUDCard className="p-5 xl:h-[39%]">
            <div className="grid h-full grid-cols-2 gap-3">
              <MiniMetric label="Sleep Debt" value={`${scores.sleepDebt}h`} />
              <MiniMetric label="Inflammation" value={`${scores.inflammation}`} />
              <MiniMetric label="Burnout Risk" value={`${scores.burnoutRisk}`} />
              <MiniMetric label="Metabolic" value={`${scores.metabolic}`} />
            </div>
          </HUDCard>
        </div>

        <BodyScanPanel systems={systems} avatarUrl={avatarUrl} />

        <div className="grid min-h-0 gap-2 xl:h-full xl:grid-rows-6 xl:overflow-hidden">
          {systems.map((system) => (
            <SystemDetailCard key={system.id} system={system} input={input} />
          ))}
        </div>

        <InsightCard
          icon={Zap}
          label="Highest Strength"
          title={highest?.name || "Metabolic"}
          body={`Your strongest current body system is ${highest?.name || "metabolic"}, with a score of ${highest?.score || overallScore}/100.`}
        />

        <InsightCard
          icon={Activity}
          label="Main Pressure"
          title={lowest?.name || "Neurological"}
          body={`The model sees the most room for improvement in ${lowest?.name || "neurological"}. This is a lifestyle simulation signal, not a diagnosis.`}
        />

        <InsightCard
          icon={Target}
          label="Best Next Move"
          title={getBestMove(input)}
          body="This action has the highest projected leverage based on your current input pattern."
        />
      </section>
    </main>
  );
}

function BodyScanPanel({
  systems,
  avatarUrl,
}: {
  systems: BodySystem[];
  avatarUrl: string;
}) {
  const byId = Object.fromEntries(systems.map((system) => [system.id, system]));

  return (
    <HUDCard className="relative min-h-[560px] overflow-hidden xl:h-full xl:min-h-0">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.04)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(34,211,238,.22),transparent_42%)]" />
      <FloatingScanParticles count={52} className="opacity-60" />
      <OrbitalAvatarHalo />

      <svg
        className="absolute inset-0 h-full w-full opacity-45"
        viewBox="0 0 900 760"
        preserveAspectRatio="none"
      >
        <circle cx="450" cy="370" r="250" fill="none" stroke="#22d3ee" strokeOpacity=".17" />
        <circle cx="450" cy="370" r="180" fill="none" stroke="#22d3ee" strokeOpacity=".12" />
        <circle cx="450" cy="370" r="105" fill="none" stroke="#22d3ee" strokeOpacity=".1" />
        <path d="M80 130 H230 L295 210" stroke="#22d3ee" strokeOpacity=".2" />
        <path d="M820 130 H670 L600 210" stroke="#22d3ee" strokeOpacity=".2" />
        <path d="M90 600 H245 L320 525" stroke="#22d3ee" strokeOpacity=".18" />
        <path d="M810 600 H650 L580 525" stroke="#22d3ee" strokeOpacity=".18" />
      </svg>

      <FloatingSystem className="left-[8%] top-[18%]" label="Cardiovascular" value={byId.cardiovascular?.score || 0} />
      <FloatingSystem className="right-[8%] top-[22%]" label="Neurological" value={byId.neurological?.score || 0} />
      <FloatingSystem className="left-[7%] top-[52%]" label="Respiratory" value={byId.respiratory?.score || 0} />
      <FloatingSystem className="right-[8%] top-[50%]" label="Digestive" value={byId.digestive?.score || 0} />
      <FloatingSystem className="left-[13%] bottom-[18%]" label="Immune" value={byId.immune?.score || 0} />
      <FloatingSystem className="right-[10%] bottom-[18%]" label="Metabolic" value={byId.metabolic?.score || 0} />

      <div className="absolute inset-x-8 bottom-2 top-12 z-10 flex items-center justify-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="FutureBody avatar"
            className="h-full max-h-full w-auto max-w-[72%] rounded-[28px] object-contain drop-shadow-[0_0_55px_rgba(34,211,238,.45)]"
          />
        ) : (
          <Image
            src={assets.body}
            alt="FutureBody body scan"
            width={1000}
            height={1300}
            priority
            className="h-full max-h-full w-auto max-w-[82%] scale-[1.12] object-contain drop-shadow-[0_0_70px_rgba(34,211,238,.9)]"
          />
        )}
      </div>
    </HUDCard>
  );
}

function FloatingSystem({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className={`absolute z-30 hidden rounded-xl border border-cyan-300/15 bg-slate-950/55 px-4 py-3 backdrop-blur xl:block ${className}`}>
      <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-light text-cyan-200">{value}</div>
    </div>
  );
}

function SystemDetailCard({
  system,
  input,
}: {
  system: BodySystem;
  input: HealthInput;
}) {
  const Icon = systemIcons[system.id] || Activity;

  return (
    <HUDCard className="p-4">
      <div className="flex h-full items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
          <Icon size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-white">
                {system.name}
              </h3>
              <div className={`mt-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getStatusClass(system.score)}`}>
                {system.status || getStatusLabel(system.score)}
              </div>
            </div>

            <div className="text-3xl font-light text-white">
              {system.score}
              <span className="text-xs text-slate-500">/100</span>
            </div>
          </div>

          <p className="mt-2 truncate text-sm text-slate-400">
            {system.description || fallbackDescriptions[system.id] || "Body system readiness estimate."}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            Based on sleep {input.sleep}h, stress {input.stress}/100, steps {input.steps.toLocaleString()} and diet quality {input.diet}/100.
          </p>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,.75)]"
              style={{ width: `${Math.max(8, Math.min(100, system.score))}%` }}
            />
          </div>
        </div>
      </div>
    </HUDCard>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cyan-300/10 bg-slate-950/45 p-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-light text-white">{value}</div>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  label,
  title,
  body,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <HUDCard className="overflow-hidden p-5">
      <div className="flex h-full items-center gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
          <Icon size={22} />
        </div>

        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {label}
          </div>
          <div className="mt-2 text-xl font-bold text-white">{title}</div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{body}</p>
        </div>
      </div>
    </HUDCard>
  );
}

export function BodyLeftBrainCard() {
  return (
    <HUDCard className="relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(34,211,238,.14),transparent_48%)]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <AnimatedAsset src={assets.brain} alt="Neural brain" size={210} variant="float" />

        <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
          Neural Insight
        </div>

        <p className="mt-3 max-w-[280px] text-sm leading-6 text-slate-400">
          “Small daily changes become visible biological patterns over time.”
        </p>
      </div>
    </HUDCard>
  );
}
