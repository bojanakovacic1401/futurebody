"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Bed,
  Brain,
  Check,
  ChevronLeft,
  FlaskConical,
  HeartPulse,
  Salad,
  Scale,
  Sparkles,
  User,
} from "lucide-react";
import type { HealthInput, SymptomFlags } from "@/types/health";
import { defaultHealthInput } from "@/lib/health/defaults";
import {
  resetStoredSimulationScenario,
  saveStoredHealthInput,
} from "@/lib/health/storage";

const steps = [
  "Profile",
  "Sleep",
  "Activity",
  "Nutrition",
  "Stress",
  "Symptoms",
  "Labs",
];

type NumberFieldKey =
  | "age"
  | "heightCm"
  | "weight"
  | "goalWeight"
  | "bodyFat"
  | "sleep"
  | "sleepQuality"
  | "steps"
  | "strength"
  | "cardio"
  | "diet"
  | "alcohol"
  | "stress";

export function OnboardingClient() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [input, setInput] = useState<HealthInput>(defaultHealthInput);

  const currentStep = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  function updateNumber(key: NumberFieldKey, value: number) {
    setInput((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateSymptom(key: keyof SymptomFlags, value: boolean) {
    setInput((current) => ({
      ...current,
      symptoms: {
        ...current.symptoms,
        [key]: value,
      },
    }));
  }

  function updateLab(key: keyof HealthInput["labs"], value: number) {
    setInput((current) => ({
      ...current,
      labs: {
        ...current.labs,
        [key]: Number.isNaN(value) ? undefined : value,
      },
    }));
  }

  function next() {
    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    saveStoredHealthInput(input);
    resetStoredSimulationScenario();
    router.push("/dashboard");
    router.refresh();
  }

  function back() {
    setStep((current) => Math.max(0, current - 1));
  }

  return (
    <main className="w-full overflow-x-hidden px-4 py-5 md:px-6">
      <div className="mx-auto w-full max-w-[1500px] space-y-5">
        <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/35 p-6">
          <ScanBackground />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                Step {step + 1} / {steps.length}
              </div>

              <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
                Health Baseline
              </h1>

              <p className="mt-2 max-w-3xl text-slate-400">
                Build your starting point so FutureBody can simulate your
                trajectory.
              </p>
            </div>

            <div className="w-full max-w-sm">
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500">
                <span>{currentStep}</span>
                <span>{progress}%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.85)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[320px_1fr]">
          <aside className="rounded-[28px] border border-cyan-300/15 bg-slate-950/35 p-4">
            <div className="space-y-2">
              {steps.map((item, index) => {
                const active = index === step;
                const done = index < step;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStep(index)}
                    className={[
                      "flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition",
                      active
                        ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-200"
                        : "border-cyan-300/10 bg-slate-950/35 text-slate-500 hover:text-cyan-200",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-xl border",
                        done
                          ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-300"
                          : active
                            ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-300"
                            : "border-cyan-300/10 text-slate-600",
                      ].join(" ")}
                    >
                      {done ? <Check size={18} /> : index + 1}
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.16em]">
                        {item}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-600">
                        {getStepSubtitle(item)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/35 p-6">
            <ScanBackground />

            <div className="relative z-10">
              {step === 0 ? (
                <ProfileStep input={input} updateNumber={updateNumber} setInput={setInput} />
              ) : null}

              {step === 1 ? (
                <SleepStep input={input} updateNumber={updateNumber} />
              ) : null}

              {step === 2 ? (
                <ActivityStep input={input} updateNumber={updateNumber} setInput={setInput} />
              ) : null}

              {step === 3 ? (
                <NutritionStep input={input} updateNumber={updateNumber} />
              ) : null}

              {step === 4 ? (
                <StressStep input={input} updateNumber={updateNumber} />
              ) : null}

              {step === 5 ? (
                <SymptomsStep input={input} updateSymptom={updateSymptom} />
              ) : null}

              {step === 6 ? (
                <LabsStep input={input} updateLab={updateLab} />
              ) : null}

              <div className="mt-8 flex flex-col gap-3 border-t border-cyan-300/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-slate-950/40 px-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-400/15 px-5 text-sm font-bold uppercase tracking-[0.16em] text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,.18)]"
                >
                  {step === steps.length - 1 ? "Finish Baseline" : "Continue"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function ProfileStep({
  input,
  updateNumber,
  setInput,
}: {
  input: HealthInput;
  updateNumber: (key: NumberFieldKey, value: number) => void;
  setInput: React.Dispatch<React.SetStateAction<HealthInput>>;
}) {
  return (
    <StepFrame
      icon={User}
      title="Basic Profile"
      description="This gives the model your starting body context."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NumberInput
          label="Age"
          value={input.age}
          suffix="yrs"
          min={13}
          max={95}
          step={1}
          onChange={(value) => updateNumber("age", value)}
        />

        <NumberInput
          label="Height"
          value={input.heightCm}
          suffix="cm"
          min={130}
          max={220}
          step={1}
          onChange={(value) => updateNumber("heightCm", value)}
        />

        <NumberInput
          label="Current Weight"
          value={input.weight}
          suffix="kg"
          min={35}
          max={220}
          step={1}
          onChange={(value) => updateNumber("weight", value)}
        />

        <NumberInput
          label="Goal Weight"
          value={input.goalWeight}
          suffix="kg"
          min={35}
          max={220}
          step={1}
          onChange={(value) => updateNumber("goalWeight", value)}
        />

        <NumberInput
          label="Body Fat"
          value={input.bodyFat}
          suffix="%"
          min={5}
          max={55}
          step={1}
          onChange={(value) => updateNumber("bodyFat", value)}
        />

        <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Biological Sex
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(["female", "male", "other"] as const).map((sex) => (
              <button
                key={sex}
                type="button"
                onClick={() =>
                  setInput((current) => ({
                    ...current,
                    biologicalSex: sex,
                  }))
                }
                className={[
                  "rounded-xl border px-3 py-3 text-xs font-bold uppercase tracking-[0.12em]",
                  input.biologicalSex === sex
                    ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-200"
                    : "border-cyan-300/10 bg-slate-950/50 text-slate-500",
                ].join(" ")}
              >
                {sex}
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepFrame>
  );
}

function SleepStep({
  input,
  updateNumber,
}: {
  input: HealthInput;
  updateNumber: (key: NumberFieldKey, value: number) => void;
}) {
  return (
    <StepFrame
      icon={Bed}
      title="Sleep"
      description="Sleep is one of the strongest signals in the FutureBody model."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <RangeInput
          label="Sleep Duration"
          value={input.sleep}
          suffix="hours"
          min={3}
          max={10}
          step={0.5}
          onChange={(value) => updateNumber("sleep", value)}
        />

        <RangeInput
          label="Sleep Quality"
          value={input.sleepQuality}
          suffix="/100"
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateNumber("sleepQuality", value)}
        />
      </div>
    </StepFrame>
  );
}

function ActivityStep({
  input,
  updateNumber,
  setInput,
}: {
  input: HealthInput;
  updateNumber: (key: NumberFieldKey, value: number) => void;
  setInput: React.Dispatch<React.SetStateAction<HealthInput>>;
}) {
  return (
    <StepFrame
      icon={Activity}
      title="Activity"
      description="Movement and training affect energy, metabolic score and resilience."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <RangeInput
          label="Daily Steps"
          value={input.steps}
          suffix="steps"
          min={0}
          max={20000}
          step={500}
          onChange={(value) => updateNumber("steps", value)}
        />

        <RangeInput
          label="Strength Training"
          value={input.strength}
          suffix="days/week"
          min={0}
          max={7}
          step={1}
          onChange={(value) => updateNumber("strength", value)}
        />

        <RangeInput
          label="Cardio"
          value={input.cardio}
          suffix="min/week"
          min={0}
          max={500}
          step={10}
          onChange={(value) => updateNumber("cardio", value)}
        />

        <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Activity Level
          </div>

          <div className="grid gap-2 md:grid-cols-5">
            {[
              ["sedentary", "Low"],
              ["light", "Light"],
              ["moderate", "Mod"],
              ["active", "Active"],
              ["very_active", "High"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setInput((current) => ({
                    ...current,
                    activityLevel: value as HealthInput["activityLevel"],
                  }))
                }
                className={[
                  "rounded-xl border px-3 py-3 text-xs font-bold uppercase tracking-[0.12em]",
                  input.activityLevel === value
                    ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-200"
                    : "border-cyan-300/10 bg-slate-950/50 text-slate-500",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepFrame>
  );
}

function NutritionStep({
  input,
  updateNumber,
}: {
  input: HealthInput;
  updateNumber: (key: NumberFieldKey, value: number) => void;
}) {
  return (
    <StepFrame
      icon={Salad}
      title="Nutrition"
      description="Nutrition quality and alcohol load affect metabolic score and inflammation estimate."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <RangeInput
          label="Diet Quality"
          value={input.diet}
          suffix="/100"
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateNumber("diet", value)}
        />

        <RangeInput
          label="Alcohol"
          value={input.alcohol}
          suffix="drinks/week"
          min={0}
          max={30}
          step={1}
          onChange={(value) => updateNumber("alcohol", value)}
        />
      </div>
    </StepFrame>
  );
}

function StressStep({
  input,
  updateNumber,
}: {
  input: HealthInput;
  updateNumber: (key: NumberFieldKey, value: number) => void;
}) {
  return (
    <StepFrame
      icon={Brain}
      title="Stress"
      description="Stress pressure influences recovery, focus and burnout risk."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <RangeInput
          label="Stress Load"
          value={input.stress}
          suffix="/100"
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateNumber("stress", value)}
        />

        <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-5">
          <div className="mb-2 flex items-center gap-3">
            <Sparkles className="text-cyan-300" size={22} />
            <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Interpretation
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            {input.stress < 40
              ? "Stress load is low. The model will treat recovery pressure as relatively controlled."
              : input.stress < 65
                ? "Stress load is moderate. The model may show some recovery and focus pressure."
                : "Stress load is high. The model will increase burnout risk and reduce readiness."}
          </p>
        </div>
      </div>
    </StepFrame>
  );
}

function SymptomsStep({
  input,
  updateSymptom,
}: {
  input: HealthInput;
  updateSymptom: (key: keyof SymptomFlags, value: boolean) => void;
}) {
  const symptomItems: { key: keyof SymptomFlags; label: string }[] = [
    { key: "fatigue", label: "Fatigue" },
    { key: "headaches", label: "Headaches" },
    { key: "digestiveIssues", label: "Digestive Issues" },
    { key: "sleepIssues", label: "Sleep Issues" },
    { key: "jointPain", label: "Joint Pain" },
    { key: "anxiety", label: "Anxiety" },
    { key: "lowMood", label: "Low Mood" },
  ];

  return (
    <StepFrame
      icon={HeartPulse}
      title="Symptoms"
      description="These are non-diagnostic signals used only to adjust simulation pressure."
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {symptomItems.map((item) => {
          const checked = input.symptoms[item.key];

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => updateSymptom(item.key, !checked)}
              className={[
                "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
                checked
                  ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-200"
                  : "border-cyan-300/10 bg-slate-950/45 text-slate-500 hover:text-cyan-200",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-xl border",
                  checked
                    ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-300"
                    : "border-cyan-300/10 text-slate-600",
                ].join(" ")}
              >
                {checked ? <Check size={18} /> : null}
              </div>

              <div className="text-sm font-bold uppercase tracking-[0.14em]">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </StepFrame>
  );
}

function LabsStep({
  input,
  updateLab,
}: {
  input: HealthInput;
  updateLab: (key: keyof HealthInput["labs"], value: number) => void;
}) {
  return (
    <StepFrame
      icon={FlaskConical}
      title="Basic Labs"
      description="Optional. These are used as lightweight wellness signals, not diagnostic results."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NumberInput
          label="Vitamin D"
          value={input.labs.vitaminD || 0}
          suffix="ng/mL"
          min={0}
          max={150}
          step={1}
          onChange={(value) => updateLab("vitaminD", value)}
        />

        <NumberInput
          label="B12"
          value={input.labs.b12 || 0}
          suffix="pg/mL"
          min={0}
          max={2000}
          step={1}
          onChange={(value) => updateLab("b12", value)}
        />

        <NumberInput
          label="Ferritin"
          value={input.labs.ferritin || 0}
          suffix="ng/mL"
          min={0}
          max={500}
          step={1}
          onChange={(value) => updateLab("ferritin", value)}
        />

        <NumberInput
          label="HbA1c"
          value={input.labs.hba1c || 0}
          suffix="%"
          min={0}
          max={15}
          step={0.1}
          onChange={(value) => updateLab("hba1c", value)}
        />

        <NumberInput
          label="CRP"
          value={input.labs.crp || 0}
          suffix="mg/L"
          min={0}
          max={100}
          step={0.1}
          onChange={(value) => updateLab("crp", value)}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-orange-300/15 bg-orange-400/5 p-4 text-sm leading-7 text-orange-100/80">
        Labs are optional and not interpreted as diagnosis. This app only uses
        them as simulation context.
      </div>
    </StepFrame>
  );
}

function StepFrame({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Scale;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-300">
          <Icon size={28} />
        </div>

        <div>
          <h2 className="text-2xl font-bold uppercase tracking-[0.18em] text-white">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-slate-400">{description}</p>
        </div>
      </div>

      {children}
    </div>
  );
}

function NumberInput({
  label,
  value,
  suffix,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full bg-transparent text-2xl font-light text-white outline-none"
        />
        <span className="text-xs text-slate-500">{suffix}</span>
      </div>
    </label>
  );
}

function RangeInput({
  label,
  value,
  suffix,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">
          {label}
        </div>

        <div className="text-right">
          <div className="text-3xl font-light text-cyan-300">
            {value.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">{suffix}</div>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="future-slider"
        style={
          {
            "--progress": `${progress}%`,
          } as React.CSSProperties
        }
      />

      <div className="mt-2 flex justify-between text-xs text-slate-600">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

function getStepSubtitle(step: string) {
  if (step === "Profile") return "body context";
  if (step === "Sleep") return "recovery signal";
  if (step === "Activity") return "movement signal";
  if (step === "Nutrition") return "metabolic signal";
  if (step === "Stress") return "load signal";
  if (step === "Symptoms") return "pressure flags";
  return "optional labs";
}

function ScanBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_45%,rgba(34,211,238,.16),transparent_48%)]" />
    </>
  );
}