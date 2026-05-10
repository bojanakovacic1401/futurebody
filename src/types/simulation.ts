import type { HealthInput, HealthScores } from "./health";

export type SimulationScenario = {
  id: string;
  name: string;
  description: string;
  input: HealthInput;
  scores: HealthScores;
};

export type InterventionChange = {
  key: keyof HealthInput;
  label: string;
  current: number;
  target: number;
  unit: string;
};