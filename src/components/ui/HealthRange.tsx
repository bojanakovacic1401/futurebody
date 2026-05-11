"use client";

type HealthRangeProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
};

export function HealthRange({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: HealthRangeProps) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>

        <span className="shrink-0 text-sm font-semibold text-cyan-300">
          {value}
          {suffix ? ` ${suffix}` : ""}
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
