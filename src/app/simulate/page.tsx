import Image from "next/image";
import { redirect } from "next/navigation";
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
import { AppShell } from "@/components/layout/AppShell";
import { HUDCard } from "@/components/ui/HUDCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { getCurrentUser } from "@/lib/auth/session";

type Intervention = {
  label: string;
  value: string;
  min: string;
  max: string;
  icon: LucideIcon;
};

type Outcome = {
  label: string;
  delta: string;
  text: string;
  icon: LucideIcon;
};

type Action = {
  title: string;
  gain: string;
  icon: LucideIcon;
};

const interventions: Intervention[] = [
  { label: "Sleep", value: "7.5 hrs", min: "4", max: "10", icon: Bed },
  {
    label: "Walking",
    value: "8,000 steps",
    min: "1K",
    max: "15K",
    icon: Footprints,
  },
  {
    label: "Stress",
    value: "Moderate",
    min: "Low",
    max: "High",
    icon: Brain,
  },
  {
    label: "Diet Quality",
    value: "Clean",
    min: "Poor",
    max: "Optimal",
    icon: Leaf,
  },
  {
    label: "Alcohol",
    value: "2 drinks",
    min: "0",
    max: "8",
    icon: GlassWater,
  },
  {
    label: "Weight",
    value: "72.0 kg",
    min: "60",
    max: "90",
    icon: Scale,
  },
];

const outcomes: Outcome[] = [
  {
    label: "Energy Score",
    delta: "+14",
    text: "from 87 → 101",
    icon: Zap,
  },
  {
    label: "Focus Score",
    delta: "+11",
    text: "from 83 → 94",
    icon: Brain,
  },
  {
    label: "Recovery",
    delta: "+16",
    text: "from 72 → 88",
    icon: Flame,
  },
  {
    label: "Sleep Quality",
    delta: "+20",
    text: "from 1.6 → 2.6",
    icon: Bed,
  },
  {
    label: "Inflammation",
    delta: "-15%",
    text: "from 2.1 → 1.8",
    icon: Sparkles,
  },
];

const actions: Action[] = [
  {
    title: "Increase Sleep",
    gain: "+18.2 Recovery",
    icon: Bed,
  },
  {
    title: "Increase Steps",
    gain: "+12.7 Energy",
    icon: Footprints,
  },
  {
    title: "Improve Diet Quality",
    gain: "+9.5 Metabolic Score",
    icon: Leaf,
  },
];

export default async function SimulatePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <main className="w-full overflow-x-hidden px-4 py-5 md:px-6">
        <div className="mx-auto w-full max-w-[1600px] space-y-5">
          <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/35 p-6">
            <ScanBackground />

            <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
                  Intervention Simulator
                </h1>
                <p className="mt-2 max-w-3xl text-slate-400">
                  Adjust lifestyle factors and preview how your future
                  trajectory changes.
                </p>
              </div>

              <button className="flex h-12 w-fit items-center gap-3 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-5 text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">
                Reset
              </button>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1fr_520px]">
            <HUDCard className="p-6">
              <div className="mb-6 text-lg font-bold uppercase tracking-[0.18em] text-white">
                Lifestyle Interventions
              </div>

              <div className="space-y-4">
                {interventions.map((item, index) => {
                  const Icon = item.icon;
                  const progress = 42 + index * 5;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-5"
                    >
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
                            <Icon size={24} />
                          </div>

                          <div>
                            <div className="font-bold uppercase tracking-[0.16em] text-white">
                              {item.label}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              Current adjustment
                            </div>
                          </div>
                        </div>

                        <div className="text-2xl font-light text-cyan-300">
                          {item.value}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="w-10 text-sm text-slate-500">
                          {item.min}
                        </span>

                        <div className="relative h-1.5 flex-1 rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,.8)]"
                            style={{ width: `${progress}%` }}
                          />
                          <div
                            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-cyan-100 bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.9)]"
                            style={{ left: `${progress}%` }}
                          />
                        </div>

                        <span className="w-12 text-right text-sm text-slate-500">
                          {item.max}
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
                  <span className="text-slate-500">ⓘ</span>
                </div>

                <div className="relative z-10 flex justify-center">
                  <Image
                    src="/assets/body-hologram-small.png"
                    alt="Impact body"
                    width={360}
                    height={560}
                    className="h-[420px] w-auto object-contain drop-shadow-[0_0_42px_rgba(34,211,238,.9)]"
                  />
                </div>
              </HUDCard>

              <HUDCard className="p-6">
                <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-white">
                  Top Recommended Actions
                </h2>

                <div className="mt-5 space-y-3">
                  {actions.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-center gap-4 rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 text-cyan-300">
                          <Icon size={24} />
                        </div>

                        <div>
                          <div className="text-white">{item.title}</div>
                          <div className="mt-1 text-sm text-emerald-300">
                            {item.gain}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
              {outcomes.map((item) => {
                const Icon = item.icon;

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

                    <div className="text-3xl font-light text-emerald-300">
                      {item.delta}
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      {item.text}
                    </div>

                    <svg viewBox="0 0 160 40" className="mt-4 h-10 w-full">
                      <polyline
                        points="0,32 18,28 36,30 54,20 72,24 90,14 108,18 126,11 144,14 160,8"
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

          <button className="relative w-full overflow-hidden rounded-2xl border border-cyan-300/40 bg-cyan-400/10 p-5 text-left shadow-[0_0_28px_rgba(34,211,238,.2)]">
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
                  Apply changes and see detailed results.
                </div>
              </div>

              <div className="ml-auto">
                <ScoreGauge value={92} size="md" tone="cyan" />
              </div>
            </div>
          </button>
        </div>
      </main>
    </AppShell>
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