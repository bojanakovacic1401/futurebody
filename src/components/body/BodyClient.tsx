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
  Waves,
  Zap,
} from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { defaultHealthInput } from "@/lib/health/defaults";
import { calculateHealthScores, getBodySystems } from "@/lib/health/scoring";
import {
  getStoredHealthInput,
  getStoredSimulationScenario,
} from "@/lib/health/storage";
import type { BodySystemScore, HealthInput } from "@/types/health";

const systemIcons: Record<string, LucideIcon> = {
  cardiovascular: HeartPulse,
  neurological: Brain,
  respiratory: Activity,
  digestive: CircleDot,
  immune: ShieldPlus,
  metabolic: Flame,
};

const systemPositions: Record<string, string> = {
  cardiovascular: "left-[16%] top-[28%]",
  neurological: "right-[16%] top-[18%]",
  respiratory: "left-[14%] top-[43%]",
  digestive: "right-[15%] top-[48%]",
  immune: "left-[17%] top-[64%]",
  metabolic: "right-[15%] top-[66%]",
};

export function BodyClient() {
  const [input, setInput] = useState<HealthInput>(defaultHealthInput);
  const [source, setSource] = useState("Baseline Active");

  useEffect(() => {
    const scenario = getStoredSimulationScenario();

    if (scenario) {
      setInput(scenario.input);
      setSource("Simulation Loaded");
      return;
    }

    setInput(getStoredHealthInput());
    setSource("Baseline Active");
  }, []);

  const scores = useMemo(() => calculateHealthScores(input), [input]);
  const systems = useMemo(() => getBodySystems(input), [input]);

  const averageSystemScore = Math.round(
    systems.reduce((sum, system) => sum + system.score, 0) / systems.length
  );

  return (
    <main className="w-full overflow-x-hidden px-4 py-5 md:px-6">
      <div className="mx-auto w-full max-w-[1600px] space-y-5">
        <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/35 p-6">
          <ScanBackground />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                {source}
              </div>

              <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
                Body Systems
              </h1>

              <p className="mt-2 max-w-3xl text-slate-400">
                System-by-system view of your current body simulation.
              </p>
            </div>

            <Link
              href="/simulate"
              className="flex h-12 w-fit items-center rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-5 text-sm font-bold uppercase tracking-[0.16em] text-cyan-200"
            >
              Adjust Simulation
            </Link>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[1fr_430px]">
          <section className="relative min-h-[820px] overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/35">
            <ScanBackground />

            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Image
                src="/assets/body-hologram.png"
                alt="FutureBody body scan"
                width={1000}
                height={1300}
                priority
                className="h-[820px] w-auto scale-110 object-contain drop-shadow-[0_0_65px_rgba(34,211,238,.95)]"
              />
            </div>

            <div className="absolute left-6 top-6 z-20 rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-5 backdrop-blur">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Overall System Score
              </div>

              <div className="mt-4 flex justify-center">
                <ScoreGauge value={averageSystemScore} size="lg" tone="cyan" />
              </div>

              <div className="mt-4 text-center">
                <div className="text-3xl font-light text-white">
                  {averageSystemScore}
                  <span className="text-sm text-slate-500">/100</span>
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  {averageSystemScore >= 80
                    ? "Strong"
                    : averageSystemScore >= 65
                      ? "Stable"
                      : "Needs Attention"}
                </div>
              </div>
            </div>

            <div className="absolute right-6 top-6 z-20 rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-5 backdrop-blur">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Readiness
              </div>
              <div className="mt-2 text-4xl font-light text-cyan-300">
                {scores.readiness}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Current health state
              </div>
            </div>

            {systems.map((system) => (
              <SystemHotspot key={system.id} system={system} />
            ))}

            <div className="absolute bottom-6 left-6 right-6 z-20 grid gap-3 md:grid-cols-3">
              <MiniSignal
                title="Sleep Debt"
                value={`${scores.sleepDebt}h`}
                status={scores.sleepDebt <= 1.5 ? "Minor" : "Elevated"}
              />
              <MiniSignal
                title="Inflammation"
                value={`${scores.inflammation}`}
                status={scores.inflammation <= 2.2 ? "Low" : "Watch"}
              />
              <MiniSignal
                title="Burnout Risk"
                value={`${scores.burnoutRisk}`}
                status={scores.burnoutRisk <= 35 ? "Low" : "Moderate"}
              />
            </div>
          </section>

          <aside className="space-y-4">
            {systems.map((system) => (
              <BodySystemCard key={system.id} system={system} input={input} />
            ))}
          </aside>
        </div>

        <section className="grid gap-5 xl:grid-cols-3">
          <InsightCard
            icon={Zap}
            title="Highest Strength"
            value={getStrongestSystem(systems).name}
            text={`Your strongest current body system is ${getStrongestSystem(
              systems
            ).name.toLowerCase()}, with a score of ${
              getStrongestSystem(systems).score
            }/100.`}
          />

          <InsightCard
            icon={Waves}
            title="Main Pressure"
            value={getWeakestSystem(systems).name}
            text={`The model sees the most room for improvement in ${getWeakestSystem(
              systems
            ).name.toLowerCase()}. This is not a diagnosis, only a lifestyle simulation signal.`}
          />

          <InsightCard
            icon={ShieldPlus}
            title="Best Next Move"
            value={getNextMove(input)}
            text="This action has the highest projected leverage based on your current input pattern."
          />
        </section>
      </div>
    </main>
  );
}

function BodySystemCard({
  system,
  input,
}: {
  system: BodySystemScore;
  input: HealthInput;
}) {
  const Icon = systemIcons[system.id] || Activity;

  return (
    <HUDCard className="p-4">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
          <Icon size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold uppercase tracking-[0.16em] text-white">
                {system.name}
              </h2>
              <div className="mt-1 text-xs font-bold uppercase text-emerald-300">
                {system.status}
              </div>
            </div>

            <div className="text-3xl font-light text-white">
              {system.score}
              <span className="text-xs text-slate-500">/100</span>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {system.description}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {getSystemExplanation(system.id, input, system.score)}
          </p>

          <div className="mt-4 h-1.5 rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,.8)]"
              style={{ width: `${system.score}%` }}
            />
          </div>
        </div>
      </div>
    </HUDCard>
  );
}

function SystemHotspot({ system }: { system: BodySystemScore }) {
  const position = systemPositions[system.id] || "left-[20%] top-[50%]";

  return (
    <div className={`absolute ${position} z-30 hidden xl:block`}>
      <div className="relative">
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-xl" />

        <div className="relative rounded-2xl border border-cyan-300/20 bg-slate-950/65 px-4 py-3 backdrop-blur">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {system.name}
          </div>
          <div className="mt-1 text-2xl font-light text-cyan-300">
            {system.score}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniSignal({
  title,
  value,
  status,
}: {
  title: string;
  value: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4 backdrop-blur">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </div>
      <div className="mt-2 text-2xl font-light text-white">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">
        {status}
      </div>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  value,
  text,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  text: string;
}) {
  return (
    <HUDCard className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
          <Icon size={24} />
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </div>
          <div className="mt-2 text-xl font-semibold text-white">{value}</div>
          <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
        </div>
      </div>
    </HUDCard>
  );
}

function getStrongestSystem(systems: BodySystemScore[]) {
  return [...systems].sort((a, b) => b.score - a.score)[0];
}

function getWeakestSystem(systems: BodySystemScore[]) {
  return [...systems].sort((a, b) => a.score - b.score)[0];
}

function getNextMove(input: HealthInput) {
  if (input.sleep < 7.2) return "Improve Sleep";
  if (input.steps < 8000) return "Increase Steps";
  if (input.stress > 55) return "Lower Stress";
  if (input.diet < 75) return "Improve Diet";
  return "Maintain Momentum";
}

function getSystemExplanation(
  systemId: string,
  input: HealthInput,
  score: number
) {
  if (systemId === "cardiovascular") {
    return `Driven mostly by ${input.steps.toLocaleString()} daily steps, ${
      input.cardio
    } weekly cardio minutes and recovery pattern.`;
  }

  if (systemId === "neurological") {
    return `Influenced by ${input.sleep.toFixed(
      1
    )} hours of sleep, stress score ${input.stress}/100 and focus recovery.`;
  }

  if (systemId === "respiratory") {
    return `Estimated from cardio minutes, daily movement and recovery breathing proxy.`;
  }

  if (systemId === "digestive") {
    return `Based on diet quality ${input.diet}/100, alcohol load and lifestyle inflammation estimate.`;
  }

  if (systemId === "immune") {
    return `Based on sleep, stress, recovery and inflammation pressure. Current score is ${score}/100.`;
  }

  if (systemId === "metabolic") {
    return `Reflects weight ${input.weight}kg, body fat ${input.bodyFat}%, diet quality and activity load.`;
  }

  return "Lifestyle simulation signal generated from your current input pattern.";
}

function ScanBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,.18),transparent_50%)]" />
    </>
  );
}