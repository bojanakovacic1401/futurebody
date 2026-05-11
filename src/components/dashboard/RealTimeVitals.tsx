"use client";

import { Activity, HeartPulse, Thermometer, Wind } from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";

const sparklineData = [
  { value: 20 },
  { value: 28 },
  { value: 24 },
  { value: 34 },
  { value: 30 },
  { value: 42 },
  { value: 37 },
  { value: 52 },
  { value: 48 },
  { value: 61 },
];

const vitals = [
  {
    label: "Heart Rate",
    value: "62",
    unit: "BPM",
    icon: HeartPulse,
  },
  {
    label: "HRV",
    value: "68",
    unit: "ms",
    icon: Activity,
  },
  {
    label: "Respiratory Rate",
    value: "14",
    unit: "br/min",
    icon: Wind,
  },
  {
    label: "Body Temp",
    value: "36.7",
    unit: "°C",
    icon: Thermometer,
  },
];

function MiniWave() {
  return (
    <svg
      viewBox="0 0 96 32"
      className="h-8 w-24 shrink-0"
      aria-hidden="true"
    >
      <polyline
        points="0,20 8,18 16,22 24,10 32,17 40,14 48,22 56,7 64,15 72,13 80,20 88,9 96,12"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function RealTimeVitals() {
  return (
    <HUDCard className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
            Real-Time Vitals
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Live physiological signals
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,.9)]" />
          Live
        </div>
      </div>

      <div className="space-y-4">
        {vitals.map((vital) => {
          const Icon = vital.icon;

          return (
            <div
              key={vital.label}
              className="flex items-center justify-between gap-4 border-t border-cyan-300/10 pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 text-cyan-300">
                  <Icon size={21} />
                </div>

                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {vital.label}
                  </div>

                  <div className="mt-1 flex items-end gap-1">
                    <span className="text-2xl font-light text-white">
                      {vital.value}
                    </span>
                    <span className="mb-1 text-xs text-slate-500">
                      {vital.unit}
                    </span>
                  </div>
                </div>
              </div>

              <MiniWave />
            </div>
          );
        })}
      </div>
    </HUDCard>
  );
}