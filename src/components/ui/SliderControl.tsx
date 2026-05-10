"use client";

import { cn } from "@/lib/constants";

type SliderControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  leftLabel?: string;
  rightLabel?: string;
  onChange: (value: number) => void;
  className?: string;
};

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  leftLabel,
  rightLabel,
  onChange,
  className,
}: SliderControlProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={cn(
        "rounded-2xl border border-cyan-300/10 bg-slate-950/50 p-4",
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
            {label}
          </div>

          {(leftLabel || rightLabel) && (
            <div className="mt-1 text-xs text-slate-500">
              {leftLabel ?? min} → {rightLabel ?? max}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-xl font-light text-cyan-200">
            {value}
          </div>
          {unit && <div className="text-xs text-slate-500">{unit}</div>}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-slate-800" />

        <div
          className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.8)]"
          style={{ width: `${percentage}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="relative z-10 h-8 w-full cursor-pointer appearance-none bg-transparent accent-cyan-300"
        />
      </div>

      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.14em] text-slate-600">
        <span>{leftLabel ?? min}</span>
        <span>{rightLabel ?? max}</span>
      </div>
    </div>
  );
}