import type { HealthInput, HealthScores } from "@/types/health";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function calculateScores(input: HealthInput): HealthScores {
  const sleepScore = clamp((input.sleep - 4) * 16.7, 0, 100);
  const stepScore = clamp(input.steps / 120, 0, 100);
  const trainingScore = clamp(input.strength * 12 + input.cardio * 0.18, 0, 100);
  const dietScore = clamp(input.diet, 0, 100);
  const stressRecovery = clamp(100 - input.stress, 0, 100);
  const alcoholScore = clamp(100 - input.alcohol * 6, 0, 100);

  const energy = clamp(
    Math.round(
      sleepScore * 0.32 +
        stepScore * 0.2 +
        dietScore * 0.18 +
        stressRecovery * 0.2 +
        alcoholScore * 0.1
    ),
    0,
    100
  );

  const focus = clamp(
    Math.round(
      sleepScore * 0.35 +
        stressRecovery * 0.35 +
        dietScore * 0.15 +
        stepScore * 0.15
    ),
    0,
    100
  );

  const recovery = clamp(
    Math.round(
      sleepScore * 0.45 +
        stressRecovery * 0.25 +
        alcoholScore * 0.2 +
        trainingScore * 0.1
    ),
    0,
    100
  );

  const burnout = clamp(
    Math.round(
      100 - (sleepScore * 0.38 + stressRecovery * 0.42 + stepScore * 0.2)
    ),
    0,
    100
  );

  const metabolic = clamp(
    Math.round(
      stepScore * 0.28 +
        trainingScore * 0.22 +
        dietScore * 0.3 +
        alcoholScore * 0.2
    ),
    0,
    100
  );

  const inflammation = clamp(
    Number(
      (
        4.1 -
        (sleepScore + stepScore + dietScore + stressRecovery + alcoholScore) /
          170
      ).toFixed(1)
    ),
    0.7,
    4.5
  );

  const readiness = clamp(
    Math.round((energy + focus + recovery + metabolic + (100 - burnout)) / 5),
    0,
    100
  );

  return {
    energy,
    focus,
    recovery,
    burnout,
    metabolic,
    inflammation,
    readiness,
  };
}