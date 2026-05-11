import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Flame,
  HeartPulse,
  Lightbulb,
  Moon,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { HUDCard } from "@/components/ui/HUDCard";
import { getCurrentUser } from "@/lib/auth/session";

const insights = [
  {
    title: "Sleep is your highest leverage change",
    body: "Your current pattern suggests that adding 45–60 minutes of sleep could improve recovery, focus and stress resilience more than any single nutrition change.",
    impact: "+18 recovery",
    icon: Moon,
    tone: "text-violet-300",
  },
  {
    title: "Stress load is suppressing readiness",
    body: "Your stress score is moderate. The model estimates that lowering perceived stress by 20% could improve your future energy trajectory within 30 days.",
    impact: "+11 readiness",
    icon: Brain,
    tone: "text-cyan-300",
  },
  {
    title: "Walking creates compounding benefit",
    body: "A consistent 20-minute walk after meals may improve metabolic score, glucose stability and inflammation trend over the next 6–12 months.",
    impact: "+9 metabolic",
    icon: TrendingUp,
    tone: "text-emerald-300",
  },
];

const warnings = [
  "This app does not diagnose disease.",
  "Predictions are probabilistic lifestyle simulations.",
  "Medical decisions should be reviewed with a clinician.",
];

const actions = [
  ["Sleep 7.5h average", "Highest effect on recovery", "+18.2"],
  ["Walk 8,000+ steps", "Best energy/metabolic tradeoff", "+12.7"],
  ["Reduce alcohol to 2/week", "Improves sleep and inflammation", "+9.1"],
  ["10 min daily breathing", "Reduces stress load", "+7.4"],
];

export default async function InsightsPage() {
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

            <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  AI Insight Engine
                </div>

                <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
                  Insights
                </h1>

                <p className="mt-2 max-w-3xl text-slate-400">
                  Personalized, non-diagnostic health pattern analysis based on
                  your current lifestyle baseline.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-5 py-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Confidence
                </div>
                <div className="mt-1 text-4xl font-light text-emerald-300">
                  92%
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
            <section className="space-y-5">
              <HUDCard className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-300">
                    <Sparkles size={24} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-white">
                      Top AI Findings
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Ranked by projected long-term effect.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {insights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-5"
                      >
                        <div className="flex gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 ${item.tone}`}
                          >
                            <Icon size={24} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                              <h3 className="text-lg font-semibold text-white">
                                {item.title}
                              </h3>

                              <span className="w-fit rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                                {item.impact}
                              </span>
                            </div>

                            <p className="mt-3 leading-7 text-slate-400">
                              {item.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </HUDCard>

              <HUDCard className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <Lightbulb className="text-cyan-300" size={24} />
                  <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-white">
                    Recommended Action Plan
                  </h2>
                </div>

                <div className="grid gap-3">
                  {actions.map(([title, text, score], index) => (
                    <div
                      key={title}
                      className="grid gap-4 rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4 md:grid-cols-[48px_1fr_110px]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-lg font-bold text-cyan-300">
                        {index + 1}
                      </div>

                      <div>
                        <div className="font-semibold text-white">{title}</div>
                        <div className="mt-1 text-sm text-slate-500">
                          {text}
                        </div>
                      </div>

                      <div className="flex items-center justify-start text-2xl font-light text-emerald-300 md:justify-end">
                        {score}
                      </div>
                    </div>
                  ))}
                </div>
              </HUDCard>
            </section>

            <aside className="space-y-5">
              <HUDCard className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <Target className="text-cyan-300" size={24} />
                  <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-white">
                    Current Pattern
                  </h2>
                </div>

                <div className="space-y-4">
                  <ScoreLine label="Energy" value="87" icon={Zap} />
                  <ScoreLine label="Cardiovascular" value="85" icon={HeartPulse} />
                  <ScoreLine label="Inflammation" value="2.1" icon={Flame} />
                  <ScoreLine label="Recovery" value="72" icon={ShieldCheck} />
                </div>
              </HUDCard>

              <HUDCard className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <AlertTriangle className="text-orange-300" size={24} />
                  <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-white">
                    Safety Language
                  </h2>
                </div>

                <div className="space-y-3">
                  {warnings.map((warning) => (
                    <div
                      key={warning}
                      className="flex gap-3 rounded-xl border border-cyan-300/10 bg-slate-950/45 p-4"
                    >
                      <CheckCircle2
                        className="mt-0.5 shrink-0 text-emerald-300"
                        size={18}
                      />
                      <p className="text-sm leading-6 text-slate-400">
                        {warning}
                      </p>
                    </div>
                  ))}
                </div>
              </HUDCard>

              <HUDCard className="p-6">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  FutureBody Language Example
                </div>

                <p className="mt-4 leading-7 text-slate-300">
                  “Your current pattern resembles profiles associated with
                  higher fatigue risk. Improving sleep and lowering stress may
                  shift your projected trajectory.”
                </p>
              </HUDCard>
            </aside>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function ScoreLine({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Zap;
}) {
  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 text-cyan-300">
          <Icon size={20} />
        </div>

        <div className="flex-1">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
            {label}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,.8)]"
              style={{ width: label === "Inflammation" ? "42%" : `${value}%` }}
            />
          </div>
        </div>

        <div className="text-2xl font-light text-white">{value}</div>
      </div>
    </div>
  );
}

function ScanBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_45%,rgba(34,211,238,.16),transparent_48%)]" />
    </>
  );
}