import type { BodySystemScore, HealthInput, HealthScores } from "@/types/health";

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function clampDecimal(value: number, min: number, max: number, decimals = 1) {
  const factor = 10 ** decimals;
  const clamped = Math.max(min, Math.min(max, value));
  return Math.round(clamped * factor) / factor;
}

function symptomPenalty(input: HealthInput) {
  const symptoms = input.symptoms;

  return [
    symptoms.fatigue,
    symptoms.headaches,
    symptoms.digestiveIssues,
    symptoms.sleepIssues,
    symptoms.jointPain,
    symptoms.anxiety,
    symptoms.lowMood,
  ].filter(Boolean).length;
}

function activityScore(input: HealthInput) {
  const stepScore = clamp((input.steps / 10000) * 100);
  const cardioScore = clamp((input.cardio / 180) * 100);
  const strengthScore = clamp((input.strength / 4) * 100);

  return clamp(stepScore * 0.5 + cardioScore * 0.25 + strengthScore * 0.25);
}

function sleepScore(input: HealthInput) {
  const durationScore = clamp(100 - Math.abs(7.8 - input.sleep) * 18);
  const qualityScore = clamp(input.sleepQuality);
  const alcoholPenalty = Math.max(0, input.alcohol - 3) * 2.5;

  return clamp(durationScore * 0.65 + qualityScore * 0.35 - alcoholPenalty);
}

function metabolicScore(input: HealthInput) {
  const bmi = input.weight / Math.pow(input.heightCm / 100, 2);
  const bmiScore = clamp(100 - Math.abs(22 - bmi) * 4);
  const bodyFatScore = clamp(100 - Math.max(0, input.bodyFat - 18) * 2);
  const movement = activityScore(input);

  return clamp(
    bmiScore * 0.25 +
      bodyFatScore * 0.2 +
      input.diet * 0.3 +
      movement * 0.2 -
      input.alcohol * 0.8
  );
}

export function calculateHealthScores(input: HealthInput): HealthScores {
  const symptoms = symptomPenalty(input);
  const sleep = sleepScore(input);
  const activity = activityScore(input);
  const metabolic = metabolicScore(input);

  const recovery = clamp(
    sleep * 0.5 +
      (100 - input.stress) * 0.28 +
      activity * 0.12 +
      input.diet * 0.1 -
      symptoms * 3
  );

  const energy = clamp(
    sleep * 0.34 +
      activity * 0.26 +
      metabolic * 0.2 +
      input.diet * 0.12 +
      (100 - input.stress) * 0.08 -
      symptoms * 2
  );

  const focus = clamp(
    sleep * 0.35 +
      (100 - input.stress) * 0.3 +
      input.diet * 0.15 +
      activity * 0.1 +
      recovery * 0.1 -
      symptoms * 2
  );

  const burnoutRisk = clamp(
    75 -
      sleep * 0.25 -
      recovery * 0.22 -
      activity * 0.1 +
      input.stress * 0.45 +
      symptoms * 5
  );

  const inflammation = clampDecimal(
    0.8 +
      input.stress / 45 +
      Math.max(0, 7 - input.sleep) * 0.28 +
      Math.max(0, 65 - input.diet) * 0.025 +
      input.alcohol * 0.08 +
      symptoms * 0.12,
    0.4,
    5,
    1
  );

  const sleepDebt = clampDecimal(
    Math.max(0, 7.5 - input.sleep) * 1.1 + Math.max(0, input.stress - 60) * 0.01,
    0,
    6,
    1
  );

  const biologicalAge = clampDecimal(
    input.age +
      Math.max(0, 75 - recovery) * 0.05 +
      Math.max(0, burnoutRisk - 35) * 0.035 +
      inflammation * 0.32 -
      Math.max(0, activity - 70) * 0.025,
    16,
    95,
    1
  );

  const longevityPotential = clamp(
    65 +
      recovery * 0.12 +
      metabolic * 0.12 +
      activity * 0.1 +
      sleep * 0.08 -
      burnoutRisk * 0.08 -
      inflammation * 1.8
  );

  const readiness = clamp(
    energy * 0.25 +
      recovery * 0.35 +
      focus * 0.15 +
      metabolic * 0.15 +
      (100 - burnoutRisk) * 0.1
  );

  return {
    energy,
    focus,
    recovery,
    burnoutRisk,
    metabolic,
    inflammation,
    sleepDebt,
    biologicalAge,
    longevityPotential,
    readiness,
  };
}

export function getBodySystems(input: HealthInput): BodySystemScore[] {
  const scores = calculateHealthScores(input);
  const activity = activityScore(input);
  const sleep = sleepScore(input);

  return [
    {
      id: "cardiovascular",
      name: "Cardiovascular",
      score: clamp(activity * 0.55 + scores.metabolic * 0.3 + scores.recovery * 0.15),
      status: "Optimal",
      description: "Movement, cardio, recovery and metabolic pressure.",
    },
    {
      id: "neurological",
      name: "Neurological",
      score: scores.focus,
      status: "Sharp",
      description: "Focus, stress load, sleep quality and cognitive recovery.",
    },
    {
      id: "respiratory",
      name: "Respiratory",
      score: clamp(activity * 0.7 + scores.recovery * 0.3),
      status: "Strong",
      description: "Cardio minutes, daily movement and recovery breathing proxy.",
    },
    {
      id: "digestive",
      name: "Digestive",
      score: clamp(input.diet * 0.75 + scores.inflammation * -4 + 25),
      status: "Good",
      description: "Nutrition quality, alcohol load and inflammation proxy.",
    },
    {
      id: "immune",
      name: "Immune",
      score: clamp(scores.recovery * 0.45 + sleep * 0.35 + (100 - scores.inflammation * 12) * 0.2),
      status: "Resilient",
      description: "Sleep, stress, recovery and lifestyle inflammation estimate.",
    },
    {
      id: "metabolic",
      name: "Metabolic",
      score: scores.metabolic,
      status: "Efficient",
      description: "Body composition, diet, activity and alcohol pattern.",
    },
  ];
}