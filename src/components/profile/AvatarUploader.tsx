"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Upload, WandSparkles } from "lucide-react";

type GenerationScenario = "baseline" | "improved" | "risk";

export function AvatarUploader() {
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [scenario, setScenario] = useState<GenerationScenario>("baseline");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
            Upload a photo and generate your FutureBody holographic avatar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-300/25 bg-slate-950/60 p-6 text-center transition hover:border-cyan-300/50 hover:bg-cyan-400/5">
              {uploadedUrl ? (
                <Image
                  src={uploadedUrl}
                  alt="Uploaded avatar"
                  width={320}
                  height={320}
                  className="h-64 w-64 rounded-2xl object-cover"
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

          <div className="relative min-h-[500px] overflow-hidden rounded-2xl border border-cyan-300/10 bg-slate-950/60">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.04)_1px,transparent_1px)] bg-[size:36px_36px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.18),transparent_55%)]" />

            {generatedUrl ? (
              <Image
                src={generatedUrl}
                alt="Generated FutureBody avatar"
                width={640}
                height={960}
                className="relative z-10 h-full w-full object-contain p-6 drop-shadow-[0_0_45px_rgba(34,211,238,.8)]"
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
              <div className="relative z-10 flex h-full min-h-[500px] items-center justify-center text-center">
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
                    Preview
                  </div>
                  <p className="mt-2 max-w-xs text-sm text-slate-500">
                    Your generated holographic future avatar will appear here.
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