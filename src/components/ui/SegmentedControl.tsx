"use client";

import { cn } from "@/lib/constants";

type SegmentedControlProps<T extends string> = {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-xl border border-cyan-300/15 bg-slate-950/60",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const isActive = option === value;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "px-3 py-2 text-sm transition",
              isActive
                ? "bg-cyan-400/18 text-cyan-200 shadow-[inset_0_0_18px_rgba(34,211,238,.12)]"
                : "text-slate-400 hover:bg-cyan-400/10 hover:text-cyan-200"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}