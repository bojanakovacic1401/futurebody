"use client";

import type { CSSProperties } from "react";
import type { AvatarDraftParams } from "@/lib/avatar/draft";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getMorphValues(draft: AvatarDraftParams) {
  const weightDelta = (draft.weightKg - 72) / 55;
  const goalDelta = (draft.goalWeightKg - draft.weightKg) / 35;
  const bodyFatDelta = (draft.bodyFat - 18) / 35;
  const muscleDelta = (draft.muscleTone - 50) / 50;
  const postureDelta = (draft.posture - 50) / 50;
  const stressDelta = draft.stress / 100;
  const sleepBoost = clamp((draft.sleepHours - 6) / 3, -1, 1);

  const torsoScaleX = clamp(
    1 + weightDelta * 0.1 + bodyFatDelta * 0.16 - muscleDelta * 0.03,
    0.88,
    1.22
  );

  const waistScaleX = clamp(
    1 + weightDelta * 0.09 + bodyFatDelta * 0.13 - muscleDelta * 0.04,
    0.88,
    1.22
  );

  const hipScaleX = clamp(
    1 + weightDelta * 0.12 + bodyFatDelta * 0.18,
    0.9,
    1.26
  );

  const legScaleX = clamp(
    1 + weightDelta * 0.06 + muscleDelta * 0.06,
    0.92,
    1.16
  );

  const shoulderScaleX = clamp(
    1 + muscleDelta * 0.12 - bodyFatDelta * 0.02,
    0.92,
    1.18
  );

  const fullScaleY = clamp(1 + (draft.heightCm - 178) * 0.002, 0.92, 1.08);
  const leanShift = clamp(goalDelta * 10, -8, 8);
  const postureRotate = clamp(-postureDelta * 2 + stressDelta * 1.4, -4, 4);
  const postureY = clamp(stressDelta * 10 - sleepBoost * 5, -6, 12);

  const brightness = clamp(0.9 + sleepBoost * 0.12 - stressDelta * 0.08, 0.78, 1.12);
  const saturation = clamp(0.95 + sleepBoost * 0.15 - stressDelta * 0.08, 0.78, 1.18);
  const contrast = clamp(1 + sleepBoost * 0.08, 0.92, 1.12);

  return {
    torsoScaleX,
    waistScaleX,
    hipScaleX,
    legScaleX,
    shoulderScaleX,
    fullScaleY,
    leanShift,
    postureRotate,
    postureY,
    brightness,
    saturation,
    contrast,
  };
}

function Layer({
  imageUrl,
  clipPath,
  style,
  opacity = 1,
}: {
  imageUrl: string;
  clipPath: string;
  style?: CSSProperties;
  opacity?: number;
}) {
  return (
    <img
      src={imageUrl}
      alt=""
      draggable={false}
      className="absolute inset-0 h-full w-full select-none object-contain"
      style={{
        clipPath,
        opacity,
        ...style,
      }}
    />
  );
}

export function AvatarMorphPreview({
  imageUrl,
  draft,
  className = "",
}: {
  imageUrl: string;
  draft: AvatarDraftParams;
  className?: string;
}) {
  const morph = getMorphValues(draft);

  return (
    <div
      className={[
        "relative h-full w-full overflow-hidden rounded-2xl border border-cyan-300/10 bg-slate-950/45",
        className,
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.045)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(34,211,238,.22),transparent_56%)]" />

      <div className="absolute bottom-4 left-1/2 h-14 w-[56%] -translate-x-1/2 rounded-full border border-cyan-300/20 bg-cyan-400/10 blur-[1px]" />

      <div
        className="absolute inset-0 z-10 transition-all duration-300"
        style={{
          transform: `translateY(${morph.postureY}px) rotate(${morph.postureRotate}deg) scaleY(${morph.fullScaleY})`,
          filter: `brightness(${morph.brightness}) saturate(${morph.saturation}) contrast(${morph.contrast})`,
          transformOrigin: "50% 58%",
        }}
      >
        <Layer
          imageUrl={imageUrl}
          clipPath="inset(0% 0% 22% 0%)"
          style={{
            transform: `translateX(${morph.leanShift * 0.25}px) scaleX(${morph.shoulderScaleX})`,
            transformOrigin: "50% 28%",
          }}
        />

        <Layer
          imageUrl={imageUrl}
          clipPath="inset(18% 0% 43% 0%)"
          style={{
            transform: `translateX(${morph.leanShift}px) scaleX(${morph.torsoScaleX})`,
            transformOrigin: "50% 42%",
          }}
        />

        <Layer
          imageUrl={imageUrl}
          clipPath="inset(42% 0% 30% 0%)"
          style={{
            transform: `translateX(${morph.leanShift}px) scaleX(${morph.waistScaleX})`,
            transformOrigin: "50% 55%",
          }}
        />

        <Layer
          imageUrl={imageUrl}
          clipPath="inset(54% 0% 18% 0%)"
          style={{
            transform: `translateX(${morph.leanShift * 0.6}px) scaleX(${morph.hipScaleX})`,
            transformOrigin: "50% 64%",
          }}
        />

        <Layer
          imageUrl={imageUrl}
          clipPath="inset(66% 0% 0% 0%)"
          style={{
            transform: `scaleX(${morph.legScaleX})`,
            transformOrigin: "50% 82%",
          }}
        />
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-full border border-cyan-300/20 bg-slate-950/75 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
        Live Morph Preview · No Credits Used
      </div>
    </div>
  );
}