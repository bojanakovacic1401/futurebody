import {
  Activity,
  Apple,
  Brain,
  Dumbbell,
  HeartPulse,
  ShieldPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BodySystemScore } from "@/types/health";
import { HUDCard } from "@/components/ui/HUDCard";
import { HologramBody } from "./HologramBody";
import { cn } from "@/lib/constants";

type BodySystemMapProps = {
  systems?: BodySystemScore[];
  compact?: boolean;
};

const defaultSystems: BodySystemScore[] = [
  {
    id: "cardiovascular",
    name: "Cardiovascular",
    score: 85,
    status: "optimal",
  },
  {
    id: "neurological",
    name: "Neurological",
    score: 83,
    status: "optimal",
  },
  {
    id: "respiratory",
    name: "Respiratory",
    score: 81,
    status: "good",
  },
  {
    id: "muscular",
    name: "Muscular",
    score: 79,
    status: "good",
  },
  {
    id: "digestive",
    name: "Digestive",
    score: 72,
    status: "good",
  },
  {
    id: "immune",
    name: "Immune",
    score: 81,
    status: "optimal",
  },
];

const iconMap: Record<string, LucideIcon> = {
  cardiovascular: HeartPulse,
  neurological: Brain,
  respiratory: Activity,
  muscular: Dumbbell,
  digestive: Apple,
  immune: ShieldPlus,
};

function getStatusLabel(status: BodySystemScore["status"]) {
  if (status === "optimal") return "Optimal";
  if (status === "good") return "Good";
  if (status === "moderate") return "Moderate";
  return "Warning";
}

function getStatusClass(status: BodySystemScore["status"]) {
  if (status === "optimal") return "text-emerald-300";
  if (status === "good") return "text-cyan-300";
  if (status === "moderate") return "text-orange-300";
  return "text-rose-300";
}

export function BodySystemMap({
  systems = defaultSystems,
  compact = false,
}: BodySystemMapProps) {
  return (
    <HUDCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
            Body Systems
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Core system readiness
          </p>
        </div>

        <button className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
          View All
        </button>
      </div>

      <div
        className={cn(
          "grid gap-4",
          compact ? "grid-cols-1" : "lg:grid-cols-[1fr_160px_1fr]"
        )}
      >
        <div className="space-y-3">
          {systems.slice(0, 3).map((system) => (
            <SystemRow key={system.id} system={system} />
          ))}
        </div>

        {!compact && (
          <div className="hidden items-center justify-center lg:flex">
            <HologramBody size="sm" intensity={0.8} />
          </div>
        )}

        <div className="space-y-3">
          {systems.slice(3).map((system) => (
            <SystemRow key={system.id} system={system} />
          ))}
        </div>
      </div>
    </HUDCard>
  );
}

function SystemRow({ system }: { system: BodySystemScore }) {
  const Icon = iconMap[system.id] ?? Activity;

  return (
    <div className="rounded-xl border border-cyan-300/12 bg-slate-950/60 p-4 transition hover:border-cyan-300/35">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 text-cyan-300">
          <Icon size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {system.name}
          </div>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-2xl font-light text-white">
              {system.score}%
            </span>
            <span
              className={cn(
                "mb-1 text-[10px] font-bold uppercase tracking-[0.14em]",
                getStatusClass(system.status)
              )}
            >
              {getStatusLabel(system.status)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}