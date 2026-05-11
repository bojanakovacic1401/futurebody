"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, ElementType, ReactNode } from "react";
import {
  Activity,
  Apple,
  Brain,
  Calendar,
  CheckCircle2,
  Dumbbell,
  FlaskConical,
  Moon,
  ShieldPlus,
  UploadCloud,
  UserRound,
  Waves,
  Zap,
} from "lucide-react";
import { calculateHealthScores } from "@/lib/health/scoring";
import {
  getStoredDashboardAvatar,
  saveStoredHealthInput,
} from "@/lib/health/storage";
import { useSyncedHealthInput } from "@/lib/health/useSyncedHealthInput";
import { getStressStatus, getStressStatusClass } from "@/lib/health/status";
import { HealthRange } from "@/components/ui/HealthRange";
import type { HealthInput } from "@/types/health";

const PROFILE_STORAGE_KEY = "futurebody_profile_setup";

const assets = {
  body: "/assets/body-hologram.png",
};

type SetupProfile = {
  fullName: string;
  birthDate: string;
  biologicalSex: "male" | "female" | "other";
  heightCm: number;
  dietType: string;
  mealsPerDay: string;
  sleepQuality: string;
  activityLevel: string;
  perceivedStress: string;
  symptoms: string[];
  notes: string;
  labFileName: string;
};

const defaultProfile: SetupProfile = {
  fullName: "Alex Morgan",
  birthDate: "May 16, 1990",
  biologicalSex: "male",
  heightCm: 178,
  dietType: "Omnivore",
  mealsPerDay: "3",
  sleepQuality: "Good",
  activityLevel: "Moderate",
  perceivedStress: "Moderate",
  symptoms: ["None"],
  notes: "",
  labFileName: "",
};

const steps = [
  { number: 1, label: "Basic Info" },
  { number: 2, label: "Health Profile" },
  { number: 3, label: "Lifestyle" },
  { number: 4, label: "Review" },
];

const dietTypes = [
  "Omnivore",
  "Mediterranean",
  "Vegetarian",
  "Vegan",
  "High Protein",
  "Low Carb",
];

const symptomOptions = [
  "None",
  "Fatigue",
  "Headaches",
  "Digestive Issues",
  "Sleep Issues",
  "Joint Pain",
  "Anxiety",
  "Depression",
  "Other",
];

function loadProfile() {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  try {
    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!stored) {
      return defaultProfile;
    }

    return {
      ...defaultProfile,
      ...JSON.parse(stored),
    } as SetupProfile;
  } catch {
    return defaultProfile;
  }
}

function saveProfile(profile: SetupProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

function getNumber(input: HealthInput, key: keyof HealthInput, fallback: number) {
  const value = input[key];

  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { input, setInput } = useSyncedHealthInput();

  const [profile, setProfile] = useState<SetupProfile>(defaultProfile);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    setProfile(loadProfile());

    const avatar = getStoredDashboardAvatar();
    setAvatarUrl(avatar?.imageUrl || "");
  }, []);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const scores = useMemo(() => calculateHealthScores(input), [input]);

  const sleep = getNumber(input, "sleep", 7);
  const stepsPerDay = getNumber(input, "steps", 8000);
  const cardio = getNumber(input, "cardio", 60);
  const strength = getNumber(input, "strength", 2);
  const diet = getNumber(input, "diet", 72);
  const stress = getNumber(input, "stress", 34);
  const weight = getNumber(input, "weight", 72);
  const bodyFat = getNumber(input, "bodyFat", 18);
  const alcohol = getNumber(input, "alcohol", 2);

  const previewMood =
    sleep >= 7 && stress <= 45 && stepsPerDay >= 8000
      ? "improved"
      : stress >= 70 || sleep < 6 || stepsPerDay < 4500
        ? "risk"
        : "baseline";

  function updateInputNumber(key: keyof HealthInput, value: number) {
    setInput({
      ...input,
      [key]: value,
    } as HealthInput);
  }

  function updateProfile<K extends keyof SetupProfile>(
    key: K,
    value: SetupProfile[K]
  ) {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleSymptom(symptom: string) {
    setProfile((current) => {
      if (symptom === "None") {
        return {
          ...current,
          symptoms: ["None"],
        };
      }

      const withoutNone = current.symptoms.filter((item) => item !== "None");
      const exists = withoutNone.includes(symptom);

      return {
        ...current,
        symptoms: exists
          ? withoutNone.filter((item) => item !== symptom)
          : [...withoutNone, symptom],
      };
    });
  }

  function handleLabFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    updateProfile("labFileName", file.name);
  }

  function saveAndGo(path: string) {
    saveStoredHealthInput(input);
    saveProfile(profile);
    router.push(path);
  }

  return (
    <main className="w-full overflow-x-hidden px-4 py-4 md:px-6">
      <section className="mx-auto grid w-full max-w-[1760px] gap-4 xl:grid-cols-[minmax(0,2fr)_390px]">
        <div className="min-w-0">
          <HUDPanel className="mb-4 p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-[0.22em] text-white">
                  Health Setup
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Build your baseline. The more accurate your data, the smarter
                  your insights.
                </p>
              </div>

              <div className="min-w-0 flex-1 lg:max-w-[780px]">
                <Stepper />
              </div>

              <div className="rounded-xl border border-cyan-300/20 bg-slate-950/60 px-5 py-3 text-xs font-bold text-white">
                Step 2 of 4
              </div>
            </div>
          </HUDPanel>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr_1fr] xl:auto-rows-[330px]">
            <SetupCard
              icon={UserRound}
              title="Basic Profile"
              subtitle="Tell us about yourself"
            >
              <div className="space-y-4">
                <TextInput
                  label="Full Name"
                  value={profile.fullName}
                  placeholder="Alex Morgan"
                  onChange={(value) => updateProfile("fullName", value)}
                />

                <TextInput
                  label="Date of Birth"
                  value={profile.birthDate}
                  placeholder="May 16, 1990"
                  onChange={(value) => updateProfile("birthDate", value)}
                />

                <div>
                  <Label>Biological Sex</Label>
                  <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-cyan-300/15 bg-slate-950/45">
                    {[
                      ["male", "Male"],
                      ["female", "Female"],
                      ["other", "Other"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          updateProfile(
                            "biologicalSex",
                            value as SetupProfile["biologicalSex"]
                          )
                        }
                        className={[
                          "h-10 border-r border-cyan-300/10 text-xs last:border-r-0",
                          profile.biologicalSex === value
                            ? "bg-cyan-400/15 text-cyan-200"
                            : "text-slate-400 hover:bg-cyan-400/5",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StaticBox
                    label="Height"
                    value={profile.heightCm}
                    suffix="cm"
                  />

                  <NumberBox
                    label="Weight"
                    value={weight}
                    suffix="kg"
                    onChange={(value) => updateInputNumber("weight", value)}
                  />
                </div>

                <HealthRange
                  label="Body Fat est."
                  value={bodyFat}
                  min={5}
                  max={45}
                  step={1}
                  suffix="%"
                  onChange={(value) => updateInputNumber("bodyFat", value)}
                />
              </div>
            </SetupCard>

            <SetupCard
              icon={Moon}
              title="Sleep"
              subtitle="Your sleep patterns & quality"
            >
              <div className="space-y-4">
                <div>
                  <Label>Average Sleep</Label>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-light text-cyan-200">
                      {Math.floor(sleep)}
                    </span>
                    <span className="mb-1 text-sm text-slate-400">h</span>
                    <span className="text-3xl font-light text-white">
                      {Math.round((sleep % 1) * 60)}
                    </span>
                    <span className="mb-1 text-sm text-slate-400">m</span>
                    <Sparkline className="ml-auto" />
                  </div>
                </div>

                <Segmented
                  label="Sleep Quality"
                  options={["Poor", "Fair", "Good", "Excellent"]}
                  active={profile.sleepQuality}
                  onChange={(value) => updateProfile("sleepQuality", value)}
                />

                <HealthRange
                  label="Average Sleep"
                  value={sleep}
                  min={3}
                  max={10}
                  step={0.5}
                  suffix="h"
                  onChange={(value) => updateInputNumber("sleep", value)}
                />
              </div>
            </SetupCard>

            <SetupCard
              icon={Activity}
              title="Activity"
              subtitle="Your movement & exercise"
            >
              <div className="space-y-4">
                <Segmented
                  label="Activity Level"
                  options={[
                    "Sedentary",
                    "Light",
                    "Moderate",
                    "Active",
                    "Very Active",
                  ]}
                  active={profile.activityLevel}
                  onChange={(value) => updateProfile("activityLevel", value)}
                />

                <StepperInput
                  label="Exercise"
                  value={strength}
                  suffix="days per week"
                  onMinus={() =>
                    updateInputNumber("strength", Math.max(0, strength - 1))
                  }
                  onPlus={() =>
                    updateInputNumber("strength", Math.min(7, strength + 1))
                  }
                />

                <StepperInput
                  label="Avg. Duration"
                  value={cardio}
                  suffix="mins"
                  onMinus={() =>
                    updateInputNumber("cardio", Math.max(0, cardio - 15))
                  }
                  onPlus={() =>
                    updateInputNumber("cardio", Math.min(300, cardio + 15))
                  }
                />

                <HealthRange
                  label="Steps Goal"
                  value={stepsPerDay}
                  min={2000}
                  max={20000}
                  step={500}
                  suffix="steps"
                  onChange={(value) => updateInputNumber("steps", value)}
                />
              </div>
            </SetupCard>

            <SetupCard
              icon={Apple}
              title="Nutrition"
              subtitle="Your eating habits"
            >
              <div className="space-y-4">
                <SelectBox
                  label="Diet Type"
                  value={profile.dietType}
                  options={dietTypes}
                  onChange={(value) => updateProfile("dietType", value)}
                />

                <Segmented
                  label="Meals per Day"
                  options={["1", "2", "3", "4+"]}
                  active={profile.mealsPerDay}
                  onChange={(value) => updateProfile("mealsPerDay", value)}
                />

                <HealthRange
                  label="Diet Quality"
                  value={diet}
                  min={0}
                  max={100}
                  step={1}
                  suffix="/100"
                  onChange={(value) => updateInputNumber("diet", value)}
                />

                <HealthRange
                  label="Alcohol"
                  value={alcohol}
                  min={0}
                  max={8}
                  step={1}
                  suffix="drinks/wk"
                  onChange={(value) => updateInputNumber("alcohol", value)}
                />
              </div>
            </SetupCard>

            <SetupCard
              icon={Waves}
              title="Stress"
              subtitle="Stress & mental wellbeing"
            >
              <div className="space-y-4">
                <Segmented
                  label="Perceived Stress"
                  options={["Low", "Moderate", "High"]}
                  active={profile.perceivedStress}
                  onChange={(value) => {
                    updateProfile("perceivedStress", value);

                    if (value === "Low") {
                      updateInputNumber("stress", Math.min(stress, 30));
                    }

                    if (value === "Moderate") {
                      updateInputNumber(
                        "stress",
                        Math.max(36, Math.min(stress, 65))
                      );
                    }

                    if (value === "High") {
                      updateInputNumber("stress", Math.max(stress, 70));
                    }
                  }}
                />

                <div>
                  <Label>Stress Score est.</Label>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-light text-white">
                      {stress}
                    </span>
                    <span className="mb-1 text-sm text-slate-500">/100</span>
                    <span
                      className={`mb-1 ml-3 text-xs font-bold uppercase ${getStressStatusClass(
                        stress
                      )}`}
                    >
                      {getStressStatus(stress)}
                    </span>
                    <Sparkline className="ml-auto" />
                  </div>
                </div>

                <HealthRange
                  label="Stress Load"
                  value={stress}
                  min={0}
                  max={100}
                  step={1}
                  suffix="/100"
                  onChange={(value) => updateInputNumber("stress", value)}
                />
              </div>
            </SetupCard>

            <SetupCard
              icon={ShieldPlus}
              title="Symptoms"
              subtitle="Any ongoing symptoms?"
            >
              <div className="space-y-4">
                <Label>Select all that apply</Label>

                <div className="flex flex-wrap gap-2">
                  {symptomOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleSymptom(item)}
                      className={[
                        "rounded-lg border px-3 py-2 text-xs",
                        profile.symptoms.includes(item)
                          ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-200"
                          : "border-cyan-300/10 bg-slate-950/45 text-slate-400 hover:bg-cyan-400/5",
                      ].join(" ")}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <textarea
                  value={profile.notes}
                  onChange={(event) => updateProfile("notes", event.target.value)}
                  placeholder="Add any additional details..."
                  className="min-h-[84px] w-full resize-none rounded-xl border border-cyan-300/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </SetupCard>

            <SetupCard icon={Zap} title="Live Impact" subtitle="Instant model refresh">
              <div className="space-y-4">
                <MetricLine label="Energy" value={scores.energy} />
                <MetricLine label="Readiness" value={scores.readiness} />
                <MetricLine label="Recovery" value={scores.recovery} />
                <p className="text-sm leading-6 text-slate-400">
                  These values are saved locally and shared with Dashboard and
                  Body Systems immediately.
                </p>
              </div>
            </SetupCard>

            <SetupCard icon={Brain} title="Model Summary" subtitle="Current projection">
              <div className="space-y-4">
                <p className="text-sm leading-6 text-slate-400">
                  Your profile currently suggests the biggest leverage is:
                </p>
                <div className="rounded-xl border border-cyan-300/10 bg-cyan-400/10 p-4 text-lg font-semibold text-cyan-200">
                  {sleep < 7
                    ? "Improve Sleep"
                    : stress > 55
                      ? "Reduce Stress"
                      : stepsPerDay < 8000
                        ? "Increase Movement"
                        : "Maintain Momentum"}
                </div>
              </div>
            </SetupCard>

            <SetupCard
              icon={FlaskConical}
              title="Optional Labs"
              subtitle="Add recent lab results"
            >
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  onChange={handleLabFile}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-full items-center justify-center rounded-xl border border-dashed border-cyan-300/30 bg-slate-950/45 text-center transition hover:border-cyan-300/60 hover:bg-cyan-400/10"
                >
                  <div>
                    <UploadCloud className="mx-auto text-cyan-300" size={22} />
                    <div className="mt-1 text-xs font-bold text-white">
                      {profile.labFileName
                        ? "Lab Report Selected"
                        : "Upload Lab Report"}
                    </div>
                    <div className="max-w-[260px] truncate text-[10px] text-slate-500">
                      {profile.labFileName || "PDF, PNG or JPG max 10MB"}
                    </div>
                  </div>
                </button>

                {[
                  ["Vitamin D", "32 ng/mL"],
                  ["Vitamin B12", "458 pg/mL"],
                  ["Ferritin", "78 ng/mL"],
                  ["HbA1c", "5.2 %"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-lg border border-cyan-300/10 bg-slate-950/45 px-3 py-2 text-sm"
                  >
                    <span className="text-slate-400">{label}</span>
                    <span className="flex items-center gap-2 text-white">
                      {value}
                      <CheckCircle2 size={14} className="text-emerald-300" />
                    </span>
                  </div>
                ))}
              </div>
            </SetupCard>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <Link
              href="/login"
              className="rounded-xl border border-cyan-300/15 bg-slate-950/50 px-7 py-3 text-sm text-slate-300"
            >
              ← Back
            </Link>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => saveAndGo("/dashboard")}
                className="rounded-xl border border-cyan-300/15 bg-slate-950/50 px-10 py-3 text-sm text-slate-300"
              >
                Save & Exit
              </button>

              <button
                type="button"
                onClick={() => saveAndGo("/dashboard")}
                className="rounded-xl bg-cyan-400 px-12 py-3 text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,.45)]"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>

        <aside className="min-w-0 xl:pt-[112px]">
          <div className="sticky top-24 space-y-4">
            <HUDPanel className="overflow-hidden p-4">
              <div className="mb-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                  Your Preview
                </h2>
                <p className="text-xs text-slate-500">Live impact projection</p>
              </div>

              <div className="relative h-[330px] overflow-hidden rounded-2xl border border-cyan-300/10 bg-slate-950/45">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,.18),transparent_58%)]" />

                <div
                  className={[
                    "relative z-10 flex h-full w-full items-center justify-center transition-all duration-500",
                    previewMood === "improved"
                      ? "brightness-110 saturate-125"
                      : previewMood === "risk"
                        ? "brightness-75 saturate-75 opacity-85"
                        : "brightness-100",
                  ].join(" ")}
                  style={{
                    transform:
                      previewMood === "improved"
                        ? "translateY(-4px) scale(1.03)"
                        : previewMood === "risk"
                          ? "translateY(8px) scale(0.98) rotate(-1deg)"
                          : "translateY(0) scale(1)",
                  }}
                >
                  <Image
                    src={avatarUrl || assets.body}
                    alt="FutureBody preview"
                    width={700}
                    height={900}
                    priority
                    unoptimized={Boolean(avatarUrl)}
                    className={[
                      "h-full w-auto object-contain drop-shadow-[0_0_45px_rgba(34,211,238,.9)] transition-all duration-500",
                      avatarUrl ? "rounded-2xl" : "scale-[1.08]",
                    ].join(" ")}
                  />
                </div>

                <div className="absolute bottom-3 left-3 rounded-full border border-cyan-300/20 bg-slate-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300">
                  {previewMood} projection
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-cyan-300/10 bg-slate-950/45 p-3 text-xs text-slate-400">
                Live preview uses local visual transforms. Real body-shape
                regeneration needs an AI generation click, not continuous slider
                updates.
              </div>
            </HUDPanel>

            <HUDPanel className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                    Projected Baseline Scores
                  </h2>
                  <p className="text-xs text-slate-500">
                    Est. based on provided data
                  </p>
                </div>

                <Link
                  href="/body"
                  className="rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300"
                >
                  View Details
                </Link>
              </div>

              <div className="space-y-3">
                <PreviewScore
                  icon={Zap}
                  label="Energy Score"
                  value={scores.energy}
                  status="Good"
                />
                <PreviewScore
                  icon={Brain}
                  label="Focus Score"
                  value={scores.focus}
                  status="Good"
                />
                <PreviewScore
                  icon={Moon}
                  label="Sleep Score"
                  value={scores.recovery}
                  status="Good"
                />
                <PreviewScore
                  icon={Activity}
                  label="Recovery Score"
                  value={scores.readiness}
                  status="Good"
                />
                <PreviewScore
                  icon={Waves}
                  label="Stress Score"
                  value={stress}
                  status={getStressStatus(stress)}
                  amber={stress > 35}
                />
                <PreviewScore
                  icon={Dumbbell}
                  label="Metabolic Score"
                  value={scores.metabolic}
                  status="Good"
                />
                <PreviewScore
                  icon={Calendar}
                  label="Longevity Score"
                  value={Math.max(50, Math.min(95, scores.readiness - 4))}
                  status="Good"
                />
              </div>

              <div className="mt-4 rounded-xl border border-cyan-300/10 bg-slate-950/45 p-3 text-xs text-slate-500">
                ⓘ These scores refine as you add more data.
              </div>
            </HUDPanel>
          </div>
        </aside>
      </section>
    </main>
  );
}

function HUDPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-slate-950/45 shadow-[0_0_28px_rgba(8,145,178,.12)]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.025)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function SetupCard({
  icon: Icon,
  title,
  subtitle,
  children,
  className = "",
}: {
  icon: ElementType;
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <HUDPanel className={`h-full p-5 ${className}`}>
      <div className="mb-4 flex items-start gap-4 border-b border-cyan-300/10 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
          <Icon size={22} />
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
            {title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div>{children}</div>
    </HUDPanel>
  );
}

function Stepper() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {steps.map((step) => (
        <div key={step.number} className="relative">
          <div className="flex items-center">
            <div
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold",
                step.number === 2
                  ? "border-cyan-300 bg-cyan-400/20 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,.45)]"
                  : step.number < 2
                    ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-300"
                    : "border-slate-700 bg-slate-950 text-slate-500",
              ].join(" ")}
            >
              {step.number}
            </div>

            {step.number !== 4 ? (
              <div
                className={[
                  "h-px flex-1",
                  step.number <= 2 ? "bg-cyan-300/60" : "bg-slate-700",
                ].join(" ")}
              />
            ) : null}
          </div>

          <div
            className={[
              "mt-2 text-[9px] font-bold uppercase tracking-[0.12em]",
              step.number === 2 ? "text-cyan-300" : "text-slate-500",
            ].join(" ")}
          >
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
      {children}
    </div>
  );
}

function TextInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-cyan-300/10 bg-slate-950/45 px-3 text-sm text-white outline-none placeholder:text-slate-600"
      />
    </label>
  );
}

function NumberBox({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="flex h-10 items-center rounded-lg border border-cyan-300/10 bg-slate-950/45 px-3">
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full bg-transparent text-sm text-white outline-none"
        />
        <span className="text-xs text-slate-500">{suffix}</span>
      </div>
    </label>
  );
}

function StaticBox({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <div className="block">
      <Label>{label}</Label>
      <div className="flex h-10 items-center rounded-lg border border-cyan-300/10 bg-slate-950/35 px-3">
        <span className="text-sm text-white">{value}</span>
        <span className="ml-auto text-xs text-slate-500">{suffix}</span>
      </div>
    </div>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-cyan-300/10 bg-slate-950/45 px-3 text-sm text-white outline-none"
      >
        {options.map((item) => (
          <option key={item} value={item} className="bg-slate-950 text-white">
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}

function Segmented({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div
        className="grid overflow-hidden rounded-lg border border-cyan-300/10 bg-slate-950/45"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={[
              "h-9 border-r border-cyan-300/10 text-[10px] last:border-r-0",
              item === active
                ? "bg-cyan-400/15 text-cyan-200"
                : "text-slate-500 hover:bg-cyan-400/5",
            ].join(" ")}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepperInput({
  label,
  value,
  suffix,
  onMinus,
  onPlus,
}: {
  label: string;
  value: number;
  suffix: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-light text-cyan-300">{value}</span>
          <span className="ml-2 text-sm text-slate-400">{suffix}</span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onMinus}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/15 text-cyan-300"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onPlus}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/15 text-cyan-300"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 24" className={`h-6 w-24 ${className}`}>
      <polyline
        points="0,16 12,15 24,17 36,8 48,13 60,12 72,7 84,11 100,6"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PreviewScore({
  icon: Icon,
  label,
  value,
  status,
  amber = false,
}: {
  icon: ElementType;
  label: string;
  value: number;
  status: string;
  amber?: boolean;
}) {
  return (
    <div className="grid grid-cols-[28px_1fr_52px_48px_78px] items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full border ${
          amber
            ? "border-orange-300/35 text-orange-300"
            : "border-cyan-300/25 text-cyan-300"
        }`}
      >
        <Icon size={15} />
      </div>

      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>

      <div className="text-xl font-light text-white">
        {value}
        <span className="text-[10px] text-slate-500">/100</span>
      </div>

      <div
        className={`text-[10px] font-bold uppercase ${
          amber ? "text-orange-300" : "text-emerald-300"
        }`}
      >
        {status}
      </div>

      <Sparkline />
    </div>
  );
}

function MetricLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="uppercase tracking-[0.14em] text-slate-500">
          {label}
        </span>
        <span className="text-cyan-300">{value}/100</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-300"
          style={{ width: `${Math.max(5, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}