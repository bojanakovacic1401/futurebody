"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
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
  WandSparkles,
  Zap,
} from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { defaultHealthInput } from "@/lib/health/defaults";
import { calculateHealthScores, getBodySystems } from "@/lib/health/scoring";
import { getRecommendations } from "@/lib/health/recommendations";
import {
  getStoredHealthInput,
  getStoredSimulationScenario,
} from "@/lib/health/storage";
import type {
  BodySystemScore,
  HealthInput,
  Recommendation,
} from "@/types/health";

type InsightCard = {
  title: string;
  body: string;
  impact: string;
  icon: LucideIcon;
  tone: string;
};

function getScoreLabel(score: number) {
  if (score >= 85) return "strong";
  if (score >= 72) return "stable";
  if (score >= 60) return "moderate";
  return "needs attention";
}

function getStrongestSystem(systems: BodySystemScore[]) {
  return [...systems].sort((a, b) => b.score - a.score)[0];
}

function getWeakestSystem(systems: BodySystemScore[]) {
  return [...systems].sort((a, b) => a.score - b.score)[0];
}

function buildInsights(input: HealthInput): InsightCard[] {
  const scores = calculateHealthScores(input);
  const insights: InsightCard[] = [];

  if (input.sleep < 7.2) {
    insights.push({
      title: "Sleep is your highest leverage signal",
      body: `Your current sleep average is ${input.sleep.toFixed(
        1
      )}h. The model estimates that increasing sleep toward 7.5h may improve recovery, focus and burnout resilience.`,
      impact: "+ recovery",
      icon: Moon,
      tone: "text-violet-300",
    });
  }

  if (input.stress > 55) {
    insights.push({
      title: "Stress load is pressuring readiness",
      body: `Your stress score is ${input.stress}/100. This pattern is associated in the model with lower recovery and higher burnout risk.`,
      impact: "- burnout",
      icon: Brain,
      tone: "text-cyan-300",
    });
  }

  if (input.steps < 8000) {
    insights.push({
      title: "Daily movement can shift your trajectory",
      body: `You are currently around ${input.steps.toLocaleString()} steps. Moving toward 8,000+ steps may improve metabolic score and energy stability.`,
      impact: "+ energy",
      icon: TrendingUp,
      tone: "text-emerald-300",
    });
  }

  if (input.diet < 75) {
    insights.push({
      title: "Nutrition quality affects metabolic projection",
      body: `Diet quality is currently ${input.diet}/100. Improving it may reduce inflammation pressure and improve metabolic score.`,
      impact: "+ metabolic",
      icon: Flame,
      tone: "text-orange-300",
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: "Your current pattern is relatively strong",
      body: `Readiness is ${scores.readiness}/100 and energy is ${scores.energy}/100. The model suggests maintaining consistency rather than making drastic changes.`,
      impact: "maintain",
      icon: ShieldCheck,
      tone: "text-emerald-300",
    });
  }

  return insights.slice(0, 3);
}

export function InsightsClient() {
  const [input, setInput] = useState<HealthInput>(defaultHealthInput);
  const [source, setSource] = useState("Baseline Active");
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

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
  const recommendations = useMemo(() => getRecommendations(input), [input]);
  const insights = useMemo(() => buildInsights(input), [input]);

  const strongest = getStrongestSystem(systems);
  const weakest = getWeakestSystem(systems);

  async function generateAIInsight() {
    setAiLoading(true);
    setAiError("");
    setAiInsight("");

    try {
      const response = await fetch("/api/health/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setAiError(data.message || "AI insight generation failed.");
        return;
      }

      setAiInsight(data.insight || "");
    } catch (error) {
      console.error("AI insight client error:", error);
      setAiError("AI insight generation failed.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <main className="w-full overflow-x-hidden px-4 py-5 md:px-6">
      <div className="mx-auto w-full max-w-[1600px] space-y-5">
        <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/35 p-6">
          <ScanBackground />

          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                {source}
              </div>

              <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
                Insights
              </h1>

              <p className="mt-2 max-w-3xl text-slate-400">
                Personalized, non-diagnostic health pattern analysis based on
                your current lifestyle baseline.
              </p>
            </div>

            <Link
              href="/simulate"
              className="flex h-12 w-fit items-center rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-5 text-sm font-bold uppercase tracking-[0.16em] text-cyan-200"
            >
              Adjust Inputs
            </Link>
          </div>
        </section>

        <HUDCard className="relative overflow-hidden p-6">
          <ScanBackground />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <WandSparkles className="text-cyan-300" size={26} />
                <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-white">
                  AI Health Explanation
                </h2>
              </div>

              <p className="max-w-3xl text-sm leading-7 text-slate-400">
                Generate a personalized explanation from your current scores,
                lifestyle inputs and recommendation model. This is a lifestyle
                simulation, not medical advice.
              </p>
            </div>

            <button
              type="button"
              onClick={generateAIInsight}
              disabled={aiLoading}
              className="flex h-12 w-fit items-center justify-center gap-3 rounded-xl border border-cyan-300/40 bg-cyan-400/15 px-5 text-sm font-bold uppercase tracking-[0.16em] text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <WandSparkles size={18} />
              {aiLoading ? "Generating..." : "Generate AI Insight"}
            </button>
          </div>

          {aiError ? (
            <div className="relative z-10 mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
              {aiError}
            </div>
          ) : null}

          {aiInsight ? (
            <div className="relative z-10 mt-5 whitespace-pre-wrap rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-5 text-sm leading-7 text-slate-300">
              {aiInsight}
            </div>
          ) : null}
        </HUDCard>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
          <section className="space-y-5">
            <HUDCard className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-300">
                  <Sparkles size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-white">
                    Top Findings
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Generated from your current health simulation state.
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
                {recommendations.length ? (
                  recommendations.map((item, index) => (
                    <RecommendationRow
                      key={item.id}
                      item={item}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-emerald-300/10 bg-emerald-400/5 p-5 text-sm leading-7 text-emerald-200">
                    Your current inputs look relatively strong. Maintain your
                    sleep, movement and stress-management consistency.
                  </div>
                )}
              </div>
            </HUDCard>

            <HUDCard className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <Target className="text-cyan-300" size={24} />
                <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-white">
                  System Summary
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SummaryBox
                  title="Strongest System"
                  value={strongest.name}
                  text={`${strongest.name} is currently ${getScoreLabel(
                    strongest.score
                  )} at ${strongest.score}/100.`}
                />

                <SummaryBox
                  title="Main Pressure Point"
                  value={weakest.name}
                  text={`${weakest.name} has the most room for improvement at ${weakest.score}/100.`}
                />
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
                <ScoreLine label="Energy" value={scores.energy} icon={Zap} />
                <ScoreLine
                  label="Cardiovascular"
                  value={
                    systems.find((item) => item.id === "cardiovascular")
                      ?.score || 0
                  }
                  icon={HeartPulse}
                />
                <ScoreLine
                  label="Recovery"
                  value={scores.recovery}
                  icon={ShieldCheck}
                />
                <ScoreLine
                  label="Burnout Risk"
                  value={scores.burnoutRisk}
                  icon={Brain}
                  inverse
                />
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
                {[
                  "This app does not diagnose disease.",
                  "Predictions are probabilistic lifestyle simulations.",
                  "Medical decisions should be reviewed with a clinician.",
                ].map((warning) => (
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
                “Your current pattern resembles profiles associated with lower
                recovery and higher fatigue pressure. Improving sleep, stress
                load and daily movement may shift your projected trajectory.”
              </p>
            </HUDCard>
          </aside>
        </div>
      </div>
    </main>
  );
}

function RecommendationRow({
  item,
  index,
}: {
  item: Recommendation;
  index: number;
}) {
  const priorityClass =
    item.priority === "high"
      ? "text-emerald-300 border-emerald-300/20 bg-emerald-400/10"
      : item.priority === "medium"
      ? "text-cyan-300 border-cyan-300/20 bg-cyan-400/10"
      : "text-slate-300 border-slate-300/10 bg-slate-400/5";

  return (
    <div className="grid gap-4 rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4 md:grid-cols-[48px_1fr_150px]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-lg font-bold text-cyan-300">
        {index + 1}
      </div>

      <div>
        <div className="font-semibold text-white">{item.title}</div>
        <div className="mt-1 text-sm leading-6 text-slate-500">
          {item.description}
        </div>
      </div>

      <div className="flex flex-col items-start justify-center gap-2 md:items-end">
        <div className="text-sm font-semibold text-emerald-300">
          {item.impact}
        </div>
        <div
          className={`rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${priorityClass}`}
        >
          {item.priority}
        </div>
      </div>
    </div>
  );
}

function SummaryBox({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </div>
      <div className="mt-2 text-2xl font-light text-white">{value}</div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function ScoreLine({
  label,
  value,
  icon: Icon,
  inverse = false,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  inverse?: boolean;
}) {
  const percent = inverse ? 100 - value : value;

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
              style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
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