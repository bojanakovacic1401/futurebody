"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Activity, Dumbbell, Moon, Scale, Upload, WandSparkles } from "lucide-react";

type GenerationScenario = "baseline" | "improved" | "risk";

type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export function AvatarUploader() {
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [scenario, setScenario] = useState<GenerationScenario>("baseline");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(72);
  const [bodyFat, setBodyFat] = useState(18);
  const [sleepHours, setSleepHours] = useState(6.5);
  const [stress, setStress] = useState(55);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goalWeightKg, setGoalWeightKg] = useState(68);

  async function getApiMessage(response: Response) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return data.message || "Request failed.";
    }

    const text = await response.text();
    console.error("Non JSON response:", text);

    return `API returned non-JSON. Status: ${response.status}. URL: ${response.url}`;
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

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
      setMessage("Image uploaded successfully. Ready to generate avatar.");
    } catch (error) {
      console.error("Upload client error:", error);
      setMessage("Upload failed on client.");
    } finally {
      setLoading(false);
    }
  }

  async function generateAvatar() {
    if (!uploadedUrl) {
      setMessage("Upload a face image first.");
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
          imageUrl: uploadedUrl,
          scenario,
          metrics: {
            heightCm,
            weightKg,
            bodyFat,
            sleepHours,
            stress,
            activityLevel,
            goalWeightKg,
          },
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
      setMessage("Future avatar generated.");
    } catch (error) {
      console.error("Generation client error:", error);
      setMessage("Generation failed on client.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/45 p-6 shadow-[0_0_35px_rgba(8,145,178,.14)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(34,211,238,.14),transparent_45%)]" />

      <div className="relative z-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-white">
            Future Avatar
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Upload a photo, enter body data, and generate a realistic future health avatar.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
          <div className="space-y-4">
            <label className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-300/25 bg-slate-950/60 p-6 text-center transition hover:border-cyan-300/50 hover:bg-cyan-400/5">
              {uploadedUrl ? (
                <Image
                  src={uploadedUrl}
                  alt="Uploaded avatar"
                  width={320}
                  height={320}
                  className="h-52 w-52 rounded-2xl object-cover"
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
              {(["baseline", "improved", "risk"] as GenerationScenario[]).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setScenario(item)}
                    className={[
                      "rounded-xl border px-3 py-3 text-xs font-bold uppercase tracking-[0.14em]",
                      scenario === item
                        ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-200"
                        : "border-cyan-300/10 bg-slate-950/50 text-slate-500",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/50 p-4">
              <div className="mb-4 flex items-center gap-3">
                <Scale className="text-cyan-300" size={20} />
                <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                  Body Inputs
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricInput
                  label="Height"
                  value={heightCm}
                  suffix="cm"
                  min={130}
                  max={220}
                  step={1}
                  onChange={setHeightCm}
                />

                <MetricInput
                  label="Weight"
                  value={weightKg}
                  suffix="kg"
                  min={35}
                  max={180}
                  step={1}
                  onChange={setWeightKg}
                />

                <MetricInput
                  label="Body fat"
                  value={bodyFat}
                  suffix="%"
                  min={5}
                  max={55}
                  step={1}
                  onChange={setBodyFat}
                />

                <MetricInput
                  label="Goal weight"
                  value={goalWeightKg}
                  suffix="kg"
                  min={35}
                  max={180}
                  step={1}
                  onChange={setGoalWeightKg}
                />

                <MetricInput
                  label="Sleep"
                  value={sleepHours}
                  suffix="h"
                  min={3}
                  max={10}
                  step={0.5}
                  onChange={setSleepHours}
                />

                <MetricInput
                  label="Stress"
                  value={stress}
                  suffix="/100"
                  min={0}
                  max={100}
                  step={1}
                  onChange={setStress}
                />
              </div>

              <div className="mt-4">
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
                      onClick={() => setActivityLevel(value as ActivityLevel)}
                      className={[
                        "rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em]",
                        activityLevel === value
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

            <button
              type="button"
              onClick={generateAvatar}
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-cyan-300/40 bg-cyan-400/15 font-bold uppercase tracking-[0.16em] text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <WandSparkles size={20} />
              {loading ? "Processing..." : "Generate Avatar"}
            </button>

            {message ? (
              <p className="rounded-xl border border-cyan-300/10 bg-slate-950/45 p-3 text-sm text-slate-400">
                {message}
              </p>
            ) : null}
          </div>

          <div className="relative min-h-[760px] overflow-hidden rounded-2xl border border-cyan-300/10 bg-slate-950/60">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.04)_1px,transparent_1px)] bg-[size:36px_36px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.16),transparent_55%)]" />

            {generatedUrl ? (
              <Image
                src={generatedUrl}
                alt="Generated FutureBody avatar"
                width={1024}
                height={1536}
                className="relative z-10 h-full w-full object-contain p-6 drop-shadow-[0_0_45px_rgba(34,211,238,.45)]"
              />
            ) : uploadedUrl ? (
              <Image
                src={uploadedUrl}
                alt="Uploaded preview"
                width={640}
                height={960}
                className="relative z-10 h-full w-full object-contain p-6 opacity-80"
              />
            ) : (
              <div className="relative z-10 flex h-full min-h-[760px] items-center justify-center text-center">
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
                    Preview
                  </div>
                  <p className="mt-2 max-w-xs text-sm text-slate-500">
                    Your realistic future avatar will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricInput({
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
    <label className="rounded-xl border border-cyan-300/10 bg-slate-950/55 p-3">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
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
          className="w-full bg-transparent text-xl font-light text-white outline-none"
        />
        <span className="text-xs text-slate-500">{suffix}</span>
      </div>
    </label>
  );
}