import type { InterventionChange } from "@/types/simulation";

export const DEFAULT_INTERVENTIONS: InterventionChange[] = [
  {
    key: "sleep",
    label: "Sleep Duration",
    current: 6,
    target: 7.5,
    unit: "hrs",
  },
  {
    key: "steps",
    label: "Daily Steps",
    current: 6240,
    target: 12000,
    unit: "steps",
  },
  {
    key: "strength",
    label: "Strength Training",
    current: 2,
    target: 4,
    unit: "sessions",
  },
  {
    key: "cardio",
    label: "Cardio",
    current: 60,
    target: 150,
    unit: "min/week",
  },
  {
    key: "diet",
    label: "Diet Quality",
    current: 62,
    target: 80,
    unit: "score",
  },
  {
    key: "alcohol",
    label: "Alcohol",
    current: 6,
    target: 2,
    unit: "drinks/week",
  },
  {
    key: "stress",
    label: "Stress Level",
    current: 68,
    target: 35,
    unit: "score",
  },
  {
    key: "weight",
    label: "Weight",
    current: 72,
    target: 68,
    unit: "kg",
  },
];