"use client";

import { Activity, Brain, CheckCircle2, Target, Zap } from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { calculateHealthScores, getBodySystems } from "@/lib/health/scoring";
import { useSyncedHealthInput } from "@/lib/health/useSyncedHealthInput";

export function InsightsClient() {
  const { input } = useSyncedHealthInput();
  const scores = calculateHealthScores(input);
  const systems = getBodySystems(input);
  const strongest = [...systems].sort((a, b) => b.score - a.score)[0];
  const weakest = [...systems].sort((a, b) => a.score - b.score)[0];

  const actions = [
    {
      title: "Increase sleep duration",
      body: "Adding 45–60 minutes of sleep is projected to improve recovery, focus and burnout resilience.",
      impact: "+12 to +18 recovery",
    },
    {
      title: "Walk 8,000+ steps daily",
      body: "Daily walking has a strong compounding effect on energy, metabolic score and inflammation trend.",
      impact: "+8 to +14 energy",
    },
    {
      title: "Reduce stress load",
      body: "Lowering perceived stress may improve readiness and reduce projected burnout risk.",
      impact: "-10 to -20 burnout risk",
    },
    {
      title: "Improve diet quality",
      body: "Better nutrition quality supports metabolic score, energy stability and inflammation estimates.",
      impact: "+6 to +12 metabolic",
    },
    {
      title: "Reduce alcohol frequency",
      body: "Reducing alcohol may improve sleep quality, recovery and next-day readiness.",
      impact: "+5 to +10 sleep/recovery",
    },
  ];

  return (
    <main className="w-full overflow-x-hidden px-4 py-5 md:px-6">
      <section className="mx-auto grid w-full max-w-[1760px] gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]">
        <div className="space-y-5">
          <HUDCard className="p-6">
            <div className="flex items-center gap-3">
              <Target className="text-cyan-300" />
              <h1 className="text-2xl font-bold uppercase tracking-[0.22em] text-white">
                Recommended Action Plan
              </h1>
            </div>

            <div className="mt-6 space-y-4">
              {actions.map((action, index) => (
                <div
                  key={action.title}
                  className="grid gap-4 rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4 md:grid-cols-[48px_1fr_180px]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-lg font-bold text-cyan-300">
                    {index + 1}
                  </div>

                  <div>
                    <div className="text-lg font-bold text-white">{action.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{action.body}</p>
                  </div>

                  <div className="flex items-center justify-start text-sm font-bold text-emerald-300 md:justify-end">
                    {action.impact}
                  </div>
                </div>
              ))}
            </div>
          </HUDCard>

          <HUDCard className="p-6">
            <div className="flex items-center gap-3">
              <Zap className="text-cyan-300" />
              <h2 className="text-2xl font-bold uppercase tracking-[0.22em] text-white">
                System Summary
              </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <SummaryCard label="Strongest System" title={strongest?.name || "Metabolic"} body={`${strongest?.name || "Metabolic"} currently leads at ${strongest?.score || scores.metabolic}/100.`} />
              <SummaryCard label="Main Pressure Point" title={weakest?.name || "Neurological"} body={`${weakest?.name || "Neurological"} has the most room for improvement at ${weakest?.score || scores.focus}/100.`} />
            </div>
          </HUDCard>
        </div>

        <div className="flex h-full flex-col gap-5">
          <HUDCard className="p-6">
            <div className="flex items-center gap-3">
              <Brain className="text-cyan-300" />
              <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white">
                Model Notes
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "This app does not diagnose disease.",
                "Predictions are probabilistic lifestyle simulations.",
                "Medical decisions should be reviewed with a clinician.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-cyan-300/10 bg-slate-950/45 p-4 text-sm text-slate-300">
                  <CheckCircle2 size={18} className="text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </HUDCard>

          <HUDCard className="flex-1 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              FutureBody Language Example
            </div>

            <p className="mt-5 text-lg leading-8 text-slate-200">
              “Your current pattern resembles profiles associated with lower
              recovery and higher fatigue pressure. Improving sleep, stress load
              and daily movement may shift your projected trajectory.”
            </p>
          </HUDCard>

          <HUDCard className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="text-cyan-300" />
              <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white">
                Current Snapshot
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label="Energy" value={scores.energy} />
              <Metric label="Recovery" value={scores.recovery} />
              <Metric label="Readiness" value={scores.readiness} />
              <Metric label="Stress" value={input.stress} />
            </div>
          </HUDCard>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-3 text-2xl font-bold text-white">{title}</div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-cyan-300/10 bg-slate-950/45 p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-3xl font-light text-cyan-300">{value}</div>
    </div>
  );
}
