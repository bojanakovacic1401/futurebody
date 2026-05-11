import Image from "next/image";
import { redirect } from "next/navigation";
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
import { AppShell } from "@/components/layout/AppShell";
import { HUDCard } from "@/components/ui/HUDCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { getCurrentUser } from "@/lib/auth/session";

const systems = [
  {
    name: "Cardiovascular",
    score: 85,
    status: "Optimal",
    icon: HeartPulse,
    description: "Heart rate, HRV, endurance and circulation indicators.",
  },
  {
    name: "Neurological",
    score: 83,
    status: "Optimal",
    icon: Brain,
    description: "Focus, cognitive load, sleep consistency and stress response.",
  },
  {
    name: "Respiratory",
    score: 81,
    status: "Strong",
    icon: Activity,
    description: "Respiratory rhythm, VO₂ estimate and recovery breathing.",
  },
  {
    name: "Metabolic",
    score: 76,
    status: "Efficient",
    icon: Flame,
    description: "Nutrition quality, activity consistency and glucose stability proxy.",
  },
  {
    name: "Recovery",
    score: 72,
    status: "Good",
    icon: ShieldPlus,
    description: "Sleep debt, fatigue indicators and readiness patterns.",
  },
  {
    name: "Inflammation",
    score: 68,
    status: "Watch",
    icon: CircleDot,
    description: "Lifestyle-related inflammation proxy from stress, sleep and diet.",
  },
  {
    name: "Stress Load",
    score: 66,
    status: "Moderate",
    icon: Waves,
    description: "Perceived stress, autonomic load and recovery pressure.",
  },
  {
    name: "Energy",
    score: 87,
    status: "Strong",
    icon: Zap,
    description: "Subjective energy, movement, sleep and nutrition signal blend.",
  },
];

export default async function BodyPage() {
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

            <div className="relative z-10">
              <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
                Body Systems
              </h1>
              <p className="mt-2 max-w-3xl text-slate-400">
                A system-by-system view of your current body simulation.
              </p>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
            <section className="relative min-h-[780px] overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/35">
              <ScanBackground />

              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <Image
                  src="/assets/body-hologram.png"
                  alt="FutureBody body scan"
                  width={1000}
                  height={1300}
                  priority
                  className="h-[760px] w-auto scale-110 object-contain drop-shadow-[0_0_60px_rgba(34,211,238,.95)]"
                />
              </div>

              <div className="absolute left-6 top-6 z-20 rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-5 backdrop-blur">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Overall System Score
                </div>
                <div className="mt-4">
                  <ScoreGauge value={81} size="lg" tone="cyan" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20 grid gap-3 md:grid-cols-3">
                {["Cardio stable", "Recovery improving", "Stress moderate"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200 backdrop-blur"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </section>

            <aside className="space-y-4">
              {systems.map((system) => {
                const Icon = system.icon;

                return (
                  <HUDCard key={system.name} className="p-4">
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
              })}
            </aside>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function ScanBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,.18),transparent_50%)]" />
    </>
  );
}