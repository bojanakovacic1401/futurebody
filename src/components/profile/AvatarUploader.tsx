"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Coins,
  RotateCcw,
  Save,
  Upload,
  WandSparkles,
  XCircle,
} from "lucide-react";
import { AvatarMorphPreview } from "@/components/avatar/AvatarMorphPreview";
import {
  defaultAvatarDraft,
  getStoredAvatarDraft,
  saveStoredAvatarDraft,
  type ActivityLevel,
  type AvatarDraftParams,
  type AvatarScenario,
} from "@/lib/avatar/draft";
import {
  resetStoredDashboardAvatar,
  saveStoredDashboardAvatar,
} from "@/lib/health/storage";

const fallbackPreview = "/assets/body-hologram.png";

export function AvatarUploader() {
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [scenario, setScenario] = useState<AvatarScenario>("baseline");
  const [draft, setDraft] = useState<AvatarDraftParams>(defaultAvatarDraft);

  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDraft(getStoredAvatarDraft());
    refreshCredits();
  }, []);

  const previewUrl = generatedUrl || uploadedUrl || fallbackPreview;

  const projectedLabel = useMemo(() => {
    if (draft.sleepHours >= 7 && draft.stress <= 45 && draft.goalWeightKg <= draft.weightKg) {
      return "Improved trajectory";
    }

    if (draft.stress >= 70 || draft.sleepHours < 6) {
      return "Risk pressure";
    }

    return "Baseline trajectory";
  }, [draft]);

  async function refreshCredits() {
    try {
      const response = await fetch("/api/avatar/credits", {
        method: "GET",
      });

      const data = await response.json();

      if (data.ok) {
        setCredits(data.credits);
      }
    } catch {
      setCredits(null);
    }
  }

  function updateDraft(next: Partial<AvatarDraftParams>) {
    const updated = {
      ...draft,
      ...next,
    };

    setDraft(updated);
    saveStoredAvatarDraft(updated);
  }

  async function getApiMessage(response: Response) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return data.message || "Request failed.";
    }

    return `API returned non-JSON. Status: ${response.status}. URL: ${response.url}`;
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/avatar/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setMessage(await getApiMessage(response));
        return;
      }

      const data = await response.json();

      if (!data.ok) {
        setMessage(data.message || "Upload failed.");
        return;
      }

      setUploadedUrl(data.imageUrl);
      setGeneratedUrl("");
      setMessage("Image uploaded. Use sliders freely — no credits are used yet.");
    } catch (error) {
      console.error("Upload client error:", error);
      setMessage("Upload failed on client.");
    } finally {
      setLoading(false);
    }
  }

  async function generateFinalAvatar() {
    if (!uploadedUrl && !generatedUrl) {
      setMessage("Upload a face image first.");
      return;
    }

    if (credits !== null && credits <= 0) {
      setMessage("Not enough avatar credits.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/avatar/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedUrl || generatedUrl,
          scenario,
          metrics: draft,
          finalGeneration: true,
        }),
      });

      if (!response.ok) {
        setMessage(await getApiMessage(response));
        return;
      }

      const data = await response.json();

      if (!data.ok) {
        setMessage(data.message || "Generation failed.");
        return;
      }

      setGeneratedUrl(data.imageUrl);
      saveStoredDashboardAvatar(data.imageUrl, scenario);

      if (typeof data.credits === "number") {
        setCredits(data.credits);
      } else {
        await refreshCredits();
      }

      setMessage(
        data.creditsCharged
          ? "Final AI avatar generated. 1 credit used."
          : "Avatar preview returned. No credits used in mock mode."
      );
    } catch (error) {
      console.error("Generation client error:", error);
      setMessage("Generation failed on client.");
    } finally {
      setLoading(false);
    }
  }

  function saveCurrentToDashboard() {
    if (!generatedUrl) {
      setMessage("Generate a final avatar first.");
      return;
    }

    saveStoredDashboardAvatar(generatedUrl, scenario);
    setMessage("Dashboard avatar saved.");
  }

  function clearDashboardAvatar() {
    resetStoredDashboardAvatar();
    setGeneratedUrl("");
    setMessage("Dashboard avatar cleared. Dashboard will use default hologram.");
  }

  function resetDraft() {
    updateDraft(defaultAvatarDraft);
    setMessage("Live avatar draft reset. No credits used.");
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/45 p-6 shadow-[0_0_35px_rgba(8,145,178,.14)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(34,211,238,.14),transparent_45%)]" />

      <div className="relative z-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-white">
              Live Body Avatar Editor
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Adjust the body like a simulation editor. Sliders update the
              preview instantly without credits. Credits are used only when you
              generate the final AI avatar.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-cyan-300/15 bg-slate-950/60 px-4 py-3">
            <Coins className="text-cyan-300" size={20} />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Avatar Credits
              </div>
              <div className="text-xl font-light text-white">
                {credits === null ? "—" : credits}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[520px_minmax(0,1fr)]">
          <div className="space-y-4">
            <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-300/25 bg-slate-950/60 p-6 text-center transition hover:border-cyan-300/50 hover:bg-cyan-400/5">
              {uploadedUrl ? (
                <Image
                  src={uploadedUrl}
                  alt="Uploaded avatar"
                  width={320}
                  height={320}
                  unoptimized
                  className="h-48 w-48 rounded-2xl object-cover"
                />
              ) : (
                <>
                  <Upload className="mb-4 text-cyan-300" size={38} />
                  <div className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-300">
                    Upload face image
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    PNG, JPG or WEBP. Max 8MB.
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="grid grid-cols-3 gap-2">
              {(["baseline", "improved", "risk"] as AvatarScenario[]).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setScenario(item)}
                    className={[
                      "rounded-xl border px-3 py-3 text-xs font-bold uppercase tracking-[0.14em]",
                      scenario === item
                        ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-200"
                        : "border-cyan-300/10 bg-slate-950/50 text-slate-500 hover:bg-cyan-400/5",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/50 p-4">
              <div className="mb-4 flex items-center gap-3">
                <Activity className="text-cyan-300" size={20} />
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                    Sims-Like Body Controls
                  </div>
                  <div className="text-xs text-slate-500">
                    Live preview only · 0 credits
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <MorphSlider
                  label="Weight"
                  value={draft.weightKg}
                  min={35}
                  max={180}
                  step={1}
                  suffix="kg"
                  onChange={(value) => updateDraft({ weightKg: value })}
                />

                <MorphSlider
                  label="Goal Weight"
                  value={draft.goalWeightKg}
                  min={35}
                  max={180}
                  step={1}
                  suffix="kg"
                  onChange={(value) => updateDraft({ goalWeightKg: value })}
                />

                <MorphSlider
                  label="Body Fat"
                  value={draft.bodyFat}
                  min={5}
                  max={55}
                  step={1}
                  suffix="%"
                  onChange={(value) => updateDraft({ bodyFat: value })}
                />

                <MorphSlider
                  label="Muscle Tone"
                  value={draft.muscleTone}
                  min={0}
                  max={100}
                  step={1}
                  suffix="/100"
                  onChange={(value) => updateDraft({ muscleTone: value })}
                />

                <MorphSlider
                  label="Posture"
                  value={draft.posture}
                  min={0}
                  max={100}
                  step={1}
                  suffix="/100"
                  onChange={(value) => updateDraft({ posture: value })}
                />

                <MorphSlider
                  label="Sleep"
                  value={draft.sleepHours}
                  min={3}
                  max={10}
                  step={0.5}
                  suffix="h"
                  onChange={(value) => updateDraft({ sleepHours: value })}
                />

                <MorphSlider
                  label="Stress"
                  value={draft.stress}
                  min={0}
                  max={100}
                  step={1}
                  suffix="/100"
                  onChange={(value) => updateDraft({ stress: value })}
                />

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Activity level
                  </label>

                  <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                    {[
                      ["sedentary", "Low"],
                      ["light", "Light"],
                      ["moderate", "Moderate"],
                      ["active", "Active"],
                      ["very_active", "High"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          updateDraft({
                            activityLevel: value as ActivityLevel,
                          })
                        }
                        className={[
                          "rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em]",
                          draft.activityLevel === value
                            ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-200"
                            : "border-cyan-300/10 bg-slate-950/50 text-slate-500 hover:bg-cyan-400/5",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={generateFinalAvatar}
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-cyan-300/40 bg-cyan-400/15 font-bold uppercase tracking-[0.16em] text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <WandSparkles size={20} />
              {loading ? "Generating..." : "Generate Final Avatar · 1 Credit"}
            </button>

            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={saveCurrentToDashboard}
                disabled={!generatedUrl}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 text-xs font-bold uppercase tracking-[0.14em] text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save size={18} />
                Use Final
              </button>

              <button
                type="button"
                onClick={resetDraft}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-xs font-bold uppercase tracking-[0.14em] text-cyan-200"
              >
                <RotateCcw size={18} />
                Reset Draft
              </button>

              <button
                type="button"
                onClick={clearDashboardAvatar}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-300/20 bg-red-400/10 text-xs font-bold uppercase tracking-[0.14em] text-red-200"
              >
                <XCircle size={18} />
                Clear
              </button>
            </div>

            {message ? (
              <p className="rounded-xl border border-cyan-300/10 bg-slate-950/45 p-3 text-sm text-slate-400">
                {message}
              </p>
            ) : null}
          </div>

          <div className="relative min-h-[820px] overflow-hidden rounded-2xl border border-cyan-300/10 bg-slate-950/60">
            <AvatarMorphPreview imageUrl={previewUrl} draft={draft} />

            <div className="absolute right-5 top-5 z-30 rounded-full border border-cyan-300/20 bg-slate-950/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
              {projectedLabel}
            </div>

            <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-emerald-300/20 bg-slate-950/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
              <CheckCircle2 size={14} />
              Draft Auto-Saved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MorphSlider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <label className="block rounded-xl border border-cyan-300/10 bg-slate-950/45 p-3">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>

        <span className="text-sm font-bold text-cyan-300">
          {value} {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="futurebody-range w-full"
        style={{ "--progress": `${progress}%` } as React.CSSProperties}
      />
    </label>
  );
}