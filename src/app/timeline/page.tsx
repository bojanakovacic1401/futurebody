import Image from "next/image";
import { redirect } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Brain,
  Clock,
  HeartPulse,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { HUDCard } from "@/components/ui/HUDCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { getCurrentUser } from "@/lib/auth/session";

type TimelinePoint = {
  label: string;
  score: string;
};

type Trajectory = {
  label: string;
  now: string;
  delta: string;
  future: string;
  icon: LucideIcon;
};

const timeline: TimelinePoint[] = [
  { label: "Now", score: "78" },
  { label: "30 Days", score: "82" },
  { label: "6 Months", score: "86" },
  { label: "2 Years", score: "90" },
  { label: "5 Years", score: "92" },
  { label: "10 Years", score: "89" },
];

const trajectories: Trajectory[] = [
  {
    label: "Energy Score",
    now: "87",
    delta: "+19",
    future: "94",
    icon: Zap,
  },
  {
    label: "Recovery Score",
    now: "72",
    delta: "+18",
    future: "90",
    icon: HeartPulse,
  },
  {
    label: "Burnout Risk",
    now: "28",
    delta: "-24",
    future: "04",
    icon: Brain,
  },
  {
    label: "Metabolic Score",
    now: "76",
    delta: "+16",
    future: "92",
    icon: TrendingUp,
  },
];

export default async function TimelinePage() {
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

            <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
                  Future Timeline
                </h1>
                <p className="mt-2 max-w-3xl text-slate-400">
                  Your current path compared with an improved lifestyle path.
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
                  <ScoreGauge value={92} size="lg" tone="cyan" />
                  <div className="mt-4 text-3xl font-light text-white">
                    92
                    <span className="text-base text-slate-500">/100</span>
                  </div>
                  <div className="mt-2 text-lg font-bold uppercase tracking-[0.18em] text-emerald-300">
                    Optimal
                  </div>
                </div>

                <div className="space-y-4">
                  <FutureMetric
                    label="Biological Age"
                    value="31.8 yrs"
                    delta="-7.6 yrs"
                  />
                  <FutureMetric
                    label="Longevity Potential"
                    value="89%"
                    delta="High"
                  />
                  <FutureMetric
                    label="Healthspan Outlook"
                    value="Excellent"
                    delta="↑"
                  />
                  <FutureMetric
                    label="Projected Resilience"
                    value="92%"
                    delta="+14%"
                  />
                </div>
              </div>
            </HUDCard>
          </section>

          <HUDCard className="p-6">
            <div className="relative overflow-hidden rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-6">
              <div className="absolute left-16 right-16 top-[72px] h-1 bg-cyan-300/20" />
              <div className="absolute left-16 right-16 top-[72px] h-1 bg-gradient-to-r from-cyan-300 to-emerald-300 shadow-[0_0_18px_rgba(34,211,238,.8)]" />

              <div className="relative grid grid-cols-2 gap-5 md:grid-cols-6">
                {timeline.map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-300">
                      {item.label}
                    </div>

                    <div className="mx-auto mt-6 h-8 w-8 rounded-full border-4 border-cyan-300 bg-slate-950 shadow-[0_0_22px_rgba(34,211,238,.9)]" />

                    <div className="mx-auto mt-5 w-24 rounded-xl border border-cyan-300/20 bg-slate-950/70 p-3">
                      <div className="text-2xl font-light text-white">
                        {item.score}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-cyan-300">
                        Score
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
              {trajectories.map((item) => {
                const Icon = item.icon;

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
                          {item.now}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-2xl font-light text-emerald-300">
                      {item.delta}
                    </div>

                    <MiniTrajectory />

                    <div className="flex items-center justify-start text-3xl font-light text-cyan-300 md:justify-end">
                      {item.future}
                    </div>
                  </div>
                );
              })}
            </div>
          </HUDCard>

          <HUDCard className="p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <Image
                src="/assets/future-head.png"
                alt="Future head"
                width={160}
                height={160}
                className="h-28 w-28 rounded-full object-contain drop-shadow-[0_0_30px_rgba(34,211,238,.8)]"
              />

              <div className="flex-1">
                <div className="text-xl font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Message From Future You
                </div>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">
                  You did not just change your habits. You changed your future.
                  Keep showing up — the compounding effect is working.
                </p>
              </div>

              <ArrowRight className="text-cyan-300" size={34} />
            </div>
          </HUDCard>
        </div>
      </main>
    </AppShell>
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

      <div className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-emerald-300">
        {delta}
      </div>
    </div>
  );
}

function MiniTrajectory() {
  return (
    <svg viewBox="0 0 420 80" className="h-20 w-full">
      <polyline
        points="0,60 40,58 80,54 120,44 160,40 200,34 240,30 280,26 320,25 360,20 420,16"
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