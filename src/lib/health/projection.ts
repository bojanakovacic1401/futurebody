import type { HealthInput, ProjectionPoint } from "@/types/health";
import { calculateHealthScores } from "@/lib/health/scoring";
import {
  applyIntervention,
  getDefaultIntervention,
  type InterventionInput,
} from "@/lib/health/interventions";

const projectionPeriods = [
  { label: "Now", months: 0 },
  { label: "30 Days", months: 1 },
  { label: "6 Months", months: 6 },
  { label: "2 Years", months: 24 },
  { label: "5 Years", months: 60 },
  { label: "10 Years", months: 120 },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function cloneScores(scores: ReturnType<typeof calculateHealthScores>) {
  return { ...scores };
}

function applyTimeDrift(
  input: HealthInput,
  months: number,
  mode: "current" | "improved"
) {
  const base = cloneScores(calculateHealthScores(input));

  if (months === 0) {
    return base;
  }

  const years = months / 12;

  const stressPressure = Math.max(0, input.stress - 55) * 0.04 * years;
  const sleepPressure = Math.max(0, 7 - input.sleep) * 2.2 * years;
  const activityProtection = Math.min(10, input.steps / 1200) * 0.22 * years;
  const dietProtection = Math.max(0, input.diet - 65) * 0.035 * years;

  const direction = mode === "improved" ? 1 : -1;

  if (mode === "current") {
    base.energy = clamp(base.energy - stressPressure - sleepPressure + activityProtection);
    base.focus = clamp(base.focus - stressPressure - sleepPressure * 0.8);
    base.recovery = clamp(base.recovery - stressPressure - sleepPressure);
    base.burnoutRisk = clamp(base.burnoutRisk + stressPressure + sleepPressure);
    base.metabolic = clamp(base.metabolic - Math.max(0, 65 - input.diet) * 0.04 * years);
    base.inflammation = Number(
      Math.min(5, base.inflammation + stressPressure * 0.05 + sleepPressure * 0.04).toFixed(1)
    );
    base.longevityPotential = clamp(base.longevityPotential - stressPressure * 0.4);
    base.readiness = clamp(base.readiness - stressPressure - sleepPressure * 0.6);
    base.biologicalAge = Number((base.biologicalAge + years * 0.8).toFixed(1));
  } else {
    base.energy = clamp(base.energy + years * 2.2 + activityProtection + dietProtection);
    base.focus = clamp(base.focus + years * 1.8 + dietProtection);
    base.recovery = clamp(base.recovery + years * 2.4);
    base.burnoutRisk = clamp(base.burnoutRisk - years * 2.8);
    base.metabolic = clamp(base.metabolic + years * 2.1 + dietProtection);
    base.inflammation = Number(
      Math.max(0.4, base.inflammation - years * 0.18).toFixed(1)
    );
    base.longevityPotential = clamp(base.longevityPotential + years * 2.2);
    base.readiness = clamp(base.readiness + years * 2.3);
    base.biologicalAge = Number(
      (base.biologicalAge + years * 0.45 - years * direction * 0.35).toFixed(1)
    );
  }

  return base;
}

export function projectHealthTrajectory(
  input: HealthInput,
  intervention: InterventionInput = getDefaultIntervention(input)
): ProjectionPoint[] {
  const improvedInput = applyIntervention(input, intervention);

  return projectionPeriods.map((period) => ({
    label: period.label,
    months: period.months,
    current: applyTimeDrift(input, period.months, "current"),
    improved: applyTimeDrift(improvedInput, period.months, "improved"),
  }));
}