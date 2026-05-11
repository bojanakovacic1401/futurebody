export function getPositiveScoreStatus(score: number) {
  if (score >= 85) return "STRONG";
  if (score >= 70) return "GOOD";
  if (score >= 55) return "MODERATE";
  return "NEEDS WORK";
}

export function getPositiveScoreStatusClass(score: number) {
  if (score >= 85) return "text-emerald-300";
  if (score >= 70) return "text-cyan-300";
  if (score >= 55) return "text-orange-300";
  return "text-red-300";
}

export function getRiskStatus(risk: number) {
  if (risk <= 30) return "LOW RISK";
  if (risk <= 55) return "MODERATE";
  return "ELEVATED";
}

export function getRiskStatusClass(risk: number) {
  if (risk <= 30) return "text-emerald-300";
  if (risk <= 55) return "text-orange-300";
  return "text-red-300";
}

export function getStressStatus(stress: number) {
  if (stress <= 35) return "LOW";
  if (stress <= 65) return "MODERATE";
  return "HIGH";
}

export function getStressStatusClass(stress: number) {
  if (stress <= 35) return "text-emerald-300";
  if (stress <= 65) return "text-orange-300";
  return "text-red-300";
}
