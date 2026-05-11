import type { HealthInput } from "@/types/health";
import { calculateHealthScores } from "@/lib/health/scoring";

export type InterventionInput = {
  sleep?: number;
  steps?: number;
  stress?: number;
  diet?: number;
  alcohol?: number;
  weight?: number;
  strength?: number;
  cardio?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function getDefaultIntervention(input: HealthInput): InterventionInput {
  return {
    sleep: Math.max(input.sleep, 7.5),
    steps: Math.max(input.steps, 8000),
    stress: Math.min(input.stress, 40),
    diet: Math.max(input.diet, 80),
    alcohol: Math.min(input.alcohol, 2),
    weight: input.goalWeight || input.weight,
    strength: Math.max(input.strength, 3),
    cardio: Math.max(input.cardio, 150),
  };
}

export function applyIntervention(
  input: HealthInput,
  intervention: InterventionInput
): HealthInput {
  return {
    ...input,
    sleep:
      intervention.sleep !== undefined
        ? clamp(intervention.sleep, 3, 10)
        : input.sleep,
    steps:
      intervention.steps !== undefined
        ? clamp(intervention.steps, 0, 25000)
        : input.steps,
    stress:
      intervention.stress !== undefined
        ? clamp(intervention.stress, 0, 100)
        : input.stress,
    diet:
      intervention.diet !== undefined
        ? clamp(intervention.diet, 0, 100)
        : input.diet,
    alcohol:
      intervention.alcohol !== undefined
        ? clamp(intervention.alcohol, 0, 30)
        : input.alcohol,
    weight:
      intervention.weight !== undefined
        ? clamp(intervention.weight, 35, 220)
        : input.weight,
    strength:
      intervention.strength !== undefined
        ? clamp(intervention.strength, 0, 7)
        : input.strength,
    cardio:
      intervention.cardio !== undefined
        ? clamp(intervention.cardio, 0, 500)
        : input.cardio,
  };
}

export function getInterventionImpact(
  input: HealthInput,
  intervention: InterventionInput
) {
  const current = calculateHealthScores(input);
  const improved = calculateHealthScores(applyIntervention(input, intervention));

  return {
    current,
    improved,
    delta: {
      energy: improved.energy - current.energy,
      focus: improved.focus - current.focus,
      recovery: improved.recovery - current.recovery,
      burnoutRisk: improved.burnoutRisk - current.burnoutRisk,
      metabolic: improved.metabolic - current.metabolic,
      inflammation: Number(
        (improved.inflammation - current.inflammation).toFixed(1)
      ),
      readiness: improved.readiness - current.readiness,
    },
  };
}