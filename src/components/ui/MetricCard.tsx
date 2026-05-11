"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/constants";
import { HUDCard } from "./HUDCard";

type MetricTone = "cyan" | "green" | "orange" | "purple" | "red";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  status: string;
  tone?: MetricTone;
  showChart?: boolean;
  className?: string;
};

const toneMap: Record<
  MetricTone,
  {
    text: string;
    border: string;
    stroke: string;
  }
> = {
  cyan: {
    text: "text-cyan-300",
    border: "border-cyan-300/25",
    stroke: "#22d3ee",
  },
  green: {
    text: "text-emerald-300",
    border: "border-emerald-300/25",
    stroke: "#34d399",
  },
  orange: {
    text: "text-orange-300",
    border: "border-orange-300/25",
    stroke: "#fb923c",
  },
  purple: {
    text: "text-violet-300",
    border: "border-violet-300/25",
    stroke: "#a78bfa",
  },
  red: {
    text: "text-rose-300",
    border: "border-rose-300/25",
    stroke: "#fb7185",
  },
};

const sparklineData = [
  { value: 20 },
  { value: 26 },
  { value: 24 },
  { value: 35 },
  { value: 29 },
  { value: 40 },
  { value: 38 },
  { value: 52 },
  { value: 47 },
  { value: 61 },
];

function MiniLine({ stroke }: { stroke: string }) {
  return (
    <svg
      viewBox="0 0 112 32"
      className="hidden h-8 w-24 shrink-0 sm:block md:w-28"
      aria-hidden="true"
    >
      <polyline
        points="0,24 12,19 24,21 36,13 48,17 60,9 72,12 84,5 96,8 112,2"
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit = "/100",
  status,
  tone = "cyan",
  showChart = true,
  className,
}: MetricCardProps) {
  const toneConfig = toneMap[tone];

  return (
    <HUDCard
      className={cn(
        "group flex items-center gap-4 p-4 transition hover:border-cyan-300/40",
        className
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-slate-950/80",
          toneConfig.border,
          toneConfig.text
        )}
      >
        <Icon size={26} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </div>

        <div className="mt-1 flex items-end gap-1">
          <span className="text-3xl font-light text-white">{value}</span>
          <span className="mb-1 text-xs text-slate-400">{unit}</span>
        </div>

        <div className={cn("mt-1 text-xs font-bold uppercase", toneConfig.text)}>
          {status}
        </div>
      </div>

      {showChart && <MiniLine stroke={toneConfig.stroke} />}

      <ChevronRight
        className="hidden text-slate-500 transition group-hover:text-cyan-300 md:block"
        size={18}
      />
    </HUDCard>
  );
}