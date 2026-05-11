import type { HealthInput } from "@/types/health";

export const defaultHealthInput: HealthInput = {
  age: 28,
  biologicalSex: "female",

  heightCm: 178,
  weight: 72,
  goalWeight: 68,
  bodyFat: 18,

  sleep: 6.5,
  sleepQuality: 68,

  steps: 6240,
  strength: 2,
  cardio: 60,

  diet: 62,
  alcohol: 6,
  stress: 68,
  activityLevel: "moderate",

  symptoms: {
    fatigue: false,
    headaches: false,
    digestiveIssues: false,
    sleepIssues: false,
    jointPain: false,
    anxiety: false,
    lowMood: false,
  },

  labs: {
    vitaminD: 32,
    b12: 458,
    ferritin: 78,
    hba1c: 5.2,
  },
};

export function normalizeHealthInput(value?: Partial<HealthInput>): HealthInput {
  return {
    ...defaultHealthInput,
    ...value,
    symptoms: {
      ...defaultHealthInput.symptoms,
      ...value?.symptoms,
    },
    labs: {
      ...defaultHealthInput.labs,
      ...value?.labs,
    },
  };
}