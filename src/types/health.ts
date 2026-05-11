export type BiologicalSex = "female" | "male" | "other";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type SymptomFlags = {
  fatigue: boolean;
  headaches: boolean;
  digestiveIssues: boolean;
  sleepIssues: boolean;
  jointPain: boolean;
  anxiety: boolean;
  lowMood: boolean;
};

export type BasicLabs = {
  vitaminD?: number;
  b12?: number;
  ferritin?: number;
  hba1c?: number;
  crp?: number;
  cholesterolTotal?: number;
  hdl?: number;
  ldl?: number;
  triglycerides?: number;
};

export type HealthInput = {
  age: number;
  biologicalSex: BiologicalSex;

  heightCm: number;
  weight: number;
  goalWeight: number;
  bodyFat: number;

  sleep: number;
  sleepQuality: number;

  steps: number;
  strength: number;
  cardio: number;

  diet: number;
  alcohol: number;
  stress: number;
  activityLevel: ActivityLevel;

  symptoms: SymptomFlags;
  labs: BasicLabs;
};

export type HealthScores = {
  energy: number;
  focus: number;
  recovery: number;
  burnoutRisk: number;
  metabolic: number;
  inflammation: number;
  sleepDebt: number;
  biologicalAge: number;
  longevityPotential: number;
  readiness: number;
};

export type BodySystemScore = {
  id: string;
  name: string;
  score: number;
  status: string;
  description: string;
};

export type ProjectionPoint = {
  label: string;
  months: number;
  current: HealthScores;
  improved: HealthScores;
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  impact: string;
  priority: "high" | "medium" | "low";
};