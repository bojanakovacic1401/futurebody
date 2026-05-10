export type HealthInput = {
  sleep: number;
  steps: number;
  strength: number;
  cardio: number;
  diet: number;
  alcohol: number;
  stress: number;
  weight: number;
};

export type HealthScores = {
  energy: number;
  focus: number;
  recovery: number;
  burnout: number;
  metabolic: number;
  inflammation: number;
  readiness: number;
};

export type BodySystemScore = {
  id: string;
  name: string;
  score: number;
  status: "optimal" | "good" | "moderate" | "warning";
};

export type HealthTimelinePoint = {
  label: string;
  currentPath: number;
  improvedPath: number;
};