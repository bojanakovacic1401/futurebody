import type { HealthInput } from "@/types/health";

export const APP_NAME = "FutureBody";

export const DEFAULT_HEALTH_INPUT: HealthInput = {
  sleep: 6,
  steps: 6240,
  strength: 2,
  cardio: 60,
  diet: 62,
  alcohol: 6,
  stress: 68,
  weight: 72,
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Body", href: "/body" },
  { label: "Timeline", href: "/timeline" },
  { label: "Simulate", href: "/simulate" },
  { label: "Insights", href: "/insights" },
  { label: "Profile", href: "/profile" },
];

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}