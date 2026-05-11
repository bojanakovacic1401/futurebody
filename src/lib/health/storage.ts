import type { HealthInput } from "@/types/health";
import { defaultHealthInput, normalizeHealthInput } from "@/lib/health/defaults";

const HEALTH_STORAGE_KEY = "futurebody_health_input";

export function getStoredHealthInput(): HealthInput {
  if (typeof window === "undefined") {
    return defaultHealthInput;
  }

  try {
    const stored = window.localStorage.getItem(HEALTH_STORAGE_KEY);

    if (!stored) {
      return defaultHealthInput;
    }

    return normalizeHealthInput(JSON.parse(stored));
  } catch {
    return defaultHealthInput;
  }
}

export function saveStoredHealthInput(input: HealthInput) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(input));
}

export function resetStoredHealthInput() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(HEALTH_STORAGE_KEY);
}