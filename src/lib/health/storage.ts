import type { HealthInput } from "@/types/health";
import type { InterventionInput } from "@/lib/health/interventions";
import { defaultHealthInput, normalizeHealthInput } from "@/lib/health/defaults";

const HEALTH_STORAGE_KEY = "futurebody_health_input";
const SIMULATION_STORAGE_KEY = "futurebody_last_simulation";
const DASHBOARD_AVATAR_KEY = "futurebody_dashboard_avatar";

export type StoredSimulationScenario = {
  input: HealthInput;
  intervention: InterventionInput;
  savedAt: string;
};

export type StoredDashboardAvatar = {
  imageUrl: string;
  scenario: "baseline" | "improved" | "risk";
  savedAt: string;
};

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

export function saveStoredSimulationScenario(
  input: HealthInput,
  intervention: InterventionInput
) {
  if (typeof window === "undefined") {
    return;
  }

  const scenario: StoredSimulationScenario = {
    input,
    intervention,
    savedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(scenario));
}

export function getStoredSimulationScenario(): StoredSimulationScenario | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(SIMULATION_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as StoredSimulationScenario;

    return {
      input: normalizeHealthInput(parsed.input),
      intervention: parsed.intervention || {},
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}

export function resetStoredSimulationScenario() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SIMULATION_STORAGE_KEY);
}

export function saveStoredDashboardAvatar(
  imageUrl: string,
  scenario: "baseline" | "improved" | "risk"
) {
  if (typeof window === "undefined") {
    return;
  }

  const avatar: StoredDashboardAvatar = {
    imageUrl,
    scenario,
    savedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(DASHBOARD_AVATAR_KEY, JSON.stringify(avatar));
}

export function getStoredDashboardAvatar(): StoredDashboardAvatar | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(DASHBOARD_AVATAR_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as StoredDashboardAvatar;
  } catch {
    return null;
  }
}

export function resetStoredDashboardAvatar() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DASHBOARD_AVATAR_KEY);
}