export type AvatarScenario = "baseline" | "improved" | "risk";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type AvatarDraftParams = {
  heightCm: number;
  weightKg: number;
  goalWeightKg: number;
  bodyFat: number;
  muscleTone: number;
  posture: number;
  sleepHours: number;
  stress: number;
  activityLevel: ActivityLevel;
};

export const defaultAvatarDraft: AvatarDraftParams = {
  heightCm: 178,
  weightKg: 72,
  goalWeightKg: 68,
  bodyFat: 18,
  muscleTone: 45,
  posture: 55,
  sleepHours: 6.5,
  stress: 55,
  activityLevel: "moderate",
};

const AVATAR_DRAFT_KEY = "futurebody_avatar_draft";

function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeAvatarDraft(value: unknown): AvatarDraftParams {
  const raw = value as Partial<AvatarDraftParams>;

  const activityLevel =
    raw?.activityLevel === "sedentary" ||
    raw?.activityLevel === "light" ||
    raw?.activityLevel === "moderate" ||
    raw?.activityLevel === "active" ||
    raw?.activityLevel === "very_active"
      ? raw.activityLevel
      : defaultAvatarDraft.activityLevel;

  return {
    heightCm: toNumber(raw?.heightCm, defaultAvatarDraft.heightCm),
    weightKg: toNumber(raw?.weightKg, defaultAvatarDraft.weightKg),
    goalWeightKg: toNumber(raw?.goalWeightKg, defaultAvatarDraft.goalWeightKg),
    bodyFat: toNumber(raw?.bodyFat, defaultAvatarDraft.bodyFat),
    muscleTone: toNumber(raw?.muscleTone, defaultAvatarDraft.muscleTone),
    posture: toNumber(raw?.posture, defaultAvatarDraft.posture),
    sleepHours: toNumber(raw?.sleepHours, defaultAvatarDraft.sleepHours),
    stress: toNumber(raw?.stress, defaultAvatarDraft.stress),
    activityLevel,
  };
}

export function getStoredAvatarDraft(): AvatarDraftParams {
  if (typeof window === "undefined") {
    return defaultAvatarDraft;
  }

  try {
    const stored = window.localStorage.getItem(AVATAR_DRAFT_KEY);

    if (!stored) {
      return defaultAvatarDraft;
    }

    return normalizeAvatarDraft(JSON.parse(stored));
  } catch {
    return defaultAvatarDraft;
  }
}

export function saveStoredAvatarDraft(draft: AvatarDraftParams) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    AVATAR_DRAFT_KEY,
    JSON.stringify(normalizeAvatarDraft(draft))
  );
}

export function resetStoredAvatarDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AVATAR_DRAFT_KEY);
}