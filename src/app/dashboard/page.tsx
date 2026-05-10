import { AppShell } from "@/components/layout/AppShell";
import { Sidebar } from "@/components/layout/Sidebar";
import { HologramBody } from "@/components/visual/HologramBody";
import { BodySystemMap } from "@/components/visual/BodySystemMap";
import { HUDCard } from "@/components/ui/HUDCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";

export default function DashboardPage() {
  return (
    <AppShell>
      <main className="px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-[1800px] gap-5">
          <Sidebar />

          <section className="min-w-0 flex-1">
            <div className="grid gap-5 xl:grid-cols-[1fr_520px]">
              <HUDCard className="relative overflow-hidden p-6 md:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,.18),transparent_45%)]" />

                <div className="relative">
                  <div className="mb-5">
                    <h1 className="text-2xl font-bold uppercase tracking-[0.12em] text-white md:text-3xl">
                      Dashboard
                    </h1>
                    <p className="mt-2 text-slate-400">
                      Your current body state and health trajectory.
                    </p>
                  </div>

                  <HologramBody size="lg" />

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <HUDCard className="p-5">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Today Overview
                      </div>
                      <div className="mt-4 text-4xl font-light text-white">
                        8,732
                      </div>
                      <div className="mt-1 text-sm text-cyan-300">Steps</div>
                    </HUDCard>

                    <HUDCard className="p-5">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Active Time
                      </div>
                      <div className="mt-4 text-4xl font-light text-white">
                        92
                      </div>
                      <div className="mt-1 text-sm text-cyan-300">minutes</div>
                    </HUDCard>

                    <HUDCard className="p-5">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        VO₂ Max
                      </div>
                      <div className="mt-4 text-4xl font-light text-white">
                        48
                      </div>
                      <div className="mt-1 text-sm text-cyan-300">
                        ml/kg/min
                      </div>
                    </HUDCard>
                  </div>
                </div>
              </HUDCard>

              <div className="space-y-5">
                <HUDCard className="p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                        Readiness
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Baseline model
                      </p>
                    </div>

                    <span className="rounded-full border border-emerald-300/30 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-300">
                      Ready
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <ScoreGauge value={78} size="lg" tone="cyan" />
                  </div>
                </HUDCard>

                <BodySystemMap />
              </div>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}